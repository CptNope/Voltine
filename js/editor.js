// Voltline · editor.js · Level editor: tools, painting, undo, playtest, shareable level codes and play links.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- level editor ---------- */
const EW=100,EW_MAX=200,EW_STEPS=[100,125,150,175,200],THN=['Prism Grid','Coil Foundry','Sky Relay','Null Core','Tide Vault','Orbit Deck','Phase Lab'],TH_ST=[0,1,2,3,5,7,8];
const PAGES_URL='https://cptnope.github.io/Voltline/';
const TOOLS=[['#','BL','Block',MINT],['^','SP','Spikes',CORAL],['~','WA','Water',TEAL],['o','GF','Low-gravity field','#c7d2ff'],['A','PA','Phase block (pink)','#ff9df5'],['B','PB','Phase block (blue)','#7fd8ff'],['H','LD','Ladder',GOLD],['>','B>','Belt right',GOLD],['<','B<','Belt left',GOLD],
 ['w','WK','Walker',GOLD],['s','SH','Shield walker',SKY],['h','HO','Spark hopper',ORG],['f','FL','Flyer',PINK],['g','GU','Gull','#e6efff'],['j','JE','Jellyfish',PINK],['a','AS','Asteroid','#b9a58c'],['u','UF','UFO',SKY],['b','BD','Blink drone','#ff9df5'],['q','PM','Phase mine',CORAL],['t','TU','Turret',CORAL],['p','HP','Health',MINT],['e','EN','Energy',GOLD],
 ['m','PL','Platform',SKY],['l','LF','Lift',SKY],['c','CR','Crusher',ORG],['k','CP','Checkpoint',GOLD],[' ','ER','Erase','#b7a3d6']];
const TILE_CH=' #^H><~oAB',ENT_CH='wftpeshgjaubq';
function blankED(){const m=[];for(let y=0;y<H;y++)m.push(new Array(EW).fill(' '));for(let x=0;x<EW;x++){m[15][x]='#';m[16][x]='#'}
  for(const x of[40,41,42]){m[15][x]=' ';m[16][x]=' '}for(let x=20;x<=22;x++){m[13][x]='#';m[14][x]='#'}for(let x=60;x<=61;x++)m[14][x]='^';
  return {b:'warden',th:0,w:EW,n:'',a:'',ok:'',m,sp:[['w',30,14],['t',21,12],['f',50,9],['p',70,14]],mv:[[40,12,0]],cr:[],cps:[55]}}
