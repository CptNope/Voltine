// Voltline · world.js · Saved progress, options, tile map building and collision physics.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- save ---------- */
let save={cleared:[0,0,0,0,0,0,0,0,0],best:[0,0,0,0,0,0,0,0,0]};
try{const s=JSON.parse(localStorage.getItem('voltline-v2')||'null');if(s&&Array.isArray(s.cleared)){save=s;while(save.cleared.length<9)save.cleared.push(0);while(save.best.length<9)save.best.push(0)}}catch(e){}
if(!Array.isArray(save.bestH))save.bestH=[0,0,0,0];while(save.bestH.length<9)save.bestH.push(0);if(!save.rush)save.rush=[0,0];
const persist=()=>{try{localStorage.setItem('voltline-v2',JSON.stringify(save))}catch(e){}};
let musicOn=true,sfxOn=true,hard=false;
const OPT={mv:8,sv:8,shake:1,rf:0,tc:0,as:0,spd:0,af:0,hs:0,hc:0,big:0,gh:1}; // spd: 0 full, 1 = 75%, 2 = 50%; af auto-fire; hs hold to swim; hc high contrast; big large text // music/sound volume 0-10, screen shake, reduced flashing, toggle charge, assist 0 off 1 half damage 2 invincible
try{const o=JSON.parse(localStorage.getItem('voltline-opts')||'{}');musicOn=o.m!==false;sfxOn=o.s!==false;hard=!!o.h;for(const k in OPT)if(Number.isInteger(o[k]))OPT[k]=o[k]}catch(e){}
const assistOn=()=>OPT.as>0||OPT.spd>0; // either one means best times and skill achievements aren't recorded
const saveOpts=()=>{try{localStorage.setItem('voltline-opts',JSON.stringify({m:musicOn,s:sfxOn,h:hard,...OPT}))}catch(e){}};
const mb=document.getElementById('mus'),sb=document.getElementById('sfx');
const optUI=()=>{mb.textContent=musicOn?'Music on':'Music off';mb.setAttribute('aria-pressed',musicOn);sb.textContent=sfxOn?'Sound on':'Sound off';sb.setAttribute('aria-pressed',sfxOn)};
const togM=()=>{musicOn=!musicOn;saveOpts();optUI()},togS=()=>{sfxOn=!sfxOn;saveOpts();optUI()};
mb.addEventListener('click',()=>{audio();togM()});
document.getElementById('optsBtn').addEventListener('click',()=>{audio();if(state==='play'||state==='pause')openOpts('pause');else if(state==='title'||state==='select')openOpts(state);scr.focus()});sb.addEventListener('click',()=>{audio();togS()});optUI();
const unlocked=w=>w===0||!!save.cleared[WFROM[w]];
const rb=document.getElementById('reset');let rArm=0;
rb.addEventListener('click',()=>{if(!rArm){rArm=1;rb.textContent='Click again to reset';setTimeout(()=>{rArm=0;rb.textContent='Reset progress'},3000);return}
 save={cleared:[0,0,0,0,0,0,0,0,0],best:[0,0,0,0,0,0,0,0,0],bestH:[0,0,0,0,0,0,0,0,0],rush:[0,0],ach:{},stats:{kills:0,pickups:0,reboots:0},splits:[],splitsH:[]};persist();rArm=0;rb.textContent='Progress cleared';P.wpn=0;state='title'});

/* ---------- level ---------- */
let S=0,ST=STAGES[0],W=194,ARENA=163,map=[],MV=[],CR=[],WARN=[],POP=[];
function buildMap(){
  ST=STAGES[S];W=ST.W;ARENA=W-31;map=[];for(let y=0;y<H;y++)map.push(new Array(W).fill(' '));
  ST.build((x0,x1,y0,y1,c='#')=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&x<W&&y>=0&&y<H)map[y][x]=c});
  HASPHASE=map.some(r=>r.includes('A')||r.includes('B'));PHASE=0;
  MV=ST.movers.map(([tx,ty,ax,ay,per,ph])=>({bx:tx*TS,by:ty*TS,ax,ay,per,ph,x:tx*TS,y:ty*TS,w:32,h:6,dx:0,dy:0}));
  CR=ST.crushers.map(([tx,ph])=>({cx:tx*TS+8,ph,bot:40,hit:0}));
}
const tile=(x,y)=>(x<0||x>=W)?'#':(y<0||y>=H)?' ':map[y][x];
let PHASE=0,HASPHASE=false; // phase blocks: 'A' solid while PHASE is 0, 'B' while it's 1; PHASE flips every 90 frames
const solid=(x,y)=>{const c=tile(x,y);return c==='#'||c==='>'||c==='<'||(c==='A'&&PHASE===0)||(c==='B'&&PHASE===1)};
const inField=(x,y)=>tile(x,y)==='o'; // low-gravity field
const wet=(x,y)=>tile(x,y)==='~';
const ladTop=(x,y)=>tile(x,y)==='H'&&tile(x,y-1)!=='H';

/* ---------- physics ---------- */
function moveX(o){
  o.x+=o.vx;const t0=Math.floor(o.y/TS),t1=Math.floor((o.y+o.h-.01)/TS);
  if(o.vx>0){const tx=Math.floor((o.x+o.w)/TS);for(let ty=t0;ty<=t1;ty++)if(solid(tx,ty)){o.x=tx*TS-o.w;o.vx=0;return true}}
  else if(o.vx<0){const tx=Math.floor(o.x/TS);for(let ty=t0;ty<=t1;ty++)if(solid(tx,ty)){o.x=(tx+1)*TS;o.vx=0;return true}}
  return false;
}
function moveY(o,oneway){
  const pb=o.y+o.h;o.y+=o.vy;o.onG=false;
  const a=Math.floor(o.x/TS),b=Math.floor((o.x+o.w-.01)/TS);
  if(o.vy>0){const ty=Math.floor((o.y+o.h)/TS);for(let tx=a;tx<=b;tx++)if(solid(tx,ty)||(oneway&&ladTop(tx,ty)&&pb<=ty*TS+.5)){o.y=ty*TS-o.h;o.vy=0;o.onG=true;return}}
  else if(o.vy<0){const ty=Math.floor(o.y/TS);for(let tx=a;tx<=b;tx++)if(solid(tx,ty)){o.y=(ty+1)*TS;o.vy=0;return}}
}
const push=(o,v)=>{const s=o.vx;o.vx=v;moveX(o);o.vx=s};
function phys(p){
  if(p.mv){p.x+=p.mv.dx;p.y+=p.mv.dy}
  const pb=p.y+p.h;moveX(p);moveY(p,true);p.mv=null;
  if(!p.onG&&p.vy>=0)for(const m of MV)if(p.x+p.w>m.x&&p.x<m.x+m.w&&pb<=m.y+.6&&p.y+p.h>=m.y){p.y=m.y-p.h;p.vy=0;p.onG=true;p.mv=m;break}
  if(p.onG&&!p.mv){const c=tile(Math.floor((p.x+p.w/2)/TS),Math.floor((p.y+p.h+1)/TS));if(c==='>')push(p,.8);else if(c==='<')push(p,-.8)}
}
const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const rectFree=(x,y,w,h)=>{for(let ty=Math.floor(y/TS);ty<=Math.floor((y+h-.01)/TS);ty++)for(let tx=Math.floor(x/TS);tx<=Math.floor((x+w-.01)/TS);tx++)if(solid(tx,ty))return false;return true};

