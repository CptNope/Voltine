// Voltline · editor.js · Level editor: tools, painting, playtest and shareable level codes.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- level editor ---------- */
const EW=100,THN=['Prism Grid','Coil Foundry','Sky Relay','Null Core'];
const TOOLS=[['#','BL','Block',MINT],['^','SP','Spikes',CORAL],['H','LD','Ladder',GOLD],['>','B>','Belt right',GOLD],['<','B<','Belt left',GOLD],
 ['w','WK','Walker',GOLD],['s','SH','Shield walker',SKY],['h','HO','Spark hopper',ORG],['f','FL','Flyer',PINK],['g','GU','Gull','#e6efff'],['t','TU','Turret',CORAL],['p','HP','Health',MINT],['e','EN','Energy',GOLD],
 ['m','PL','Platform',SKY],['l','LF','Lift',SKY],['c','CR','Crusher',ORG],['k','CP','Checkpoint',GOLD],[' ','ER','Erase','#b7a3d6']];
function blankED(){const m=[];for(let y=0;y<H;y++)m.push(new Array(EW).fill(' '));for(let x=0;x<EW;x++){m[15][x]='#';m[16][x]='#'}
  for(const x of[40,41,42]){m[15][x]=' ';m[16][x]=' '}for(let x=20;x<=22;x++){m[13][x]='#';m[14][x]='#'}for(let x=60;x<=61;x++)m[14][x]='^';
  return {b:'warden',th:0,m,sp:[['w',30,14],['t',21,12],['f',50,9],['p',70,14]],mv:[[40,12,0]],cr:[],cps:[55]}}
let ED=blankED();
try{const o=JSON.parse(localStorage.getItem('voltline-edit')||'null');const d=o&&validLevel(o);if(d)ED=d}catch(e){}
function validLevel(o){
  if(!o||!Array.isArray(o.m)||o.m.length!==H||!RUSH.includes(o.b)||!(o.th>=0&&o.th<=3))return null;
  const m=o.m.map(r=>Array.isArray(r)?r:String(r).split(''));if(m.some(r=>r.length!==EW||r.some(c=>!' #^H><'.includes(c))))return null;
  const inX=x=>Number.isInteger(x)&&x>=0&&x<EW,inY=y=>Number.isInteger(y)&&y>=0&&y<H;
  const sp=(o.sp||[]).filter(a=>Array.isArray(a)&&'wftpeshg'.includes(a[0])&&String(a[0]).length===1&&inX(a[1])&&inY(a[2])).slice(0,120).map(a=>[a[0],a[1],a[2]]);
  const mv=(o.mv||[]).filter(a=>Array.isArray(a)&&inX(a[0])&&inY(a[1])).slice(0,30).map(a=>[a[0],a[1],a[2]?1:0]);
  const cr=(o.cr||[]).filter(inX).slice(0,20),cps=(o.cps||[]).filter(inX).slice(0,3);
  return {b:o.b,th:o.th,m,sp,mv,cr,cps};
}
const saveED=()=>{try{localStorage.setItem('voltline-edit',JSON.stringify({...ED,m:ED.m.map(r=>r.join(''))}))}catch(e){}};
function encodeLevel(){const r=ED.m.map(row=>{let o='',i=0;while(i<row.length){let j=i;while(j<row.length&&row[j]===row[i]&&j-i<99)j++;o+=(j-i)+row[i];i=j}return o});
  return 'VL1.'+btoa(JSON.stringify({b:ED.b,t:ED.th,r,s:ED.sp,v:ED.mv,c:ED.cr,k:ED.cps}))}
function decodeLevel(code){try{const c=code.trim().replace(/^VL1\./,'');const o=JSON.parse(atob(c));if(!Array.isArray(o.r)||o.r.length!==H)return null;
  const m=o.r.map(str=>{const row=[];String(str).replace(/(\d+)(\D)/g,(_,n,ch)=>{for(let i=0;i<+n&&row.length<=EW;i++)row.push(ch);return ''});return row});
  return validLevel({b:o.b,th:o.t,m,sp:o.s,mv:o.v,cr:o.c,cps:o.k})}catch(e){return null}}
const CUSTOM={name:'Custom Level',custom:true,W:EW+31,get kind(){return ED.b},get boss(){return BN[ED.b]},get th(){return STAGES[ED.th].th},get key(){return STAGES[ED.th].key},get wind(){return ED.th===2},
  get cps(){return [2,...ED.cps.slice().sort((a,b)=>a-b)]},get spawns(){return ED.sp},get crushers(){return ED.cr.map(x=>[x,(x*37)%160])},
  get movers(){return ED.mv.map(([x,y,v])=>v?[x,y,0,28,150,0]:[x,y,40,0,180,0])},
  build(f){f(0,0,0,14);for(let y=0;y<H;y++)for(let x=1;x<EW;x++){const c=ED.m[y][x];if(c!==' ')f(x,x,y,y,c)}f(1,4,15,16);f(EW,EW+30,15,16);f(EW+29,EW+30,0,14)}};
