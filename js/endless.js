// Voltline · endless.js · Endless run: hand-made 16-column chunks stitched together as you go.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
//
// The roadmap called this "Endless climb", but the camera scrolls sideways, so it runs left to right and
// scores distance (one column = one metre). The stage starts 8 chunks long and grows 4 chunks at a time
// as you near the end. A wall of static, the null wave, follows you and speeds up; touching it, or dying
// any other way, ends the run. Every chunk has floor at both edges, so any order joins up, and every chunk
// passes tools/check-chunks.js. The theme (colours, background, music) changes every 8 chunks.
// tier 1 opens from the start, tier 2 from 80 m, tier 3 from 200 m.
const CHUNKS=[
 {id:'c01',tier:1,b(f){},s:[['w',8,14]]},
 {id:'c02',tier:1,b(f){f(6,8,15,16,' ')},s:[]},
 {id:'c03',tier:1,b(f){f(4,5,15,16,' ');f(10,11,15,16,' ')},s:[]},
 {id:'c04',tier:1,b(f){f(6,7,14,14,'^')},s:[['f',11,9]]},
 {id:'c05',tier:1,b(f){f(6,8,12,14)},s:[['f',12,8]]},
 {id:'c06',tier:1,b(f){f(5,10,0,13)},s:[]},
 {id:'c07',tier:1,b(f){f(2,6,15,15,'>');f(7,9,15,16,' ');f(10,13,15,15,'<')},s:[]},
 {id:'c08',tier:1,b(f){f(7,9,7,14);f(6,6,7,14,'H')},s:[]},
 {id:'c09',tier:2,b(f){f(3,12,12,15,'~')},s:[['j',8,14]]},
 {id:'c10',tier:2,b(f){f(2,13,0,14,'o');f(4,10,15,16,' ')},s:[]},
 {id:'c11',tier:2,b(f){f(3,6,15,15,'A');f(7,10,15,15,'B');f(11,12,15,15,'A');f(3,12,16,16,' ')},s:[]},
 {id:'c12',tier:2,b(f){f(3,12,14,14,'^');f(5,6,12,12);f(9,10,11,11)},s:[]},
 {id:'c13',tier:2,b(f){},s:[['h',6,14],['s',11,14]]},
 {id:'c14',tier:2,b(f){f(7,8,12,14)},s:[['t',7,11],['w',12,14]]},
 {id:'c15',tier:2,b(f){f(5,10,11,14);f(4,4,11,14,'H')},s:[['w',8,10]]},
 {id:'c16',tier:2,b(f){f(4,6,15,16,' ');f(10,12,15,16,' ')},s:[['g',8,4]]},
 {id:'c17',tier:3,b(f){f(2,12,15,16,' ');f(4,5,12,12,'A');f(8,9,11,11,'B');f(12,12,12,12,'A')},s:[]},
 {id:'c18',tier:3,b(f){f(2,13,0,14,'o');f(3,12,14,14,'^');f(7,8,10,10)},s:[['a',7,6]]},
 {id:'c19',tier:3,b(f){f(6,7,13,14)},s:[['b',4,12],['q',10,13]]},
 {id:'c20',tier:3,b(f){f(2,13,12,15,'~');f(5,10,15,15,'^')},s:[['j',8,13]]},
 {id:'c21',tier:3,b(f){f(1,4,15,15,'<');f(5,7,15,16,' ');f(8,10,15,15,'<');f(11,12,15,16,' ')},s:[]},
 {id:'c22',tier:3,b(f){f(3,8,0,13);f(11,12,14,14,'^')},s:[['f',13,9]]},
 {id:'c23',tier:3,b(f){f(6,8,8,14);f(5,5,8,14,'H');f(9,11,14,14,'^')},s:[['u',10,3]]},
 {id:'c24',tier:3,b(f){f(3,5,15,16,' ');f(8,9,12,14);f(11,12,15,16,' ')},s:[['h',8,11],['g',12,4]]},
];
const EN_THEMES=[0,1,7,5,8,2,3],EN_W=16,EN_START=2; // two flat chunks to start
const ENDLESS={name:'Endless Run',endless:true,W:EN_W*8,cps:[2],kind:'warden',boss:'',th:STAGES[0].th,key:'prism',spawns:[],movers:[],crushers:[],build(f){}};
STAGES.push(ENDLESS);
const ENDLESS_I=STAGES.length-1;
let EL=null; // {list (chunk ids), far (furthest column), wave (x px), best}
const enTier=m=>m>=200?3:m>=80?2:1;
// 60% of picks come from the newest tier unlocked, the rest from any unlocked tier
function enPick(n){const m=n*EN_W,pool=CHUNKS.filter(c=>c.tier<=enTier(m)),hi=pool.filter(c=>c.tier===enTier(m)),from=rnd()<.6?hi:pool;
  return from[Math.floor(rnd()*from.length)].id}
