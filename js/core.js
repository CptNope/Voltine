// Voltline · core.js · Canvas setup, colours, weapons, stage data and boss roster.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
const cv=document.getElementById('game'),ctx=cv.getContext('2d'),scr=document.getElementById('screen');
const VW=480,VH=272,TS=16,H=17,G=.25;
const MINT='#5ef2c4',ORG='#ff8a3d',CRM='#ffe9c7',GOLD='#ffd166',PINK='#ff5ea8',CORAL='#ff6b6b',VIO='#8b5cf6',SKY='#7fd8ff';
let sc=1;
const fit=()=>{const r=scr.getBoundingClientRect(),d=window.devicePixelRatio||1;cv.width=Math.max(1,Math.round(r.width*d));cv.height=Math.max(1,Math.round(r.height*d));sc=cv.width/VW};
const ro=new ResizeObserver(fit);ro.observe(scr);fit();

/* ---------- weapons & stages ---------- */
const WPN=[{n:'VOLT BUSTER',s:'VB',c:MINT,cost:0},{n:'PRISM SPREAD',s:'PS',c:PINK,cost:2,d:'Fires a three-way fan of shots.'},{n:'ARC BOLT',s:'AB',c:GOLD,cost:3,d:'Lobs a heavy bolt that bounces along the floor.'},{n:'GUST RING',s:'GR',c:SKY,cost:4,d:'Orbiting shield that eats bullets. Fire again to throw it.'},{n:'TIDE LANCE',s:'TL',c:'#4fd1c5',cost:3,d:'A fast lance that pierces everything in a line.'}];
const VERSION='0.16';
const WEAK={warden:3,hound:1,kite:4,undertow:2};
const TEAL='#4fd1c5';
// weapon index -> stage index that awards it; select-screen card order -> stage index
const WFROM=[-1,0,1,2,5],CARD=[0,1,2,5,3];
const STAGES=[
{name:'Prism Grid',boss:'PRISM WARDEN',kind:'warden',W:194,cps:[2,76,152],
 th:{edge:MINT,fill:'#1b0f35',sky:['#0d0520','#24103f','#3a1446'],r1:['#6a3bd1','#170a2e'],r2:['#b0489c','#1d0c33'],spike:'tri',deco:'planet'},
 build(f){f(0,0,0,14);f(0,30,15,16);f(32,33,13,13);f(35,55,15,16);f(40,42,13,14);f(56,60,15,16);f(56,60,14,14,'^');f(57,58,12,12);
  f(61,100,15,16);f(72,74,8,14);f(71,71,8,14,'H');f(103,104,13,13);f(107,108,11,11);f(110,140,15,16);f(118,120,13,14);f(125,126,14,14,'^');f(130,132,13,14);
  f(141,150,15,16);f(141,150,0,13);f(151,193,15,16);f(192,193,0,14)},
 spawns:[['w',18,14],['w',26,14],['w',48,14],['w',88,14],['w',114,14],['w',136,14],['t',41,12],['t',73,7],['t',119,12],['t',131,12],
  ['f',52,9],['f',84,8],['f',95,7],['f',105,8],['f',123,8],['s',46,14],['s',113,14],['p',64,14],['p',98,14],['p',156,14],['e',80,14],['e',138,14]],movers:[],crushers:[]},
{name:'Coil Foundry',boss:'COIL HOUND',kind:'hound',W:200,cps:[2,81,145],
 th:{edge:'#ffb347',fill:'#22100e',sky:['#12060f','#2e0d1c','#5a1a1a'],r1:['#c2410c','#1a0a0e'],r2:['#ff8a3d','#220c10'],spike:'lava',deco:'stacks'},
 build(f){f(0,0,0,14);f(0,24,15,16);f(25,40,16,16);f(25,40,15,15,'>');f(41,44,16,16);f(41,44,15,15,'^');f(42,43,12,12);
  f(45,70,15,16);f(52,56,13,14);f(52,56,12,12,'<');f(71,80,16,16);f(71,80,15,15,'<');f(81,83,15,16);f(84,86,6,16);f(83,83,6,14,'H');
  f(87,100,6,6);f(92,93,6,6,' ');f(87,100,16,16);f(87,100,15,15,'^');f(101,130,15,16);f(105,124,15,15,'>');
  f(131,140,16,16);f(131,140,15,15,'^');f(133,133,12,12);f(136,136,11,11);f(139,139,12,12);f(141,199,15,16);f(198,199,0,14)},
 spawns:[['w',15,14],['w',48,14],['w',62,14],['w',112,14],['w',127,14],['t',54,11],['t',89,5],['t',98,5],['t',128,14],
  ['f',20,9],['f',46,8],['f',77,9],['f',135,8],['h',47,14],['h',66,14],['h',116,14],['p',50,14],['p',103,14],['p',148,14],['e',66,14],['e',150,14]],
 movers:[],crushers:[[32,0],[38,80],[75,0],[108,0],[114,50],[120,100]]},
{name:'Sky Relay',boss:'GALE KITE',kind:'kite',W:196,cps:[2,63,112],wind:true,
 th:{edge:SKY,fill:'#0e1a3a',sky:['#0a1030','#1d2f6b','#3b4fa0'],r1:['#9db4ff','rgba(14,26,58,.55)'],r2:['#cfe0ff','rgba(20,36,80,.6)'],spike:'barb',deco:'clouds'},
 build(f){f(0,0,0,14);f(0,20,15,16);f(41,47,13,16);f(61,85,15,16);f(68,69,12,14);f(88,90,12,12);f(93,95,10,10);f(98,100,12,12);
  f(108,130,15,16);f(118,119,12,14);f(123,124,14,14,'^');f(150,195,15,16);f(194,195,0,14)},
 spawns:[['w',10,14],['w',44,12],['w',72,14],['w',80,14],['w',115,14],['w',128,14],['t',68,11],['t',118,11],['t',94,9],
  ['f',26,7],['f',38,8],['f',54,7],['f',92,6],['f',104,8],['f',136,7],['f',142,8],['g',14,6],['g',75,5],['g',113,6],['g',160,5],['p',45,12],['p',82,14],['p',156,14],['e',99,11],['e',126,14]],
 movers:[[23,12,40,0,180,0],[29,10,0,28,150,0],[35,12,40,0,200,3.14],[50,11,48,0,220,0],[57,12,0,32,160,0],[103,11,40,0,180,0],[133,12,40,0,180,0],[139,10,0,32,150,1],[145,12,40,0,200,2]],crushers:[]},
{name:'Null Core',boss:'NULL ENGINE',kind:'null',W:214,cps:[2,68,141],final:true,
 th:{edge:'#e8e8ff',fill:'#14101f',sky:['#050308','#140a1c','#2a0a1a'],r1:['#ff3b5c','#0c0610'],r2:['#b9b4d6','#120c18'],spike:'tri',deco:'core'},
 build(f){f(0,0,0,14);f(0,18,15,16);f(19,30,16,16);f(19,30,15,15,'>');f(36,70,15,16);f(44,46,14,14,'^');f(45,45,12,12);f(52,54,12,14);f(61,64,0,13);
  f(71,74,15,16);f(72,74,5,14);f(71,71,5,14,'H');f(75,96,16,16);f(75,96,15,15,'^');f(97,130,15,16);f(105,118,15,15,'<');f(122,123,12,14);
  f(141,213,15,16);f(158,160,14,14,'^');f(159,159,12,12);f(212,213,0,14)},
 spawns:[['w',10,14],['w',40,14],['w',57,14],['w',67,14],['w',100,14],['w',126,14],['w',145,14],['w',166,14],['t',53,11],['t',73,4],['t',122,11],['t',155,14],
  ['f',28,8],['f',48,8],['f',85,6],['f',112,8],['f',136,7],['f',164,8],['s',41,14],['h',101,14],['g',143,5],['g',170,5],['p',38,14],['p',98,14],['p',147,14],['p',178,14],['e',58,14],['e',128,14],['e',176,14]],
 movers:[[33,12,24,0,140,0],[78,9,0,30,150,0],[84,8,40,0,180,0],[91,9,0,30,150,2],[133,12,32,0,160,0],[138,11,0,28,150,1]],crushers:[[24,0],[29,80],[109,0],[115,80]]}];
