import { calculateAdvertising, defaults, segmentSnapshot } from './advertising-model.js';
import { toLngLat } from './road-motion.js';
import { drawCampaign, campaignSlot, campaignDraft, setCampaignDraft } from './campaign-art.js';
import { countPanelEvents, estimatePanelAudience } from './panel-workshop-model.js';

const i18n=window.PORTFOLIO_I18N, t=key=>i18n.ad(key), number=(n,d=0)=>i18n.number(n,d);
const money=n=>`${number(n)} ${t('currency')}`;

export function initAdvertisingCalculator() {
  const form=document.querySelector('#adForm');
  if(!form)return;
  const update=()=>{
    const values={basis:form.elements.basis.value};
    let valid=true;
    for(const key of Object.keys(defaults).filter(k=>k!=='basis')) {
      const field=form.elements[key];values[key]=field.valueAsNumber;
      const ok=field.checkValidity();field.setAttribute('aria-invalid',String(!ok));valid=valid&&ok;
    }
    const error=document.querySelector('#adError');error.hidden=valid;error.textContent=valid?'':t('invalid');
    document.querySelector('#adBasisNote').textContent=t(values.basis==='screen'?'screenNote':'slotNote');
    document.querySelector('#adMultiplier').hidden=values.basis!=='slot';
    if(!valid) {
      document.querySelectorAll('[id^="ad-result-"]').forEach(el=>el.textContent='—');
      document.querySelector('#adPerSlot').textContent='';document.querySelector('#adVerdict').textContent='';return;
    }
    const result=calculateAdvertising(values);
    for(const key of ['annual','operating','fiveYear'])document.querySelector('#ad-result-'+key).textContent=money(result[key]);
    document.querySelector('#ad-result-breakEven').textContent=result.breakEven===null?t('impossible'):number(Math.ceil(result.breakEven));
    document.querySelector('#adPerSlot').textContent=`${t('perSlot')} : ${number(result.perSlot)}`;
    const verdict=document.querySelector('#adVerdict');verdict.textContent=t(result.operating>=0?'positive':'negative');verdict.dataset.viable=String(result.operating>=0);
  };
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',update);
  form.addEventListener('reset',()=>setTimeout(update,0));
  update();
}