// paints one chunk at chunk index n onto the live map (the map grows to fit)
function enPaint(n,id){
  const c=id==='start'?EN_FLAT:CHUNKS.find(q=>q.id===id),x0=n*EN_W;
  while(map[0].length<x0+EN_W)for(let y=0;y<H;y++)map[y].push(' ');
  W=map[0].length;ENDLESS.W=W;
  const f=(a,b,y0,y1,ch='#')=>{for(let y=y0;y<=y1;y++)for(let x=a;x<=b;x++)if(x>=0&&x<EN_W&&y>=0&&y<H)map[y][x0+x]=ch};
  f(0,EN_W-1,15,16);if(n===0)f(0,0,0,14);c.b(f);
  for(const [t,x,y] of c.s)spawnOne([t,x0+x,y]);
}
const EN_FLAT={id:'start',tier:9,b(f){},s:[]}; // the empty chunks you start on (never picked)
function enExtend(k){for(let i=0;i<k;i++){const n=EL.list.length,id=n<EN_START?'start':enPick(n);EL.list.push(id);enPaint(n,id)}}
function startEndless(){
  DAILY=null;startStage(ENDLESS_I);HASPHASE=true;E=[];PU=[];
  EL={list:[],wave:-6*TS,best:save.endless||0,theme:0};
  for(let y=0;y<H;y++)map[y].length=0;enExtend(8);P.x=2*TS;P.y=13*TS;introT=120;
}
const enMetres=()=>Math.max(0,Math.floor(P.x/TS)-2);
function enTick(){
  if(!EL)return;
  if(P.x>(W-EN_W*3)*TS)enExtend(4);
  // theme changes every 8 chunks; colours, background and music follow the camera
  const th=EN_THEMES[Math.floor((camX+VW/2)/TS/EN_W/8)%EN_THEMES.length];
  if(th!==EL.theme){EL.theme=th;ENDLESS.th=STAGES[th].th;ENDLESS.key=STAGES[th].key}
  // the null wave: starts after the intro, speeds up with distance, never falls more than a screen behind
  if(introT<=0){const v=Math.min(EN_VMAX,.45+enMetres()*.0015);EL.wave+=v;EL.wave=Math.max(EL.wave,P.x-VW*.8)}
  for(const e of E)if(e.x+e.w<EL.wave)e.dead=1;
  if(state==='play'&&P.x<EL.wave)die('null wave');
}
// the slowest chunk's route speed is about 0.9 px/frame (tools/check-chunks.js); the wave tops out below it
const EN_VMAX=.75;
function endlessOver(){
  const L=save.log||[],last=L[L.length-1];logEv({e:'endless',m:enMetres(),c:last&&last.e==='death'?last.c:'?'});
  const m=enMetres(),pb=!assistOn()&&m>(save.endless||0);if(pb){save.endless=m;persist()}
  if(m>=300&&!assistOn())ach('endless');
  lastWin={endless:1,m,pb};state='got';gotT=0;EL=null;snd(220,.4,'sawtooth',110,.05);
}
function drawWave(){
  if(!EL)return;const x=EL.wave;if(x<camX-20)return;
  ctx.save();ctx.fillStyle='rgba(255,59,92,.16)';ctx.fillRect(camX-10,0,x-camX+10,VH);
  ctx.strokeStyle=hc('#ff3b5c','hazard');ctx.lineWidth=2;glow('#ff3b5c',OPT.rf?0:10);ctx.beginPath();
  for(let y=0;y<=VH;y+=8){const j=OPT.rf?0:Math.sin(y*.3+tick*.4)*4;ctx.lineTo(x+j,y)}ctx.stroke();ctx.shadowBlur=0;
  if(!OPT.rf)for(let i=0;i<10;i++){const y=(tick*3+i*29)%VH;ctx.fillStyle='rgba(255,107,107,.35)';ctx.fillRect(x-30+((i*37)%26),y,12,2)}
  ctx.restore();
}