STAGES.push({name:'Boss Rush',boss:'BOSS RUSH',kind:'warden',W:33,cps:[6],rush:true,
 th:{edge:'#e8e8ff',fill:'#14101f',sky:['#050308','#1a0820','#3a0a24'],r1:['#ff5ea8','#0c0610'],r2:['#b9b4d6','#120c18'],spike:'tri',deco:'core'},
 build(f){f(0,1,0,14);f(0,32,15,16);f(31,32,0,14)},spawns:[],movers:[],crushers:[]});
STAGES.push({name:'Tide Vault',boss:'UNDERTOW',kind:'undertow',W:200,cps:[2,92,145],
 th:{edge:TEAL,fill:'#071a24',sky:['#02101a','#06283a','#0d4152'],r1:['#2b8fb3','rgba(7,26,36,.7)'],r2:['#7fd8ff','rgba(9,34,48,.75)'],spike:'barb',deco:'tide'},
 build(f){f(0,0,0,11);f(0,199,12,16);
  f(21,40,12,15,'~');f(28,30,15,15,'^');f(48,50,9,11);
  f(61,90,12,15,'~');f(70,71,12,13);f(80,81,14,15);
  f(99,100,9,11);
  f(111,140,12,15,'~');f(118,120,15,15,'^');f(130,132,15,15,'^');f(124,126,9,9);
  f(172,195,12,14,'~');f(175,177,8,8);f(190,192,8,8);f(198,199,0,11)},
 spawns:[['w',12,11],['w',55,11],['w',104,11],['w',150,11],['s',45,11],['s',95,11],['t',49,8],['t',99,8],
  ['j',35,13],['j',66,13],['j',76,14],['j',86,13],['j',115,13],['j',128,13],['j',137,14],['g',8,6],['g',56,5],['g',104,5],['f',58,7],['f',120,7],
  ['p',52,11],['p',108,11],['p',150,11],['e',93,11],['e',147,11]],movers:[],crushers:[]});
STAGES.forEach((st,i)=>st.key=['prism','foundry','sky','core','rush','tide'][i]);
const RUSH=['warden','hound','kite','undertow','null'],BN={warden:'PRISM WARDEN',hound:'COIL HOUND',kite:'GALE KITE',undertow:'UNDERTOW',null:'NULL ENGINE'};
let rushIdx=0,rushWait=0,lastSel=0;

// the Null Core opens once all four wardens are down (players who already cleared it before Tide Vault existed keep access)
const coreOpen=()=>!!(save.cleared[0]&&save.cleared[1]&&save.cleared[2]&&(save.cleared[5]||save.cleared[3]));
