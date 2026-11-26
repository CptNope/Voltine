// Voltline · input.js · Keyboard, touch pad and pointer input.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- input ---------- */
const K={},prev={};
// ---- bindings: defaults, saved overrides, and the key -> action map built from them
const DEF_BIND={left:['ArrowLeft','a'],right:['ArrowRight','d'],up:['ArrowUp','w'],down:['ArrowDown','s'],jump:['z','k',' '],fire:['x','j'],prev:['q'],next:['e','c'],start:['Enter','p'],back:['Escape','Backspace'],opts:['o'],music:['m'],sfx:['n'],route:['r']};
const DEF_PAD={jump:[0],fire:[1,2],prev:[4],next:[3,5],start:[9],music:[8]};
const BIND_ACTS=[['left','Move left'],['right','Move right'],['up','Up / climb'],['down','Down / slide'],['jump','Jump / swim'],['fire','Fire'],['prev','Previous weapon'],['next','Next weapon'],['start','Start / pause'],['back','Back'],['opts','Settings'],['music','Music on/off'],['sfx','Sound on/off'],['route','Check route (editor)']];
let BIND={},PADB={},KM={},capture=null,bindMsg=null;
const normKey=k=>typeof k==='string'&&k.length===1?k.toLowerCase():k;
function rebuildKM(){KM={};for(const a in BIND)for(const k of BIND[a])KM[normKey(k)]=a;if(!KM.Escape)KM.Escape='back';if(!KM.Enter)KM.Enter='start'} // Esc and Enter always work in menus
function loadBinds(){
  BIND=JSON.parse(JSON.stringify(DEF_BIND));PADB=JSON.parse(JSON.stringify(DEF_PAD));
  try{const o=JSON.parse(localStorage.getItem('voltline-keys')||'null');
    if(o&&o.k)for(const a in DEF_BIND)if(Array.isArray(o.k[a]))BIND[a]=o.k[a].filter(x=>typeof x==='string'&&x.length>0&&x.length<20).slice(0,3);
    if(o&&o.p)for(const a in DEF_PAD)if(Array.isArray(o.p[a]))PADB[a]=o.p[a].filter(n=>Number.isInteger(n)&&n>=0&&n<20).slice(0,3)}catch(e){}
  rebuildKM();
}
function saveBinds(){try{localStorage.setItem('voltline-keys',JSON.stringify({k:BIND,p:PADB}))}catch(e){}rebuildKM()}
const actName=a=>(BIND_ACTS.find(x=>x[0]===a)||[a,a])[1];
function bindKey(act,key){
  const k=normKey(key);let stolen=null;
  for(const a in BIND)if(a!==act&&BIND[a].map(normKey).includes(k)){BIND[a]=BIND[a].filter(x=>normKey(x)!==k);stolen=a}
  BIND[act]=[k];saveBinds();for(const a in K)K[a]=false;
  bindMsg={t:200,bad:!!(stolen&&!BIND[stolen].length),s:stolen?(BIND[stolen].length?keyName(k)+' moved from '+actName(stolen):actName(stolen)+' has no key now. Give it one.'):actName(act)+' set to '+keyName(k)};
}
function bindPad(act,btn){
  let stolen=null;for(const a in PADB)if(a!==act&&PADB[a].includes(btn)){PADB[a]=PADB[a].filter(x=>x!==btn);stolen=a}
  PADB[act]=[btn];saveBinds();
  bindMsg={t:200,bad:!!(stolen&&!PADB[stolen].length),s:stolen?(PADB[stolen].length?padName(btn)+' moved from '+actName(stolen):actName(stolen)+' has no button now. Give it one.'):actName(act)+' set to '+padName(btn)};
}
function resetBinds(){BIND=JSON.parse(JSON.stringify(DEF_BIND));PADB=JSON.parse(JSON.stringify(DEF_PAD));saveBinds();bindMsg={t:150,s:'Controls reset to defaults'}}
function keyName(k){return {' ':'Space',ArrowLeft:'←',ArrowRight:'→',ArrowUp:'↑',ArrowDown:'↓',Escape:'Esc',Enter:'Enter',Backspace:'Backspace',Shift:'Shift',Control:'Ctrl',Alt:'Alt',Tab:'Tab'}[k]||(typeof k==='string'&&k.length===1?k.toUpperCase():String(k))}
function padName(i){return ['A','B','X','Y','LB','RB','LT','RT','Select','Start','L-stick','R-stick'][i]||('Button '+i)}
loadBinds();
addEventListener('keydown',e=>{const tg=e.target&&e.target.tagName;if(tg==='TEXTAREA'||tg==='INPUT')return;
  if(demoInput()){e.preventDefault();audio();return} // a key during the demo only ends the demo
  if(capture){e.preventDefault();if(e.key==='Escape'){capture=null;return}if(capture.kind==='key'&&!e.repeat){bindKey(capture.act,e.key);capture=null}return}
  const k=KM[normKey(e.key)];if(k&&!(tg==='BUTTON'&&(e.key===' '||e.key==='Enter'))){K[k]=true;e.preventDefault();audio()}});
addEventListener('keyup',e=>{const k=KM[normKey(e.key)];if(k)K[k]=false});
addEventListener('blur',()=>{for(const k in K)K[k]=false});
const pr=k=>K[k]&&!prev[k];
if(matchMedia('(pointer:coarse)').matches||'ontouchstart' in window)document.body.classList.add('touch');
for(const b of document.querySelectorAll('.pad button')){
  const k=b.dataset.k,on=e=>{e.preventDefault();K[k]=true;b.classList.add('on');audio()},off=e=>{e.preventDefault();K[k]=false;b.classList.remove('on')};
  b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('pointerleave',off);
}
scr.addEventListener('pointerdown',e=>{scr.focus();audio();if(demoInput())return;
  if(state==='edit'){edPointer(e,true);return}
  if(state==='select'){const r=scr.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*VW,y=(e.clientY-r.top)/r.height*VH;
    if(y>=208&&y<=230){const t=BAR[Math.max(0,Math.min(3,Math.floor((x-20)/111)))];if(sel!==t){sel=t;return}}
    else{const c=[...CARD,'ch'].findIndex((_,i)=>{const q=cardRect(i);return x>=q.x&&x<q.x+q.w&&y>=q.y&&y<q.y+q.h});if(c<0&&y<208)return;if(c>=0&&c!==sel){sel=c;return}}}
  if(state==='gallery'){const r=scr.getBoundingClientRect(),y=(e.clientY-r.top)/r.height*VH,i=Math.floor((y-62)/17)+gOff;if(y>=50&&y<230&&i>=0&&i<GAL.list.length){if(i!==gsel){gsel=i;return}}}
  if(state==='rooms'){const r=scr.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*VW,y=(e.clientY-r.top)/r.height*VH;let t=null;
    if(y>=38&&y<60)t=-1;else if(y>=64&&y<250){const row=Math.floor((y-64)/18),col=x<244?0:1;if(row>=0&&row<10)t=col*10+row}
    if(t===null||t>=ROOMS.length)return;if(t!==rsel){rsel=t;return}}
  if(state==='title'||state==='select'||state==='got'||state==='gallery'||state==='rooms'){K.start=true;setTimeout(()=>K.start=false,90)}});

