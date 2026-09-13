import { paintColours } from "./road-motion.js";
// Shared car artwork and sampled-position playback for both map engines.
export const carClass = (speed) => speed < 3 ? 'slow' : speed < 8 ? 'medium' : 'fast';

export function createCarSprites() {
  return Object.fromEntries(Object.entries(paintColours).map(([key, colour]) => {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 88;
    const ctx = canvas.getContext('2d');
    const box = (x, y, w, h, radius, fill) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fill();
    };
    // Nose points north (SUMO: clockwise degrees from north).
    box(9, 8, 33, 75, 10, '#00000055');
    [[5,20],[35,20],[5,61],[35,61]].forEach(([x,y]) => box(x,y,8,15,2,'#14202b'));
    box(10, 5, 28, 76, 9, '#eff5f5');
    box(12, 7, 24, 72, 8, colour);
    box(14, 11, 20, 14, 5, '#ffffff28');
    box(14, 28, 20, 15, 4, '#173449');
    box(16, 30, 15, 3, 1, '#a7d6e1');
    box(15, 44, 18, 16, 3, colour);
    box(14, 61, 20, 10, 3, '#234356');
    box(12, 11, 6, 4, 1, '#fff7cc');
    box(30, 11, 6, 4, 1, '#fff7cc');
    box(12, 73, 6, 4, 1, '#ad312c');
    box(30, 73, 6, 4, 1, '#ad312c');
    return [key, { image: ctx.getImageData(0,0,48,88), url: canvas.toDataURL() }];
  }));
}

export function interpolateVehicles(from, to, progress) {
  const fraction = Math.max(0, Math.min(1, progress));
  if (fraction === 1) return to;
  const next = new Map(to.map(vehicle => [String(vehicle.id), vehicle]));
  // Only interpolate IDs present in both samples. No invented routes or entries.
  return from.map(vehicle => {
    const target = next.get(String(vehicle.id));
    if (!target) return vehicle;
    const angle = Number(vehicle.angle) || 0;
    const turn = (((Number(target.angle) || 0) - angle + 540) % 360) - 180;
    return {
      ...vehicle,
      lat: vehicle.lat + (target.lat - vehicle.lat) * fraction,
      lng: vehicle.lng + (target.lng - vehicle.lng) * fraction,
      angle: (angle + turn * fraction + 360) % 360,
    };
  });
}
