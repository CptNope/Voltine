// Voltline · step.js · Projectiles, pickups, particles and the per-frame game step.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- shots, pickups ---------- */
function updShots(){
  for(const s of PB){
    if(s.k==='o'&&s.mode==='orbit'){s.ang+=.16;s.x=P.x+P.w/2+Math.cos(s.ang)*20;s.y=P.y+P.h/2+Math.sin(s.ang)*20;if(--s.life<=0){s.dead=1;continue}}
    else if(s.k==='d'){s.t++;if(s.t<24)s.vx*=.97;else{const dx=P.x+P.w/2-s.x,dy=P.y+P.h/2-s.y,d=Math.hypot(dx,dy)||1;s.vx=dx/d*5.5;s.vy=dy/d*5.5;if(d<10||s.t>240){s.dead=1;continue}}s.x+=s.vx;s.y+=s.vy}
    else{if(s.k==='a')s.vy=Math.min(s.vy+.2,5);if(s.k==='c'&&s.echo>0&&--s.echo===0)PB.push({k:'c',w:6,x:s.ox,y:s.oy,vx:s.vx,vy:0,r:3,dmg:1});s.x+=s.vx;s.y+=s.vy;
      if(s.k==='a'&&s.vy>0&&solid(Math.floor(s.x/TS),Math.floor((s.y+s.r)/TS))&&!solid(Math.floor(s.x/TS),Math.floor((s.y-s.r)/TS))){if(s.bounce-->0){s.y=Math.floor((s.y+s.r)/TS)*TS-s.r;s.vy=-3.2;burst(s.x,s.y+s.r,GOLD,4,1)}else s.dead=1}
      if(s.x<camX-20||s.x>camX+VW+20||s.y>VH+20||s.y<-40||solid(Math.floor(s.x/TS),Math.floor(s.y/TS))){s.dead=1;continue}}
    if(s.k==='o')for(const e of EB)if(Math.hypot(e.x-s.x,e.y-s.y)<s.r+e.r+1){e.dead=1;burst(e.x,e.y,SKY,3,1)}
    if(B&&B.kind==='null'&&B.st==='p1'){for(const o of B.sh){if(o.hp<=0)continue;const q=orbPos(B,o);if(Math.hypot(q.x-s.x,q.y-s.y)<s.r+6){s.dead=1;o.hp-=s.dmg;o.fl=6;
      if(o.hp<=0){burst(q.x,q.y,CORAL,12);snd(150,.25,'sawtooth',50,.05)}else snd(1400,.04,'square',900,.02);break}}if(s.dead)continue}
    const r={x:s.x-s.r,y:s.y-s.r,w:s.r*2,h:s.r*2};
    for(const e of E){if(e.dead||!hit(r,e))continue;if(s.pierce&&e.flash>0)continue;
      if(e.type==='s'&&!e.open&&s.k!=='B'&&Math.sign(s.vx)===-e.dir&&Math.abs(s.vy)<2.5){if(!s.pierce){s.dead=1;burst(s.x,s.y,SKY,3,1);snd(1800,.04,'square',1200,.02)}break}e.hp-=s.dmg;e.flash=8;if(!s.pierce)s.dead=1;
      if(e.hp<=0){e.dead=1;stat('kills');if(s.k==='B')ach('charged');if(e.type==='s')ach('shield');if(e.type==='j')ach('jelly');burst(e.x+7,e.y+7,{w:GOLD,f:PINK,s:GOLD,h:ORG,g:'#e6efff'}[e.type]||CORAL,14);snd(150,.2,'sawtooth',50,.05);const r=Math.random();if(r<.3)PU.push({x:e.x+3,y:e.y,w:8,h:8,v:3,t:0,vy:-2,drop:1,en:r<.12})}
      else snd(600,.04,'square',400,.02);if(s.dead)break}
    if(!s.dead&&MB&&hit(r,MB))hitMid(s);
    if(!s.dead&&B&&B.st!=='drop'&&B.st!=='intro'&&B.st!=='boom'&&B.st!=='break'&&hit(r,B)){if(!s.pierce)s.dead=1;hitBoss(s)}
    if(s.k==='B'&&tick%2===0)PT.push({x:s.x,y:s.y,vx:-s.vx*.1,vy:0,l:10,c:MINT});
  }
  PB=PB.filter(s=>!s.dead);
  for(const s of EB){if(s.dead)continue;if(s.bub)s.vy+=.025;if(s.grav)s.vy+=.2;s.x+=s.vx;s.y+=s.vy;
    if(s.x<camX-30||s.x>camX+VW+30||s.y<-30||s.y>VH+20||solid(Math.floor(s.x/TS),Math.floor(s.y/TS))){s.dead=1;if(s.vy>3)burst(s.x,s.y,GOLD,5,1.5)}
    else if(hit({x:s.x-s.r,y:s.y-s.r,w:s.r*2,h:s.r*2},P)){s.dead=1;hurt(s.sp?3:2)}}
  EB=EB.filter(s=>!s.dead);
  for(const u of PU){u.t++;if(u.drop){u.vy=Math.min((u.vy||0)+G,4);u.vx=0;moveY(u,false);if(u.t>400)u.dead=1}
    if(hit(u,P)){u.dead=1;stat('pickups');
      if(u.en){let w=P.wpn;if(w===0){let lo=99;for(let i=1;i<WPN.length;i++)if(unlocked(i)&&EN[i]<lo){lo=EN[i];w=i}}if(w)EN[w]=Math.min(28,EN[w]+u.v)}
      else P.hp=Math.min(28,P.hp+(hard?Math.ceil(u.v/2):u.v));
      snd(700,.15,'triangle',1400,.05);burst(u.x+4,u.y+4,u.en?GOLD:MINT,8,1.5)}}
  PU=PU.filter(u=>!u.dead);
}
function updParts(){for(const q of PT){q.x+=q.vx;q.y+=q.vy;if(!q.orb&&!q.wind)q.vy+=.05;q.l--}PT=PT.filter(q=>q.l>0);for(const q of POP){q.y-=.4;q.l--}POP=POP.filter(q=>q.l>0)}

