// Voltline · entities.js · Run state, the player, moving platforms, crushers, wind and regular enemies.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- state ---------- */
let state='title',sel=0,P,E=[],PB=[],EB=[],PT=[],PU=[],B=null,arena=false,cp=0,camX=0,shake=0,deadT=0,gotT=0,clock=0,deaths=0,tick=0,EN=[28,28,28,28],gust=0,lastWin=0;
const stars=Array.from({length:70},()=>({x:Math.random()*VW*2,y:Math.random()*170,r:Math.random()<.2?1.4:.8}));
function spawnAll(){
  E=[];PU=[];
  for(const [t,x,y] of ST.spawns){
    if(t==='p'||t==='e'){PU.push({x:x*TS+3,y:(y+1)*TS-10,w:10,h:10,v:8,t:0,en:t==='e'});continue}
    const e={type:t,x:x*TS,y:0,w:t==='t'?16:14,h:14,vx:0,vy:0,dir:-1,t:Math.floor(Math.random()*60),hp:(t==='w'?3:t==='f'?2:4)+(hard?1:0),flash:0,onG:false};
    e.y=(y+1)*TS-e.h;e.y0=e.y;E.push(e);
  }
}
function groundY(tx){for(let y=0;y<H;y++)if(solid(tx,y))return y*TS;return 15*TS}
function resetRun(full){
  buildMap();spawnAll();PB=[];EB=[];PT=[];WARN=[];POP=[];B=null;arena=false;gust=0;rushWait=0;EN=[28,28,28,28];
  if(full){cp=0;clock=0;deaths=0}
  const w=P?P.wpn:0;
  P={x:ST.cps[cp]*TS,y:groundY(ST.cps[cp])-22,w:12,h:22,vx:0,vy:0,face:1,onG:false,climb:false,slide:0,hp:28,inv:60,charge:0,shootT:0,hurt:0,anim:0,mv:null,wpn:unlocked(w)?w:0};
  camX=Math.max(0,Math.min(W*TS-VW,P.x-VW/2));
}
buildMap();resetRun(true);

function burst(x,y,c,n=10,sp=2.5){for(let i=0;i<n;i++){const a=Math.random()*6.283,s=Math.random()*sp+.5;PT.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:20+Math.random()*20,c})}}
function onLadder(p){const cx=Math.floor((p.x+p.w/2)/TS);for(let ty=Math.floor(p.y/TS);ty<=Math.floor((p.y+p.h-1)/TS);ty++)if(tile(cx,ty)==='H')return true;return false}
function endSlide(){P.slide=0;P.y-=10;P.h=22}
function hurt(d){
  if(P.inv>0||state!=='play')return;
  if(hard)d=Math.ceil(d*1.5);P.hp-=d;P.inv=80;P.hurt=14;P.vy=-2;P.climb=false;if(P.slide&&rectFree(P.x,P.y-10,P.w,22))endSlide();
  snd(220,.18,'sawtooth',90,.06);shake=6;burst(P.x+6,P.y+10,ORG,6);
  if(P.hp<=0)die();
}
function die(){P.hp=0;state='dead';deadT=0;deaths++;snd(400,.6,'triangle',60,.08);for(let i=0;i<16;i++){const a=i/16*6.283;PT.push({x:P.x+6,y:P.y+11,vx:Math.cos(a)*2,vy:Math.sin(a)*2,l:70,c:i%2?MINT:ORG,orb:1})}}
function swap(d){let w=P.wpn;for(let i=0;i<4;i++){w=(w+d+4)%4;if(unlocked(w))break}if(w!==P.wpn){P.wpn=w;P.charge=0;PB=PB.filter(b=>b.k!=='o');snd(700,.06,'square',900,.03);POP.push({x:P.x+6,y:P.y-6,s:WPN[w].n,c:WPN[w].c,l:50})}}
function fire(){
  const w=P.wpn,y=P.y+(P.slide?5:9),x0=P.face>0?P.x+P.w+2:P.x-2;
  if(w===0){if(PB.filter(b=>b.k==='b').length>=3)return;PB.push({k:'b',w:0,x:x0,y,vx:P.face*5,vy:0,r:2.5,dmg:1});snd(880,.07,'square',1300,.03)}
  else{
    if(w===3){const o=PB.filter(b=>b.k==='o');if(o.length){if(o[0].mode==='orbit'){for(const b of o){b.mode='fly';b.vx=P.face*4.2}snd(500,.2,'triangle',1200,.05);P.shootT=14}return}}
    if(EN[w]<WPN[w].cost){snd(120,.08,'square',100,.03);return}
    if(w===1){if(PB.filter(b=>b.k==='p').length>=6)return;for(const vy of[-1.3,0,1.3])PB.push({k:'p',w:1,x:x0,y,vx:P.face*4.6,vy,r:2.5,dmg:1});snd(990,.09,'square',1500,.035)}
    if(w===2){if(PB.filter(b=>b.k==='a').length>=2)return;PB.push({k:'a',w:2,x:x0,y:y-2,vx:P.face*2.8,vy:-3.6,r:4,dmg:3,bounce:2});snd(260,.18,'sawtooth',520,.05)}
    if(w===3){for(let i=0;i<4;i++)PB.push({k:'o',w:3,mode:'orbit',ang:i*Math.PI/2,x:P.x,y:P.y,vx:0,vy:0,r:4,dmg:1,life:220,pierce:1});snd(400,.25,'triangle',800,.05)}
    EN[w]-=WPN[w].cost;
  }
  P.shootT=14;
}

