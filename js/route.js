// Voltline · route.js · In-browser route checker for the level editor.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
// Same idea as tools/ghost.js: remove enemies, then beam-search run/jump/wait/slide/climb inputs
// with the real engine until the hero reaches the boss gate without taking damage. The search runs
// in small time slices each frame so the page stays responsive.

const RMAC=[{r:8},{r:20},{l:8},{w:12},{w:30},
  ...[4,10,16,24].flatMap(h=>[12,20,28,40,60].map(a=>({jr:h,a,n:Math.max(a,50)}))),
  {jn:22,n:50},{jl:14,n:40},{slide:1},{up:100},{down:40},{sw:40},{sw:80},{su:40},{w:45},{jr:24,a:90,n:100},{jr:24,a:120,n:130},{jr:24,a:70,n:120}];
let RT=null,routeMsg=null;

function routeStart(opt){
  saveED();silent=true;
  S=ED_I;resetRun(true);E=[];PU=[];P.inv=0;
  for(let i=0;i<5;i++)routeStep({});
  const goal=(ARENA+3)*TS,timed=MV.length>0||CR.length>0||HASPHASE;
  RT={share:opt&&opt.share||null,frontier:[routeSnap()],seen:new Set(),it:0,best:P.x,bestSnap:null,goal,timed,t0:performance.now(),q:[],qi:0,next:[]};
  routeMsg=null;state='route';
}
const RKEYS=['left','right','up','down','jump','fire','start','back','next','prev','opts','music','sfx','route'];
function routeKeys(k){for(const key of RKEYS)K[key]=!!k[key]}
function routeStep(k){routeKeys(k);state='play';step()}
function routeSnap(){return {P:{...P,mv:P.mv?MV.indexOf(P.mv):-1},tick,cp}}
function routeRestore(s){
  tick=s.tick;cp=s.cp;state='play';if(HASPHASE)PHASE=Math.floor(tick/90)%2;E=[];EB=[];PB=[];PT=[];POP=[];
  for(const m of MV){const a=s.tick/m.per*6.283+m.ph;m.x=m.bx+Math.sin(a)*m.ax;m.y=m.by+Math.sin(a)*m.ay;m.dx=m.dy=0}
  P={...s.P};P.mv=P.mv>=0?MV[P.mv]:null;
}
function routeFrames(m){
  const f=[];
  if(m.r)for(let i=0;i<m.r;i++)f.push({right:1});
  if(m.l)for(let i=0;i<m.l;i++)f.push({left:1});
  if(m.w)for(let i=0;i<m.w;i++)f.push({});
  if(m.jr)for(let i=0;i<m.n;i++)f.push({right:i<m.a,jump:i<m.jr});
  if(m.jl)for(let i=0;i<m.n;i++)f.push({left:1,jump:i<m.jl});
  if(m.jn)for(let i=0;i<m.n;i++)f.push({jump:i<m.jn});
  if(m.slide){f.push({down:1,jump:1});for(let i=0;i<40;i++)f.push({right:1})}
  if(m.up)for(let i=0;i<m.up;i++)f.push({up:1,right:i>m.up-20});
  if(m.down)for(let i=0;i<m.down;i++)f.push({down:1});
  if(m.sw)for(let i=0;i<m.sw;i++)f.push({right:1,jump:i%14<3});
  if(m.su)for(let i=0;i<m.su;i++)f.push({jump:i%12<3});
  f.push({});return f;
}
// returns 'goal', 'ok' (ended supported), or 'fail'
function routeTry(m){
  const hp0=P.hp;
  for(const k of routeFrames(m)){
    routeKeys(k);step();
    if(state!=='play'||P.hp<hp0)return 'fail';
    if(arena)return 'goal';
  }
  return P.onG||P.climb||P.wt?'ok':'fail';
}
function routeFinish(ok){
  silent=false;const bestTile=Math.floor(RT.best/TS);
  routeMsg=ok?{ok:1,s:'Route found: the level can be finished.',t:240}:{ok:0,s:'No route found past column '+bestTile+'. Cursor moved there.',t:300};
  if(!ok)edc.x=Math.max(1,Math.min(ED.w-1,bestTile+1));
  if(ok){ED.ok=levelHash(ED);saveED()}
  if(RT.share)routeMsg.s=ok?'Route verified. Press '+(RT.share==='link'?'Copy play link':'Copy code')+' again to copy.':'No route past column '+bestTile+'. Press copy again to share it unverified.';
  RT=null;for(const k in K)K[k]=false;enterEditor();
}
// one time slice; called from step() while state==='route'
function routeSlice(){
  if(K.back){silent=false;RT=null;routeMsg={ok:0,s:'Route check cancelled.',t:150};for(const k in K)K[k]=false;enterEditor();return}
  const R=RT,end=performance.now()+10;
  while(performance.now()<end){
    if(R.qi>=R.q.length){ // finish this layer, build the next frontier
      if(R.q.length){
        const next=R.next;if(!next.length)return routeFinish(false);
        next.sort((a,b)=>b.P.x-a.P.x||a.P.y-b.P.y);
        const byX=next.slice(0,28),byH=next.slice().sort((a,b)=>a.P.y-b.P.y).slice(0,12);
        R.frontier=[...new Set([...byX,...byH])];R.best=Math.max(R.best,next[0].P.x);R.it++;
        if(R.it>160||performance.now()-R.t0>60000)return routeFinish(false);
      }
      R.q=[];for(const s of R.frontier)for(const m of RMAC)R.q.push([s,m]);R.qi=0;R.next=[];
    }
    const [s,m]=R.q[R.qi++];
    routeRestore(s);const res=routeTry(m);
    if(res==='goal')return routeFinish(true);
    if(res!=='ok')continue;
    const n=routeSnap(),key=Math.round(n.P.x/8)+','+Math.round(n.P.y/8)+','+(n.P.climb?1:0)+','+n.P.mv+(R.timed?','+(Math.floor(n.tick/15)%16):'');
    if(R.seen.has(key))continue;R.seen.add(key);R.next.push(n);R.best=Math.max(R.best,n.P.x);
  }
  state='route';
}
