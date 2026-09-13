// Confirmed crossings on one selected lane; no inference across missing samples or lane changes.
export function crossesGate(previous,current,gate) {
  return previous && current && previous.id===current.id && previous.lane===current.lane &&
    previous.pos<gate && current.pos>=gate && current.pos-previous.pos<=Math.max(previous.speed,current.speed)*1.5+20;
}
export function countPanelEvents(events,time,windowSeconds,slot=null) {
  const start=windowSeconds===0?0:Math.max(0,time-windowSeconds);
  const selected=events.filter(([at])=>at>start&&at<=time);
  const eligible=slot===null?selected:selected.filter(([at])=>Math.floor((at%60)/10)===slot);
  return {start,end:time,passages:selected.length,vehicles:new Set(selected.map(event=>event[1])).size,eligible:eligible.length};
}
export function estimatePanelAudience(passages,occupants,visibility,cpm) {
  if(![passages,occupants,visibility,cpm].every(Number.isFinite)||passages<0||occupants<0||occupants>10||visibility<0||visibility>100||cpm<0)throw new RangeError('Invalid audience assumptions');
  const impressions=passages*occupants*visibility/100;
  return {impressions,value:impressions*cpm/1000};
}
