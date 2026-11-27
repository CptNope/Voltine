// Voltline · records.js · Achievements, checkpoint splits, lifetime stats, the Records screen and progress codes.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.

// [id, name, description, skill]: skill achievements need assist off
const ACH=[
 ['first_clear','First Light','Clear any sector',0],
 ['weak','Pressure Point','Land a weakness hit on a boss',0],
 ['charged','Full Charge','Defeat an enemy with a charged shot',0],
 ['shield','Around the Shield','Defeat a shield walker',0],
 ['jelly','Sting Operation','Defeat a jellyfish',0],
 ['flawless','Untouched','Beat a boss without taking a hit',1],
 ['no_reboot','Clean Run','Clear a sector without a reboot',1],
 ['all_weapons','Full Arsenal','Own all six boss weapons',0],
 ['all_wardens','Wardens Down','Beat all six wardens',0],
 ['core','The Grid Is Free','Clear the Null Core',0],
 ['hard_core','Hard Light','Clear the Null Core on Hard',1],
 ['rush','Gauntlet','Finish Boss Rush',0],
 ['rush_hard','Iron Gauntlet','Finish Boss Rush on Hard',1],
 ['speed','Prism Sprint','Clear Prism Grid in under 2:30',1],
 ['kills','Centurion','Defeat 100 enemies',0],
 ['maker','Architect','Beat a level you built in the editor',0],
 ['mid','Gatecrasher','Beat a mid-boss',0],
 ['mid_clean','Clean Break','Beat a mid-boss without taking a hit',1],
 ['gold','Gold Standard','Earn a gold medal in a challenge room',1],
 ['gold_all','All That Glitters','Earn gold in all twenty challenge rooms',1],
 ['endless','Long Haul','Run 300 m in Endless',1]];
const ACH_IDS=ACH.map(a=>a[0]);
if(!save.ach||typeof save.ach!=='object')save.ach={};
if(!save.stats||typeof save.stats!=='object')save.stats={kills:0,pickups:0,reboots:0};
if(!Array.isArray(save.splits))save.splits=[];if(!Array.isArray(save.splitsH))save.splitsH=[];
let TOASTS=[],runSplits=[],bossHurt=false,recPage=0;

function ach(id){
  if(silent||PRAC)return;if(!save.ach)save.ach={};const a=ACH.find(x=>x[0]===id);if(!a||save.ach[id])return;if(a[3]&&assistOn())return;
  save.ach[id]=1;persist();TOASTS.push({s:a[1],t:200});snd(880,.12,'triangle',1320,.05);setTimeout(()=>snd(1320,.2,'triangle',1760,.05),120);
}
function stat(k,n=1){if(silent)return;if(!save.stats)save.stats={};save.stats[k]=(save.stats[k]||0)+n;if(k==='kills'&&save.stats.kills>=100)ach('kills')}

/* ---------- splits: one per checkpoint, the boss gate, and the clear ---------- */
const splitBest=()=>(((hard?save.splitsH:save.splits)||[])[S]||[]);
const fmtS=f=>{const s=Math.abs(f)/60;return (f<0?'-':'+')+(s>=60?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):s.toFixed(1))};
function split(i){
  if(ST.custom||ST.rush)return;runSplits[i]=clock;const b=splitBest()[i];
  if(b)POP.push({x:P.x+6,y:P.y-10,s:fmtS(clock-b),c:clock<=b?MINT:CORAL,l:110});
}
function saveSplits(){if(ST.custom||ST.rush||assistOn())return;const k=hard?'splitsH':'splits';if(!Array.isArray(save[k]))save[k]=[];save[k][S]=runSplits.slice()}