/* ---------- main step ---------- */
const PAUSE_ITEMS=['resume','weapon','restart','settings','quit'];
const OPT_ITEMS=[{k:'mv',n:'Music volume'},{k:'sv',n:'Sound volume'},{k:'shake',n:'Screen shake'},{k:'rf',n:'Flashing and particles'},{k:'hc',n:'High contrast'},{k:'big',n:'Text size'},{k:'tc',n:'Charge shot'},{k:'af',n:'Auto-fire'},{k:'hs',n:'Hold jump to swim'},{k:'as',n:'Assist'},{k:'spd',n:'Game speed'},{k:'keys',n:'Controls'},{k:'back',n:'Back'}];
let kr=0,kc=0; // controls screen: row and column (0 keyboard, 1 gamepad)
let pm=0,om=0,optsFrom='title',introT=0;
function openOpts(from){optsFrom=from;om=0;state='opts'}
function optChange(k,d){if(k==='mv'||k==='sv')OPT[k]=Math.max(0,Math.min(10,OPT[k]+d));else if(k==='as'||k==='spd')OPT[k]=(OPT[k]+d+3)%3;else OPT[k]=OPT[k]?0:1;saveOpts()}
function optLabel(k){const v=OPT[k];return k==='mv'||k==='sv'?'■'.repeat(v)+'□'.repeat(10-v):k==='shake'?(v?'On':'Off'):k==='rf'?(v?'Reduced':'Full'):k==='tc'?(v?'Tap to toggle':'Hold'):k==='as'?['Off','Half damage','Invincible'][v]:k==='spd'?['100%','75%','50%'][v]:k==='af'||k==='hs'||k==='hc'?(v?'On':'Off'):k==='big'?(v?'Large':'Normal'):k==='keys'?'Change ›':''}
let hitStop=0,camLook=0; // hit-stop freezes gameplay for a few frames on boss hits; camLook eases the camera's lead
function startStage(i){S=i;rushIdx=0;rushWait=0;runSplits=[];resetRun(true);state='play';introT=200;snd(440,.1,'square',880,.04)}
function step(){
  if(state==='route'){routeSlice();return}
  tick++;pollPad();if(pr('music'))togM();if(pr('sfx'))togS();
  if(state==='title'&&pendingShared&&(pr('start')||pr('jump'))){const L=pendingShared;pendingShared=null;playShared(L,'title');snd(440,.1,'square',880,.04)}
  else if(state==='title'){if(pr('opts'))openOpts('title');if(pr('left')||pr('right')){hard=!hard;saveOpts();snd(600,.05,'square',0,.03)}if(pr('start')||pr('jump')){state='select';snd(440,.1,'square',880,.04)}camX=(tick*.4)%2000}
  else if(state==='select'){camX=(tick*.4)%2000;
    const NC=CARD.length,bi=BAR.indexOf(sel),go=pr('start')||pr('jump'),beep=()=>snd(600,.05,'square',0,.03);
    if(pr('left')){sel=sel<NC?(sel+NC-1)%NC:BAR[(bi+3)%4];beep()}if(pr('right')){sel=sel<NC?(sel+1)%NC:BAR[(bi+1)%4];beep()}
    if(pr('down')){if(sel<4){sel=Math.min(sel+4,NC-1);beep()}else if(sel<NC){lastSel=sel;sel=B_RUSH;beep()}}
    if(pr('up')){if(sel>=B_RUSH){sel=lastSel;beep()}else if(sel>=4&&sel<NC){sel-=4;beep()}}
    if(pr('opts'))openOpts('select');else if(pr('back')){state='title'}
    else if(go&&sel===B_EDIT)enterEditor();
    else if(go&&sel===B_REC){state='records';recPage=0}
    else if(go&&sel===B_GAL){state='gallery';gsel=0;loadGallery()}
    else if(go){const si=sel<NC?CARD[sel]:4;if((si===3&&!coreOpen())||(si===4&&!save.cleared[3])){snd(110,.15,'square',90,.04);const r=sel<NC?cardRect(sel):{x:20,y:200,w:106};POP.push({x:r.x+r.w/2,y:r.y+(sel<NC?40:14),s:'LOCKED',c:CORAL,l:40})}else startStage(si)}}
  else if(state==='pause'){const n=PAUSE_ITEMS.length;
    if(pr('down')){pm=(pm+1)%n;snd(600,.04,'square',0,.03)}if(pr('up')){pm=(pm+n-1)%n;snd(600,.04,'square',0,.03)}
    if(pr('next')||(pm===1&&pr('right')))swap(1);if(pr('prev')||(pm===1&&pr('left')))swap(-1);
    if(pr('opts'))openOpts('pause');
    else if(pr('back'))state='play';
    else if(pr('start')||pr('jump')){const it=PAUSE_ITEMS[pm];
      if(it==='resume'||it==='weapon')state='play';
      else if(it==='restart'){resetRun(false);state='play'}
      else if(it==='settings')openOpts('pause');
      else if(it==='quit'){if(ST.custom)enterEditor();else{state='select';sel=S===4?B_RUSH:Math.max(0,CARD.indexOf(S))}}}}
  else if(state==='opts'){const n=OPT_ITEMS.length,k=OPT_ITEMS[om].k;
    if(pr('down')){om=(om+1)%n;snd(600,.04,'square',0,.03)}if(pr('up')){om=(om+n-1)%n;snd(600,.04,'square',0,.03)}
    if(pr('back')||pr('opts')||(k==='back'&&(pr('jump')||pr('start'))))state=optsFrom;
    else if(k==='keys'){if(pr('right')||pr('jump')||pr('start')){state='keys';kr=0;kc=0;bindMsg=null}}
    else{const d=pr('right')||pr('jump')||pr('start')?1:pr('left')?-1:0;if(d&&k!=='back'){optChange(k,d);snd(700,.05,'square',0,.04)}}}
  else if(state==='keys'){const n=BIND_ACTS.length+2;
    if(bindMsg&&bindMsg.t>0)bindMsg.t--;
    if(!capture){
      if(pr('down')){kr=(kr+1)%n;snd(600,.04,'square',0,.03)}if(pr('up')){kr=(kr+n-1)%n;snd(600,.04,'square',0,.03)}
      if(pr('left')||pr('right')){kc=1-kc;snd(600,.04,'square',0,.03)}
      if(pr('back'))state='opts';
      else if(pr('start')||pr('jump')){
        if(kr===n-1)state='opts';else if(kr===n-2){resetBinds();snd(500,.1,'square',0,.04)}
        else{const act=BIND_ACTS[kr][0];if(kc===1&&!(act in DEF_PAD))bindMsg={t:150,s:actName(act)+' uses the D-pad or stick on a gamepad'};else{capture={kind:kc?'pad':'key',act};snd(800,.05,'square',0,.04)}}}}}
  else if(state==='play'){
    if(ST.custom&&(pr('start')||pr('back'))){if(sharedMode){const b=endShared();state=b==='gallery'?'gallery':'title'}else enterEditor()}else if(pr('start')||pr('back')){state='pause';pm=0}else if(pr('opts')){openOpts('pause')}else{
      if(hitStop>0)hitStop--;else{
      clock++;updWorld();updPlayer();if(state==='play'){updEnemies();
      if(!arena&&P.x>(ARENA+3)*TS){arena=true;split(ST.cps.length-1);for(let y=0;y<15;y++)map[y][ARENA]='#';spawnBoss();snd(110,.5,'sawtooth',220,.06)}
      midCheck();if(MB)updMid();
      if(B)updBoss();else if(rushWait>0&&--rushWait===0){spawnBoss();snd(110,.5,'sawtooth',220,.06)}}if(state==='play'||state==='dead')updShots();}
    }
  }else if(state==='dead'){deadT++;updWorld();if(deadT>90){resetRun(false);state='play'}}
  else if(state==='edit'){
    for(const k of['left','right','up','down'])edc.hold[k]=K[k]?(edc.hold[k]||0)+1:0;
    const rp=k=>pr(k)||(edc.hold[k]>14&&tick%3===0);
    if(rp('left'))edc.x--;if(rp('right'))edc.x++;if(rp('up'))edc.y--;if(rp('down'))edc.y++;
    edc.x=Math.max(1,Math.min(W-1,edc.x));edc.y=Math.max(0,Math.min(H-1,edc.y));
    if(pr('next'))edc.tool=(edc.tool+1)%TOOLS.length;if(pr('prev'))edc.tool=(edc.tool+TOOLS.length-1)%TOOLS.length;
    const k=TOOLS[edc.tool][0],tileT=' #^H><~'.includes(k);
    if(pr('jump')||pr('fire'))edPushUndo(); // one undo step per keyboard stroke
    if(tileT?K.jump:pr('jump')){edCell(edc.x,edc.y,edc.tool);edRefresh()}
    if(K.fire){edCell(edc.x,edc.y,TOOLS.length-1);edRefresh()}
    if(routeMsg&&routeMsg.t>0)routeMsg.t--;
    if(pr('route'))routeStart();else if(pr('start'))edTest();else if(pr('back')){saveED();state='select';sel=B_EDIT}
    if(edc.dirty&&tick%60===0){edc.dirty=0;saveED()}
    const t=Math.max(0,Math.min(W*TS-VW,edc.x*TS+8-VW/2));camX+=(t-camX)*.25}
  else if(state==='records')recordsStep();
  else if(state==='gallery')galleryStep();
  else if(state==='got'){gotT++;if(gotT>60&&(pr('start')||pr('jump'))){if(ST.custom){if(sharedMode){const b=endShared();state=b==='gallery'?'gallery':'title';return}enterEditor();return}state='select';if(ST.rush)sel=B_RUSH;else{sel=CARD.findIndex(i=>!save.cleared[i]&&(i!==3||coreOpen()));if(sel<0)sel=0}}}
  if(state==='play'||state==='dead'||state==='pause'){camLook+=(P.face*36-camLook)*.05;const t=arena?ARENA*TS:MBlock?midCam(midOf()):Math.max(0,Math.min(W*TS-VW,P.x+P.w/2-VW/2+camLook));camX+=(t-camX)*(arena||MBlock?.08:.14)}
  if(introT>0&&state==='play')introT--;if(!OPT.shake)shake=0;
  updParts();if(shake>0)shake*=.85;if(shake<.3)shake=0;
  if(!silent)setTrack(state==='title'||state==='select'||state==='edit'||state==='records'||state==='gallery'||((state==='opts'||state==='keys')&&optsFrom!=='pause')?'menu':state==='play'||state==='dead'?(ST.rush?(rushIdx===RUSH.length-1?'final':'boss'):B&&B.st!=='boom'?(ST.final?'final':'boss'):arena?null:MB&&MB.st!=='boom'?'boss':ST.key):null);
  const ev=state==='edit';if(edp.hidden===ev)edp.hidden=!ev;
  Object.assign(prev,K);
}

