// Voltline · sectors.js · Orbit Deck and Phase Lab (stage indexes 7 and 8, added after the editor's custom stage at 6).
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
// Tiles: 'o' low-gravity field (floaty jumps), 'A' / 'B' phase blocks (solid on alternate beats).
STAGES.push({name:'Orbit Deck',boss:'ORBITER',kind:'orbiter',W:200,cps:[2,78,135],key:'orbit',
 th:{edge:'#c7d2ff',fill:'#0b0e24',sky:['#02030c','#0a0f2c','#1b1446'],r1:['#7f8cff','rgba(11,14,36,.7)'],r2:['#c7d2ff','rgba(14,18,44,.8)'],spike:'tri',deco:'orbit'},
 build(f){f(0,0,0,14);f(0,199,15,16);
  f(8,30,0,14,'o');f(19,25,15,16,' ');f(22,22,12,12);                        // first floaty crossing
  f(44,62,0,14,'o');f(49,50,11,14);f(53,55,7,14);f(61,66,15,16,' ');f(56,75,0,14,'o');f(67,69,12,12);f(70,75,15,16,' ');
  f(101,130,0,14,'o');f(104,127,14,14,'^');f(106,107,10,10);f(113,114,9,9);f(120,121,10,10);
  f(172,197,0,14,'o');f(175,177,10,10);f(190,192,10,10);f(198,199,0,14)},
 spawns:[['w',12,14],['a',34,10],['u',40,6],['w',36,14],['a',58,5],['u',84,5],['w',88,14],['s',95,14],['a',110,6],['u',124,4],
  ['w',140,14],['a',150,9],['u',158,5],['t',146,14],['p',27,14],['p',96,14],['p',138,14],['e',80,14],['e',160,14]],movers:[],crushers:[]});
STAGES.push({name:'Phase Lab',boss:'MIRROR',kind:'mirror',W:200,cps:[2,69,142],key:'phase',
 th:{edge:'#ff9df5',fill:'#140a1c',sky:['#07030c','#1a0b24','#2c0f38'],r1:['#a35cff','rgba(20,10,28,.7)'],r2:['#ff9df5','rgba(26,12,36,.8)'],spike:'tri',deco:'phase'},
 build(f){f(0,0,0,14);f(0,199,15,16);
  f(17,30,15,16,' ');f(18,19,13,13,'A');f(22,23,12,12,'B');f(26,27,13,13,'A');   // stepping stones on alternate beats
  f(51,66,15,16,' ');f(51,58,15,15,'A');f(59,66,15,15,'B');                         // a bridge that changes under you
  f(72,73,12,12,'A');f(74,75,9,9,'B');f(76,78,8,14);                               // climbing a wall in time
  f(96,100,15,15,'A');f(101,105,15,15,'B');f(96,105,16,16,' ');
  f(116,135,14,14,'^');f(117,118,11,11,'A');f(121,122,11,11,'B');f(125,126,11,11,'A');f(129,130,11,11,'B');f(133,134,11,11,'A');
  f(171,173,10,10,'A');f(194,196,10,10,'B');f(198,199,0,14)},
 spawns:[['w',10,14],['b',36,9],['w',42,14],['q',46,14],['b',62,8],['s',84,14],['q',90,14],['b',110,8],['w',112,14],['q',138,14],
  ['b',150,8],['s',156,14],['t',162,14],['p',32,14],['p',86,14],['p',145,14],['e',68,14],['e',140,14]],movers:[],crushers:[]});