/* ---------- playtest log: stays on this device; the report is text the player chooses to share ---------- */
let bossT0=0;
function logEv(o){
  if(silent||!ST||ST.custom)return;if(!Array.isArray(save.log))save.log=[];
  // mode tags keep challenge rooms, Endless, the Daily run and practice out of the sector numbers
  const tag={};if(ST.room)tag.r=roomId;if(ST.endless)tag.en=1;if(DAILY)tag.dl=1;if(PRAC)tag.p=1;if(MB&&o.e==='death')tag.mb=MB.kind;
  save.log.push(Object.assign({s:ST.key,h:hard?1:0,a:assistOn()?1:0,when:Date.now()},tag,o));if(save.log.length>400)save.log.splice(0,save.log.length-400);persist();
}
// Pause → "Flag this moment" (or F while playing) marks a spot for the report, so testers needn't stop
function flagMoment(){logEv({e:'flag',x:ST.endless?enMetres():Math.floor((P.x+6)/TS),t:clock,b:B?B.kind:''});POP.push({x:P.x+6,y:P.y-16,s:'FLAGGED',c:GOLD,l:70});snd(990,.08,'triangle',0,.04)}
function playtestReport(){
  const L=Array.isArray(save.log)?save.log:[],keys=['prism','foundry','sky','tide','orbit','phase','core','rush'],nm={prism:'Prism Grid',foundry:'Coil Foundry',sky:'Sky Relay',tide:'Tide Vault',orbit:'Orbit Deck',phase:'Phase Lab',core:'Null Core',rush:'Boss Rush'};
  const out=['Voltline playtest report · version '+VERSION+' · '+new Date().toISOString().slice(0,10),'Events logged: '+L.length+(assistOn()?' · assist or slow mode is on now':'')+(hard?' · Hard is selected now':''),''];
  const dev=save.dev||{},used=[['k','keyboard'],['p','gamepad'],['t','touch'],['m','mouse']].filter(([k])=>dev[k]).map(([,n])=>n);
  out.splice(2,0,'Inputs used: '+(used.join(', ')||'unknown')+' · settings: '+(['as','spd','hc','big','rf','tc','af','hs'].filter(k=>OPT[k]).map(k=>({as:'assist',spd:'slow '+[100,75,50][OPT.spd]+'%',hc:'high contrast',big:'large text',rf:'reduced flashing',tc:'toggle charge',af:'auto-fire',hs:'hold to slide'})[k]).join(', ')||'defaults'));
  const flags=L.filter(e=>e.e==='flag');
  if(flags.length){out.push('Flagged moments ('+flags.length+'):');for(const e of flags.slice(-15))out.push('  '+(e.r?'room '+e.r:e.en?'Endless':(nm[e.s]||e.s))+(e.en?' at '+e.x+' m':' column '+e.x)+(e.b?' during the '+(BN[e.b]||e.b)+' fight':'')+' · '+fmt(e.t||0)+' into the run');out.push('')}
  const main=L.filter(e=>!e.r&&!e.en&&!e.p&&!e.dl);
  for(const k of keys){const ev=main.filter(e=>e.s===k);if(!ev.length)continue;
    const d=ev.filter(e=>e.e==='death'),c=ev.filter(e=>e.e==='clear'),b=ev.filter(e=>e.e==='boss');
    out.push(nm[k]+': '+c.length+' clear'+(c.length===1?'':'s')+(c.length?' (fastest '+fmt(Math.min(...c.map(e=>e.t)))+')':'')+', '+d.length+' death'+(d.length===1?'':'s'));
    const spots={};for(const e of d){const key=e.b?'boss fight ('+(BN[e.b]||e.b)+')':e.mb?'mid-boss fight ('+(MBN[e.mb]||e.mb)+')':'columns '+Math.floor(e.x/5)*5+'-'+(Math.floor(e.x/5)*5+4);(spots[key]=spots[key]||{n:0,c:{}}).n++;spots[key].c[e.c]=(spots[key].c[e.c]||0)+1}
    Object.entries(spots).sort((a,b)=>b[1].n-a[1].n).slice(0,5).forEach(([w,v])=>out.push('  '+v.n+' × '+w+' ('+Object.entries(v.c).map(([c,n])=>n+' '+c).join(', ')+')'));
    const byB={};for(const e of b)(byB[e.k]=byB[e.k]||[]).push(e.d);
    const mids=ev.filter(e=>e.e==='mid');if(mids.length)out.push('  mid-boss '+(MBN[mids[0].k]||mids[0].k)+': '+mids.length+' win'+(mids.length===1?'':'s')+(mids[0].d?', average fight '+fmt(mids.reduce((x,e)=>x+(e.d||0),0)/mids.length):''));
    for(const [kk,ds] of Object.entries(byB))out.push('  boss '+(BN[kk]||kk)+': '+ds.length+' win'+(ds.length===1?'':'s')+', average fight '+fmt(ds.reduce((x,y)=>x+y,0)/ds.length)+', range '+fmt(Math.min(...ds))+'-'+fmt(Math.max(...ds)));
    out.push('')}
  const rooms=L.filter(e=>e.r&&!e.dl);if(rooms.length){out.push('Challenge rooms:');const by={};for(const e of rooms)(by[e.r]=by[e.r]||[]).push(e);
    for(const [id,ev] of Object.entries(by)){const r=roomOf(id),c=ev.filter(e=>e.e==='room'),d=ev.filter(e=>e.e==='death').length;
      out.push('  '+(r?r.n:id)+': '+c.length+' clear'+(c.length===1?'':'s')+(c.length?' (best '+fmtR(Math.min(...c.map(e=>e.t)))+(r?', gold '+fmtR(r.m[0]):'')+')':'')+', '+d+' death'+(d===1?'':'s'))}out.push('')}
  const dl=L.filter(e=>e.dl);if(dl.length){const c=dl.filter(e=>e.e==='daily');out.push('Daily run: '+c.length+' finished'+(c.length?' (best '+fmtR(Math.min(...c.map(e=>e.t)))+')':'')+', '+dl.filter(e=>e.e==='death').length+' deaths','')}
  const en=L.filter(e=>e.en&&e.e==='endless');if(en.length){const ms=en.map(e=>e.m);out.push('Endless: '+en.length+' run'+(en.length===1?'':'s')+', best '+Math.max(...ms)+' m, average '+Math.round(ms.reduce((a,b)=>a+b,0)/ms.length)+' m; ended by '+Object.entries(en.reduce((o,e)=>(o[e.c]=(o[e.c]||0)+1,o),{})).map(([c,n])=>n+' '+c).join(', '),'')}
  const pr=L.filter(e=>e.p&&e.e==='death').length;if(pr)out.push('Practice: '+pr+' deaths (not counted above)','');
  if(L.length===0)out.push('No events yet. Play a few stages first.');
  return out.join('\n');
}

