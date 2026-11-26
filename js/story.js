// Voltline · story.js · Story cards (intro and ending), boss intro cards, and reboot / checkpoint effects.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
//
// The story is deliberately light: four cards before the first stage select, three after the Null Core.
// Each card types itself out; jump or fire finishes it or moves on, Enter or Esc skips the rest.
const STORY_INTRO=[
 'The Grid went dark in a single night.',
 'Six wardens still run their sectors. None of them answer to anyone now.',
 'At the centre, the Null Engine hums: silent, waiting.',
 'One maintenance unit still has a spare core and a stubborn streak. KESTREL, powering on.'];
const STORY_END=[
 'The Null Engine winds down for the last time.',
 'Sector by sector, the lights come back on across the Grid.',
 'Kestrel stays powered on. Somebody has to check the wiring.'];
let STORY=null; // {lines, i, t, then}
function startStory(lines,then){STORY={lines,i:0,t:0,then};state='story'}
const storyLen=s=>Math.ceil(s.length*1.6); // frames to type a line
function storyStep(){
  const s=STORY;s.t++;
  const done=()=>{const then=s.then;STORY=null;then()};
  if(pr('start')||pr('back')){snd(300,.08,'square',150,.03);done();return}
  if(pr('jump')||pr('fire')){if(s.t<storyLen(s.lines[s.i]))s.t=storyLen(s.lines[s.i]);else{s.i++;s.t=0;snd(700,.04,'square',0,.02)}}
  else if(s.t>storyLen(s.lines[s.i])+110){s.i++;s.t=0} // about four seconds a card, under 30 s in total
  if(s.i>=s.lines.length)done();
}
function drawStory(){
  const s=STORY;if(!s)return;drawBG(STAGES[3].th);dim(.82);
  const line=s.lines[Math.min(s.i,s.lines.length-1)],shown=line.slice(0,Math.floor(s.t/1.6));
  const hero={x:VW/2-6,y:120,w:12,h:22,face:1,climb:false,slide:0,onG:true,vx:0,anim:0,wpn:0,charge:0,inv:0,hurt:0};
  if(s.lines===STORY_INTRO&&s.i===3||s.lines===STORY_END&&s.i===2){ctx.save();ctx.translate(VW/2,131);ctx.scale(2.4,2.4);ctx.translate(-VW/2,-131);drawHero(hero,true);ctx.restore()}
  // wrap at about 46 characters so long lines never get squeezed
  const rows=[];for(const w of line.split(' ')){const r=rows[rows.length-1];if(r!==undefined&&(r+' '+w).length<=46)rows[rows.length-1]=r+' '+w;else rows.push(w)}
  let left=shown.length;rows.forEach((r,k)=>{const part=r.slice(0,Math.max(0,left));left-=r.length+1;ctx.font='700 13px "Chakra Petch",monospace';const x=VW/2-ctx.measureText(r).width/2;text(part,x,180+k*18-(rows.length-1)*9,13,CRM,'left',4)}); // each row is centred on its full width, so typing doesn't shift it
  s.lines.forEach((_,k)=>{ctx.beginPath();ctx.arc(VW/2+(k-(s.lines.length-1)/2)*12,214,2.5,0,6.283);ctx.fillStyle=k===s.i?MINT:'rgba(243,233,255,.25)';ctx.fill()});
  text('jump: next  ·  Enter: skip',VW/2,256,8,'rgba(243,233,255,.45)','center',0);
}
/* ---------- boss intro cards ---------- */
const FLAVOR={
 warden:'Keeper of the Prism Grid. It still guards a gate nobody uses.',
 hound:'The foundry watchdog. It learned to bite the sparks before you could.',
 kite:'It flies the relay\'s last signal in circles, waiting for a reply.',
 undertow:'The vault flooded years ago. Undertow decided it liked it that way.',
 orbiter:'A satellite that never stopped scanning for intruders. It found one.',
 mirror:'It watched every other warden fall. It knows your moves by now.',
 null:'The engine that went quiet and took the whole Grid with it.'};
