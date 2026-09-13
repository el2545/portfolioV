export function campaignSlot(time) { return Math.floor(((time % 60) + 60) % 60 / 10); }
// Original teaching artwork. A fixed palette separates ad changes from traffic colours.
export function drawCampaign(canvas,kind,time=0) {
  const i18n=window.PORTFOLIO_I18N,t=key=>i18n.ad(key),ctx=canvas.getContext('2d');
  const w=canvas.width,h=canvas.height,digital=kind==='dooh',slot=campaignSlot(time);
  const dark=digital?'#123e47':'#664523',light=digital?'#e0f1e9':'#f4e8d2',accent=digital?'#8cc9bd':'#d1a164';
  ctx.fillStyle=dark;ctx.fillRect(0,0,w,h);
  const variation=digital?slot:0;
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(w*(.76+(variation%3)*.09),h*(.68+(variation%2)*.14),w*(.28+(variation%3)*.05),0,Math.PI*2);ctx.fill();
  ctx.fillStyle=light;ctx.beginPath();ctx.moveTo(w*(.4+(variation%2)*.12),h);ctx.lineTo(w*(.68+(variation%3)*.08),h*(.44+(variation%2)*.1));ctx.lineTo(w,h*.73);ctx.lineTo(w,h);ctx.fill();
  const rtl=i18n.language==='ar';ctx.direction=rtl?'rtl':'ltr';ctx.textAlign=rtl?'right':'left';const x=rtl?w*.92:w*.08;
  ctx.fillStyle=light;ctx.font=`600 ${w*.039}px sans-serif`;ctx.fillText(t('demo'),x,h*.12);
  ctx.font=`bold ${w*.083}px sans-serif`;ctx.fillText(t('campaign'),x,h*.34,w*.82);
  ctx.font=`500 ${w*.045}px sans-serif`;ctx.fillText(digital?`DOOH / ${slot+1}`:'OOH',x,h*.47);
  if(digital)for(let i=0;i<6;i++){ctx.fillStyle=i===slot?'#ffffff':'#42746f';ctx.fillRect(w*(.08+i*.14),h*.86,w*.11,h*.045);}
  else {ctx.fillStyle=dark;ctx.fillRect(w*.08,h*.83,w*.22,h*.02);}
}
