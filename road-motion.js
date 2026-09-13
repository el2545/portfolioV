const radians = Math.PI / 180;
const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
export const paintColours = ['#d9e3e6', '#487993', '#cbb78e', '#a75543', '#728c7d', '#586677'];
export function paintIndex(id) {
  let hash = 2166136261;
  for (const letter of String(id)) hash = Math.imul(hash ^ letter.charCodeAt(0), 16777619);
  return (hash >>> 0) % paintColours.length;
}
export function toLngLat(x, y, origin, scale) {
  const mx = (origin[0] + 180) / 360 + x * scale;
  const my = (1 - Math.log(Math.tan(Math.PI / 4 + origin[1] * radians / 2)) / Math.PI) / 2 - y * scale;
  return [mx * 360 - 180, Math.atan(Math.sinh(Math.PI * (1 - 2 * my))) / radians];
}
function prepare(lane) {
  if (!lane.distances) {
    lane.distances = [0];
    for (let i = 1; i < lane.shape.length; i++) {
      lane.distances.push(lane.distances[i - 1] + Math.hypot(lane.shape[i][0] - lane.shape[i - 1][0], lane.shape[i][1] - lane.shape[i - 1][1]));
    }
  }
  return lane;
}
export function lanePoint(lane, position) {
  prepare(lane);
  const distances = lane.distances;
  const distance = clamp(position / lane.length, 0, 1) * distances.at(-1);
  let low = 1, high = distances.length - 1;
  while (low < high) { const mid = (low + high) >> 1; if (distances[mid] < distance) low = mid + 1; else high = mid; }
  const a = lane.shape[low - 1], b = lane.shape[low];
  const fraction = (distance - distances[low - 1]) / (distances[low] - distances[low - 1] || 1);
  return [a[0] + (b[0] - a[0]) * fraction, a[1] + (b[1] - a[1]) * fraction];
}
export function connectedPath(lanes, source, target, budget = 90) {
  if (source === target) return [source];
  const queue = [{ ids: [source], distance: 0 }];
  const visited = new Set();
  for (let visit = 0; queue.length && visit < 150; visit++) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift(), last = current.ids.at(-1);
    if (last === target) return current.ids;
    if (visited.has(last)) continue;
    visited.add(last);
    for (const id of lanes[last]?.next || []) {
      if (!lanes[id] || visited.has(id)) continue;
      const distance = current.distance + (id === target ? 0 : lanes[id].length);
      if (distance <= budget && current.ids.length < 16) queue.push({ ids: [...current.ids, id], distance });
    }
  }
  return null;
}
export function makeTransition(from, to, lanes) {
  const source = lanes[from.lane], target = lanes[to.lane];
  if (!source || !target) return { kind: 'gap', from, to };
  if (source.edge === target.edge && from.lane !== to.lane) return { kind: 'lane-change', from, to, source, target };
  let ids = connectedPath(lanes, from.lane, to.lane, Math.max(from.speed, to.speed) * 1.5 + 15);
  // SUMO may change a lane and cross a junction in the same recorded second.
  // Resolve the connected sibling lane; preserve the measured lateral offsets.
  let laneChange = false;
  if (!ids) {
    if (!lanes.edgeGroups) {
      lanes.edgeGroups = new Map();
      lanes.forEach((lane, index) => {
        if (!lane) return;
        if (!lanes.edgeGroups.has(lane.edge)) lanes.edgeGroups.set(lane.edge, []);
        lanes.edgeGroups.get(lane.edge).push(index);
      });
    }
    let best = Infinity;
    for (const start of lanes.edgeGroups.get(source.edge) || []) {
      for (const end of lanes.edgeGroups.get(target.edge) || []) {
        const candidate = connectedPath(lanes, start, end, Math.max(from.speed, to.speed) * 1.5 + 15);
        if (!candidate) continue;
        const a = lanePoint(lanes[start], from.pos), b = lanePoint(lanes[end], to.pos);
        const cost = Math.hypot(from.x-a[0],from.y-a[1]) + Math.hypot(to.x-b[0],to.y-b[1]);
        if (cost < best && cost < 8) { best=cost; ids=candidate; laneChange=true; }
      }
    }
  }
  if (!ids || (ids.length === 1 && to.pos < from.pos - 0.1)) return { kind: 'gap', from, to };
  const sections = ids.map((id, i) => ({ lane: lanes[id], start: i === 0 ? from.pos : 0, end: i === ids.length - 1 ? to.pos : lanes[id].length }));
  const distance = sections.reduce((sum, part) => sum + Math.max(0, part.end - part.start), 0);
  if (distance > Math.max(from.speed, to.speed) * 1.5 + 20) return { kind: 'gap', from, to };
  const start = lanePoint(lanes[ids[0]], from.pos), end = lanePoint(lanes[ids.at(-1)], to.pos);
  return { kind: 'lanes', from, to, sections, distance, laneChange, startOffset: [from.x - start[0], from.y - start[1]], endOffset: [to.x - end[0], to.y - end[1]] };
}
function pathPoint(transition, distance) {
  let remaining = clamp(distance, 0, transition.distance);
  for (const part of transition.sections) {
    const length = Math.max(0, part.end - part.start);
    if (remaining <= length) return lanePoint(part.lane, part.start + remaining);
    remaining -= length;
  }
  const last = transition.sections.at(-1);
  return lanePoint(last.lane, last.end);
}
export function sampleTransition(transition, fraction) {
  const { from, to } = transition;
  const f = clamp(fraction, 0, 1);
  if (f === 0) return { ...from, steering: 0 };
  if (f === 1) return { ...to, steering: 0 };
  if (transition.kind === 'gap') return { ...from, steering: 0, gap: true };
  let x, y, angle = from.angle, steering = 0;
  if (transition.kind === 'lane-change') {
    const p = lanePoint(transition.source, from.pos + (to.pos - from.pos) * f);
    const q = lanePoint(transition.target, from.pos + (to.pos - from.pos) * f);
    const blend = f * f * (3 - 2 * f);
    const a = lanePoint(transition.source, from.pos), b = lanePoint(transition.target, to.pos);
    x = p[0] + (q[0] - p[0]) * blend + (from.x - a[0]) * (1 - f) + (to.x - b[0]) * f;
    y = p[1] + (q[1] - p[1]) * blend + (from.y - a[1]) * (1 - f) + (to.y - b[1]) * f;
    angle = (from.angle + (((to.angle - from.angle + 540) % 360) - 180) * f + 360) % 360;
  } else {
    // Monotone Hermite distance honours endpoint speed without overshooting the lane path.
    const d = transition.distance;
    let m0 = d ? from.speed / d : 0, m1 = d ? to.speed / d : 0;
    const norm = Math.hypot(m0, m1);
    if (norm > 3) { m0 *= 3 / norm; m1 *= 3 / norm; }
    const progress = clamp((-2 * f ** 3 + 3 * f ** 2) + (f ** 3 - 2 * f ** 2 + f) * m0 + (f ** 3 - f ** 2) * m1, 0, 1);
    const along = d * progress;
    const point = pathPoint(transition, along);
    x = point[0] + transition.startOffset[0] * (1 - f) + transition.endOffset[0] * f;
    y = point[1] + transition.startOffset[1] * (1 - f) + transition.endOffset[1] * f;
    if (d > 0.02) {
      const behind = pathPoint(transition, Math.max(0, along - 1));
      const ahead = pathPoint(transition, Math.min(d, along + 1));
      angle = (Math.atan2(ahead[0] - behind[0], ahead[1] - behind[1]) / radians + 360) % 360;
      const future = pathPoint(transition, Math.min(d, along + 3));
      const futureAngle = Math.atan2(future[0] - point[0], future[1] - point[1]) / radians;
      steering = clamp(((futureAngle - angle + 540) % 360) - 180, -28, 28);
    }
  }
  return { ...from, x, y, angle, steering, speed: from.speed + (to.speed - from.speed) * f };
}

