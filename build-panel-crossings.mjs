import fs from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { crossesGate } from './panel-workshop-model.js';
import { lanePoint } from './road-motion.js';
const root=new URL('./',import.meta.url),read=async file=>JSON.parse(await fs.readFile(new URL(file,root),'utf8'));
const sites=(await read('advertising-sites.json')).zones,result={version:1,method:'Same-lane forward crossing of the midpoint of the illustrative segment between consecutive one-second FCD samples. Crossing time is linearly interpolated; lane changes, arrivals without a previous sample and discontinuities are excluded. Not a full road count or measured advertising exposure.',zones:{}};
for(const [zone,panels] of Object.entries(sites)){
 const manifest=await read(zone+'_traffic.json'),network=await read(manifest.network);
 const counters=panels.map(panel=>({id:panel.id,lane:panel.lane,gate:(panel.start+panel.end)/2,events:[]}));
 let previous=new Map(),previousTime=null;
 for(const chunk of manifest.chunks){
  const data=await read(chunk.file);
  for(const [time,rows] of data.frames){
   const relevant=new Map();
   for(const row of rows){
    const matches=counters.filter(c=>c.lane===row[1]);if(!matches.length)continue;
    const current={id:row[0],lane:row[1],pos:row[2],speed:row[6]};relevant.set(current.id,current);
    const old=previous.get(current.id);
    for(const counter of matches)if(time===previousTime+1&&crossesGate(old,current,counter.gate)){
     const crossing=previousTime+(counter.gate-old.pos)/(current.pos-old.pos);
     counter.events.push([Math.round(crossing*1000)/1000,current.id]);
    }
   }
   previous=relevant;previousTime=time;
  }
 }
 for(const c of counters){
  const lane=network.lanes[c.lane],p=lanePoint(lane,c.gate),a=lanePoint(lane,Math.max(0,c.gate-1)),b=lanePoint(lane,c.gate+1),length=Math.hypot(b[0]-a[0],b[1]-a[1]);
  const dx=(b[1]-a[1])/length*lane.width*.6,dy=-(b[0]-a[0])/length*lane.width*.6;
  c.line=[[p[0]-dx,p[1]-dy],[p[0]+dx,p[1]+dy]];c.events.sort((x,y)=>x[0]-y[0]);
 }
 result.zones[zone]={source:manifest.source,panels:counters};
 console.log(zone,counters.map(c=>`${c.id}: ${c.events.length} crossings`).join(', '));
}
const data=JSON.stringify(result);await fs.writeFile(new URL('panel-crossings.json',root),data);await fs.writeFile(new URL('panel-crossings.json.gz',root),gzipSync(data));