// names and authors: plain text only, short, no markup characters
const cleanText=(s,n)=>String(s||'').replace(/[^A-Za-z0-9 .,'!?&()\-:]/g,'').replace(/\s+/g,' ').trim().slice(0,n);
function validLevel(o){
  if(!o||!Array.isArray(o.m)||o.m.length!==H||!RUSH.includes(o.b)||!(o.th>=0&&o.th<=6))return null;
  const w=Number.isInteger(o.w)?o.w:EW;if(w<EW||w>EW_MAX)return null;
  const m=o.m.map(r=>Array.isArray(r)?r:String(r).split(''));if(m.some(r=>r.length!==w||r.some(c=>!TILE_CH.includes(c))))return null;
  const inX=x=>Number.isInteger(x)&&x>=0&&x<w,inY=y=>Number.isInteger(y)&&y>=0&&y<H;
  const sp=(o.sp||[]).filter(a=>Array.isArray(a)&&ENT_CH.includes(a[0])&&String(a[0]).length===1&&inX(a[1])&&inY(a[2])).slice(0,200).map(a=>[a[0],a[1],a[2]]);
  const mv=(o.mv||[]).filter(a=>Array.isArray(a)&&inX(a[0])&&inY(a[1])).slice(0,40).map(a=>[a[0],a[1],a[2]?1:0]);
  const cr=(o.cr||[]).filter(inX).slice(0,30),cps=(o.cps||[]).filter(inX).slice(0,3);
  return {b:o.b,th:o.th,w,n:cleanText(o.n,32),a:cleanText(o.a,24),ok:typeof o.ok==='string'?o.ok.slice(0,16):'',m,sp,mv,cr,cps};
}
// fingerprint of everything that affects whether the level can be finished; a stored match means "route verified"
function levelHash(L=ED){const s=JSON.stringify([L.b,L.th,L.w,L.m.map(r=>r.join('')),L.sp,L.mv,L.cr,L.cps]);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
const isVerified=(L=ED)=>!!L.ok&&L.ok===levelHash(L);
let ED=blankED();
try{const o=JSON.parse(localStorage.getItem('voltline-edit')||'null');const d=o&&validLevel(o);if(d)ED=d}catch(e){}
let sharedMode=false,ED_SAVED=null,pendingShared=null; // while playing a shared level, the player's own editor level is parked here
const saveED=()=>{if(sharedMode)return;try{localStorage.setItem('voltline-edit',JSON.stringify({...ED,m:ED.m.map(r=>r.join(''))}))}catch(e){}};
function encodeLevel(L=ED){const r=L.m.map(row=>{let o='',i=0;while(i<row.length){let j=i;while(j<row.length&&row[j]===row[i]&&j-i<99)j++;o+=(j-i)+row[i];i=j}return o});
  const o={b:L.b,t:L.th,r,s:L.sp,v:L.mv,c:L.cr,k:L.cps};if(L.w!==EW)o.w=L.w;if(L.n)o.n=L.n;if(L.a)o.a=L.a;if(isVerified(L))o.ok=L.ok;
  return 'VL1.'+btoa(JSON.stringify(o))}
function decodeLevel(code){try{const c=String(code).trim().replace(/^VL1\./,'');const o=JSON.parse(atob(c));if(!Array.isArray(o.r)||o.r.length!==H)return null;
  const w=Number.isInteger(o.w)?o.w:EW;if(w<EW||w>EW_MAX)return null;
  const m=o.r.map(str=>{const row=[];String(str).replace(/(\d+)(\D)/g,(_,n,ch)=>{for(let i=0;i<+n&&row.length<=w;i++)row.push(ch);return ''});return row});
  return validLevel({b:o.b,th:o.t,w,n:o.n,a:o.a,ok:o.ok,m,sp:o.s,mv:o.v,cr:o.c,cps:o.k})}catch(e){return null}}
const CUSTOM={name:'Custom Level',custom:true,get W(){return ED.w+31},get kind(){return ED.b},get boss(){return BN[ED.b]},get th(){return STAGES[TH_ST[ED.th]].th},get key(){return STAGES[TH_ST[ED.th]].key},get wind(){return ED.th===2},
  get cps(){return [2,...ED.cps.slice().sort((a,b)=>a-b)]},get spawns(){return ED.sp},get crushers(){return ED.cr.map(x=>[x,(x*37)%160])},
  get movers(){return ED.mv.map(([x,y,v])=>v?[x,y,0,28,150,0]:[x,y,40,0,180,0])},
  build(f){const w=ED.w;f(0,0,0,14);for(let y=0;y<H;y++)for(let x=1;x<w;x++){const c=ED.m[y][x];if(c!==' ')f(x,x,y,y,c)}f(1,4,15,16);f(w,w+30,15,16);f(w+29,w+30,0,14)}};
STAGES.push(CUSTOM);
const ED_I=STAGES.length-1;
const edc={x:8,y:12,tool:0,hold:{},dirty:0,paint:0};

/* ---------- undo / redo: one snapshot per stroke ---------- */
let UNDO=[],REDO=[];
const edSnap=()=>JSON.stringify({...ED,m:ED.m.map(r=>r.join(''))});
const edFrom=j=>{const o=JSON.parse(j);o.m=o.m.map(r=>r.split(''));return o};
function edPushUndo(){UNDO.push(edSnap());if(UNDO.length>50)UNDO.shift();REDO=[]}
function edUndo(){if(!UNDO.length){edSay('Nothing to undo.');return}REDO.push(edSnap());ED=edFrom(UNDO.pop());edc.dirty=1;edUI();edRefresh();edSay('Undone.')}
function edRedo(){if(!REDO.length){edSay('Nothing to redo.');return}UNDO.push(edSnap());ED=edFrom(REDO.pop());edc.dirty=1;edUI();edRefresh();edSay('Redone.')}

const hasGround=x=>{for(let y=0;y<H;y++){const c=ED.m[y]&&ED.m[y][x];if(c==='#'||c==='>'||c==='<')return true}return false}; // phase blocks don't count: they vanish
function edCell(x,y,tool){
  if(x<1||x>=ED.w||y<0||y>=H)return;if(x<=4&&y>=15)return;
  const k=TOOLS[tool][0];
  const clearEnt=()=>{ED.sp=ED.sp.filter(a=>!(a[1]===x&&a[2]===y));ED.mv=ED.mv.filter(a=>!(a[0]===x&&a[1]===y));};
  if(TILE_CH.includes(k)){if(k===' '){clearEnt();ED.cr=ED.cr.filter(c=>c!==x);ED.cps=ED.cps.filter(c=>c!==x)}if(ED.m[y][x]===k&&k!==' ')return;ED.m[y][x]=k}
  else if(ENT_CH.includes(k)){clearEnt();ED.sp.push([k,x,y])}
  else if(k==='m'||k==='l'){clearEnt();ED.mv.push([x,y,k==='l'?1:0])}
  else if(k==='c'){ED.cr=ED.cr.includes(x)?ED.cr.filter(c=>c!==x):[...ED.cr,x]}
  else if(k==='k'){if(ED.cps.includes(x))ED.cps=ED.cps.filter(c=>c!==x);else if(!hasGround(x)){edSay('Checkpoints need solid ground somewhere in their column.');routeMsg={ok:0,s:'Checkpoints need ground under them.',t:150};return}else ED.cps=[...ED.cps,x].slice(-3)}
  edc.dirty=1;
}
function edResize(w){
  if(w===ED.w)return;edPushUndo();
  if(w>ED.w)ED.m.forEach((row,y)=>{for(let x=ED.w;x<w;x++)row.push(y>=15?'#':' ')});
  else{ED.m=ED.m.map(r=>r.slice(0,w));ED.sp=ED.sp.filter(a=>a[1]<w);ED.mv=ED.mv.filter(a=>a[0]<w);ED.cr=ED.cr.filter(x=>x<w);ED.cps=ED.cps.filter(x=>x<w)}
  ED.w=w;edc.x=Math.min(edc.x,w-1);edc.dirty=1;edUI();edRefresh();edSay('Level is now '+w+' columns.');
}
function edRefresh(){S=ED_I;buildMap();spawnAll();PB=[];EB=[];B=null;arena=false;}
const $=id=>document.getElementById(id);
const edp=$('edp'),edMsg=$('edMsg'),edCode=$('edCode');
const edUI=()=>{$('edBoss').textContent='Boss: '+BN[ED.b].toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());$('edTheme').textContent='Theme: '+THN[ED.th];$('edWidth').textContent='Width: '+ED.w;
  if(document.activeElement!==$('edName'))$('edName').value=ED.n||'';if(document.activeElement!==$('edAuthor'))$('edAuthor').value=ED.a||'';
  $('edVerified').textContent=isVerified()?'Route verified':'Not verified yet';$('edVerified').className=isVerified()?'ok':''};
const edSay=t=>{edMsg.textContent=t;clearTimeout(edSay.t);edSay.t=setTimeout(()=>edMsg.textContent='',4000)};
$('edBoss').addEventListener('click',()=>{edPushUndo();ED.b=RUSH[(RUSH.indexOf(ED.b)+1)%RUSH.length];edc.dirty=1;edUI();edRefresh()});
$('edTheme').addEventListener('click',()=>{edPushUndo();ED.th=(ED.th+1)%THN.length;edc.dirty=1;edUI();edRefresh()});
let wArm=0;$('edWidth').addEventListener('click',e=>{const i=EW_STEPS.indexOf(ED.w),nw=EW_STEPS[(i+1)%EW_STEPS.length];
  const loses=nw<ED.w&&(ED.m.some((r,y)=>r.slice(nw).some(c=>y>=15?c!=='#':c!==' '))||ED.sp.some(a=>a[1]>=nw)||ED.mv.some(a=>a[0]>=nw)||ED.cr.some(x=>x>=nw)||ED.cps.some(x=>x>=nw));
  if(loses&&!wArm){wArm=1;e.currentTarget.textContent='Shrink to '+nw+'? Click again';setTimeout(()=>{wArm=0;edUI()},3000);return}wArm=0;edResize(nw)});
$('edName').addEventListener('input',e=>{ED.n=cleanText(e.target.value,32);edc.dirty=1});
$('edAuthor').addEventListener('input',e=>{ED.a=cleanText(e.target.value,24);edc.dirty=1});
$('edUndo').addEventListener('click',()=>edUndo());$('edRedo').addEventListener('click',()=>edRedo());
$('edTest').addEventListener('click',()=>{audio();edTest()});
$('edRoute').addEventListener('click',()=>{if(state==='edit'){routeStart();scr.focus()}});
$('edExit').addEventListener('click',()=>{saveED();state='select';sel=B_EDIT;scr.focus()});
let clrArm=0;$('edClear').addEventListener('click',e=>{const b=e.currentTarget;if(!clrArm){clrArm=1;b.textContent='Click again to clear';setTimeout(()=>{clrArm=0;b.textContent='Clear level'},3000);return}
  clrArm=0;b.textContent='Clear level';edPushUndo();const m=[];for(let y=0;y<H;y++)m.push(new Array(ED.w).fill(' '));for(let x=0;x<ED.w;x++){m[15][x]='#';m[16][x]='#'}ED={b:ED.b,th:ED.th,w:ED.w,n:ED.n,a:ED.a,ok:'',m,sp:[],mv:[],cr:[],cps:[]};edc.dirty=1;edRefresh();edUI();edSay('Level cleared. Undo brings it back.')});
// sharing: verify the route first; a second press copies anyway
let shareArm=0;
function shareCode(kind){
  const go=()=>{const c=encodeLevel(),txt=kind==='link'?playLink(c):c;edCode.value=txt;edCode.select();
    try{navigator.clipboard.writeText(txt).then(()=>edSay((kind==='link'?'Play link':'Code')+' copied'+(isVerified()?' (route verified).':' (not verified).')),()=>edSay('Selected above. Copy it from there.'))}catch(e){edSay('Selected above. Copy it from there.')}};
  if(isVerified()||shareArm===kind){shareArm=0;go();return}
  shareArm=kind;edSay('Checking the route first. Press '+(kind==='link'?'Copy play link':'Copy code')+' again afterwards to copy.');routeStart({share:kind});
}
const playLink=c=>(/github\.io$/.test(location.hostname)?location.origin+location.pathname:PAGES_URL)+'?level='+encodeURIComponent(c);
$('edCopy').addEventListener('click',()=>shareCode('code'));
$('edLink').addEventListener('click',()=>shareCode('link'));
$('edLoad').addEventListener('click',()=>{const d=decodeLevel(edCode.value.replace(/^.*[?&]level=/,'').replace(/&.*$/,'').replace(/%2B/gi,'+').replace(/%2F/gi,'/').replace(/%3D/gi,'='));
  if(!d){edSay('That code could not be read.');return}edPushUndo();ED=d;edc.dirty=1;edUI();edRefresh();saveED();edSay('Level loaded'+(d.n?': '+d.n:'')+(isVerified()?' (route verified).':'.'));scr.focus()});
edUI();
function edTest(){saveED();rushIdx=0;rushWait=0;S=ED_I;runSplits=[];resetRun(true);state='play';introT=200;scr.focus();snd(440,.1,'square',880,.04)}
function enterEditor(){if(sharedMode)endShared();state='edit';edRefresh();camX=Math.max(0,Math.min(W*TS-VW,edc.x*TS-VW/2));edUI();scr.focus()}
// play someone else's level without touching the player's own editor level
function playShared(L,from){if(!sharedMode){ED_SAVED=ED;sharedMode=from||'title'}ED=L;rushIdx=0;rushWait=0;S=ED_I;runSplits=[];resetRun(true);state='play';introT=220;scr.focus()}
function endShared(){if(!sharedMode)return;const back=sharedMode;sharedMode=false;ED=ED_SAVED||ED;ED_SAVED=null;return back}
function edPointer(e,down){
  const r=scr.getBoundingClientRect(),sx=(e.clientX-r.left)/r.width*VW,sy=(e.clientY-r.top)/r.height*VH;
  if(down&&sy<40){const i=Math.floor(sy/19)*15+Math.floor((sx-3)/31.6);if(sx>=3&&i>=0&&i<TOOLS.length){edc.tool=i;snd(600,.04,'square',0,.03)}return}
  if(down&&sy>110&&sy<170&&(sx<22||sx>VW-22)){edc.x=Math.max(0,Math.min(W-1,edc.x+(sx<22?-12:12)));return}
  if(sy<40||sy>VH-16)return;
  if(down)edPushUndo();
  const tx=Math.floor((sx+camX)/TS),ty=Math.floor(sy/TS);edc.x=Math.max(0,Math.min(W-1,tx));edc.y=Math.max(0,Math.min(H-1,ty));
  const k=TOOLS[edc.tool][0];if(down||TILE_CH.includes(k)){edCell(tx,ty,edc.tool);edRefresh()}
}
scr.addEventListener('pointermove',e=>{if(state==='edit'&&e.buttons&1)edPointer(e,false)});
// Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y redo (checked before the game's key map, which uses Z for jump)
addEventListener('keydown',e=>{if(state!=='edit'||!(e.ctrlKey||e.metaKey))return;const k=e.key.toLowerCase();
  if(k==='z'&&!e.shiftKey){e.preventDefault();e.stopImmediatePropagation();edUndo()}else if(k==='y'||(k==='z'&&e.shiftKey)){e.preventDefault();e.stopImmediatePropagation();edRedo()}},true);
// play links: ?level=VL1... opens straight into a shared level
{const q=(()=>{try{return new URLSearchParams(location.search).get('level')}catch(e){return null}})();if(q){const d=decodeLevel(q);if(d)pendingShared=d}}
