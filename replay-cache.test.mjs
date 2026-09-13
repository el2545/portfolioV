import assert from 'node:assert/strict';
import { TrafficReplay } from './road-motion.js';
import { campaignSlot } from './campaign-art.js';
const manifest={type:'sumo_lane_replay',version:1,step:1,start:0,end:9,zone:'test',origin:[0,0],scale:1e-8,ids:['v'],chunks:Array.from({length:10},(_,i)=>({file:String(i),first:i,last:i}))};
const network={zone:'test',lanes:[{id:'lane',length:100,shape:[[0,0],[0,100]],next:[],edge:'road'}]};
const replay=new TrafficReplay(manifest,network,async file=>{
 const n=Number(file);if(n<8)await new Promise(resolve=>setTimeout(resolve,(8-n)*10));
 return {zone:'test',start:n,frames:[[n,[[0,0,n,0,n,0,10]]]]};
});
const stale=Array.from({length:8},(_,i)=>replay.frame(i));
replay.pin(8);await Promise.all([replay.frame(8),replay.frame(9)]);await Promise.all(stale);
assert.equal(replay.frames[8].vehicles.length,1);assert.equal(replay.frames[9].vehicles.length,1);
assert.ok(replay.decoded.size<=4);assert.ok(replay.chunks.size<=3);
for(const [time,slot] of [[0,0],[9.99,0],[10,1],[59,5],[60,0],[609,0],[610,1]])assert.equal(campaignSlot(time),slot);
console.log('PASS stale frames cannot evict the selected pair; cache bounds; DOOH slot boundaries');
