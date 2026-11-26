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
 ['all_weapons','Full Arsenal','Own all four boss weapons',0],
 ['all_wardens','Wardens Down','Beat all four wardens',0],
 ['core','The Grid Is Free','Clear the Null Core',0],
 ['hard_core','Hard Light','Clear the Null Core on Hard',1],
 ['rush','Gauntlet','Finish Boss Rush',0],
 ['rush_hard','Iron Gauntlet','Finish Boss Rush on Hard',1],
 ['speed','Prism Sprint','Clear Prism Grid in under 2:30',1],
 ['kills','Centurion','Defeat 100 enemies',0],
 ['maker','Architect','Beat a level you built in the editor',0]];
const ACH_IDS=ACH.map(a=>a[0]);
if(!save.ach||typeof save.ach!=='object')save.ach={};
if(!save.stats||typeof save.stats!=='object')save.stats={kills:0,pickups:0,reboots:0};
if(!Array.isArray(save.splits))save.splits=[];if(!Array.isArray(save.splitsH))save.splitsH=[];
let TOASTS=[],runSplits=[],bossHurt=false,recPage=0;

function ach(id){
  if(silent)return;if(!save.ach)save.ach={};const a=ACH.find(x=>x[0]===id);if(!a||save.ach[id])return;if(a[3]&&assistOn())return;
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
  save.log.push(Object.assign({s:ST.key,h:hard?1:0,a:assistOn()?1:0,when:Date.now()},o));if(save.log.length>400)save.log.splice(0,save.log.length-400);persist();
}
function playtestReport(){
  const L=Array.isArray(save.log)?save.log:[],keys=['prism','foundry','sky','tide','core','rush'],nm={prism:'Prism Grid',foundry:'Coil Foundry',sky:'Sky Relay',tide:'Tide Vault',core:'Null Core',rush:'Boss Rush'};
  const out=['Voltline playtest report · version '+VERSION+' · '+new Date().toISOString().slice(0,10),'Events logged: '+L.length+(assistOn()?' · assist or slow mode is on now':'')+(hard?' · Hard is selected now':''),''];
  for(const k of keys){const ev=L.filter(e=>e.s===k);if(!ev.length)continue;
    const d=ev.filter(e=>e.e==='death'),c=ev.filter(e=>e.e==='clear'),b=ev.filter(e=>e.e==='boss');
    out.push(nm[k]+': '+c.length+' clear'+(c.length===1?'':'s')+(c.length?' (fastest '+fmt(Math.min(...c.map(e=>e.t)))+')':'')+', '+d.length+' death'+(d.length===1?'':'s'));
    const spots={};for(const e of d){const key=e.b?'boss fight ('+(BN[e.b]||e.b)+')':'columns '+Math.floor(e.x/5)*5+'-'+(Math.floor(e.x/5)*5+4);(spots[key]=spots[key]||{n:0,c:{}}).n++;spots[key].c[e.c]=(spots[key].c[e.c]||0)+1}
    Object.entries(spots).sort((a,b)=>b[1].n-a[1].n).slice(0,5).forEach(([w,v])=>out.push('  '+v.n+' × '+w+' ('+Object.entries(v.c).map(([c,n])=>n+' '+c).join(', ')+')'));
    const byB={};for(const e of b)(byB[e.k]=byB[e.k]||[]).push(e.d);
    for(const [kk,ds] of Object.entries(byB))out.push('  boss '+(BN[kk]||kk)+': '+ds.length+' win'+(ds.length===1?'':'s')+', average fight '+fmt(ds.reduce((x,y)=>x+y,0)/ds.length)+', range '+fmt(Math.min(...ds))+'-'+fmt(Math.max(...ds)));
    out.push('')}
  if(L.length===0)out.push('No events yet. Play a few stages first.');
  return out.join('\n');
}

/* ---------- progress codes ---------- */
function exportProgress(){return 'VS1.'+btoa(JSON.stringify(save))}
function importProgress(code){
  try{const o=JSON.parse(atob(String(code).trim().replace(/^VS1\./,'')));if(!o||!Array.isArray(o.cleared))return null;
    const nums=(a,n)=>Array.from({length:n},(_,i)=>{const v=Array.isArray(a)?a[i]:0;return Number.isFinite(v)&&v>=0?Math.floor(v):0});
    const spl=a=>Array.isArray(a)?a.slice(0,8).map(r=>Array.isArray(r)?nums(r,Math.min(r.length,6)):[]):[];
    const out={cleared:nums(o.cleared,6).map(v=>v?1:0),best:nums(o.best,6),bestH:nums(o.bestH,6),rush:nums(o.rush,2),ach:{},stats:{},splits:spl(o.splits),splitsH:spl(o.splitsH)};
    for(const id of ACH_IDS)if(o.ach&&o.ach[id])out.ach[id]=1;
    for(const k of['kills','pickups','reboots'])out.stats[k]=nums([o.stats&&o.stats[k]],1)[0];
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
  if(pr('left')||pr('right')){recPage=1-recPage;snd(600,.05,'square',0,.03)}
  if(pr('back')||pr('start')||pr('jump')){state='select';sel=7}
}
function drawRecords(){
  drawBG(STAGES[0].th);dim(.78);
  text('RECORDS',VW/2,30,20,GOLD,'center',8);
  text((recPage?'◀ Achievements':'Achievements')+'   ·   '+(recPage?'Times':'Times ▶'),VW/2,46,9,'rgba(243,233,255,.6)','center',0);
  if(recPage===0){
    const got=ACH_IDS.filter(id=>save.ach&&save.ach[id]).length;text(got+' of '+ACH.length+' unlocked',VW-16,30,9,GOLD,'right',0);
    ACH.forEach((a,i)=>{const col=i<8?0:1,row=i%8,x=20+col*226,y=66+row*22,on=!!(save.ach&&save.ach[a[0]]);
      ctx.strokeStyle=on?GOLD:'rgba(255,255,255,.2)';ctx.lineWidth=1;ctx.strokeRect(x+.5,y-8.5,9,9);if(on){ctx.fillStyle=GOLD;ctx.fillRect(x+2,y-7,6,6)}
      text(a[1]+(a[3]?' *':''),x+16,y,10,on?GOLD:CRM,'left',on?4:0,205);text(a[2],x+16,y+(OPT.big?11:10),8,'rgba(243,233,255,.55)','left',0,205)});
    text('* needs assist off',20,252,8,'rgba(243,233,255,.5)','left',0);
  }else{
    const rows=[...CARD.map(i=>[STAGES[i].name,i]),['Boss Rush',-1]];
    text('Sector',24,70,9,'rgba(243,233,255,.6)','left',0);text('Best',230,70,9,'rgba(243,233,255,.6)','right',0);text('Best on Hard',330,70,9,'rgba(243,233,255,.6)','right',0);text('Splits ('+(hard?'Hard':'Normal')+')',350,70,9,'rgba(243,233,255,.6)','left',0);
    rows.forEach(([n,i],r)=>{const y=90+r*20,b=i<0?save.rush[0]:save.best[i],h=i<0?save.rush[1]:save.bestH[i];
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