let bossCard=0,cardKind='',cardSeen={};
// shown the first time each boss appears in a run; the fight waits (and the clock stops) until it closes
function bossCardOpen(kind){if(cardSeen[kind]||silent)return;cardSeen[kind]=1;cardKind=kind;bossCard=150}
function bossCardStep(){bossCard--;if(bossCard>20&&(pr('jump')||pr('fire')||pr('start')))bossCard=20}
function drawBossCard(){
  if(bossCard<=0)return;const a=Math.min(1,bossCard/20,(150-bossCard)/12+.2);ctx.globalAlpha=a;
  const si=STAGES.findIndex(s=>s.kind===cardKind&&!s.rush&&!s.custom&&!s.room),x=VW/2-190,y=66;
  ctx.fillStyle='rgba(8,3,20,.9)';ctx.fillRect(x,y,380,96);const c=si>=0?STAGES[si].th.edge:PINK;glow(c,10);ctx.lineWidth=1.5;ctx.strokeRect(x+.5,y+.5,379,95);ctx.shadowBlur=0;
  if(si>=0){ctx.save();ctx.beginPath();ctx.rect(x+4,y+4,92,88);ctx.clip();portrait(si,x+50,y+48,.9);ctx.restore()}
  text('WARDEN',x+108,y+24,8,'rgba(243,233,255,.55)','left',0);if(cardKind==='null')text('FINAL',x+108,y+24,8,CORAL,'left',0);
  text(BN[cardKind],x+108,y+46,18,c,'left',8,262);
  text(FLAVOR[cardKind]||'',x+108,y+68,9,CRM,'left',0,262);
  if(bossCard>20)text('jump to skip',x+372,y+88,7,'rgba(243,233,255,.4)','right',0);
  ctx.globalAlpha=1;
}
/* ---------- reboot, respawn and checkpoint effects ---------- */
let cpFx=null; // {x, y, t}
function checkpointFx(x,y){cpFx={x,y,t:0};POP.push({x,y:y-70,s:'CHECKPOINT',c:GOLD,l:60})}
function drawWorldFx(){
  if(cpFx){cpFx.t++;const k=cpFx.t/36;ctx.beginPath();ctx.arc(cpFx.x,cpFx.y-30,10+k*60,0,6.283);ctx.strokeStyle=`rgba(255,209,102,${(1-k)*.8})`;ctx.lineWidth=2;ctx.stroke();if(cpFx.t>=36)cpFx=null}
  if(P&&P.spawnT>0&&state==='play'&&bossCard<=0){const k=P.spawnT/30,x=P.x+P.w/2;ctx.save();ctx.globalAlpha=OPT.rf?k*.5:k*(.6+.3*Math.sin(tick*.8));ctx.fillStyle=hc(MINT,'hero');ctx.fillRect(x-8*k-2,0,16*k+4,P.y+P.h);ctx.restore()}
}
function drawReboot(){
  // the screen loses signal, then a progress bar fills while the unit reboots
  const k=Math.min(1,deadT/90);ctx.fillStyle=`rgba(4,2,12,${Math.min(.75,deadT/40)})`;ctx.fillRect(0,0,VW,VH);
  if(!OPT.rf)for(let i=0;i<6;i++){const y=(deadT*7+i*47)%VH;ctx.fillStyle='rgba(255,107,107,.06)';ctx.fillRect(0,y,VW,3)}
  if(deadT>20){text('SIGNAL LOST',VW/2,124,20,CORAL,'center',OPT.rf?0:8);
    ctx.strokeStyle='rgba(243,233,255,.4)';ctx.lineWidth=1;ctx.strokeRect(VW/2-60.5,140.5,120,8);ctx.fillStyle=MINT;ctx.fillRect(VW/2-59,142,118*Math.max(0,(deadT-20)/70),5);
    text(ST.room?'restarting the room':cp>0||PRAC?'rebooting at checkpoint':'rebooting at the start',VW/2,166,9,CRM,'center',0)}
}
