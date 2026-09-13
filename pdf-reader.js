(() => {
  'use strict';
  const dialog=document.querySelector('#pdfReader');
  if(!dialog?.showModal)return;
  const i18n=window.PORTFOLIO_I18N,t=key=>i18n.pdf(key),el=id=>document.getElementById(id);
  let library,documentTask,documentPDF,renderTask,currentURL,opener,pageNumber=1,generation=0,renderGeneration=0,resizeTimer,loadAttempt=0;
  const canvas=el('pdfCanvas'),status=el('pdfStatus'),pageInput=el('pdfPage'),zoom=el('pdfZoom'),scroll=el('pdfScroll');
  const fallbackImage=document.createElement('img');fallbackImage.id='pdfFallback';fallbackImage.hidden=true;fallbackImage.style.cssText='display:block;margin-inline:auto;width:100%;height:auto';scroll.prepend(fallbackImage);
  document.querySelectorAll('a[href]').forEach(link=>{
    const url=new URL(link.href);if(link.hasAttribute('download')||url.origin!==location.origin||!url.pathname.toLowerCase().endsWith('.pdf'))return;
    link.setAttribute('aria-haspopup','dialog');
    const language=link.closest('.di-cv-item')?.querySelector('strong')?.textContent;
    if(language)link.setAttribute('aria-label',t('readHere')+' · '+language.trim());
  });
  const message=(key,page,total)=>t(key).replace('{page}',i18n.number(page,0)).replace('{total}',i18n.number(total,0));
  function controls(ready) {
    pageInput.disabled=!ready;zoom.disabled=!ready;
    el('pdfPrevious').disabled=!ready||pageNumber<=1;
    el('pdfNext').disabled=!ready||pageNumber>=documentPDF?.numPages;
  }
  function fail() {
    status.textContent=t('error');el('pdfRetry').hidden=false;controls(false);canvas.hidden=true;el('pdfTextDetails').hidden=true;
    const name=currentURL?.pathname.split('/').pop();if(!/^CV_SANY_El_Ghali_(FR|ENG|AR)\.pdf$/.test(name||''))return;
    const token=generation;
    fallbackImage.onload=()=>{if(token!==generation||!dialog.open)return;fallbackImage.hidden=false;fallbackImage.alt=t('fallback');status.textContent=t('fallback');el('pdfTotal').textContent='1';pageInput.value='1';zoom.disabled=false;};
    fallbackImage.onerror=()=>{fallbackImage.hidden=true;};
    fallbackImage.src=new URL(name.replace('.pdf','.preview.png'),currentURL).href;
  }
  async function renderPage() {
    if(!documentPDF||!dialog.open)return;
    const token=++renderGeneration,docToken=generation,doc=documentPDF;
    if(renderTask){renderTask.cancel();try{await renderTask.promise;}catch{}}
    if(token!==renderGeneration||docToken!==generation)return;
    controls(false);canvas.hidden=true;el('pdfTextDetails').hidden=true;status.textContent=t('rendering');
    try {
      const page=await doc.getPage(pageNumber);
      if(token!==renderGeneration||docToken!==generation)return;
      const original=page.getViewport({scale:1}),scale=zoom.value==='fit'?Math.max(.2,(scroll.clientWidth-32)/original.width):Number(zoom.value);
      const viewport=page.getViewport({scale}),density=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.floor(viewport.width*density);canvas.height=Math.floor(viewport.height*density);
      canvas.style.width=viewport.width+'px';canvas.style.height=viewport.height+'px';
      renderTask=page.render({canvasContext:canvas.getContext('2d'),viewport,transform:density!==1?[density,0,0,density,0,0]:null});
      await renderTask.promise;
      if(token!==renderGeneration||docToken!==generation)return;
      canvas.hidden=false;canvas.setAttribute('aria-label',message('pageImage',pageNumber,doc.numPages));
      pageInput.value=String(pageNumber);pageInput.max=String(doc.numPages);pageInput.removeAttribute('aria-invalid');
      el('pdfTotal').textContent=i18n.number(doc.numPages,0);status.textContent=message('ready',pageNumber,doc.numPages);controls(true);
      currentURL.hash='page='+pageNumber;el('pdfExternal').href=currentURL.href;scroll.scrollTo(0,0);
      const text=await page.getTextContent();
      if(token!==renderGeneration||docToken!==generation)return;
      el('pdfText').textContent=text.items.map(item=>item.str+(item.hasEOL?'\n':' ')).join('')||t('empty');el('pdfTextDetails').hidden=false;
    } catch(error) {if(token===renderGeneration&&docToken===generation&&error.name!=='RenderingCancelledException')fail();}
  }
  async function load() {
    const token=++generation;++renderGeneration;
    if(renderTask){renderTask.cancel();try{await renderTask.promise;}catch{}}
    if(documentTask){try{await documentTask.destroy();}catch{}}
    if(token!==generation||!dialog.open)return;
    documentPDF=null;fallbackImage.hidden=true;controls(false);canvas.hidden=true;el('pdfTextDetails').hidden=true;el('pdfRetry').hidden=true;status.textContent=t('loading');
    el('pdfTotal').textContent='—';
    try {
      library=library||await import('./pdf.min.mjs?reader=8&attempt='+loadAttempt++);
      if(token!==generation||!dialog.open)return;
      library.GlobalWorkerOptions.workerSrc=i18n.asset('pdf.worker.min.mjs');
      const url=new URL(currentURL);url.hash='';
      const task=library.getDocument({url:url.href,standardFontDataUrl:i18n.asset('./'),wasmUrl:i18n.asset('./'),isEvalSupported:false});documentTask=task;
      const pdf=await task.promise;
      if(token!==generation||!dialog.open)return;
      documentPDF=pdf;
      pageNumber=Math.max(1,Math.min(pageNumber,documentPDF.numPages));await renderPage();
    }catch{if(token===generation&&dialog.open)fail();}
  }
  document.addEventListener('click',async event=>{
    const link=event.target.closest('a[href]');
    if(!link||link.closest('#pdfReader')||link.hasAttribute('download')||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const url=new URL(link.href);if(url.origin!==location.origin||!url.pathname.toLowerCase().endsWith('.pdf'))return;
    event.preventDefault();opener=link;currentURL=url;
    const requested=Number(new URLSearchParams(url.hash.slice(1)).get('page'));pageNumber=Number.isInteger(requested)&&requested>0?requested:1;
    if(document.fullscreenElement)await document.exitFullscreen();
    if(el('mapPlay')?.getAttribute('aria-pressed')==='true')el('mapPlay').click();
    el('pdfName').textContent=decodeURIComponent(url.pathname.split('/').pop());el('pdfExternal').href=url.href;
    const download=new URL(url);download.hash='';el('pdfDownload').href=download.href;
    zoom.value='fit';fallbackImage.style.width='100%';el('pdfTextDetails').open=false;dialog.showModal();document.documentElement.classList.add('di-pdf-open');load();
  });
  el('pdfClose').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{
    ++generation;++renderGeneration;clearTimeout(resizeTimer);renderTask?.cancel();
    documentTask?.destroy().catch(()=>{});documentTask=null;documentPDF=null;canvas.width=1;canvas.height=1;
    fallbackImage.onload=null;fallbackImage.onerror=null;fallbackImage.removeAttribute('src');fallbackImage.hidden=true;el('pdfText').textContent='';document.documentElement.classList.remove('di-pdf-open');opener?.focus({preventScroll:true});
  });
  el('pdfPrevious').addEventListener('click',()=>{if(pageNumber>1){pageNumber--;renderPage();}});
  el('pdfNext').addEventListener('click',()=>{if(pageNumber<documentPDF?.numPages){pageNumber++;renderPage();}});
  function goToPage(event) {
    event?.preventDefault();if(!documentPDF||pageInput.disabled)return;
    if(!pageInput.checkValidity()){pageInput.setAttribute('aria-invalid','true');status.textContent=t('invalid');return;}
    pageNumber=pageInput.valueAsNumber;renderPage();
  }
  el('pdfPageForm').addEventListener('submit',goToPage);pageInput.addEventListener('change',goToPage);
  zoom.addEventListener('change',()=>{if(!fallbackImage.hidden){fallbackImage.style.width=zoom.value==='fit'?'100%':fallbackImage.naturalWidth/2*Number(zoom.value)+'px';fallbackImage.style.maxWidth=zoom.value==='fit'?'100%':'none';}else renderPage();});el('pdfRetry').addEventListener('click',load);
  addEventListener('resize',()=>{clearTimeout(resizeTimer);if(dialog.open&&zoom.value==='fit')resizeTimer=setTimeout(renderPage,150);});
})();