export class AdvertisingExplorer {
  constructor({map,maplibre,leafletMap,layer,onFocus}) {
    this.map=map;this.maplibre=maplibre;this.leafletMap=leafletMap;this.layer=layer;
    this.onFocus=onFocus;this.events=new AbortController();
    this.sites=[];this.markers=[];this.selected='A';this.snapshot=null;
    this.scene=document.querySelector('#adScene');
    this.counts=null;this.countLoading=false;
    const form=document.querySelector('#panelForm');
    form.elements.text.value=campaignDraft.text;form.elements.slot.value=String(campaignDraft.slot);
    form.addEventListener('submit',event=>event.preventDefault(),{signal:this.events.signal});
    form.addEventListener('input',()=>{
      setCampaignDraft(form.elements.text.value,Number(form.elements.slot.value));
      this.layer?.setAdvertisingTime(this.snapshot?.time||0);this.updateSnapshot();
    },{signal:this.events.signal});
    document.querySelector('#panelResetText').addEventListener('click',()=>{form.elements.text.value='';form.elements.text.dispatchEvent(new Event('input',{bubbles:true}));},{signal:this.events.signal});
    document.querySelector('#panelPreviewSlot').addEventListener('click',()=>{if(!this.snapshot)return;const timeline=document.querySelector('#mapTimeline');timeline.value=String(Math.floor(this.snapshot.time/60)*60+campaignDraft.slot*10);timeline.dispatchEvent(new Event('input',{bubbles:true}));},{signal:this.events.signal});
    document.querySelector('#panelWorkshop').addEventListener('toggle',()=>{this.map?.resize();this.leafletMap?.invalidateSize();},{signal:this.events.signal});
    this.onZoom=()=>this.markers.forEach(marker=>{const element=marker.getElement?.();if(element)element.style.visibility=(this.map?.getZoom()??this.leafletMap?.getZoom()??0)>=16?'visible':'hidden';});
    this.map?.on('zoom',this.onZoom);this.leafletMap?.on('zoomend',this.onZoom);
    this.onButton=event=>{const button=event.target.closest('[data-ad-site]');if(button)this.select(button.dataset.adSite,true);};
    this.scene.addEventListener('click',this.onButton,{signal:this.events.signal});
    document.querySelector('#adExplain').addEventListener('click',async event=>{
      event.preventDefault();if(document.fullscreenElement)await document.exitFullscreen();
      const target=document.querySelector('#advertising-value');target.scrollIntoView({block:'start'});
      const title=document.querySelector('#adTitle');title.tabIndex=-1;title.focus({preventScroll:true});history.replaceState(null,'','#advertising-value');
    },{signal:this.events.signal});
  }
  destroy() {this.destroyed=true;this.events.abort();this.map?.off('zoom',this.onZoom);this.leafletMap?.off('zoomend',this.onZoom);this.clear();}
  clear() {
    this.sites=[];this.snapshot=null;this.scene.hidden=true;
    this.markers.forEach(m=>m.remove());this.markers=[];
    this.layer?.setBillboards([]);
    this.map?.getSource('ad-segment')?.setData({type:'FeatureCollection',features:[]});
    this.map?.getSource('panel-gate')?.setData({type:'FeatureCollection',features:[]});
    if(this.gateLine)this.leafletMap.removeLayer(this.gateLine);this.gateLine=null;
    if(this.line)this.leafletMap.removeLayer(this.line);this.line=null;
  }
  setSites(sites,manifest) {
    this.clear();this.sites=sites;this.manifest=manifest;this.scene.hidden=false;
    this.layer?.setBillboards(sites);
    this.loadCounts();
    for(const site of sites) {
      const coord=toLngLat(...site.position,manifest.origin,manifest.scale);
      const button=document.createElement('button');button.type='button';button.className='di-ad-pin di-ad-pin--'+site.kind;
      button.textContent=site.id;button.setAttribute('aria-label',t('open')+' '+site.id+' · '+site.kind.toUpperCase());
      button.addEventListener('click',event=>{event.stopPropagation();this.select(site.id,true);});
      if(this.map) this.markers.push(new this.maplibre.Marker({element:button,anchor:'bottom',offset:[0,-48]}).setLngLat(coord).addTo(this.map));
      else {
        const marker=window.L.marker([coord[1],coord[0]],{icon:window.L.divIcon({html:button,className:'di-ad-leaflet',iconSize:[85,30],iconAnchor:[42,48]}),keyboard:false}).addTo(this.leafletMap);
        this.markers.push(marker);
      }
    }
    this.onZoom();this.select(this.selected,false);
  }
  select(id,focus) {
    const site=this.sites.find(s=>s.id===id);if(!site)return;this.selected=id;
    this.scene.querySelectorAll('[data-ad-site]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.adSite===id)));
    document.querySelector('#adSiteDescription').textContent=t(site.kind==='ooh'?'oohShort':'doohShort');
    const coordinates=site.segment.map(p=>toLngLat(...p,this.manifest.origin,this.manifest.scale));
    const colour=site.kind==='ooh'?'#aa702b':'#176d73';
    if(this.map) {
      if(!this.map.getSource('ad-segment')) {
        this.map.addSource('ad-segment',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
        this.map.addLayer({id:'ad-segment-line',type:'line',source:'ad-segment',paint:{'line-color':['get','colour'],'line-width':5,'line-opacity':.8,'line-dasharray':[2,2]}} ,'traffic-cars-3d');
      }
      this.map.getSource('ad-segment').setData({type:'FeatureCollection',features:[{type:'Feature',properties:{colour},geometry:{type:'LineString',coordinates}}]});
      if(focus){this.onFocus?.();this.map.easeTo({center:toLngLat(...site.position,this.manifest.origin,this.manifest.scale),zoom:19,pitch:this.map.getPitch(),bearing:this.map.getPitch()>0?site.angle:0,duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:650});}
    } else {
      if(this.line)this.leafletMap.removeLayer(this.line);
      this.line=window.L.polyline(coordinates.map(([lng,lat])=>[lat,lng]),{color:colour,weight:5,dashArray:'6 6',interactive:false}).addTo(this.leafletMap);
      if(focus)this.leafletMap.setView([coordinates.at(-1)[1],coordinates.at(-1)[0]],19);
    }
    this.drawGate();this.updateSnapshot();
  }
  frame(frame) {this.snapshot=frame;this.updateSnapshot();}
  updateSnapshot() {
    const site=this.sites.find(s=>s.id===this.selected);if(!site)return;
    const timeValue=this.snapshot?.time||0;
    drawCampaign(document.querySelector('#adCreative'),site.kind,timeValue);
    const customVisible=campaignDraft.text&&(site.kind==='ooh'||campaignSlot(timeValue)===campaignDraft.slot);
    document.querySelector('#adCreative').setAttribute('aria-label',t('showcase')+' · '+(customVisible?campaignDraft.text:t('campaign')));
    document.querySelector('#adLoopLabel').textContent=site.kind==='ooh'?t('fixedPoster'):t('slotLabel').replace('{slot}',number(campaignSlot(timeValue)+1));
    document.querySelector('#adLoopNote').hidden=site.kind!=='dooh';
    this.updateWorkshop(site,timeValue);
    const target=document.querySelector('#adTraffic');if(!this.snapshot){target.textContent='';return;}
    const info=segmentSnapshot(site,this.snapshot.vehicles);
    const time=new Date(this.snapshot.time*1000).toISOString().slice(14,19);
    target.textContent=`${t('segment')} · ${number(site.end-site.start)} ${t('lengthUnit')} · ${t('recorded')} ${time}\n${number(info.count)} ${t('vehicles')}${info.speed===null?'':` · ${number(info.speed,1)} ${t('speedUnit')} (${t('speed')})`}`;
    target.title=t('sceneNote');
  }
  async loadCounts() {
    if(this.counts||this.countLoading)return;
    this.countLoading=true;
    try {
      const response=await fetch(i18n.asset('panel-crossings.json'),{signal:AbortSignal.timeout(30000)});
      if(!response.ok)throw new Error('Counts unavailable');
      const data=await response.json();if(data.version!==1||!data.zones)throw new Error('Invalid counts');
      this.counts=data;
    }catch {this.counts=null;}finally {this.countLoading=false;if(!this.destroyed){this.drawGate();this.updateSnapshot();}}
  }
  drawGate() {
    if(!this.sites.length)return;
    const gate=this.counts?.zones[this.manifest?.zone]?.panels.find(p=>p.id===this.selected);if(!gate)return;
    const coords=gate.line.map(point=>toLngLat(...point,this.manifest.origin,this.manifest.scale));
    if(this.map){
      if(!this.map.getSource('panel-gate')){
        this.map.addSource('panel-gate',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
        this.map.addLayer({id:'panel-gate-line',type:'line',source:'panel-gate',minzoom:16,paint:{'line-color':'#ffffff','line-width':4}},'traffic-cars-3d');
      }
      this.map.getSource('panel-gate').setData({type:'FeatureCollection',features:[{type:'Feature',properties:{},geometry:{type:'LineString',coordinates:coords}}]});
    }else if(this.leafletMap){if(this.gateLine)this.leafletMap.removeLayer(this.gateLine);this.gateLine=window.L.polyline(coords.map(([lng,lat])=>[lat,lng]),{color:'#ffffff',weight:4,interactive:false}).addTo(this.leafletMap);}
  }
  updateWorkshop(site,time) {
    const form=document.querySelector('#panelForm'),gate=this.counts?.zones[this.manifest.zone]?.panels.find(p=>p.id===site.id);
    form.elements.slot.disabled=site.kind!=='dooh';
    document.querySelector('#panelPreviewSlot').hidden=site.kind!=='dooh';
    const outputs=['uniqueVehicles','crossings','eligibleCrossings','estimatedImpressions','estimatedValue'];
    if(!gate||!this.snapshot){document.querySelector('#panelPeriodLabel').textContent=t(this.countLoading?'workshopLoading':'workshopUnavailable');outputs.forEach(key=>document.querySelector('#panel-'+key).textContent='—');return;}
    const counts=countPanelEvents(gate.events,time,Number(form.elements.period.value),site.kind==='dooh'?campaignDraft.slot:null);
    const clock=value=>new Date(value*1000).toISOString().slice(14,19);
    document.querySelector('#panelPeriodLabel').textContent=t('periodReadout').replace('{start}',clock(counts.start)).replace('{end}',clock(time));
    for(const [key,value] of Object.entries({uniqueVehicles:counts.vehicles,crossings:counts.passages,eligibleCrossings:counts.eligible}))document.querySelector('#panel-'+key).textContent=number(value);
    let valid=true;for(const name of ['occupants','visibility','cpm']){const field=form.elements[name],ok=field.checkValidity();field.setAttribute('aria-invalid',String(!ok));valid=valid&&ok;}
    document.querySelector('#panelError').hidden=valid;document.querySelector('#panelError').textContent=valid?'':t('workshopError');
    if(!valid){document.querySelector('#panel-estimatedImpressions').textContent='—';document.querySelector('#panel-estimatedValue').textContent='—';return;}
    const estimate=estimatePanelAudience(counts.eligible,form.elements.occupants.valueAsNumber,form.elements.visibility.valueAsNumber,form.elements.cpm.valueAsNumber);
    document.querySelector('#panel-estimatedImpressions').textContent=number(estimate.impressions,1);
    document.querySelector('#panel-estimatedValue').textContent=number(estimate.value,2);
  }
}