STAGES.push(CUSTOM);
const ED_I=STAGES.length-1;
const edc={x:8,y:12,tool:0,hold:{},dirty:0,paint:0};
function edCell(x,y,tool){
  if(x<1||x>=EW||y<0||y>=H)return;if(x<=4&&y>=15)return;
  const k=TOOLS[tool][0];
  const clearEnt=()=>{ED.sp=ED.sp.filter(a=>!(a[1]===x&&a[2]===y));ED.mv=ED.mv.filter(a=>!(a[0]===x&&a[1]===y));};
  if(' #^H><'.includes(k)){if(k===' '){clearEnt();ED.cr=ED.cr.filter(c=>c!==x);ED.cps=ED.cps.filter(c=>c!==x)}if(ED.m[y][x]===k&&k!==' ')return;ED.m[y][x]=k}
  else if('wftpeshg'.includes(k)){clearEnt();ED.sp.push([k,x,y])}
  else if(k==='m'||k==='l'){clearEnt();ED.mv.push([x,y,k==='l'?1:0])}
  else if(k==='c'){ED.cr=ED.cr.includes(x)?ED.cr.filter(c=>c!==x):[...ED.cr,x]}
  else if(k==='k'){ED.cps=ED.cps.includes(x)?ED.cps.filter(c=>c!==x):[...ED.cps,x].slice(-3)}
  edc.dirty=1;
}
function edRefresh(){S=ED_I;buildMap();spawnAll();PB=[];EB=[];B=null;arena=false;}
const edp=document.getElementById('edp'),edMsg=document.getElementById('edMsg'),edCode=document.getElementById('edCode');
const edUI=()=>{document.getElementById('edBoss').textContent='Boss: '+BN[ED.b].toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());document.getElementById('edTheme').textContent='Theme: '+THN[ED.th]};
const edSay=t=>{edMsg.textContent=t;clearTimeout(edSay.t);edSay.t=setTimeout(()=>edMsg.textContent='',3500)};
document.getElementById('edBoss').addEventListener('click',()=>{ED.b=RUSH[(RUSH.indexOf(ED.b)+1)%4];edc.dirty=1;edUI();edRefresh()});
document.getElementById('edTheme').addEventListener('click',()=>{ED.th=(ED.th+1)%4;edc.dirty=1;edUI();edRefresh()});
document.getElementById('edTest').addEventListener('click',()=>{audio();edTest()});
document.getElementById('edRoute').addEventListener('click',()=>{if(state==='edit'){routeStart();scr.focus()}});
document.getElementById('edExit').addEventListener('click',()=>{saveED();state='select';sel=5;scr.focus()});
let clrArm=0;document.getElementById('edClear').addEventListener('click',e=>{const b=e.currentTarget;if(!clrArm){clrArm=1;b.textContent='Click again to clear';setTimeout(()=>{clrArm=0;b.textContent='Clear level'},3000);return}
  clrArm=0;b.textContent='Clear level';const m=[];for(let y=0;y<H;y++)m.push(new Array(EW).fill(' '));for(let x=0;x<EW;x++){m[15][x]='#';m[16][x]='#'}ED={b:ED.b,th:ED.th,m,sp:[],mv:[],cr:[],cps:[]};edc.dirty=1;edRefresh();edSay('Level cleared.')});
document.getElementById('edCopy').addEventListener('click',()=>{const c=encodeLevel();edCode.value=c;edCode.select();
  try{navigator.clipboard.writeText(c).then(()=>edSay('Code copied.'),()=>edSay('Code is selected above. Copy it from there.'))}catch(e){edSay('Code is selected above. Copy it from there.')}});
document.getElementById('edLoad').addEventListener('click',()=>{const d=decodeLevel(edCode.value);if(!d){edSay('That code could not be read.');return}ED=d;edc.dirty=1;edUI();edRefresh();saveED();edSay('Level loaded.');scr.focus()});
edUI();
function edTest(){saveED();rushIdx=0;rushWait=0;S=ED_I;resetRun(true);state='play';scr.focus();snd(440,.1,'square',880,.04)}
function enterEditor(){state='edit';edRefresh();camX=Math.max(0,Math.min(W*TS-VW,edc.x*TS-VW/2));edUI();scr.focus()}
function edPointer(e,down){
  const r=scr.getBoundingClientRect(),sx=(e.clientX-r.left)/r.width*VW,sy=(e.clientY-r.top)/r.height*VH;
  if(down&&sy<22){const i=Math.floor((sx-3)/26);if(i>=0&&i<TOOLS.length){edc.tool=i;snd(600,.04,'square',0,.03)}return}
  if(down&&sy>110&&sy<170&&(sx<22||sx>VW-22)){edc.x=Math.max(0,Math.min(W-1,edc.x+(sx<22?-12:12)));return}
  if(sy<22||sy>VH-16)return;
  const tx=Math.floor((sx+camX)/TS),ty=Math.floor(sy/TS);edc.x=Math.max(0,Math.min(W-1,tx));edc.y=Math.max(0,Math.min(H-1,ty));
  const k=TOOLS[edc.tool][0];if(down||' #^H><'.includes(k)){edCell(tx,ty,edc.tool);edRefresh()}
}
scr.addEventListener('pointermove',e=>{if(state==='edit'&&e.buttons&1)edPointer(e,false)});
