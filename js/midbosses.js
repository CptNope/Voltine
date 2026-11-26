// Voltline · midbosses.js · One mid-boss halfway through each warden sector.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
//
// Each sector names a walled section (columns l..r) just after its middle checkpoint. Walking in
// raises walls at l and r, locks the camera and spawns the mid-boss. Beating it lowers the walls
// and it stays beaten for the rest of the attempt, even if you die before the next checkpoint.
// Run state (MB, MBlock, MBdone, MBhit) lives in entities.js so resetRun can clear it.
const MIDS={
  'Prism Grid':{l:79,r:103,k:'sentry'},
  'Coil Foundry':{l:105,r:133,k:'press'},
  'Sky Relay':{l:64,r:86,k:'carrier'},
  'Tide Vault':{l:94,r:112,k:'clam'},
  'Orbit Deck':{l:80,r:100,k:'meteor'},
  'Phase Lab':{l:79,r:96,k:'pcore'},
};
const MBN={sentry:'PRISM SENTRY',press:'DROP PRESS',carrier:'DRONE CARRIER',clam:'GIANT CLAM',meteor:'METEOR HEAD',pcore:'PHASE CORE'};
const MB_HP=16;
let MBwall=[]; // tiles the walls replaced, put back when the gate opens
const midOf=()=>ST&&!ST.custom&&!ST.rush?MIDS[ST.name]||null:null;
// the floor under the arena's middle, so every mid-boss stands on (or hovers over) real ground
const midFloor=m=>groundY(Math.floor((m.l+m.r)/2));
const midCam=m=>Math.max(0,Math.min(W*TS-VW,((m.l+m.r+1)/2)*TS-VW/2));

function midCheck(){
  const m=midOf();if(!m||MBdone||MBlock)return;
  if(P.x<=(m.l+2)*TS||P.x>=m.r*TS)return;
  MBlock=true;MBhit=false;
  MBwall=[];for(let y=0;y<15;y++)for(const x of[m.l,m.r])if(!solid(x,y)){MBwall.push([x,y,map[y][x]]);map[y][x]='#'}
  for(const e of E)if(e.x>m.l*TS-8&&e.x<(m.r+1)*TS)e.dead=1;
  E=E.filter(e=>!e.dead);EB=[];
  for(const c of CR)if(c.cx>m.l*TS&&c.cx<(m.r+1)*TS)c.off=1; // stage crushers park so the Drop Press is the only thing slamming
  const fy=midFloor(m),cx=((m.l+m.r+1)/2)*TS;
  const sz={sentry:[26,26],press:[34,26],carrier:[44,20],clam:[36,24],meteor:[28,28],pcore:[24,24]}[m.k];
  const bx=m.k==='clam'?m.r*TS-sz[0]-24:cx-sz[0]/2; // the clam sits at the far end of its short arena, past the pillar
  MB={kind:m.k,x:bx,y:m.k==='clam'?fy-sz[1]:-40,w:sz[0],h:sz[1],vx:0,vy:0,hp:Math.round(MB_HP*(hard?1.25:1)),max:Math.round(MB_HP*(hard?1.25:1)),shown:0,t:0,st:'intro',inv:0,fy,cx};
  snd(110,.4,'sawtooth',200,.06);shake=OPT.shake?4:0;
}
function midOpen(){
  for(const [x,y,c] of MBwall)map[y][x]=c;MBwall=[];for(const c of CR)c.off=0;
}
function hitMid(s){
  const b=MB;if(b.inv>0||b.st==='intro'||b.st==='boom')return;
  if(midShielded(b)){burst(s.x,s.y,'#c7d2ff',4,1.2);snd(1600,.04,'square',1000,.02);if(!s.pierce)s.dead=1;return}
  b.hp-=s.dmg;b.inv=8;if(!s.pierce)s.dead=1;burst(s.x,s.y,CRM,5);snd(500,.06,'square',250,.04);
  if(b.hp<=0){b.hp=0;b.st='boom';b.t=0;if(!OPT.rf)hitStop=8;logEv({e:'mid',k:b.kind});if(!MBhit)ach('mid_clean');ach('mid')}
}
// shots bounce off while it is closed up or out of phase
const midShielded=b=>(b.kind==='clam'&&b.st!=='open')||(b.kind==='pcore'&&PHASE===1);