/* ---------- player ---------- */
function updPlayer(){
  const p=P,L=K.left,R=K.right,U=K.up,D=K.down,cx=Math.floor((p.x+p.w/2)/TS);
  if(p.inv>0)p.inv--;if(p.shootT>0)p.shootT--;
  if(pr('next'))swap(1);if(pr('prev'))swap(-1);
  if(pr('fire'))fire();
  if(p.wpn===0){if(K.fire){p.charge++;if(p.charge===55)snd(520,.12,'triangle',1040,.05)}else{if(p.charge>=55){PB.push({k:'B',w:0,x:p.face>0?p.x+p.w+2:p.x-2,y:p.y+(p.slide?5:9),vx:p.face*5.5,vy:0,r:7,dmg:3,pierce:1});p.shootT=14;snd(180,.3,'sawtooth',700,.06)}p.charge=0}}
  if(p.hurt>0){p.hurt--;p.vx=-p.face*.9;p.vy=Math.min(p.vy+G,6);phys(p);envCheck();return}
  if(p.climb){
    p.vx=0;p.vy=((D?1:0)-(U?1:0))*1.3;p.x=cx*TS+TS/2-p.w/2;if(L)p.face=-1;if(R)p.face=1;
    if(pr('jump')){p.climb=false;p.vy=0}
    else{moveY(p,false);p.anim+=Math.abs(p.vy);
      const fy=Math.floor((p.y+p.h-2)/TS);
      if(p.onG)p.climb=false;
      else if(U&&tile(cx,fy)!=='H'){p.y=(fy+1)*TS-p.h;p.climb=false;p.vy=0;p.onG=true}
      else if(!onLadder(p))p.climb=false;}
    envCheck();return;
  }
  if(!p.slide&&((U&&onLadder(p))||(D&&p.onG&&tile(cx,Math.floor((p.y+p.h+2)/TS))==='H'))){p.climb=true;p.mv=null;p.vy=0;if(D&&!onLadder(p))p.y+=3;return}
  if(p.slide>0){
    p.slide--;p.vx=p.face*3.2;
    if(pr('jump')&&rectFree(p.x,p.y-10,p.w,22)){endSlide();p.vy=-5.2;p.mv=null;snd(330,.12,'square',660,.03)}
    else if(p.slide===0){if(rectFree(p.x,p.y-10,p.w,22))endSlide();else p.slide=1}
    if(tick%3===0)PT.push({x:p.x+(p.face>0?0:p.w),y:p.y+p.h-1,vx:-p.face*.8,vy:-.3,l:14,c:CRM});
  }else{
    const dir=(R?1:0)-(L?1:0);p.vx=dir*1.6;if(dir)p.face=dir;
    if(pr('jump')&&p.onG){if(D){p.slide=26;p.h=12;p.y+=10;snd(150,.12,'triangle',90,.04)}else{p.vy=-5.2;p.mv=null;snd(330,.12,'square',660,.03)}}
    if(!K.jump&&p.vy<-2)p.vy=-2;
  }
  p.vy=Math.min(p.vy+G,6);
  const was=p.onG;phys(p);
  if(ST.wind&&gust>0&&!arena&&!p.mv)push(p,p.onG?-.4:-.55);
  if(p.slide&&!p.onG&&rectFree(p.x,p.y-10,p.w,22))endSlide();
  if(p.onG&&!was){burst(p.x+6,p.y+p.h,VIO,4,1);snd(90,.06,'triangle',60,.03)}
  if(p.onG&&p.vx)p.anim++;
  envCheck();
}
function envCheck(){
  const p=P;
  if(p.y>H*TS+20){die();return}
  if(p.inv===0)for(let ty=Math.floor((p.y+3)/TS);ty<=Math.floor((p.y+p.h-1)/TS);ty++)for(let tx=Math.floor((p.x+2)/TS);tx<=Math.floor((p.x+p.w-2)/TS);tx++)if(tile(tx,ty)==='^'){die();return}
  for(const c of CR)if(p.x+p.w>c.cx-12&&p.x<c.cx+12&&p.y<c.bot){hurt(6);break}
  for(let i=ST.cps.length-1;i>cp;i--)if(p.x>ST.cps[i]*TS){cp=i;snd(660,.1,'triangle',990,.05);burst(ST.cps[i]*TS+8,13*TS,GOLD,12);break}
}

