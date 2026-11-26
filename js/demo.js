// Voltline · demo.js · Title screen attract mode.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
//
// After 20 seconds on the title screen without input, the game plays the start of Prism Grid by itself.
// The inputs come from tools/build-demo.js (a route found by the route checker, one character triple per
// run of identical frames). Runs are seeded, so the same inputs always play out the same way. The hero
// is invulnerable and fires regularly; nothing is recorded (the run is `silent`). Any key, tap or click
// ends the demo.
const DEMO_INPUT='AAFFAYBBgAALFAYBBgAALFAEBAkAALFAYBAuAAzFAYBBgAALFAEBA4AABFAQBAYAALFAYBBgAALQBRRATAABFAYBBgAALFAYBBgAALFAEBAkAALFAKBAeAALFAYBBgAALFAYBAuAAzFAQBAsAABFAYBBgAALMABBAoAABFAYBBgAALFAEBAV';
const DEMO_SEED=1,DEMO_IDLE=20*60;
let demoOn=false,demoF=0,demoFrames=null,idleT=0,demoHard=false;
function demoDecode(s){const B=['right','left','jump','down','up'],o=[];
  for(let i=0;i+2<s.length;i+=3){const m=G64.indexOf(s[i]),n=G64.indexOf(s[i+1])*64+G64.indexOf(s[i+2]);for(let k=0;k<n;k++)o.push(m)}
  return o.map(m=>{const f={};B.forEach((b,i)=>{if(m&1<<i)f[b]=1});return f})}
function startDemo(){
  demoFrames=demoFrames||demoDecode(DEMO_INPUT);if(!demoFrames.length)return;
  demoHard=hard;hard=false;silent=true;demoOn=true;demoF=0;startStage(0,DEMO_SEED);MBdone=true; // the route the inputs came from skips the mid-boss
}
function endDemo(){demoOn=false;silent=false;hard=demoHard;idleT=0;for(const k in K)K[k]=false;state='title'}
// called at the top of step(): counts idle time on the title, and feeds the demo's inputs
function demoTick(){
  if(state==='title'&&!demoOn){if(Object.values(K).some(v=>v))idleT=0;else if(++idleT>=DEMO_IDLE)startDemo();return}
  if(!demoOn)return;
  if(K.start||K.back||K.opts){endDemo();return} // gamepad Start / Back
  if(demoF>=demoFrames.length||state!=='play'){endDemo();return}
  const f=demoFrames[demoF++];for(const k of['right','left','jump','down','up','fire'])K[k]=!!f[k];
  K.fire=demoF%16<3;P.inv=Math.max(P.inv,2);introT=0;
}
// any real key, click or tap ends the demo or resets the idle timer
const demoInput=()=>{idleT=0;if(demoOn){endDemo();return true}return false};
function drawDemo(){
  if(!demoOn)return;const a=Math.min(1,demoF/30,(demoFrames.length-demoF)/30);ctx.globalAlpha=a;
  ctx.fillStyle='rgba(8,3,20,.75)';ctx.fillRect(0,VH-40,VW,26);
  text('DEMO',16,VH-22,12,GOLD,'left',6);text('Press any key to play',VW-16,VH-22,10,tick%60<40?CRM:'rgba(243,233,255,.5)','right',0);
  ctx.globalAlpha=1;
}