function updMid(){
  const b=MB;b.t++;if(b.inv>0)b.inv--;if(b.shown<b.hp&&tick%2===0)b.shown++;
  const px=P.x+P.w/2,py=P.y+P.h/2,mx=b.x+b.w/2,my=b.y+b.h/2,m=midOf(),L=(m.l+1)*TS,R=m.r*TS;
  const aim=(sp,spread=0)=>{const a=Math.atan2(py-my,px-mx)+spread;EB.push({x:mx,y:my,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:3.5})};
  if(b.st==='boom'){
    if(b.t%6===0){burst(b.x+Math.random()*b.w,b.y+Math.random()*b.h,[MINT,GOLD,PINK][b.t%3],8,2.5);snd(140+Math.random()*80,.12,'sawtooth',40,.05);shake=OPT.shake?3:0}
    if(b.t>60){MB=null;MBlock=false;MBdone=true;EB=[];midOpen();
      PU.push({x:mx-5,y:my,w:10,h:10,v:10,t:0,vy:-2,drop:1});POP.push({x:mx,y:my-10,s:'GATE OPEN',c:GOLD,l:70});snd(660,.25,'triangle',1320,.05)}
    return}
  if(b.st==='intro'){ // drop or rise into place
    const ty=b.kind==='clam'?b.fy-b.h:b.kind==='press'?40:b.kind==='carrier'?110:b.kind==='meteor'?120:b.kind==='pcore'?140:150;
    b.y+=(ty-b.y)*.08;if(b.t>70){b.y=ty;b.st=b.kind==='clam'?'shut':'go';b.t=0;b.vx=b.kind==='meteor'?1.7:0;b.vy=b.kind==='meteor'?1.3:0}return}
  ({sentry:midSentry,press:midPress,carrier:midCarrier,clam:midClam,meteor:midMeteor,pcore:midCore})[b.kind](b,{px,py,mx,my,L,R,aim});
  b.x=Math.max(L,Math.min(R-b.w,b.x));
  if(hit(b,P))hurt(3);
}
// Prism Sentry: hovers in a figure eight, fires aimed fans, then a ring
function midSentry(b,{L,R,aim}){
  const cx=(L+R)/2;b.x=cx+Math.sin(b.t*.012)*(R-L-60)/2-b.w/2;b.y=150+Math.sin(b.t*.024)*28;
  if(b.t%80===40){for(const d of[-.25,0,.25])aim(2.4,d);snd(900,.06,'square',600,.03)}
  if(b.t%320===300){for(let i=0;i<10;i++){const a=i/10*6.283;EB.push({x:b.x+b.w/2,y:b.y+b.h/2,vx:Math.cos(a)*1.8,vy:Math.sin(a)*1.8,r:3.5})}snd(500,.15,'square',200,.04)}
}
// Drop Press: tracks you along the ceiling, slams down, throws sparks both ways along the floor
function midPress(b,{px,mx,L,R}){
  if(b.st==='go'){b.y+=(40-b.y)*.1;b.x+=Math.max(-2,Math.min(2,px-mx));if(b.t>70){b.st='warn';b.t=0}}
  else if(b.st==='warn'){if(b.t%6<3)burst(b.x+b.w/2,b.y+b.h,ORG,1,1);if(b.t>24){b.st='slam';b.t=0;b.vy=0}}
  else if(b.st==='slam'){b.vy=Math.min(b.vy+.6,9);b.y+=b.vy;if(b.y+b.h>=b.fy){b.y=b.fy-b.h;b.st='down';b.t=0;shake=OPT.shake?6:0;snd(70,.25,'square',40,.06);
    for(const d of[-1,1])EB.push({x:b.x+b.w/2+d*20,y:b.fy-5,vx:d*2.6,vy:0,r:4,sp:1})}}
  else if(b.st==='down'&&b.t>55){b.st='go';b.t=0}
}
// Drone Carrier: sweeps across the top and dips low; launches flyers (at most three alive)
function midCarrier(b,{L,R}){
  const cx=(L+R)/2;b.x=cx+Math.sin(b.t*.01)*(R-L-70)/2-b.w/2;b.y=120+Math.max(0,Math.sin(b.t*.017))*70;
  if(b.t%150===75&&E.filter(e=>e.type==='f'&&!e.dead).length<3){E.push({type:'f',x:b.x+b.w/2-7,y:b.y+b.h,w:14,h:14,vx:0,vy:0,dir:-1,t:0,hp:1,flash:0,onG:false,cd:40,y0:b.y+b.h});snd(700,.08,'square',350,.03)}
  if(b.t%100===50)EB.push({x:b.x+b.w/2,y:b.y+b.h,vx:0,vy:1,r:3.5,grav:1});
}
// Giant Clam: shut (shots bounce), then opens to spit drifting bubbles; only hurt while open
function midClam(b,{aim}){
  if(b.st==='shut'&&b.t>100){b.st='open';b.t=0;snd(300,.15,'sine',600,.05)}
  else if(b.st==='open'){if(b.t===20||b.t===45)for(const d of[-.35,0,.35]){aim(1.4,d);EB[EB.length-1].bub=1;EB[EB.length-1].r=5}if(b.t>80){b.st='shut';b.t=0;snd(200,.1,'square',100,.04)}}
}
// Meteor Head: bounces around the arena, pausing to burst rocks in eight directions
function midMeteor(b,{L,R}){
  if(b.st==='go'){b.x+=b.vx;b.y+=b.vy;
    if(b.x<=L||b.x+b.w>=R){b.vx*=-1;snd(200,.05,'square',120,.03)}
    if(b.y<=50||b.y+b.h>=b.fy){b.vy*=-1;b.y=Math.max(50,Math.min(b.fy-b.h,b.y))}
    if(b.t>220){b.st='burst';b.t=0}}
  else if(b.st==='burst'){if(b.t===30){for(let i=0;i<8;i++){const a=i/8*6.283;EB.push({x:b.x+b.w/2,y:b.y+b.h/2,vx:Math.cos(a)*2,vy:Math.sin(a)*2,r:4})}snd(160,.2,'sawtooth',60,.05);shake=OPT.shake?3:0}
    if(b.t>50){b.st='go';b.t=0;const s=hard?2.1:1.7;b.vx=Math.sign(b.vx||1)*s;b.vy=Math.sign(b.vy||1)*s*.8}}
}
// Phase Core: rises, shielded, and fires rings on the blue beat; sinks toward you, open to hits, on the pink beat
function midCore(b,{px,py,mx,my,aim}){
  if(PHASE===1){b.y+=(110-b.y)*.05;b.x+=Math.sin(b.t*.05)*.6;if(b.t%45===10){for(let i=0;i<8;i++){const a=i/8*6.283+b.t*.1;EB.push({x:mx,y:my,vx:Math.cos(a)*1.7,vy:Math.sin(a)*1.7,r:3.5})}snd(1000,.08,'square',500,.03)}}
  else{b.x+=Math.max(-.9,Math.min(.9,(px-mx)*.02));b.y+=(b.fy-b.h-8-b.y)*.06;if(b.t%60===30)aim(2.2)} // sinks to shooting height on the pink beat
  b.y=Math.max(60,Math.min(b.fy-b.h-8,b.y));
}