/* ---------- progress codes ---------- */
function exportProgress(){return 'VS1.'+btoa(JSON.stringify(save))}
function importProgress(code){
  try{const o=JSON.parse(atob(String(code).trim().replace(/^VS1\./,'')));if(!o||!Array.isArray(o.cleared))return null;
    const nums=(a,n)=>Array.from({length:n},(_,i)=>{const v=Array.isArray(a)?a[i]:0;return Number.isFinite(v)&&v>=0?Math.floor(v):0});
    const spl=a=>Array.isArray(a)?a.slice(0,8).map(r=>Array.isArray(r)?nums(r,Math.min(r.length,6)):[]):[];
    const out={cleared:nums(o.cleared,9).map(v=>v?1:0),best:nums(o.best,9),bestH:nums(o.bestH,9),rush:nums(o.rush,2),ach:{},stats:{},splits:spl(o.splits),splitsH:spl(o.splitsH)};
    for(const id of ACH_IDS)if(o.ach&&o.ach[id])out.ach[id]=1;
    for(const k of['kills','pickups','reboots'])out.stats[k]=nums([o.stats&&o.stats[k]],1)[0];
    out.rooms={};if(o.rooms&&typeof o.rooms==='object')for(const [k,v] of Object.entries(o.rooms).slice(0,100))if(/^r\d\d$/.test(k)&&Number.isFinite(v)&&v>0)out.rooms[k]=Math.floor(v);
    if(o.daily&&typeof o.daily.d==='string'&&/^\d{4}-\d\d-\d\d$/.test(o.daily.d)&&Number.isFinite(o.daily.t)&&o.daily.t>0)out.daily={d:o.daily.d,t:Math.floor(o.daily.t)};
    if(Number.isFinite(o.endless)&&o.endless>0)out.endless=Math.min(99999,Math.floor(o.endless));
    out.gal={};if(o.gal&&typeof o.gal==='object')for(const [k,v] of Object.entries(o.gal).slice(0,200))if(/^[a-z0-9]{1,12}$/.test(k)&&Number.isFinite(v)&&v>0)out.gal[k]=Math.floor(v);
    return out}catch(e){return null}
}
{
  const box=document.getElementById('progCode'),msg=document.getElementById('progMsg');
  const say=t=>{msg.textContent=t;clearTimeout(say.t);say.t=setTimeout(()=>msg.textContent='',4000)};
  document.getElementById('progCopy').addEventListener('click',()=>{const c=exportProgress();box.value=c;box.select();
    try{navigator.clipboard.writeText(c).then(()=>say('Progress code copied.'),()=>say('Code is selected above. Copy it from there.'))}catch(e){say('Code is selected above. Copy it from there.')}});
  document.getElementById('progReport').addEventListener('click',()=>{const r=playtestReport();box.value=r;box.select();
    try{navigator.clipboard.writeText(r).then(()=>say('Playtest report copied. Paste it wherever you send feedback.'),()=>say('Report is selected above. Copy it from there.'))}catch(e){say('Report is selected above. Copy it from there.')}});
  let arm=0;document.getElementById('progLoad').addEventListener('click',e=>{const d=importProgress(box.value);if(!d){say('That code could not be read.');return}
    if(!arm){arm=1;e.currentTarget.textContent='Click again to replace this device\'s progress';setTimeout(()=>{arm=0;document.getElementById('progLoad').textContent='Load progress code'},4000);return}
    arm=0;document.getElementById('progLoad').textContent='Load progress code';save=d;persist();P.wpn=0;state='title';say('Progress loaded.')});
}

