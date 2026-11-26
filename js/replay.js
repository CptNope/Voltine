// Voltline · replay.js · Ghost replays of your best run, and Practice mode.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
//
// Ghosts: every second frame of a run records the hero's position and pose. When a clear beats the
// sector's best time, that recording becomes the sector's ghost, kept separately for Normal and Hard
// in localStorage `voltline-ghosts`. Next time, a see-through copy runs alongside you.
//
// Encoding: three characters per sample from a 64-character alphabet: x and y deltas (−32..31) and a
// pose bitfield. A jump too big for a delta (respawns, teleports) is written as '~' + x (2 chars) + y (2 chars).
const G64='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const g64=n=>G64[n&63],gi=c=>G64.indexOf(c);
let GHOSTS={};try{const g=JSON.parse(localStorage.getItem('voltline-ghosts')||'{}');if(g&&typeof g==='object')GHOSTS=g}catch(e){}
const saveGhosts=()=>{try{localStorage.setItem('voltline-ghosts',JSON.stringify(GHOSTS))}catch(e){}};
let GREC=null,GPLAY=null,GTIME=0; // PRAC (the practice run, or null) is declared in entities.js
const ghostKey=(s=S,h=hard)=>(ST.room?roomId:s)+(h?'h':'n');
const canRecord=()=>!ST.custom&&!ST.rush&&!PRAC&&!DAILY;
const pose=p=>(p.face>0?1:0)|(p.climb?2:0)|(p.slide?4:0)|(p.onG?8:0)|(Math.abs(p.vx)>.2?16:0)|(p.wt?32:0);
function ghostEncode(s){
  let o='',px=0,py=0;
  for(let i=0;i<s.length;i+=3){const x=s[i],y=s[i+1],dx=x-px,dy=y-py;
    if(i===0||dx<-32||dx>31||dy<-32||dy>31){const yy=y+256;o+='~'+g64(x>>6)+g64(x)+g64(yy>>6)+g64(yy)}else o+=g64(dx+32)+g64(dy+32);
    o+=g64(s[i+2]);px=x;py=y}
  return o;
}
function ghostDecode(str){
  const out=[];let x=0,y=0,i=0;
  while(i<str.length){let jump=0;
    if(str[i]==='~'){x=gi(str[i+1])*64+gi(str[i+2]);y=gi(str[i+3])*64+gi(str[i+4])-256;i+=5;jump=1}else{x+=gi(str[i])-32;y+=gi(str[i+1])-32;i+=2}
    out.push({x,y,b:gi(str[i]),jump});i++}
  return out;
}
function ghostStart(){
  GREC=canRecord()?[]:null;GPLAY=null;GTIME=0;
  const g=OPT.gh&&canRecord()?GHOSTS[ghostKey()]:null;
  if(g&&typeof g.d==='string'){try{GPLAY=ghostDecode(g.d);GTIME=g.t}catch(e){GPLAY=null}}
}
function ghostTick(){if(GREC&&clock%2===0)GREC.push(Math.round(P.x),Math.round(P.y),pose(P))}
// called when a clear sets a new best time
function ghostSave(){
  if(!GREC||GREC.length<3)return;
  GHOSTS[ghostKey()]={t:clock,v:1,d:ghostEncode(GREC)};saveGhosts();
}
function drawGhost(){
  if(!GPLAY||!OPT.gh||state==='edit')return;
  const f=clock/2,i=Math.min(GPLAY.length-1,Math.floor(f));if(i<0)return;
  const a=GPLAY[i],b=GPLAY[Math.min(GPLAY.length-1,i+1)],k=b.jump?0:f-i;
  const x=a.x+(b.x-a.x)*k,y=a.y+(b.y-a.y)*k;
  if(x<camX-40||x>camX+VW+40)return;
  const slide=!!(a.b&4);
  ctx.save();ctx.globalAlpha=.32;
  drawHero({x,y:slide?y:y,w:12,h:slide?12:22,face:a.b&1?1:-1,climb:!!(a.b&2),slide:slide?1:0,onG:!!(a.b&8),vx:a.b&16?1:0,wt:!!(a.b&32),anim:Math.floor(f*2),wpn:0,charge:0,inv:0,hurt:0},true);
  ctx.restore();
  if(i>=GPLAY.length-1&&clock<GTIME+120)text('GHOST',x+6,y-6,8,'rgba(243,233,255,.6)','center',0);
}

/* ---------- Practice mode ---------- */
// Records → Practice: start any cleared sector from a later checkpoint, its mid-boss, or its boss.
// Practice runs never record best times, splits, ghosts, achievements or clears.
const PRAC_COLS=['Checkpoint 2','Checkpoint 3','Mid-boss','Boss'];
let pracR=0,pracC=0;
const pracRows=()=>CARD.filter(i=>save.cleared[i]);
function pracOk(si,c){const st=STAGES[si];if(!st)return false;return c===3?true:c===2?!!MIDS[st.name]:st.cps.length>c+1}
function startPractice(si,c){
  if(!pracOk(si,c))return;
  startStage(si);PRAC={s:si,c};introT=60;
  const m=MIDS[ST.name];
  if(c<2){cp=c+1;}
  else if(c===2){cp=1;PRAC.x=(m.l+3)*TS;PRAC.y=groundY(m.l+3)-22}
  else{cp=ST.cps.length-1;PRAC.x=(ARENA-3)*TS;PRAC.y=groundY(ARENA-3)-22;MBdone=true}
  resetRun(false);GREC=null;GPLAY=null;
}
function practiceStep(){
  const rows=pracRows();
  if(!rows.length){if(pr('left')){recPage=1;snd(600,.05,'square',0,.03)}if(pr('back')||pr('start')||pr('jump')){state='select';sel=B_REC}return}
  pracR=Math.max(0,Math.min(rows.length-1,pracR));
  if(pr('up'))pracR=(pracR+rows.length-1)%rows.length;if(pr('down'))pracR=(pracR+1)%rows.length;
  if(pr('left')){if(pracC===0){recPage=1;snd(600,.05,'square',0,.03);return}pracC--}
  if(pr('right'))pracC=Math.min(PRAC_COLS.length-1,pracC+1);
  if(pr('back')){state='select';sel=B_REC;return}
  if(pr('start')||pr('jump')){const si=rows[pracR];if(pracOk(si,pracC)){startPractice(si,pracC);snd(440,.1,'square',880,.04)}else snd(200,.1,'square',0,.04)}
}
function drawPractice(){
  const rows=pracRows();
  if(!rows.length){text('Clear a sector to practise it here.',VW/2,130,11,CRM,'center',0);return}
  text('Start a cleared sector from a later point. Practice runs record nothing.',VW/2,62,8,'rgba(243,233,255,.6)','center',0,440);
  PRAC_COLS.forEach((n,c)=>text(n,170+c*78,80,8,'rgba(243,233,255,.6)','center',0,74));
  rows.forEach((si,r)=>{const y=98+r*20;text(STAGES[si].name,20,y,10,r===pracR?MINT:CRM,'left',r===pracR?4:0,120);
    PRAC_COLS.forEach((n,c)=>{const ok=pracOk(si,c),on=r===pracR&&c===pracC,x=170+c*78;
      if(on){ctx.strokeStyle=ok?MINT:CORAL;ctx.lineWidth=1.5;ctx.strokeRect(x-34.5,y-11.5,69,15)}
      text(ok?'▶':'—',x,y,10,ok?(on?MINT:GOLD):'rgba(243,233,255,.3)','center',on?4:0)})});
}
