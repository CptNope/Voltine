// Voltline · gallery.js · The level gallery: curated levels from levels.json, played without touching your own editor level.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
const GAL={list:[],status:'idle',err:''};
let gsel=0,gOff=0;
function loadGallery(){
  if(GAL.status==='ok'||GAL.status==='loading')return;
  GAL.status='loading';
  try{
    fetch('levels.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(j=>{
      const out=[];for(const e of(Array.isArray(j&&j.levels)?j.levels:[]).slice(0,100)){const L=decodeLevel(e&&e.code);if(L)out.push(L)}
      GAL.list=out;GAL.status=out.length?'ok':'err';GAL.err=out.length?'':'The gallery file has no readable levels.';
    }).catch(()=>{GAL.status='err';GAL.err=location.protocol==='file:'?'The gallery needs the web version (it can\'t load files when opened from disk).':'The gallery could not be loaded. Check your connection.'});
  }catch(e){GAL.status='err';GAL.err='The gallery could not be loaded.'}
}
function galleryStep(){
  const n=GAL.list.length;
  if(pr('back')){state='select';sel=B_GAL;return}
  if(GAL.status!=='ok'){if(GAL.status==='err'&&(pr('start')||pr('jump'))){GAL.status='idle';loadGallery()}return}
  if(pr('down')){gsel=(gsel+1)%n;snd(600,.04,'square',0,.03)}if(pr('up')){gsel=(gsel+n-1)%n;snd(600,.04,'square',0,.03)}
  if(pr('start')||pr('jump')){playShared(GAL.list[gsel],'gallery');snd(440,.1,'square',880,.04)}
}
function drawGallery(){
  drawBG(STAGES[TH_ST[(GAL.list[gsel]||{th:0}).th]].th);dim(.85);
  text('LEVEL GALLERY',VW/2,30,20,GOLD,'center',8);
  if(GAL.status!=='ok'){text(GAL.status==='loading'||GAL.status==='idle'?'Loading levels…':GAL.err,VW/2,130,11,GAL.status==='err'?CORAL:CRM,'center',0,440);
    if(GAL.status==='err')text('Enter to retry · Esc back',VW/2,160,9,'rgba(243,233,255,.6)','center',0);return}
  const n=GAL.list.length,vis=10;gOff=Math.max(0,Math.min(n-vis,gsel-4));
  text('Level',24,52,8,'rgba(243,233,255,.55)','left',0);text('Boss',250,52,8,'rgba(243,233,255,.55)','left',0);text('Length',350,52,8,'rgba(243,233,255,.55)','left',0);text('Your best',456,52,8,'rgba(243,233,255,.55)','right',0);
  GAL.list.slice(gOff,gOff+vis).forEach((L,r)=>{const i=gOff+r,on=i===gsel,y=70+r*17,best=save.gal&&save.gal[levelHash(L)];
    if(on){ctx.fillStyle='rgba(255,209,102,.08)';ctx.fillRect(16,y-12,448,16)}
    text((on?'▸ ':'')+(L.n||'Untitled')+(L.a?'  ·  '+L.a:''),24,y,10,on?GOLD:CRM,'left',on?5:0,214);
    text(BN[L.b].toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()),250,y,9,'rgba(243,233,255,.75)','left',0,96);
    text(L.w+' cols'+(isVerified(L)?' ✓':''),350,y,9,isVerified(L)?MINT:'rgba(243,233,255,.6)','left',0,90);
    text(best?fmt(best):'—',456,y,9,best?MINT:'rgba(243,233,255,.35)','right',0)});
  const L=GAL.list[gsel];text(THN[L.th]+' theme  ·  '+(isVerified(L)?'route verified':'not verified'),VW/2,248,9,'rgba(243,233,255,.6)','center',0);
  text('↑ ↓ choose · Enter play · Esc back',VW/2,264,8,'rgba(243,233,255,.5)','center',0);
}
