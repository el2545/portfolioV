(() => {
  'use strict';
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const locationOK = (lat, lng) => finite(lat) && Math.abs(lat) <= 90 && finite(lng) && Math.abs(lng) <= 180;
  function frameStats(vehicles) {
    const count = vehicles.length;
    const sum = vehicles.reduce((total, vehicle) => total + vehicle.speed, 0);
    return { count, meanSpeed: count ? sum / count : null,
      stopped: vehicles.filter(vehicle => vehicle.speed < 0.1).length };
  }
  function validate(data, mode) {
    if (mode === 'heatmap') {
      if (data.type !== 'sumo_geo_heatmap' || !Array.isArray(data.points) || !data.points.length) throw new Error('Invalid SUMO heat export');
      for (const point of data.points) {
        if (!Array.isArray(point) || !locationOK(point[0], point[1]) || !finite(point[2]) || point[2] < 0) throw new Error('Invalid heat sample');
      }
      return { records: data.points.length, frames: null, meanSpeed: null };
    }
    if (data.type !== 'sumo_geo_simulation' || !Array.isArray(data.timesteps) || !data.timesteps.length) throw new Error('Invalid SUMO trajectory export');
    let previous = -Infinity, records = 0, speedSum = 0;
    for (const frame of data.timesteps) {
      if (!finite(frame.time) || frame.time <= previous || !Array.isArray(frame.vehicles)) throw new Error('Invalid frame time or vehicles');
      previous = frame.time;
      const ids = new Set();
      for (const vehicle of frame.vehicles) {
        if (vehicle.id === undefined || ids.has(String(vehicle.id)) || !locationOK(vehicle.lat, vehicle.lng) || !finite(vehicle.speed) || vehicle.speed < 0) throw new Error('Invalid vehicle record');
        ids.add(String(vehicle.id)); records++; speedSum += vehicle.speed;
      }
    }
    return { records, frames: data.timesteps.length, meanSpeed: records ? speedSum / records : null };
  }
  async function readJSON(path, signal) {
    if (typeof DecompressionStream !== 'undefined') {
      try {
        const response = await fetch(path + '.gz', { signal });
        if (!response.ok) throw new Error('Compressed export unavailable');
        const bytes = new Uint8Array(await response.arrayBuffer());
        // Handles both a raw .gz asset and a server that already decoded Content-Encoding.
        if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
          const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
          return await new Response(stream).json();
        }
        return JSON.parse(new TextDecoder().decode(bytes));
      } catch (error) {
        if (signal?.aborted) throw error;
      }
    }
    const response = await fetch(path, { signal });
    if (!response.ok) throw new Error('Source export unavailable: ' + path);
    return response.json();
  }
  window.PORTFOLIO_DATA = { frameStats, validate, readJSON };
})();
