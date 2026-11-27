// Voltline · audio.js · Sound effects, the synthesized soundtrack and gamepad polling.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- audio ---------- */
let ac=null,silent=false;
let mg=null,nbuf=null;
function audio(){if(ac){if(ac.state==='suspended')ac.resume();return}try{ac=new (window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=.8;mg.connect(ac.destination)}catch(e){ac=null}}
function snd(f,d,type='square',f2=0,vol=.04){
  if(!ac||!sfxOn||silent)return;try{const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
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
 tide:{bpm:96,root:57,lt:'triangle',L:'12 . . 15 . . 19 . 17 . . 15 . . 12 . 10 . . 12 . . 15 . . . . . . . . . 19 . . 22 . . 24 . 22 . . 19 . . 17 . 15 . . 17 . . 12 . . . . . . . . .',B:'0 . . . . . 7 . 5 . . . . . 3 . 0 . . . . . 7 . 8 . . . 7 . . .',D:'k . . . h . . . s . . . h . . h'},
 orbit:{bpm:108,root:62,lt:'triangle',L:'12 . . . 19 . . . 17 . 16 . 14 . . . 12 . . . 21 . . . 19 . . . . . . . 24 . . . 23 . . . 21 . 19 . 17 . . . 16 . 14 . 12 . . . . . . . . . . .',B:'0 . . . . . . . -5 . . . . . . . -3 . . . . . . . -7 . . . . . . .',D:'k . . . . . h . s . . . . . h .'},
 phase:{bpm:160,root:60,L:'0 12 7 12 3 12 7 12 0 12 8 12 3 12 8 12 2 14 7 14 5 14 7 14 2 14 10 14 5 14 10 14 0 . 12 . 15 . 12 . 19 . 15 . 12 . 10 . 8 . 7 . 8 . 10 . 12 . . . 7 . . .',B:'0 0 . 0 . 0 0 . 8 8 . 8 . 8 8 . 5 5 . 5 . 5 5 . 3 3 . 3 2 . 2 .',D:'k h s h k h s h k h s h k k s h'},
 boss:{bpm:152,root:55,L:'0 3 7 3 0 3 7 10 . 8 7 . 5 . 3 . 0 3 7 3 0 3 7 12 . 10 8 . 7 . 5 . 12 . 10 . 8 . 7 . 8 . 7 . 5 . 3 . 5 . 3 . 2 . 3 . 5 . 7 . . . . . . .',B:'0 0 12 0 0 12 0 12 -4 -4 8 -4 -2 -2 10 -2',D:'k h s h k h s h k h s h k k s s'},
 final:{bpm:158,root:50,L:'0 . 12 . 11 . 7 . 8 . 7 . 3 . 1 . 0 . 12 . 13 . 15 . 13 . 12 . 8 . 7 . 15 . 13 . 12 . 13 . 12 . 8 . 7 . 8 . 7 . 3 . 1 . 0 . 1 . 3 . 7 .',B:'0 0 0 0 1 1 1 1 -2 -2 -2 -2 -4 -4 -5 -5',D:'k h s h k k s h k h s h k s s s'}};
for(const k in TR){const t=TR[k];t.L=pat(t.L,32);t.B=pat(t.B,16);t.D=t.D.trim().split(/\s+/)}
const mus={id:null,step:0,next:0,layer:false};
// Everything one step of a track plays, as a list (pure, so the smoke tests can check it without audio).
// Every second pass through the lead adds a harmony a fourth below, a soft arpeggio over the bass and
// off-beat hats. With `layer` on (a boss below half health) a pulsing low bass and a high arpeggio join in.
// Both depend only on the step count, so they switch on the beat with no gap.
function musicStep(tr,i,layer){
  const out=[],L=tr.L[i%tr.L.length],D=tr.D[i%tr.D.length],second=Math.floor(i/tr.L.length)%2===1;
  let lb=0;for(let k=i;k>i-tr.B.length;k--){const b=tr.B[((k%tr.B.length)+tr.B.length)%tr.B.length];if(b!==null){lb=b;break}} // the bass note in force
  const Bn=tr.B[i%tr.B.length];
  if(L!==null)out.push({f:NOTE(tr.root+12+L),d:1.5,beat:1,w:tr.lt||'square',v:tr.lt?.05:.022,part:'lead'});
  if(Bn!==null)out.push({f:NOTE(tr.root-12+Bn),d:1.7,beat:1,w:'triangle',v:.07,part:'bass'});
  if(D==='k')out.push({f:150,d:.11,w:'sine',v:.16,f2:45,part:'drum'});else if(D==='s')out.push({noise:1,d:.09,v:.06,hp:1400,part:'drum'});else if(D==='h')out.push({noise:1,d:.03,v:.025,hp:7000,part:'drum'});
  if(second){
    if(L!==null)out.push({f:NOTE(tr.root+7+L),d:1.2,beat:1,w:'triangle',v:.028,part:'harmony'});
    if(i%2===0)out.push({f:NOTE(tr.root+12+lb+[0,7,12,7][(i/2)%4]),d:.9,beat:1,w:'sine',v:.022,part:'arp'});
    if(D==null&&i%2===1)out.push({noise:1,d:.02,v:.012,hp:8000,part:'drum2'});
  }
  if(layer){
    if(i%2===0)out.push({f:NOTE(tr.root-24+lb),d:.9,beat:1,w:'sawtooth',v:.026,part:'pulse'});
    out.push({f:NOTE(tr.root+24+lb+[0,3,7,12][i%4]),d:.5,beat:1,w:'square',v:.008,part:'high'});
  }
  return out;
}
function setTrack(id){if(mus.id===id)return;mus.id=id;mus.step=0;mus.next=ac?ac.currentTime+.08:0}
function tone(f,t,d,type,vol,f2){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(mg);o.start(t);o.stop(t+d+.02)}
function noise(t,d,vol,hp){if(!nbuf){nbuf=ac.createBuffer(1,Math.floor(ac.sampleRate*.3),ac.sampleRate);const a=nbuf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
  const sr=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();sr.buffer=nbuf;fl.type='highpass';fl.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);sr.connect(fl).connect(g).connect(mg);sr.start(t);sr.stop(t+d+.02)}
function musicTick(){
  if(mg)mg.gain.value=OPT.mv/10;
  if(!ac||!mg||!mus.id||ac.state!=='running')return;const tr=TR[mus.id],sp=60/tr.bpm/4;if(mus.next<ac.currentTime)mus.next=ac.currentTime+.03;
  try{while(mus.next<ac.currentTime+.12){const t=mus.next,i=mus.step;
    if(musicOn)for(const n of musicStep(tr,i,mus.layer)){if(n.noise)noise(t,n.d,n.v,n.hp);else tone(n.f,t,n.d*(n.beat?sp:1),n.w,n.v,n.f2)}
    mus.next+=sp;mus.step++}}catch(e){}
}

/* ---------- gamepad ---------- */
const PAD_DIRS={12:'up',13:'down',14:'left',15:'right'},padOwn={},PADK=['jump','fire','next','prev','start','up','down','left','right','music'];let padPrev=[];
function pollPad(){
  let gp=null;try{if(navigator.getGamepads)for(const g of navigator.getGamepads())if(g){gp=g;break}}catch(e){}
  const cur={},now=gp?gp.buttons.map(b=>!!(b&&b.pressed)):[];if(now.some(Boolean)&&typeof save!=='undefined')(save.dev=save.dev||{}).p=1;
  if(gp&&capture&&capture.kind==='pad'){const i=now.findIndex((p,n)=>p&&!padPrev[n]&&!(n in PAD_DIRS));if(i>=0){bindPad(capture.act,i);capture=null}padPrev=now;return}
  if(gp){for(const a in PADB)for(const i of PADB[a])if(now[i])cur[a]=true;for(const i in PAD_DIRS)if(now[i])cur[PAD_DIRS[i]]=true;
    const ax=gp.axes[0]||0,ay=gp.axes[1]||0;if(ax<-.5)cur.left=true;if(ax>.5)cur.right=true;if(ay<-.6)cur.up=true;if(ay>.6)cur.down=true}
  padPrev=now;
  for(const k of PADK){if(cur[k]){if(!K[k])padOwn[k]=1;K[k]=true}else if(padOwn[k]){K[k]=false;padOwn[k]=0}}
}

