export function campaignSlot(time) { return Math.floor(((time % 60) + 60) % 60 / 10); }
export const campaignDraft = { text:'', slot:0, revision:0 };
export function setCampaignDraft(text,slot) {
  const value=Array.from(String(text).replace(/[\u0000-\u001f\u007f]/g,' ')).slice(0,60).join('').trim();
  if(!Number.isInteger(slot)||slot<0||slot>5)throw new RangeError('Invalid ad slot');
  if(value!==campaignDraft.text||slot!==campaignDraft.slot){campaignDraft.text=value;campaignDraft.slot=slot;campaignDraft.revision++;}
}
// Original teaching artwork. A fixed palette separates ad changes from traffic colours.
export function drawCampaign(canvas,kind,time=0) {
  const i18n=window.PORTFOLIO_I18N,t=key=>i18n.ad(key),ctx=canvas.getContext('2d');
  const w=canvas.width,h=canvas.height,digital=kind==='dooh',slot=campaignSlot(time);
  const dark=digital?'#123e47':'#664523',light=digital?'#e0f1e9':'#f4e8d2',accent=digital?'#8cc9bd':'#d1a164';
  ctx.fillStyle=dark;ctx.fillRect(0,0,w,h);
  const variation=digital?slot:0;
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(w*(.76+(variation%3)*.09),h*(.68+(variation%2)*.14),w*(.28+(variation%3)*.05),0,Math.PI*2);ctx.fill();
  ctx.fillStyle=light;ctx.beginPath();ctx.moveTo(w*(.4+(variation%2)*.12),h);ctx.lineTo(w*(.68+(variation%3)*.08),h*(.44+(variation%2)*.1));ctx.lineTo(w,h*.73);ctx.lineTo(w,h);ctx.fill();
  const custom=campaignDraft.text&&(!digital||slot===campaignDraft.slot);
  const text=custom?campaignDraft.text:t('campaign');
  const firstLetter=text.match(/\p{L}/u)?.[0]||'';
  const rtl=custom?/[\p{Script=Arabic}\p{Script=Hebrew}]/u.test(firstLetter):i18n.language==='ar';ctx.direction=rtl?'rtl':'ltr';ctx.textAlign=rtl?'right':'left';const x=rtl?w*.92:w*.08;
  ctx.fillStyle=light;ctx.font=`600 ${w*.039}px sans-serif`;ctx.fillText(t('demo'),x,h*.12);
  let size=w*.083,lines=[];
  do {
    ctx.font=`bold ${size}px sans-serif`;lines=[''];
    for(const word of text.split(/\s+/)) {
      const i=lines.length-1,candidate=lines[i]?lines[i]+' '+word:word;
      if(ctx.measureText(candidate).width<=w*.82)lines[i]=candidate;
      else if(ctx.measureText(word).width<=w*.82){if(lines[i])lines.push(word);else lines[i]=word;}
      else {if(lines[i])lines.push('');for(const char of Array.from(word)){const j=lines.length-1;if(ctx.measureText(lines[j]+char).width>w*.82)lines.push(char);else lines[j]+=char;}}
    }
    if(lines.length<=2)break;size-=2;
  }while(size>22);
  lines.slice(0,2).forEach((line,i)=>ctx.fillText(line,x,h*.32+i*size*1.2));
  ctx.font=`500 ${w*.045}px sans-serif`;ctx.fillText(digital?`DOOH / ${slot+1}`:'OOH',x,h*.58);
  if(digital)for(let i=0;i<6;i++){ctx.fillStyle=i===slot?'#ffffff':'#42746f';ctx.fillRect(w*(.08+i*.14),h*.86,w*.11,h*.045);}
  else {ctx.fillStyle=dark;ctx.fillRect(w*.08,h*.83,w*.22,h*.02);}
}
