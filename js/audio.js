// Voltline · audio.js · Sound effects, the synthesized soundtrack and gamepad polling.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- audio ---------- */
let ac=null;
let mg=null,nbuf=null;
function audio(){if(ac){if(ac.state==='suspended')ac.resume();return}try{ac=new (window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=.8;mg.connect(ac.destination)}catch(e){ac=null}}
function snd(f,d,type='square',f2=0,vol=.04){
  if(!ac||!sfxOn)return;try{const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
  if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(Math.max(.0002,vol*OPT.sv/8),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g).connect(ac.destination);o.start(t);o.stop(t+d)}catch(e){}
}

/* ---------- music ---------- */
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const pat=(s,len)=>{const a=s.trim().split(/\s+/).map(x=>x==='.'?null:+x);while(a.length%len)a.push(null);return a};
const TR={
 menu:{bpm:100,root:60,lt:'triangle',L:'0 . 7 . 12 . 10 . 7 . 3 . 5 . 7 . 0 . 7 . 12 . 15 . 14 . 12 . 10 . 7 . . . 5 . 3 . 5 . 7 . 10 . 7 . 5 . 3 . 0 . . . . . . . . . . .',B:'0 . . . 0 . . . -4 . . . -4 . . . -7 . . . -7 . . . -5 . . . -5 . . .',D:'k . . . h . . . s . . . h . . .'},
 prism:{bpm:128,root:57,L:'12 . 12 15 . 17 . 19 . 17 15 . 12 . 10 . 12 . 12 15 . 17 . 22 . 19 . 17 . 15 . . 19 . 19 22 . 24 . 22 . 19 17 . 15 . 17 . 19 . 17 . 15 . 12 . 10 . 12 . . . . . .',B:'0 . 0 12 0 . 0 12 3 . 3 15 3 . 3 15 5 . 5 17 5 . 5 17 2 . 2 14 2 . 2 14',D:'k . h . s . h . k k h . s . h h'},
 foundry:{bpm:142,root:52,L:'0 0 . 3 . 0 . 5 . 6 . 5 . 3 . . 0 0 . 3 . 0 . 7 . 6 5 . 3 . . . 12 . 10 . 7 . 6 . 5 . 3 . 5 . 6 . 7 . 7 . 10 . 7 . 6 . 5 . 3 . . .',B:'0 0 12 0 0 0 12 0 3 3 15 3 1 1 13 1',D:'k . h k s . h . k . h k s . s h'},
 sky:{bpm:120,root:62,lt:'triangle',L:'7 . . 9 . . 11 . 12 . . 11 . 9 . 7 . . . 4 . . 7 . 9 . . . . . . . 12 . . 14 . . 16 . 14 . . 12 . 11 . 9 . . . 7 . . 9 . 11 . . . . . . . . .',B:'0 . . . 7 . . . 5 . . . 7 . . . 0 . . . 7 . . . 9 . . . 7 . . .',D:'k . . h . . h . s . . h . . h .'},
 core:{bpm:134,root:50,L:'0 . 1 . 0 . . 7 . 6 . 5 . 6 . . 0 . 1 . 0 . . 10 . 8 . 7 . 6 . . 12 . 13 . 12 . . 7 . 8 . 10 . 8 . 7 . 6 . 7 . 6 . 5 . 1 . 0 . . . . . . .',B:'0 . 0 . 0 . 0 . 1 . 1 . 1 . 1 . 0 . 0 . 0 . 0 . 6 . 6 . 5 . 5 .',D:'k . h . s . h k k . h . s . h h'},
 boss:{bpm:152,root:55,L:'0 3 7 3 0 3 7 10 . 8 7 . 5 . 3 . 0 3 7 3 0 3 7 12 . 10 8 . 7 . 5 . 12 . 10 . 8 . 7 . 8 . 7 . 5 . 3 . 5 . 3 . 2 . 3 . 5 . 7 . . . . . . .',B:'0 0 12 0 0 12 0 12 -4 -4 8 -4 -2 -2 10 -2',D:'k h s h k h s h k h s h k k s s'},
 final:{bpm:158,root:50,L:'0 . 12 . 11 . 7 . 8 . 7 . 3 . 1 . 0 . 12 . 13 . 15 . 13 . 12 . 8 . 7 . 15 . 13 . 12 . 13 . 12 . 8 . 7 . 8 . 7 . 3 . 1 . 0 . 1 . 3 . 7 .',B:'0 0 0 0 1 1 1 1 -2 -2 -2 -2 -4 -4 -5 -5',D:'k h s h k k s h k h s h k s s s'}};
for(const k in TR){const t=TR[k];t.L=pat(t.L,32);t.B=pat(t.B,16);t.D=t.D.trim().split(/\s+/)}
const mus={id:null,step:0,next:0};
function setTrack(id){if(mus.id===id)return;mus.id=id;mus.step=0;mus.next=ac?ac.currentTime+.08:0}
function tone(f,t,d,type,vol,f2){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(mg);o.start(t);o.stop(t+d+.02)}
function noise(t,d,vol,hp){if(!nbuf){nbuf=ac.createBuffer(1,Math.floor(ac.sampleRate*.3),ac.sampleRate);const a=nbuf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
  const sr=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();sr.buffer=nbuf;fl.type='highpass';fl.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);sr.connect(fl).connect(g).connect(mg);sr.start(t);sr.stop(t+d+.02)}
function musicTick(){
  if(mg)mg.gain.value=OPT.mv/10;
  if(!ac||!mg||!mus.id||ac.state!=='running')return;const tr=TR[mus.id],sp=60/tr.bpm/4;if(mus.next<ac.currentTime)mus.next=ac.currentTime+.03;
  try{while(mus.next<ac.currentTime+.12){const t=mus.next,i=mus.step;
    if(musicOn){const L=tr.L[i%tr.L.length],Bn=tr.B[i%tr.B.length],D=tr.D[i%tr.D.length];
      if(L!==null)tone(NOTE(tr.root+12+L),t,sp*1.5,tr.lt||'square',tr.lt?.05:.022);
      if(Bn!==null)tone(NOTE(tr.root-12+Bn),t,sp*1.7,'triangle',.07);
      if(D==='k')tone(150,t,.11,'sine',.16,45);else if(D==='s')noise(t,.09,.06,1400);else if(D==='h')noise(t,.03,.025,7000)}
    mus.next+=sp;mus.step++}}catch(e){}
}

/* ---------- gamepad ---------- */
const GPM={0:'jump',1:'fire',2:'fire',3:'next',4:'prev',5:'next',8:'music',9:'start',12:'up',13:'down',14:'left',15:'right'},padOwn={},PADK=['jump','fire','next','prev','start','up','down','left','right','music'];
function pollPad(){
  let gp=null;try{if(navigator.getGamepads)for(const g of navigator.getGamepads())if(g){gp=g;break}}catch(e){}
  const cur={};
  if(gp){for(const i in GPM)if(gp.buttons[i]&&gp.buttons[i].pressed)cur[GPM[i]]=true;const ax=gp.axes[0]||0,ay=gp.axes[1]||0;if(ax<-.5)cur.left=true;if(ax>.5)cur.right=true;if(ay<-.6)cur.up=true;if(ay>.6)cur.down=true}
  for(const k of PADK){if(cur[k]){if(!K[k])padOwn[k]=1;K[k]=true}else if(padOwn[k]){K[k]=false;padOwn[k]=0}}
}

