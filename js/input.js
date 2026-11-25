// Voltline · input.js · Keyboard, touch pad and pointer input.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- input ---------- */
const K={},prev={};
const KM={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',z:'jump',Z:'jump',k:'jump',K:'jump',' ':'jump',x:'fire',X:'fire',j:'fire',J:'fire',Enter:'start',p:'start',P:'start',Escape:'back',Backspace:'back',q:'prev',Q:'prev',e:'next',E:'next',c:'next',C:'next',m:'music',M:'music',n:'sfx',N:'sfx',o:'opts',O:'opts'};
addEventListener('keydown',e=>{const tg=e.target&&e.target.tagName;if(tg==='TEXTAREA'||tg==='INPUT')return;const k=KM[e.key];if(k&&!(tg==='BUTTON'&&(e.key===' '||e.key==='Enter'))){K[k]=true;e.preventDefault();audio()}});
addEventListener('keyup',e=>{const k=KM[e.key];if(k)K[k]=false});
addEventListener('blur',()=>{for(const k in K)K[k]=false});
const pr=k=>K[k]&&!prev[k];
if(matchMedia('(pointer:coarse)').matches||'ontouchstart' in window)document.body.classList.add('touch');
for(const b of document.querySelectorAll('.pad button')){
  const k=b.dataset.k,on=e=>{e.preventDefault();K[k]=true;b.classList.add('on');audio()},off=e=>{e.preventDefault();K[k]=false;b.classList.remove('on')};
  b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('pointerleave',off);
}
scr.addEventListener('pointerdown',e=>{scr.focus();audio();
  if(state==='edit'){edPointer(e,true);return}
  if(state==='select'){const r=scr.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*VW;const y=(e.clientY-r.top)/r.height*VH;if(y>=208&&y<=230){const t=x<240?4:5;if(sel!==t){sel=t;return}}else{const i=Math.floor((x-20)/112);if(i>=0&&i<4&&y<208){if(i!==sel){sel=i;return}}}}
  if(state==='title'||state==='select'||state==='got'){K.start=true;setTimeout(()=>K.start=false,90)}});

