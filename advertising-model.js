// Monetary inputs reproduce the scenario on thesis pp. 93–95, not market quotes.
export const defaults = Object.freeze({ impressions: 300000, cpm: 55, fill: 70, slots: 6, opex: 300167, capex: 150000, basis: 'screen' });
export function calculateAdvertising(input) {
  for (const key of ['impressions','cpm','fill','slots','opex','capex']) {
    if (!Number.isFinite(input[key]) || input[key] < 0) throw new RangeError(key);
  }
  if (input.fill > 100 || !Number.isInteger(input.slots) || input.slots < 1 || !['screen','slot'].includes(input.basis)) throw new RangeError('scenario');
  // A screen-wide audience budget is divided among equal-duration slots.
  // Multiplication by slots is valid only if the input is an audience per slot.
  const multiplier = input.basis === 'slot' ? input.slots : 1;
  const monthly = input.impressions / 1000 * input.cpm * input.fill / 100 * multiplier;
  const annual = monthly * 12;
  const denominator = 12 * input.cpm * input.fill / 100 * multiplier;
  return { monthly, annual, operating: annual-input.opex, fiveYear: 5*(annual-input.opex)-input.capex,
    perSlot: input.impressions / (input.basis === 'screen' ? input.slots : 1),
    breakEven: denominator > 0 ? input.opex * 1000 / denominator : input.opex === 0 ? 0 : null };
}
export function segmentSnapshot(site, vehicles) {
  const selected = vehicles.filter(v => v.lane === site.lane && v.pos >= site.start && v.pos <= site.end);
  return { count: new Set(selected.map(v=>v.id)).size, speed: selected.length ? selected.reduce((sum,v)=>sum+v.speed,0)/selected.length*3.6 : null };
}