/* ---------- drawing ---------- */
function drawMid(){
  const b=MB;if(!b||(b.st==='boom'&&b.t%4<2))return;
  const hurtC=b.inv>4&&!OPT.rf?'#fff':null,col=c=>hurtC||(OPT.hc?HCP.enemy:c),x=b.x,y=b.y,w=b.w,h=b.h,cx=x+w/2,cy=y+h/2;
  ctx.lineWidth=1.6;ctx.lineJoin='round';ctx.fillStyle='#0b0e24';
  if(b.kind==='sentry'){const c=col(PINK);glow(c,10);poly([cx,y,x+w,cy,cx,y+h,x,cy]);ctx.fill();ctx.stroke();
    ctx.save();ctx.translate(cx,cy);ctx.rotate(tick*.04);poly([0,-7,6,4,-6,4]);ctx.strokeStyle=col(GOLD);ctx.stroke();ctx.restore()}
  else if(b.kind==='press'){const c=col(ORG);glow(c,8);ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,y);ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1.6;
    ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+i*w/4,y+h-6);ctx.lineTo(x+i*w/4,y+h);ctx.stroke()}
    ctx.beginPath();ctx.arc(cx,y+10,4,0,6.283);ctx.strokeStyle=col(b.st==='warn'&&tick%6<3?GOLD:CRM);ctx.stroke()}
  else if(b.kind==='carrier'){const c=col(SKY);glow(c,8);poly([x,cy,x+10,y,x+w-10,y,x+w,cy,x+w-8,y+h,x+8,y+h]);ctx.fill();ctx.stroke();
    for(const d of[-1,1]){ctx.beginPath();ctx.ellipse(cx+d*16,y-3,9,2,0,0,6.283);ctx.strokeStyle=col(tick%4<2?CRM:SKY);ctx.stroke()}
    ctx.strokeStyle=col(GOLD);ctx.strokeRect(cx-6,y+h-6,12,6)}
  else if(b.kind==='clam'){const c=col(TEAL),open=b.st==='open'?Math.min(1,b.t/10)*(b.t>70?(80-b.t)/10:1):0;glow(c,8);
    ctx.beginPath();ctx.ellipse(cx,y+h,w/2,h*.55,0,Math.PI,6.283);ctx.closePath();ctx.fill();ctx.stroke(); // bottom shell
    ctx.save();ctx.translate(x,y+h);ctx.rotate(-open*.5);ctx.beginPath();ctx.ellipse(w/2,0,w/2,h*.6,0,Math.PI,6.283);ctx.closePath();ctx.fill();ctx.stroke();
    for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(i*w/5,-h*.45);ctx.lineWidth=.8;ctx.stroke()}ctx.restore();
    if(open>.2){ctx.beginPath();ctx.arc(cx,y+h-6,5,0,6.283);ctx.fillStyle=col(CRM);ctx.shadowColor=CRM;ctx.fill()}}
  else if(b.kind==='meteor'){const c=col(GOLD);glow(c,10);ctx.save();ctx.translate(cx,cy);ctx.rotate(tick*.05);
    const pts=[];for(let i=0;i<9;i++){const a=i/9*6.283,r=w/2*(i%2?.82:1);pts.push(Math.cos(a)*r,Math.sin(a)*r)}poly(pts);ctx.fill();ctx.stroke();ctx.restore();
    for(let i=1;i<4;i++){ctx.beginPath();ctx.arc(cx-Math.sign(b.vx||1)*i*7,cy-Math.sign(b.vy||1)*i*5,4-i,0,6.283);ctx.strokeStyle=col(ORG);ctx.stroke()}
    ctx.beginPath();ctx.arc(cx,cy,4,0,6.283);ctx.strokeStyle=col(b.st==='burst'&&tick%6<3?CORAL:CRM);ctx.stroke()}
  else if(b.kind==='pcore'){const sh=PHASE===1,c=col(sh?'#7fb2ff':PINK);glow(c,10);ctx.beginPath();ctx.arc(cx,cy,w/2,0,6.283);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,5,0,6.283);ctx.strokeStyle=col(CRM);ctx.stroke();
    if(sh){ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(cx,cy,w/2+6,tick*.05,tick*.05+6.283);ctx.strokeStyle=c;ctx.stroke();ctx.setLineDash([])}}
  ctx.shadowBlur=0;
}
function drawMidHUD(){
  if(!MB)return;text(MBN[MB.kind],VW-8,28,9,CRM,'right',0,150);bar(VW-8,8,Math.min(MB.shown,MB.hp),MB.max,MB.hp<=MB.max/2?CORAL:GOLD,true);
  if(MB.st==='intro')text(MBN[MB.kind],VW/2,110,18,ST.th.edge);
}
