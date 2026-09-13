import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { crossesGate,countPanelEvents,estimatePanelAudience } from './panel-workshop-model.js';
import { setCampaignDraft,campaignDraft } from './campaign-art.js';
const vehicle=(id,lane,pos,speed=10)=>({id,lane,pos,speed});
assert.ok(crossesGate(vehicle(1,2,40),vehicle(1,2,60),50));
for(const [a,b] of [[vehicle(1,2,50),vehicle(1,2,55)],[vehicle(1,2,45),vehicle(1,3,55)],[vehicle(1,2,45),vehicle(2,2,55)],[vehicle(1,2,45),vehicle(1,2,45)],[vehicle(1,2,0),vehicle(1,2,100)]])assert.ok(!crossesGate(a,b,50));
const events=[[1,1],[9.9,2],[10,1],[60,3],[61,1]];
assert.deepEqual(countPanelEvents(events,61,60),{start:1,end:61,passages:4,vehicles:3,eligible:4});
assert.equal(countPanelEvents(events,61,60,0).eligible,3);
assert.equal(countPanelEvents(events,9,60).passages,1);
assert.deepEqual(estimatePanelAudience(20,1.5,50,55),{impressions:15,value:.825});
assert.deepEqual(estimatePanelAudience(20,1.5,0,55),{impressions:0,value:0});
assert.throws(()=>estimatePanelAudience(20,1,101,55),RangeError);
setCampaignDraft('نص عربي <script>',2);assert.equal(campaignDraft.text,'نص عربي <script>');assert.equal(campaignDraft.slot,2);
setCampaignDraft('a'.repeat(100),0);assert.equal(campaignDraft.text.length,60);assert.throws(()=>setCampaignDraft('x',6),RangeError);
const data=JSON.parse(await fs.readFile(new URL('./panel-crossings.json',import.meta.url),'utf8'));
for(const [zone,{panels}] of Object.entries(data.zones)){
 for(const panel of panels){
  assert.ok(panel.events.length>0);let before=-1;
  for(const [time,id] of panel.events){assert.ok(time>=before&&time<=3599&&Number.isInteger(id));before=time;}
  const full=countPanelEvents(panel.events,3599,0);assert.equal(full.passages,panel.events.length);
  assert.equal(Array.from({length:6},(_,slot)=>countPanelEvents(panel.events,3599,0,slot).eligible).reduce((a,b)=>a+b,0),full.passages);
 }
 console.log('PASS counters',zone);
}
console.log('PASS gate boundaries, repeats, rewind, periods, ad slots, audience assumptions and text limits');
