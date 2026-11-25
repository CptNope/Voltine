// Voltline · step.js · Projectiles, pickups, particles and the per-frame game step.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- shots, pickups ---------- */
function updShots(){
  for(const s of PB){
    if(s.k==='o'&&s.mode==='orbit'){s.ang+=.16;s.x=P.x+P.w/2+Math.cos(s.ang)*20;s.y=P.y+P.h/2+Math.sin(s.ang)*20;if(--s.life<=0){s.dead=1;continue}}
    else{if(s.k==='a')s.vy=Math.min(s.vy+.2,5);s.x+=s.vx;s.y+=s.vy;
      if(s.k==='a'&&s.vy>0&&solid(Math.floor(s.x/TS),Math.floor((s.y+s.r)/TS))&&!solid(Math.floor(s.x/TS),Math.floor((s.y-s.r)/TS))){if(s.bounce-->0){s.y=Math.floor((s.y+s.r)/TS)*TS-s.r;s.vy=-3.2;burst(s.x,s.y+s.r,GOLD,4,1)}else s.dead=1}
      if(s.x<camX-20||s.x>camX+VW+20||s.y>VH+20||s.y<-40||solid(Math.floor(s.x/TS),Math.floor(s.y/TS))){s.dead=1;continue}}
    if(s.k==='o')for(const e of EB)if(Math.hypot(e.x-s.x,e.y-s.y)<s.r+e.r+1){e.dead=1;burst(e.x,e.y,SKY,3,1)}
    if(B&&B.kind==='null'&&B.st==='p1'){for(const o of B.sh){if(o.hp<=0)continue;const q=orbPos(B,o);if(Math.hypot(q.x-s.x,q.y-s.y)<s.r+6){s.dead=1;o.hp-=s.dmg;o.fl=6;
      if(o.hp<=0){burst(q.x,q.y,CORAL,12);snd(150,.25,'sawtooth',50,.05)}else snd(1400,.04,'square',900,.02);break}}if(s.dead)continue}
    const r={x:s.x-s.r,y:s.y-s.r,w:s.r*2,h:s.r*2};
    for(const e of E){if(e.dead||!hit(r,e))continue;if(s.pierce&&e.flash>0)continue;
      if(e.type==='s'&&!e.open&&s.k!=='B'&&Math.sign(s.vx)===-e.dir&&Math.abs(s.vy)<2.5){if(!s.pierce){s.dead=1;burst(s.x,s.y,SKY,3,1);snd(1800,.04,'square',1200,.02)}break}e.hp-=s.dmg;e.flash=8;if(!s.pierce)s.dead=1;
      if(e.hp<=0){e.dead=1;burst(e.x+7,e.y+7,{w:GOLD,f:PINK,s:GOLD,h:ORG,g:'#e6efff'}[e.type]||CORAL,14);snd(150,.2,'sawtooth',50,.05);const r=Math.random();if(r<.3)PU.push({x:e.x+3,y:e.y,w:8,h:8,v:3,t:0,vy:-2,drop:1,en:r<.12})}
      else snd(600,.04,'square',400,.02);if(s.dead)break}
    if(!s.dead&&B&&B.st!=='drop'&&B.st!=='intro'&&B.st!=='boom'&&B.st!=='break'&&hit(r,B)){if(!s.pierce)s.dead=1;hitBoss(s)}
    if(s.k==='B'&&tick%2===0)PT.push({x:s.x,y:s.y,vx:-s.vx*.1,vy:0,l:10,c:MINT});
  }
  PB=PB.filter(s=>!s.dead);
  for(const s of EB){if(s.dead)continue;if(s.bub)s.vy+=.025;s.x+=s.vx;s.y+=s.vy;
    if(s.x<camX-30||s.x>camX+VW+30||s.y<-30||s.y>VH+20||solid(Math.floor(s.x/TS),Math.floor(s.y/TS))){s.dead=1;if(s.vy>3)burst(s.x,s.y,GOLD,5,1.5)}
    else if(hit({x:s.x-s.r,y:s.y-s.r,w:s.r*2,h:s.r*2},P)){s.dead=1;hurt(s.sp?3:2)}}
  EB=EB.filter(s=>!s.dead);
  for(const u of PU){u.t++;if(u.drop){u.vy=Math.min((u.vy||0)+G,4);u.vx=0;moveY(u,false);if(u.t>400)u.dead=1}
    if(hit(u,P)){u.dead=1;
      if(u.en){let w=P.wpn;if(w===0){let lo=99;for(let i=1;i<WPN.length;i++)if(unlocked(i)&&EN[i]<lo){lo=EN[i];w=i}}if(w)EN[w]=Math.min(28,EN[w]+u.v)}
      else P.hp=Math.min(28,P.hp+(hard?Math.ceil(u.v/2):u.v));
      snd(700,.15,'triangle',1400,.05);burst(u.x+4,u.y+4,u.en?GOLD:MINT,8,1.5)}}
  PU=PU.filter(u=>!u.dead);
}
function updParts(){for(const q of PT){q.x+=q.vx;q.y+=q.vy;if(!q.orb&&!q.wind)q.vy+=.05;q.l--}PT=PT.filter(q=>q.l>0);for(const q of POP){q.y-=.4;q.l--}POP=POP.filter(q=>q.l>0)}