/* ---------- world: movers, crushers, wind ---------- */
function updWorld(){
  for(const m of MV){const a=tick/m.per*6.283+m.ph,nx=m.bx+Math.sin(a)*m.ax,ny=m.by+Math.sin(a)*m.ay;m.dx=nx-m.x;m.dy=ny-m.y;m.x=nx;m.y=ny}
  for(const c of CR){const t=(tick+c.ph)%160,prevB=c.bot;
    c.bot=t<60?40:t<80?40+(t%4<2?2:0):t<90?40+(t-80)*20:t<120?240:240-(t-120)*5;
    if(prevB<240&&c.bot>=240&&Math.abs(c.cx-camX-VW/2)<VW/2+20){shake=Math.max(shake,4);snd(70,.2,'square',40,.05);burst(c.cx,240,ORG,6,1.5)}}
  if(ST.wind){const t=tick%360;gust=t>=220?1:0;if(gust&&!arena&&tick%2===0)PT.push({x:camX+VW+4,y:Math.random()*220+10,vx:-5-Math.random()*3,vy:0,l:110,c:'rgba(207,224,255,.6)',wind:1})}
  for(const w of WARN){w.t--;if(w.t===0){EB.push({x:w.x,y:-6,vx:0,vy:4.6,r:4,c:GOLD});snd(900,.08,'sawtooth',300,.03)}}
  WARN=WARN.filter(w=>w.t>0);
}

/* ---------- enemies ---------- */
function updEnemies(){
  const px=P.x+P.w/2,py=P.y+P.h/2;
  for(const e of E){
    if(e.dead||Math.abs(e.x-camX-VW/2)>VW/2+40)continue;
    e.t++;if(e.flash)e.flash--;
    if(e.type==='w'){
      e.vx=e.dir*.6;e.vy=Math.min(e.vy+G,6);if(moveX(e))e.dir*=-1;moveY(e,false);
      if(e.onG){const ax=Math.floor((e.dir>0?e.x+e.w+1:e.x-1)/TS);if(!solid(ax,Math.floor((e.y+e.h+2)/TS)))e.dir*=-1}
      if(e.y>H*TS)e.dead=1;
    }else if(e.type==='f'){
      if(Math.abs(px-e.x)<150){e.x+=Math.sign(px-e.x-7)*.7;e.y0+=Math.sign(py-8-e.y0)*.25}
      e.y=e.y0+Math.sin(e.t*.07)*12;
    }else{
      e.aim=Math.atan2(py-(e.y+4),px-(e.x+8));
      if(e.t%(hard?80:110)===0&&Math.hypot(px-e.x,py-e.y)<230){EB.push({x:e.x+8+Math.cos(e.aim)*9,y:e.y+4+Math.sin(e.aim)*9,vx:Math.cos(e.aim)*2,vy:Math.sin(e.aim)*2,r:3});snd(300,.08,'square',200,.025)}
    }
    if(hit(e,P))hurt(3);
  }
}