/* ---------- Records screen ---------- */
function recordsStep(){
  if(recPage===2){practiceStep();return}
  if(pr('left')&&recPage>0||pr('right')){recPage=pr('right')?recPage+1:recPage-1;snd(600,.05,'square',0,.03);return}
  if(pr('back')||pr('start')||pr('jump')){state='select';sel=B_REC}
}
function drawRecords(){
  drawBG(STAGES[0].th);dim(.78);
  text('RECORDS',VW/2,30,20,GOLD,'center',8);
  text(['Achievements','Times','Practice'].map((n,i)=>i===recPage?'['+n+']':n).join('   ·   '),VW/2,46,9,'rgba(243,233,255,.6)','center',0);
  if(recPage===2){drawPractice();text('↑↓←→ choose · Enter start · ← from the first column for Times · Esc back',VW/2,262,8,'rgba(243,233,255,.5)','center',0,460);return}
  if(recPage===0){
    const got=ACH_IDS.filter(id=>save.ach&&save.ach[id]).length;text(got+' of '+ACH.length+' unlocked',VW-16,30,9,GOLD,'right',0);
    const per=Math.ceil(ACH.length/2),gap=Math.min(22,160/(per-1)); // two columns that grow with the list
    ACH.forEach((a,i)=>{const col=i<per?0:1,row=i%per,x=20+col*226,y=66+row*gap,on=!!(save.ach&&save.ach[a[0]]);
      ctx.strokeStyle=on?GOLD:'rgba(255,255,255,.2)';ctx.lineWidth=1;ctx.strokeRect(x+.5,y-8.5,9,9);if(on){ctx.fillStyle=GOLD;ctx.fillRect(x+2,y-7,6,6)}
      text(a[1]+(a[3]?' *':''),x+16,y,10,on?GOLD:CRM,'left',on?4:0,205);text(a[2],x+16,y+(OPT.big?11:10),8,'rgba(243,233,255,.55)','left',0,205)});
    text('* needs assist off',20,252,8,'rgba(243,233,255,.5)','left',0);
  }else{
    const rows=[...CARD.map(i=>[STAGES[i].name,i]),['Boss Rush',-1]];
    text('Sector',24,70,9,'rgba(243,233,255,.6)','left',0);text('Best',230,70,9,'rgba(243,233,255,.6)','right',0);text('Best on Hard',330,70,9,'rgba(243,233,255,.6)','right',0);text('Splits ('+(hard?'Hard':'Normal')+')',350,70,9,'rgba(243,233,255,.6)','left',0);
    rows.forEach(([n,i],r)=>{const y=86+r*17,b=i<0?save.rush[0]:save.best[i],h=i<0?save.rush[1]:save.bestH[i];
      text(n,24,y,10,CRM,'left',0);text(b?fmt(b):'—',230,y,10,b?MINT:'rgba(243,233,255,.35)','right',0);text(h?fmt(h):'—',330,y,10,h?CORAL:'rgba(243,233,255,.35)','right',0);
      const sp=i<0?null:((hard?save.splitsH:save.splits)||[])[i];text(sp&&sp.length?sp.map(f=>fmt(f)).join(' '):'—',350,y,8,'rgba(243,233,255,.6)','left',0)});
    const st=save.stats||{};text('Enemies defeated '+(st.kills||0)+'   ·   Pickups '+(st.pickups||0)+'   ·   Reboots '+(st.reboots||0),VW/2,230,9,CRM,'center',0);
  }
  text('← → switch page · Esc back',VW/2,264,8,'rgba(243,233,255,.5)','center',0);
}
function drawToasts(){
  if(!TOASTS.length)return;const q=TOASTS[0];q.t--;if(q.t<=0){TOASTS.shift();return}
  const al=Math.min(1,q.t/20,(200-q.t)/12),w=Math.max(150,q.s.length*7+90);ctx.globalAlpha=al;
  ctx.fillStyle='rgba(8,3,20,.9)';ctx.fillRect(VW-w-8,40,w,26);ctx.strokeStyle=GOLD;ctx.lineWidth=1;ctx.strokeRect(VW-w-7.5,40.5,w-1,25);
  text('ACHIEVEMENT',VW-w,51,7,'rgba(255,209,102,.8)','left',0);text(q.s,VW-w,62,10,GOLD,'left',4);ctx.globalAlpha=1;
}