/* ---------- main step ---------- */
const PAUSE_ITEMS=['resume','weapon','restart','settings','quit'];
const OPT_ITEMS=[{k:'mv',n:'Music volume'},{k:'sv',n:'Sound volume'},{k:'shake',n:'Screen shake'},{k:'rf',n:'Flashing and particles'},{k:'tc',n:'Charge shot'},{k:'as',n:'Assist'},{k:'back',n:'Back'}];
let pm=0,om=0,optsFrom='title',introT=0;
function openOpts(from){optsFrom=from;om=0;state='opts'}
function optChange(k,d){if(k==='mv'||k==='sv')OPT[k]=Math.max(0,Math.min(10,OPT[k]+d));else if(k==='as')OPT.as=(OPT.as+d+3)%3;else OPT[k]=OPT[k]?0:1;saveOpts()}
function optLabel(k){const v=OPT[k];return k==='mv'||k==='sv'?'■'.repeat(v)+'□'.repeat(10-v):k==='shake'?(v?'On':'Off'):k==='rf'?(v?'Reduced':'Full'):k==='tc'?(v?'Tap to toggle':'Hold'):k==='as'?['Off','Half damage','Invincible'][v]:''}
function startStage(i){S=i;rushIdx=0;rushWait=0;resetRun(true);state='play';introT=200;snd(440,.1,'square',880,.04)}
function step(){
  if(state==='route'){routeSlice();return}
  tick++;pollPad();if(pr('music'))togM();if(pr('sfx'))togS();
  if(state==='title'){if(pr('opts'))openOpts('title');if(pr('left')||pr('right')){hard=!hard;saveOpts();snd(600,.05,'square',0,.03)}if(pr('start')||pr('jump')){state='select';snd(440,.1,'square',880,.04)}camX=(tick*.4)%2000}
  else if(state==='select'){camX=(tick*.4)%2000;
    if(pr('left')){sel=sel<5?(sel+4)%5:sel===6?5:6;snd(600,.05,'square',0,.03)}if(pr('right')){sel=sel<5?(sel+1)%5:sel===5?6:5;snd(600,.05,'square',0,.03)}
    if(pr('down')&&sel<5){lastSel=sel;sel=5;snd(600,.05,'square',0,.03)}if(pr('up')&&sel>=5){sel=lastSel;snd(600,.05,'square',0,.03)}
    if(pr('opts'))openOpts('select');else if(pr('back')){state='title'}
    else if((pr('start')||pr('jump'))&&sel===6)enterEditor();else
    if(pr('start')||pr('jump')){const si=sel<5?CARD[sel]:4;if((si===3&&!coreOpen())||(si===4&&!save.cleared[3])){snd(110,.15,'square',90,.04);POP.push({x:sel===5?128:20+sel*90+42,y:sel===5?214:200,s:'LOCKED',c:CORAL,l:40})}else startStage(si)}}
  else if(state==='pause'){const n=PAUSE_ITEMS.length;
    if(pr('down')){pm=(pm+1)%n;snd(600,.04,'square',0,.03)}if(pr('up')){pm=(pm+n-1)%n;snd(600,.04,'square',0,.03)}
    if(pr('next')||(pm===1&&pr('right')))swap(1);if(pr('prev')||(pm===1&&pr('left')))swap(-1);
    if(pr('opts'))openOpts('pause');
    else if(pr('back'))state='play';
    else if(pr('start')||pr('jump')){const it=PAUSE_ITEMS[pm];
      if(it==='resume'||it==='weapon')state='play';
      else if(it==='restart'){resetRun(false);state='play'}
      else if(it==='settings')openOpts('pause');
      else if(it==='quit'){if(ST.custom)enterEditor();else{state='select';sel=S===4?5:Math.max(0,CARD.indexOf(S))}}}}
  else if(state==='opts'){const n=OPT_ITEMS.length,k=OPT_ITEMS[om].k;
    if(pr('down')){om=(om+1)%n;snd(600,.04,'square',0,.03)}if(pr('up')){om=(om+n-1)%n;snd(600,.04,'square',0,.03)}
    if(pr('back')||pr('opts')||(k==='back'&&(pr('jump')||pr('start'))))state=optsFrom;
    else{const d=pr('right')||pr('jump')||pr('start')?1:pr('left')?-1:0;if(d&&k!=='back'){optChange(k,d);snd(700,.05,'square',0,.04)}}}
  else if(state==='play'){
    if(ST.custom&&(pr('start')||pr('back'))){enterEditor()}else if(pr('start')||pr('back')){state='pause';pm=0}else if(pr('opts')){openOpts('pause')}else{
      clock++;updWorld();updPlayer();if(state==='play'){updEnemies();
      if(!arena&&P.x>(ARENA+3)*TS){arena=true;for(let y=0;y<15;y++)map[y][ARENA]='#';spawnBoss();snd(110,.5,'sawtooth',220,.06)}
      if(B)updBoss();else if(rushWait>0&&--rushWait===0){spawnBoss();snd(110,.5,'sawtooth',220,.06)}}if(state==='play'||state==='dead')updShots();
    }
  }else if(state==='dead'){deadT++;updWorld();if(deadT>90){resetRun(false);state='play'}}
  else if(state==='edit'){
    for(const k of['left','right','up','down'])edc.hold[k]=K[k]?(edc.hold[k]||0)+1:0;
    const rp=k=>pr(k)||(edc.hold[k]>14&&tick%3===0);
    if(rp('left'))edc.x--;if(rp('right'))edc.x++;if(rp('up'))edc.y--;if(rp('down'))edc.y++;
    edc.x=Math.max(1,Math.min(W-1,edc.x));edc.y=Math.max(0,Math.min(H-1,edc.y));
    if(pr('next'))edc.tool=(edc.tool+1)%TOOLS.length;if(pr('prev'))edc.tool=(edc.tool+TOOLS.length-1)%TOOLS.length;
    const k=TOOLS[edc.tool][0],tileT=' #^H><~'.includes(k);
    if(tileT?K.jump:pr('jump')){edCell(edc.x,edc.y,edc.tool);edRefresh()}
    if(K.fire){edCell(edc.x,edc.y,TOOLS.length-1);edRefresh()}
    if(routeMsg&&routeMsg.t>0)routeMsg.t--;
    if(pr('route'))routeStart();else if(pr('start'))edTest();else if(pr('back')){saveED();state='select';sel=6}
    if(edc.dirty&&tick%60===0){edc.dirty=0;saveED()}
    const t=Math.max(0,Math.min(W*TS-VW,edc.x*TS+8-VW/2));camX+=(t-camX)*.25}
  else if(state==='got'){gotT++;if(gotT>60&&(pr('start')||pr('jump'))){if(ST.custom){enterEditor();return}state='select';if(ST.rush)sel=5;else{sel=CARD.findIndex(i=>!save.cleared[i]&&(i!==3||coreOpen()));if(sel<0)sel=0}}}
  if(state==='play'||state==='dead'||state==='pause'){const t=arena?ARENA*TS:Math.max(0,Math.min(W*TS-VW,P.x+P.w/2-VW/2+P.face*24));camX+=(t-camX)*(arena?.08:.18)}
  if(introT>0&&state==='play')introT--;if(!OPT.shake)shake=0;
  updParts();if(shake>0)shake*=.85;if(shake<.3)shake=0;
  if(!silent)setTrack(state==='title'||state==='select'||state==='edit'||(state==='opts'&&optsFrom!=='pause')?'menu':state==='play'||state==='dead'?(ST.rush?(rushIdx===RUSH.length-1?'final':'boss'):B&&B.st!=='boom'?(ST.final?'final':'boss'):arena?null:ST.key):null);
  const ev=state==='edit';if(edp.hidden===ev)edp.hidden=!ev;
  Object.assign(prev,K);
}

