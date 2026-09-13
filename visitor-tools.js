(() => {
  'use strict';
  const i18n=window.PORTFOLIO_I18N,t=key=>i18n.visitor(key);
  const email='sanyghali@gmail.com';
  async function copyText(button,text) {
    const group=button.closest('.di-copy-group'),status=group.querySelector('.di-copy-status'),manual=group.querySelector('.di-copy-manual');
    manual.hidden=true;status.textContent='';
    try {
      await navigator.clipboard.writeText(text);
      status.textContent=t('copied');
    } catch {
      status.textContent=t('copyFailed');manual.hidden=false;
      const input=manual.querySelector('input');input.value=text;input.focus();input.select();
    }
  }
  const copyEmail=document.querySelector('[data-copy-email]');
  if(copyEmail){copyEmail.hidden=false;copyEmail.addEventListener('click',()=>copyText(copyEmail,email));}
  document.querySelectorAll('[data-project]').forEach(group=>{
    const id=group.dataset.project,title=document.getElementById(id).querySelector('h3').textContent.trim().replace(/\s+/g,' ');
    // Share this deployment and section, excluding query parameters and stale anchors.
    const url=new URL(location.pathname,location.origin);url.hash=id;
    const button=group.querySelector('.di-project-copy');button.hidden=false;
    button.addEventListener('click',()=>copyText(button,url.href));
    const link=group.querySelector('.di-project-email');
    link.href='mailto:'+email+'?subject='+encodeURIComponent(t('projectSubject')+title)+'&body='+encodeURIComponent(t('greeting')+'\n\n'+t('projectBody')+'\n'+title+'\n'+url.href+'\n\n');
  });
  const top=document.querySelector('.di-back-top');
  const updateTop=()=>{top.hidden=scrollY<600;};
  addEventListener('scroll',updateTop,{passive:true});updateTop();
  top.addEventListener('click',event=>{
    event.preventDefault();
    const title=document.querySelector('#profile h1');title.tabIndex=-1;title.focus({preventScroll:true});
    history.replaceState(null,'','#profile');
    scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  });
})();
