import { calculateAdvertising, defaults, segmentSnapshot } from './advertising-model.js';
import { toLngLat } from './road-motion.js';

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
    this.onButton=event=>{const button=event.target.closest('[data-ad-site]');if(button)this.select(button.dataset.adSite,true);};
    this.scene.addEventListener('click',this.onButton,{signal:this.events.signal});
    document.querySelector('#adExplain').addEventListener('click',async event=>{
      event.preventDefault();if(document.fullscreenElement)await document.exitFullscreen();
      const target=document.querySelector('#advertising-value');target.scrollIntoView({block:'start'});
      const title=document.querySelector('#adTitle');title.tabIndex=-1;title.focus({preventScroll:true});history.replaceState(null,'','#advertising-value');
    },{signal:this.events.signal});
  }
  destroy() {this.events.abort();this.clear();}
  clear() {
    this.sites=[];this.snapshot=null;this.scene.hidden=true;
    this.markers.forEach(m=>m.remove());this.markers=[];
    this.layer?.setBillboards([]);
    this.map?.getSource('ad-segment')?.setData({type:'FeatureCollection',features:[]});
    if(this.line)this.leafletMap.removeLayer(this.line);this.line=null;
  }
  setSites(sites,manifest) {
    this.clear();this.sites=sites;this.manifest=manifest;this.scene.hidden=false;
    this.layer?.setBillboards(sites);
    for(const site of sites) {
      const coord=toLngLat(...site.position,manifest.origin,manifest.scale);
      const button=document.createElement('button');button.type='button';button.className='di-ad-pin di-ad-pin--'+site.kind;
      button.textContent=site.id+' · '+site.kind.toUpperCase();button.setAttribute('aria-label',t('open')+' '+site.id+' · '+site.kind.toUpperCase());
      button.addEventListener('click',event=>{event.stopPropagation();this.select(site.id,true);});
      if(this.map) this.markers.push(new this.maplibre.Marker({element:button,anchor:'bottom',offset:[0,-48]}).setLngLat(coord).addTo(this.map));
      else {
        const marker=window.L.marker([coord[1],coord[0]],{icon:window.L.divIcon({html:button,className:'di-ad-leaflet',iconSize:[85,30],iconAnchor:[42,48]}),keyboard:false}).addTo(this.leafletMap);
        this.markers.push(marker);
      }
    }
    this.select(this.selected,false);
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
      if(focus){this.onFocus?.();this.map.easeTo({center:toLngLat(...site.position,this.manifest.origin,this.manifest.scale),zoom:19,pitch:58,bearing:-18,duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:650});}
    } else {
      if(this.line)this.leafletMap.removeLayer(this.line);
      this.line=window.L.polyline(coordinates.map(([lng,lat])=>[lat,lng]),{color:colour,weight:5,dashArray:'6 6',interactive:false}).addTo(this.leafletMap);
      if(focus)this.leafletMap.setView([coordinates.at(-1)[1],coordinates.at(-1)[0]],19);
    }
    this.updateSnapshot();
  }
  frame(frame) {this.snapshot=frame;this.updateSnapshot();}
  updateSnapshot() {
    const site=this.sites.find(s=>s.id===this.selected);if(!site)return;
    const target=document.querySelector('#adTraffic');if(!this.snapshot){target.textContent='';return;}
    const info=segmentSnapshot(site,this.snapshot.vehicles);
    const time=new Date(this.snapshot.time*1000).toISOString().slice(14,19);
    target.textContent=`${t('segment')} · ${number(site.end-site.start)} ${t('lengthUnit')} · ${t('recorded')} ${time}\n${number(info.count)} ${t('vehicles')}${info.speed===null?'':` · ${number(info.speed,1)} ${t('speedUnit')} (${t('speed')})`}`;
    target.title=t('sceneNote');
  }
}