export class TrafficReplay {
  constructor(manifest, network, read) {
    if (manifest.type !== 'sumo_lane_replay' || manifest.version !== 1 || manifest.step !== 1 || network.zone !== manifest.zone) throw new Error('Invalid traffic manifest');
    this.manifest = manifest; this.network = network; this.read = read;
    this.chunks = new Map(); this.decoded = new Map(); this.transitions = null;
    this.pinned = new Set();
    this.frames = Array.from({ length: manifest.end - manifest.start + 1 }, (_, i) => ({ time: manifest.start + i, vehicles: [] }));
  }
  pin(index) { this.pinned = new Set([index, Math.min(index + 1, this.frames.length - 1)]); }
  async frame(index) {
    index = clamp(index, 0, this.frames.length - 1);
    if (this.decoded.has(index)) return this.frames[index];
    const time = this.frames[index].time;
    const chunkIndex = this.manifest.chunks.findIndex(chunk => chunk.first <= time && time <= chunk.last);
    if (chunkIndex < 0) throw new Error('Missing traffic time range');
    const chunk = await this.chunk(chunkIndex);
    const source = chunk.frames[time - chunk.start];
    if (!source || source[0] !== time || !Array.isArray(source[1])) throw new Error('Invalid traffic frame');
    const ids = new Set();
    const vehicles = source[1].map(row => {
      if (row.length !== 7 || !row.every(Number.isFinite) || !this.network.lanes[row[1]] || !this.manifest.ids[row[0]] || row[6] < 0 || ids.has(row[0])) throw new Error('Invalid vehicle sample');
      ids.add(row[0]);
      const [idIndex, lane, pos, x, y, angle, speed] = row;
      const [lng, lat] = toLngLat(x, y, this.manifest.origin, this.manifest.scale);
      return { id: this.manifest.ids[idIndex], lane, pos, x, y, angle, speed, lng, lat, state: speed < 3 ? 'slow' : speed < 8 ? 'medium' : 'fast' };
    });
    this.frames[index] = { time, vehicles };
    this.decoded.set(index, true);
    while (this.decoded.size > 4) {
      const old = [...this.decoded.keys()].find(key => !this.pinned.has(key));
      if(old === undefined)break;
      this.frames[old] = { time: this.frames[old].time, vehicles: [] }; this.decoded.delete(old);
    }
    if (chunkIndex + 1 < this.manifest.chunks.length && time > this.manifest.chunks[chunkIndex].last - 10) this.chunk(chunkIndex + 1).catch(() => {});
    return this.frames[index];
  }
  async chunk(index) {
    if (!this.chunks.has(index)) {
      const descriptor = this.manifest.chunks[index];
      const promise = this.read(descriptor.file).then(data => {
        if (data.zone !== this.manifest.zone || data.start !== descriptor.first || data.frames.length !== descriptor.last - descriptor.first + 1) throw new Error('Invalid traffic chunk');
        return data;
      }).catch(error => { this.chunks.delete(index); throw error; });
      this.chunks.set(index, promise);
      while (this.chunks.size > 3) this.chunks.delete(this.chunks.keys().next().value);
    }
    return this.chunks.get(index);
  }
  between(from, to, fraction) {
    if (!this.transitions || this.transitions.time !== from.time) {
      const next = new Map(to.vehicles.map(vehicle => [vehicle.id, vehicle]));
      this.transitions = { time: from.time, rows: from.vehicles.map(vehicle => next.has(vehicle.id) ? makeTransition(vehicle, next.get(vehicle.id), this.network.lanes) : { kind: 'gap', from: vehicle, to: vehicle }) };
    }
    return this.transitions.rows.map(transition => {
      const vehicle = sampleTransition(transition, fraction);
      const [lng, lat] = toLngLat(vehicle.x, vehicle.y, this.manifest.origin, this.manifest.scale);
      return { ...vehicle, lng, lat };
    });
  }
}
