import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { calculateAdvertising, defaults, segmentSnapshot } from './advertising-model.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const shared=calculateAdvertising(defaults),perSlot=calculateAdvertising({...defaults,basis:'slot'});
near(shared.annual,138600);near(shared.operating,-161567);near(shared.fiveYear,-957835);
near(perSlot.annual,831600);near(perSlot.operating,531433);near(perSlot.fiveYear,2507165);
near(calculateAdvertising({...defaults,slots:12}).annual,shared.annual);
near(calculateAdvertising({...defaults,slots:12,basis:'slot'}).annual,perSlot.annual*2);
near(calculateAdvertising({...defaults,impressions:shared.breakEven}).operating,0);
near(calculateAdvertising({...defaults,fill:0}).annual,0);
assert.equal(calculateAdvertising({...defaults,cpm:0}).breakEven,null);
assert.equal(calculateAdvertising({...defaults,cpm:0,opex:0}).breakEven,0);
for(const change of [{fill:101},{slots:0},{slots:1.5},{impressions:-1},{cpm:NaN},{capex:Infinity},{basis:'invalid'}])assert.throws(()=>calculateAdvertising({...defaults,...change}),RangeError);
const selection={lane:4,start:20,end:80};
const sample=segmentSnapshot(selection,[{id:'a',lane:4,pos:20,speed:0},{id:'b',lane:4,pos:80,speed:10},{id:'c',lane:4,pos:81,speed:5},{id:'d',lane:5,pos:30,speed:9}]);
assert.deepEqual(sample,{count:2,speed:18});assert.deepEqual(segmentSnapshot(selection,[]),{count:0,speed:null});
const root=new URL('./',import.meta.url);
const read=async f=>JSON.parse(await fs.readFile(new URL(f,root),'utf8'));
const sites=(await read('advertising-sites.json')).zones;
for(const [zone,items] of Object.entries(sites)){
 const manifest=await read(zone+'_traffic.json'),network=await read(manifest.network);
 const chunk=await read(manifest.chunks.find(c=>manifest.initialTime>=c.first&&manifest.initialTime<=c.last).file);
 const rows=chunk.frames.find(f=>f[0]===manifest.initialTime)[1];
 for(const site of items){
  assert.ok(site.roadClearance>=3);assert.ok(site.start>=0&&site.end<=network.lanes[site.lane].length);
  assert.ok(site.segment.length>=2);assert.ok(site.position.every(Number.isFinite));
  const expected=rows.filter(r=>r[1]===site.lane&&r[2]>=site.start&&r[2]<=site.end);
  const actual=segmentSnapshot(site,rows.map(r=>({id:r[0],lane:r[1],pos:r[2],speed:r[6]})));
  assert.equal(actual.count,expected.length);
 }
 console.log('PASS billboards and source segment counts',zone);
}
console.log('PASS thesis arithmetic, audience allocation, break-even, invalid input and zero cases');
