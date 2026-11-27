// Voltline · rooms.js · Challenge rooms and the Daily run.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
//
// A challenge room is a short level with no boss: reach the exit gate as fast as you can. Rooms share
// one stage slot (ROOM, after Orbit Deck and Phase Lab) that loadRoom() fills in, the way the editor's
// CUSTOM stage works. Medal times (gold, silver, bronze, in frames) are set from the route checker:
// gold is the time tools/check-rooms.js needs, rounded up, so gold is always reachable.
// t: theme stage index. Rooms unlock when their sector is cleared (Prism Grid rooms are always open).
const ROOMS=[
 {id:'r01',n:'First Steps',t:0,W:46,m:[570,780,1050],b(f){f(10,12,15,16,' ');f(19,22,15,16,' ');f(28,29,14,14,'^');f(36,37,12,14)},s:[['w',25,14]]},
 {id:'r02',n:'Low Clearance',t:0,W:48,m:[420,570,780],b(f){f(10,17,0,13);f(22,25,15,16,' ');f(30,38,0,13);f(41,42,14,14,'^')},s:[['f',27,9]]},
 {id:'r03',n:'Ladder Wall',t:0,W:44,m:[780,1080,1410],b(f){f(12,14,5,14);f(11,11,5,14,'H');f(15,19,14,14,'^');f(20,21,9,14);f(22,25,14,14,'^');f(26,28,11,14)},s:[['t',34,10]]},
 {id:'r04',n:'Belt Sprint',t:1,W:54,m:[570,780,1050],b(f){f(6,18,15,15,'<');f(19,21,15,16,' ');f(22,36,15,15,'>');f(37,39,15,16,' ');f(40,48,15,15,'<');f(44,45,13,14)},s:[['h',30,14]]},
 {id:'r05',n:'Crusher Row',t:1,W:50,m:[480,660,870],cr:[[13,0],[19,40],[25,80],[31,120],[37,20]],b(f){f(42,43,14,14,'^')},s:[]},
 {id:'r06',n:'Hot Steps',t:1,W:46,m:[510,690,930],b(f){f(8,38,15,15,'^');f(9,11,12,12);f(15,17,11,11);f(21,23,12,12);f(27,29,10,10);f(33,35,12,12)},s:[]},
 {id:'r07',n:'Lift Off',t:2,W:46,m:[600,810,1080],wind:1,mv:[[10,12,16,0,160,0],[15,11,16,0,160,80],[20,12,16,0,160,0],[25,11,16,0,160,80],[30,12,16,0,160,0],[35,11,16,0,160,80]],b(f){f(8,38,15,16,' ')},s:[]},
 {id:'r08',n:'Gust Hop',t:2,W:50,m:[690,960,1260],wind:1,b(f){f(8,10,15,16,' ');f(14,16,15,16,' ');f(20,22,15,16,' ');f(26,28,15,16,' ');f(32,34,15,16,' ');f(38,40,15,16,' ');f(36,37,13,14)},s:[['g',24,4]]},
 {id:'r09',n:'Going Up',t:2,W:42,m:[720,990,1320],wind:1,mv:[[9,13,0,28,150,0],[15,10,0,28,150,75],[21,7,0,28,150,0]],b(f){f(8,35,15,16,' ');f(25,35,8,14);f(29,30,7,7,'^')},s:[]},
 {id:'r10',n:'Deep Dive',t:5,W:48,m:[660,900,1200],b(f){f(0,47,12,16);f(6,40,12,15,'~');f(16,17,12,13);f(28,29,12,13)},s:[['j',12,14],['j',23,14],['j',34,14]]},
 {id:'r11',n:'Urchin Bed',t:5,W:46,m:[510,690,930],b(f){f(0,45,12,16);f(6,38,12,15,'~');f(10,34,15,15,'^');f(15,16,12,12);f(22,23,12,12);f(29,30,12,12)},s:[['j',19,13]]},
 {id:'r12',n:'Surf Leap',t:5,W:50,m:[690,960,1260],b(f){f(0,49,12,16);f(6,14,12,15,'~');f(15,16,10,15);f(17,25,12,15,'~');f(26,27,10,15);f(28,36,12,15,'~');f(37,38,10,15)},s:[]},
 {id:'r13',n:'Moon Jump',t:7,W:46,m:[480,660,870],b(f){f(6,36,0,14,'o');f(11,17,15,16,' ');f(24,29,15,16,' ')},s:[['a',20,9]]},
 {id:'r14',n:'Asteroid Belt',t:7,W:50,m:[630,870,1140],b(f){f(6,42,0,14,'o');f(9,40,14,14,'^');f(13,14,10,10);f(20,21,9,9);f(27,28,10,10);f(34,35,9,9)},s:[['a',17,6],['a',31,5],['u',24,3]]},
 {id:'r15',n:'Floater',t:7,W:48,m:[540,750,990],b(f){f(5,40,0,14,'o');f(8,38,15,16,' ');f(14,15,11,11);f(23,24,9,9);f(32,33,11,11)},s:[['u',28,3]]},
 {id:'r16',n:'Beat Bridge',t:8,W:46,m:[390,540,720],b(f){f(9,16,15,15,'A');f(9,16,16,16,' ');f(17,24,15,15,'B');f(17,24,16,16,' ');f(25,32,15,15,'A');f(25,32,16,16,' ')},s:[]},
 {id:'r17',n:'Blink Gauntlet',t:8,W:50,m:[600,810,1080],b(f){f(12,13,13,14);f(22,23,12,14);f(32,33,13,14)},s:[['b',16,12],['q',27,13],['b',36,12],['q',40,13]]},
 {id:'r18',n:'Phase Stairs',t:8,W:44,m:[780,1080,1410],b(f){f(8,34,15,16,' ');f(8,34,14,14,'^');f(10,11,12,12,'A');f(14,15,10,10,'B');f(18,19,9,9,'A');f(22,23,10,10,'B');f(26,27,12,12,'A');f(30,31,12,12,'B')},s:[]},
 {id:'r19',n:'Mixed Signals',t:3,W:54,m:[600,810,1080],b(f){f(6,14,15,15,'>');f(15,16,15,16,' ');f(19,25,0,13);f(28,29,14,14,'^');f(32,37,15,15,'A');f(30,31,15,15);f(32,37,16,16,' ');f(38,45,15,15,'B');f(38,45,16,16,' ')},s:[['t',48,14]]},
 {id:'r20',n:'Final Exam',t:3,W:60,m:[750,1020,1350],b(f){f(8,10,8,14);f(7,7,8,14,'H');f(11,13,14,14,'^');f(17,24,0,13);f(26,40,13,16);f(27,37,13,15,'~');f(31,32,15,15,'^');f(41,52,0,14,'o');f(44,49,15,16,' ')},s:[['j',33,14],['f',47,6]]},
];
const ROOM_UNLOCK=t=>t===0||!!save.cleared[t];
const ROOM={name:'',room:true,W:46,cps:[2],kind:'warden',boss:'',th:STAGES[0].th,key:'prism',spawns:[],movers:[],crushers:[],build(f){}};
STAGES.push(ROOM);
const ROOM_I=STAGES.length-1;
let roomId=null,DAILY=null,rsel=0,rOff=0;
function loadRoom(r){
  const st=STAGES[r.t];roomId=r.id;
  Object.assign(ROOM,{name:r.n,W:r.W,th:st.th,key:st.key,wind:!!r.wind,spawns:r.s,movers:(r.mv||[]).map(([x,y,ax,ay,per,ph])=>[x,y,ax,ay,per,ph]),crushers:r.cr||[],
    build(f){f(0,r.W-1,15,16);f(0,0,0,14);f(r.W-1,r.W-1,0,14);r.b(f)}});
}
const roomOf=id=>ROOMS.find(r=>r.id===id);
const roomBest=id=>save.rooms&&save.rooms[id]||0;
// 3 gold, 2 silver, 1 bronze, 0 none
const medalFor=(r,t)=>!t?0:t<=r.m[0]?3:t<=r.m[1]?2:t<=r.m[2]?1:0;
const MEDAL=['','BRONZE','SILVER','GOLD'],MEDC=['','#d08a4a','#cfd8e6',GOLD];
const fmtR=f=>{const s=f/60;return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')+'.'+Math.floor(s*10%10)};
function startRoom(r,seed){loadRoom(r);startStage(ROOM_I,seed);introT=150}
function roomExit(){return ST.room&&P.x>(W-4)*TS}
function roomClear(){
  const r=roomOf(roomId);
  if(DAILY){DAILY.total+=clock;DAILY.i++;
    if(DAILY.i<DAILY.list.length){const keep=P.wpn;startRoom(roomOf(DAILY.list[DAILY.i]),DAILY.seed+DAILY.i);P.wpn=keep;snd(660,.15,'triangle',990,.05);return}
    logEv({e:'daily',t:DAILY.total});
    const pb=!assistOn()&&(!save.daily||save.daily.d!==DAILY.d||DAILY.total<save.daily.t);if(pb)save.daily={d:DAILY.d,t:DAILY.total};persist();
    lastWin={daily:1,pb,total:DAILY.total};state='got';gotT=0;snd(523,.2,'square',0,.05);setTimeout(()=>snd(784,.5,'square',0,.05),200);return}
  if(!r){lastWin={test:1};state='got';gotT=0;return} // a room that isn't in ROOMS (the chunk checker's test rooms) records nothing
  if(!save.rooms||typeof save.rooms!=='object')save.rooms={};
  logEv({e:'room',t:clock});
  const old=roomBest(r.id),pb=!assistOn()&&(!old||clock<old),before=medalFor(r,old);
  if(pb){save.rooms[r.id]=clock;ghostSave()}persist();
  const med=medalFor(r,clock);if(!assistOn()){if(med===3)ach('gold');if(ROOMS.every(q=>medalFor(q,roomBest(q.id))===3))ach('gold_all')}
  lastWin={room:1,pb,med,up:pb&&medalFor(r,clock)>before};state='got';gotT=0;
  snd(523,.2,'square',0,.05);setTimeout(()=>snd(med===3?1046:784,.5,'square',0,.05),200);
}
/* ---------- daily run ---------- */
const todayStr=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const hashStr=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
// three different rooms from all twenty, the same for everyone on the same date
function dailyRooms(d){let s=hashStr('voltline-daily-'+d);const pick=[],pool=ROOMS.map(r=>r.id);
  while(pick.length<3){s=Math.imul(s^s>>>15,2246822507)>>>0;s=(s^s>>>13)>>>0;const i=s%pool.length;pick.push(pool.splice(i,1)[0])}return pick}
function startDaily(){const d=todayStr(),list=dailyRooms(d);DAILY={d,list,i:0,total:0,seed:hashStr(d)};startRoom(roomOf(list[0]),DAILY.seed)}
/* ---------- the Challenges screen ---------- */
// slot -1 is the Daily run; 0..19 are the rooms, in two columns of ten
function roomsStep(){
  const n=ROOMS.length;
  if(pr('back')){state='select';sel=CH_SLOT;return}
  // slot -1 is the Daily run (top left), -2 is Endless (top right), 0..19 the rooms in two columns of ten
  if(pr('up')){rsel=rsel===-1?9:rsel===-2?n-1:rsel===0?-1:rsel===10?-2:rsel-1}
  if(pr('down')){rsel=rsel===-1?0:rsel===-2?10:rsel===9?-1:rsel===n-1?-2:rsel+1}
  if(pr('left')||pr('right')){rsel=rsel===-1?-2:rsel===-2?-1:rsel<10?Math.min(rsel+10,n-1):rsel-10}
  if(pr('start')||pr('jump')){
    if(rsel===-1){startDaily();snd(440,.1,'square',880,.04);return}
    if(rsel===-2){startEndless();snd(440,.1,'square',880,.04);return}
    const r=ROOMS[rsel];if(!ROOM_UNLOCK(r.t)){snd(110,.15,'square',90,.04);POP.push({x:VW/2,y:250,s:'Clear '+STAGES[r.t].name+' to open this room',c:CORAL,l:60});return}
    DAILY=null;startRoom(r);snd(440,.1,'square',880,.04)}
}
function drawRooms(){
  drawBG(STAGES[0].th);dim(.8);
  text('CHALLENGES',VW/2,28,18,GOLD,'center',8);
  const golds=ROOMS.filter(r=>medalFor(r,roomBest(r.id))===3).length;text(golds+' / '+ROOMS.length+' gold',VW-16,28,9,GOLD,'right',0);
  {const dl=save.daily&&save.daily.d===todayStr()?save.daily.t:0;
   for(const [slot,x,label] of [[-1,20,'DAILY RUN · '+todayStr()+(dl?' · best '+fmtR(dl):' · 3 rooms')],[-2,VW/2+4,'ENDLESS RUN · '+(save.endless?'best '+save.endless+' m':'outrun the null wave')]]){const on=rsel===slot;
     ctx.strokeStyle=on?MINT:'rgba(183,163,214,.35)';ctx.lineWidth=on?2:1;ctx.strokeRect(x+.5,38.5,VW/2-25,20);text(label,x+(VW/2-24)/2,52,9,on?MINT:CRM,'center',on?6:0,VW/2-34)}}
  ROOMS.forEach((r,i)=>{const col=i<10?0:1,row=i%10,x=20+col*224,y=76+row*18,on=i===rsel,open=ROOM_UNLOCK(r.t),bt=roomBest(r.id),md=medalFor(r,bt);
    if(on){ctx.strokeStyle=open?MINT:CORAL;ctx.lineWidth=1.5;ctx.strokeRect(x-3.5,y-11.5,222,16)}
    ctx.beginPath();ctx.arc(x+5,y-4,4,0,6.283);if(md){ctx.fillStyle=MEDC[md];ctx.fill()}else{ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;ctx.stroke()}
    text((i+1)+'. '+r.n,x+14,y,9,!open?'#6b5a8e':on?MINT:CRM,'left',on?4:0,120);
    text(open?(bt?fmtR(bt):'—'):STAGES[r.t].name,x+214,y,8,open?(md?MEDC[md]:'rgba(243,233,255,.5)'):'#6b5a8e','right',0,80)});
  if(rsel>=0){const r=ROOMS[rsel];text('Gold '+fmtR(r.m[0])+'   ·   Silver '+fmtR(r.m[1])+'   ·   Bronze '+fmtR(r.m[2]),VW/2,262,8,'rgba(243,233,255,.6)','center',0)}
  else text(rsel===-1?'The same three rooms for everyone today. Best total time is kept for the day.':'Chunks join up as you go. The null wave follows and speeds up. One life.',VW/2,262,8,'rgba(243,233,255,.6)','center',0,440);
}
function drawRoomGoal(){
  if(!ST.room)return;const x=(W-4)*TS,c=OPT.hc?HCP.interact:GOLD,gy=groundY(W-3),top=gy-72;
  ctx.save();glow(c,10);ctx.lineWidth=2;ctx.strokeRect(x+.5,top+.5,TS*2-1,72);ctx.globalAlpha=.25+Math.sin(tick*.1)*.1;ctx.fillStyle=c;ctx.fillRect(x+3,top+3,TS*2-6,66);ctx.restore();
  text('EXIT',x+TS,top-6,8,c,'center',4);
}
