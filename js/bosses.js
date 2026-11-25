// Voltline · bosses.js · Boss spawning, the four boss behaviours and stage-clear handling.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- bosses ---------- */
const AL=()=> (ARENA+1)*TS, AR=()=>(W-2)*TS;
function spawnBoss(){
  bossHurt=false;bossT0=clock;
  const k=ST.rush?RUSH[rushIdx]:ST.kind;B={kind:k,x:(W-9)*TS,y:-50,w:28,h:34,vx:0,vy:0,hp:28,shown:0,st:'drop',t:0,face:-1,inv:0,onG:false};
  if(k==='hound'){B.w=34;B.h=22}
  if(k==='kite'){B.w=32;B.h=20;B.y=-30}
  if(ST.rush)for(let y=12;y<=14;y++)for(let x=3;x<=30;x++)map[y][x]=k==='undertow'?'~':' '; // flood the rush arena for Undertow only
  if(k==='undertow'){B.w=26;B.h=18;B.x=(AL()+AR())/2-13;B.y=250;B.st='intro';B.trail=[]}
  if(k==='null'){B.w=40;B.h=40;B.x=AR()-90;B.y=160;B.st='intro';B.ph=1;B.sh=[0,1,2,3].map(i=>({a:i*Math.PI/2,hp:3,fl:0}))}
}
const orbPos=(b,o)=>({x:b.x+20+Math.cos(o.a)*34,y:b.y+20+Math.sin(o.a)*34});
function aimFire(n,spread,sp,ox,oy,c){const a0=Math.atan2(P.y+11-oy,P.x+6-ox);for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*spread;EB.push({x:ox,y:oy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:3.5,c})}snd(240,.15,'sawtooth',120,.05)}
function hitBoss(s){
  if(B.inv>0)return;const weak=WEAK[B.kind]===s.w;B.hp-=(weak?4:B.kind==='null'&&s.w>0?s.dmg+1:s.dmg)*(hard?.7:1);B.inv=weak?24:B.kind==='null'?16:10;
  if(weak)ach('weak');if(!OPT.rf)hitStop=weak?4:2;snd(weak?300:500,.08,'square',weak?120:250,.05);snd(90,.08,'square',55,.05);burst(s.x,s.y,weak?GOLD:CRM,weak?10:5);if(weak){POP.push({x:B.x+B.w/2,y:B.y-4,s:'WEAK!',c:GOLD,l:40});shake=5}
  if(B.hp<=0){logEv({e:'boss',k:B.kind,d:clock-bossT0});B.hp=0;B.st='boom';B.t=0;if(!OPT.rf)hitStop=10;if(!bossHurt)ach('flawless')}
}
function updBoss(){
  const b=B;b.t++;if(b.inv)b.inv--;if(b.shown<b.hp&&tick%2===0)b.shown++;
  if(b.st==='boom'){if(b.t%6===0){burst(b.x+Math.random()*b.w,b.y+Math.random()*b.h,[MINT,PINK,GOLD][b.t%3],8,3);snd(120+Math.random()*80,.15,'sawtooth',40,.05);shake=4}
    if(b.t>110){B=null;EB=[];WARN=[];
      if(ST.rush&&rushIdx<RUSH.length-1){rushIdx++;rushWait=110;const cx=(AL()+AR())/2;PU.push({x:cx-30,y:120,w:10,h:10,v:14,t:0,vy:-1,drop:1},{x:cx+20,y:120,w:10,h:10,v:14,t:0,vy:-1,drop:1,en:1});POP.push({x:cx,y:110,s:'NEXT: '+BN[RUSH[rushIdx]],c:GOLD,l:100})}
      else winStage()}return}
  if(b.kind==='kite'||b.kind==='null'||b.kind==='undertow'){({kite:updKite,null:updNull,undertow:updUndertow})[b.kind](b);if(B&&hit(b,P))hurt(4);return}
  b.vy=Math.min(b.vy+G,7);
  if(b.st==='drop'){moveY(b,false);if(b.onG){shake=10;snd(80,.3,'sawtooth',40,.08);b.st='intro';b.t=0}return}
  if(b.st==='intro'){if(b.t>60){b.st='idle';b.t=0}return}
  if(b.kind==='warden')updWarden(b);else updHound(b);
  if(hit(b,P))hurt(4);
}
function updWarden(b){
  const enr=b.hp<=14;
  if(b.st==='idle'){b.vx=0;b.face=P.x<b.x?-1:1;
    if(b.t>(enr?28:48)){const r=Math.floor(Math.random()*3);b.t=0;
      if(r===0){b.st='hop';b.vy=-6.2;b.vx=b.face*Math.min(2.6,Math.max(1,Math.abs(P.x-b.x)/50))}else b.st=r===1?'spread':'dash'}}
  else if(b.st==='hop'){if(b.onG&&b.t>5){shake=5;b.st='idle';b.t=0;if(enr)EB.push({x:b.x,y:b.y+28,vx:-2.4,vy:0,r:4,c:GOLD},{x:b.x+28,y:b.y+28,vx:2.4,vy:0,r:4,c:GOLD})}}
  else if(b.st==='spread'){b.vx=0;if(b.t===18)aimFire(enr?7:5,.28,2.3,b.x+14,b.y+12);if(enr&&b.t===42)aimFire(4,.34,2.8,b.x+14,b.y+12);if(b.t>60){b.st='idle';b.t=0}}
  else if(b.st==='dash'){b.vx=b.t<26?0:b.face*4.6;if(b.t<26&&b.t%4===0)PT.push({x:b.x+14,y:b.y+34,vx:-b.face*1.5,vy:-.5,l:12,c:CORAL})}
  const wall=moveX(b);moveY(b,false);
  if(b.st==='dash'&&b.t>26&&wall){shake=8;snd(90,.2,'square',50,.06);b.st='idle';b.t=0;burst(b.face>0?b.x+28:b.x,b.y+17,GOLD,10)}
}
function updHound(b){
  const enr=b.hp<=14;
  if(b.st==='idle'){b.vx=0;b.face=P.x<b.x?-1:1;
    if(b.t>(enr?24:42)){const r=Math.floor(Math.random()*(enr?4:3.4));b.t=0;b.bounced=0;
      b.st=['pounce','sparks','run','storm'][Math.min(3,r)];if(b.st==='pounce'){b.vy=-5.6;b.vx=b.face*Math.min(3,Math.max(1.2,Math.abs(P.x-b.x)/45))}}}
  else if(b.st==='pounce'){if(b.onG&&b.t>4){shake=4;snd(90,.1,'square',60,.04);b.st='idle';b.t=0}}
  else if(b.st==='sparks'){b.vx=0;if(b.t===12||b.t===32||(enr&&b.t===52)){EB.push({x:b.face>0?b.x+b.w:b.x,y:234,vx:b.face*2.6,vy:0,r:4,c:GOLD,sp:1});snd(1200,.1,'sawtooth',400,.04)}if(b.t>70){b.st='idle';b.t=0}}
  else if(b.st==='run'){b.vx=b.t<18?0:b.face*4.2;if(b.t<18&&b.t%3===0)PT.push({x:b.x+17,y:b.y+22,vx:-b.face,vy:-.6,l:10,c:GOLD})}
  else if(b.st==='storm'){b.vx=0;if(b.t===1){b.vy=-6.5;snd(150,.4,'sawtooth',600,.05)}
    if(b.t===26){for(let i=0;i<(enr?6:4);i++)WARN.push({x:AL()+20+Math.random()*(AR()-AL()-40),t:40+i*6});WARN.push({x:P.x+6,t:44})}
    if(b.t>120&&b.onG){b.st='idle';b.t=0}}
  const wall=moveX(b);moveY(b,false);
  if(b.st==='run'&&b.t>18&&wall){shake=6;snd(90,.2,'square',50,.06);burst(b.face>0?b.x+b.w:b.x,b.y+11,GOLD,8);if(!b.bounced){b.bounced=1;b.face*=-1}else{b.st='idle';b.t=0}}
}
function updKite(b){
  const enr=b.hp<=14,cx=(AL()+AR())/2-16;b.face=P.x<b.x+16?-1:1;
  if(b.st==='drop'){b.y+=1.4;b.x+=(cx+80-b.x)*.05;if(b.y>=150){b.st='intro';b.t=0;snd(300,.4,'triangle',900,.06)}return}
  if(b.st==='intro'){if(b.t>60){b.st='cruise';b.t=0}return}
  if(b.st==='cruise'){const tx=cx+Math.sin(b.t*.025)*150;b.x+=(tx-b.x)*.05;b.y+=(160+Math.sin(b.t*.08)*12-b.y)*.1;
    if(b.t%(enr?28:42)===20)aimFire(3,.3,2.4,b.x+16,b.y+16,SKY);
    if(b.t>110){const r=Math.random();b.st=r<.45?'dive':r<.8?'gust':'cruise';b.t=0;b.gx=P.x<cx+16?AR()-44:AL()+12}}
  else if(b.st==='dive'){if(b.t<20){b.x+=Math.sin(b.t)*1.5}else{if(b.t===20){const dx=P.x-b.x-10,dy=P.y-b.y,d=Math.hypot(dx,dy)||1;b.dvx=dx/d*(enr?5:4.2);b.dvy=dy/d*(enr?5:4.2);snd(600,.3,'sawtooth',150,.05)}
    b.x+=b.dvx;b.y+=b.dvy;if(b.y>=214||b.t>90){b.y=Math.min(b.y,214);b.st='rise';b.t=0;if(enr)aimFire(5,.5,2.2,b.x+16,b.y+10,PINK)}}}
  else if(b.st==='rise'){b.y-=2;if(b.y<=162){b.st='cruise';b.t=0}}
  else if(b.st==='gust'){b.x+=(b.gx-b.x)*.06;b.y+=(140-b.y)*.06;
    if(b.t>40&&b.t<150){const d=Math.sign(P.x-b.x)||1;push(P,d*.95);if(tick%2===0)PT.push({x:b.x+16,y:b.y+10+Math.random()*200,vx:d*(5+Math.random()*2),vy:0,l:60,c:'rgba(127,216,255,.7)',wind:1});if(b.t%35===0)aimFire(2,.25,2.6,b.x+16,b.y+14,SKY)}
    if(b.t>160){b.st='cruise';b.t=0}}
  b.x=Math.max(AL(),Math.min(AR()-b.w,b.x));
}
function updNull(b){
  const cx=(AL()+AR())/2-20,enr=b.hp<=7;
  if(b.st==='intro'){if(b.t===1)snd(60,1,'sawtooth',200,.07);if(b.t>70){b.st='p1';b.t=0}return}
  if(b.st==='p1'){
    for(const o of b.sh){o.a+=.025;if(o.fl)o.fl--;if(o.hp>0){const q=orbPos(b,o);if(Math.hypot(q.x-P.x-6,q.y-P.y-11)<13)hurt(3)}}
    if(b.t%70===35)aimFire(3,.25,2.4,b.x+20,b.y+20,CORAL);
    if(b.t%220===150){for(let i=0;i<4;i++)WARN.push({x:AL()+20+Math.random()*(AR()-AL()-40),t:40+i*8});WARN.push({x:P.x+6,t:46})}
    if(b.t%260===100&&E.filter(e=>!e.dead&&e.minion).length<2)E.push({type:'f',minion:1,x:b.x+12,y:b.y-30,y0:b.y-30,w:14,h:14,vx:0,vy:0,dir:-1,t:0,hp:2,flash:0});
    if(b.hp<=14){b.ph=2;b.st='break';b.t=0;for(const o of b.sh)if(o.hp>0){const q=orbPos(b,o);burst(q.x,q.y,CORAL,10);o.hp=0}shake=12;snd(50,1,'sawtooth',30,.08);EB=[];WARN=[]}
    return}
  if(b.st==='break'){b.x+=Math.sin(b.t*1.3)*1.2;if(b.t%8===0)burst(b.x+Math.random()*40,b.y+Math.random()*40,['#e8e8ff',CORAL][b.t%2],5,2);if(b.t>70){b.st='float';b.t=0;POP.push({x:b.x+20,y:b.y-6,s:'CORE EXPOSED',c:CORAL,l:60})}}
  else if(b.st==='float'){b.x+=(cx+Math.sin(b.t*.03)*140-b.x)*.05;b.y+=(126+Math.sin(b.t*.09)*16-b.y)*.08;
    if(b.t%(enr?32:46)===20)aimFire(enr?5:3,.26,2.5,b.x+20,b.y+20,CORAL);
    if(b.t>150){const r=Math.random();b.st=r<.4?'slam':r<.7?'spread':'storm';b.t=0}}
  else if(b.st==='slam'){if(b.t<22)b.x+=(P.x-14-b.x)*.08;else{b.y+=6;if(b.y>=198){b.y=198;shake=10;snd(70,.3,'square',40,.07);
      EB.push({x:b.x,y:234,vx:-2.8,vy:0,r:4,c:GOLD,sp:1},{x:b.x+40,y:234,vx:2.8,vy:0,r:4,c:GOLD,sp:1});burst(b.x+20,238,GOLD,12);b.st='rise';b.t=0}}}
  else if(b.st==='rise'){b.y-=2;if(b.y<=128){b.st='float';b.t=0}}
  else if(b.st==='spread'){if(b.t===15||b.t===38||(enr&&b.t===60))aimFire(7,.26,2.6,b.x+20,b.y+20,PINK);if(b.t>75){b.st='float';b.t=0}}
  else if(b.st==='storm'){if(b.t===10){for(let i=0;i<(enr?7:5);i++)WARN.push({x:AL()+20+Math.random()*(AR()-AL()-40),t:36+i*6});WARN.push({x:P.x+6,t:40})}if(b.t>100){b.st='float';b.t=0}}
  b.x=Math.max(AL(),Math.min(AR()-b.w,b.x));
}
function updUndertow(b){
  const enr=b.hp<=14,surf=12*TS,deep=surf+14,cx=(AL()+AR())/2-13;
  b.trail.unshift({x:b.x+13,y:b.y+9});if(b.trail.length>70)b.trail.pop();
  if(b.st==='intro'){b.y+=(deep-b.y)*.04;if(b.t===1){snd(70,1.2,'sawtooth',140,.07);shake=6}if(b.t>80){b.st='swim';b.t=0}return}
  if(b.st==='swim'){const tx=Math.max(AL()+60,Math.min(AR()-86,P.x-13));b.x+=Math.max(-1.6,Math.min(1.6,tx-b.x))*(enr?1.4:1);b.y+=(deep+Math.sin(b.t*.1)*4-b.y)*.1;b.face=P.x<b.x?-1:1;
    if(b.t>(enr?55:85)){const r=Math.random();b.st=r<.5?'leap':r<.8||!enr?'spit':'whirl';b.t=0}}
  else if(b.st==='leap'){if(b.t===1){b.vx=(b.x<cx?1:-1)*3;b.vy=-6.4;snd(300,.3,'sawtooth',900,.05);burst(b.x+13,surf,SKY,10,2)}
    b.x+=b.vx;b.y+=b.vy;const was=b.vy;b.vy+=.15;b.face=Math.sign(b.vx)||1;
    if(enr&&was<0&&b.vy>=0)aimFire(3,.3,2.3,b.x+13,b.y+9,TEAL);
    if(b.x<AL()+20||b.x>AR()-46)b.vx=0;
    if(b.vy>0&&b.y>=deep){b.y=deep;shake=7;snd(120,.3,'square',60,.06);burst(b.x+13,surf,SKY,14,2.5);b.st='swim';b.t=0}}
  else if(b.st==='spit'){b.y+=(surf-14-b.y)*.1;b.face=P.x<b.x?-1:1;
    if(b.t===24||b.t===48||(enr&&b.t===72)){for(let i=-1;i<=1;i++)EB.push({x:b.x+13,y:b.y+6,vx:b.face*1.5+i*.5,vy:-1.6,r:5,c:SKY,bub:1});snd(500,.12,'triangle',250,.04)}
    if(b.t>95){b.st='swim';b.t=0}}
  else if(b.st==='whirl'){b.y+=(surf-10-b.y)*.1;if(b.t>20&&b.t<130){push(P,Math.sign(b.x+13-P.x-6)*.7);if(tick%3===0){const a=Math.random()*6.283;PT.push({x:b.x+13+Math.cos(a)*60,y:surf+4+Math.sin(a)*10,vx:-Math.cos(a)*1.5,vy:0,l:30,c:'rgba(127,216,255,.6)',wind:1})}}
    if(b.t>140){b.st='swim';b.t=0}}
}
function winStage(){
  if(ST.custom){ach('maker');lastWin={custom:1};state='got';gotT=0;snd(523,.2,'square',0,.05);setTimeout(()=>snd(784,.5,'square',0,.05),200);return}
  if(ST.rush){ach('rush');if(hard)ach('rush_hard');const i=hard?1:0,pb=!OPT.as&&(!save.rush[i]||clock<save.rush[i]);if(pb)save.rush[i]=clock;persist();lastWin={rush:1,pb};state='got';gotT=0;snd(523,.2,'square',0,.05);setTimeout(()=>snd(784,.5,'square',0,.05),200);return}
  logEv({e:'clear',t:clock,d:deaths});split(ST.cps.length);const first=!save.cleared[S];save.cleared[S]=1;const bt=hard?save.bestH:save.best;if(!OPT.as&&(!bt[S]||clock<bt[S])){bt[S]=clock;saveSplits()}persist();
  ach('first_clear');if(deaths===0)ach('no_reboot');if(save.cleared[0]&&save.cleared[1]&&save.cleared[2]&&save.cleared[5])ach('all_wardens');
  if([1,2,3,4].every(unlocked))ach('all_weapons');if(S===3){ach('core');if(hard)ach('hard_core')}if(S===0&&clock<150*60)ach('speed');
  lastWin={first,w:WFROM.indexOf(S),all:coreOpen(),fin:!!ST.final};state='got';gotT=0;snd(523,.2,'square',0,.05);setTimeout(()=>snd(659,.2,'square',0,.05),180);setTimeout(()=>snd(784,.4,'square',0,.05),360);
}

