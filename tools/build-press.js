// Builds the press kit in docs/press/: screenshots, a 30-second gameplay GIF and the logo, by driving the
// real game frame by frame in headless Chrome. Not part of CI. Needs puppeteer-core, Chrome and ffmpeg.
//   python3 -m http.server 8765 &   (from the repo root)
//   PUPPETEER=/path/to/puppeteer-core node tools/build-press.js
// Everything is seeded and stepped by hand (the game's own loop is paused), so it comes out the same each time.
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const puppeteer = require(process.env.PUPPETEER || 'puppeteer-core');
const OUT = path.join(__dirname, '..', 'docs', 'press'), TMP = fs.mkdtempSync('/tmp/voltline-press-');
fs.mkdirSync(path.join(OUT, 'screenshots'), { recursive: true });
const URL = process.env.URL || 'http://localhost:8765/index.html';
// a simple fighter: keeps its distance, jumps now and then, fires with the boss's weakness weapon
// Damage and death are switched off (so the hero never blinks), and `silent` keeps achievements, toasts and
// boss cards off screen. A simple fighter keeps its distance, jumps now and then and fires the boss's weakness.
const BOT = `window.hurt=()=>{};window.die=()=>{};silent=true;
  window.__bot=(i)=>{P.hp=28;EN.fill(28);const tx=B?B.x+B.w/2:P.x+200;if(B&&B.hp<8)B.hp=8;
  K.right=P.x<tx-110;K.left=P.x>tx-40;K.jump=i%40<12;K.fire=i%8<4;if(B&&WEAK[B.kind]!==undefined)P.wpn=WEAK[B.kind];if(B&&B.kind==='null')P.wpn=2};
  window.__run=(i)=>{K.right=true;K.jump=i%50<14;K.fire=i%12<4;K.up=i%100<40};
  window.__stand=(i)=>{K.right=false;K.left=false;K.jump=false;K.fire=i%30<4};
  window.__demo=demoDecode(DEMO_INPUT);window.__feed=(i)=>{const f=__demo[Math.min(i,__demo.length-1)];for(const k of['right','left','jump','down','up'])K[k]=!!f[k];K.fire=i%16<3};`;
const SCENES = [
  ['01-prism-grid', `startStage(0,1);MBdone=true;introT=0;`, 'feed', 760],
  ['02-orbiter', `save.cleared=[1,1,1,1,0,1,0,1,1];startStage(7,3);introT=0;P.x=(ARENA+6)*16;P.y=150;`, 'bot', 520],
  ['03-tide-vault', `startStage(5,2);introT=0;MBdone=true;P.x=118*16;P.y=200;`, 'run', 150],
  ['04-phase-lab', `save.cleared=[1,1,1,1,0,1,0,1,1];startStage(8,4);introT=0;MBdone=true;P.x=112*16;P.y=150;`, 'run', 110],
  ['05-null-engine', `save.cleared=[1,1,1,1,0,1,0,1,1];startStage(3,5);introT=0;P.x=(ARENA+6)*16;P.y=150;`, 'bot', 700],
  ['06-endless', `startEndless();introT=0;enExtend(8);P.x=(16*9+1)*16;P.y=groundY(16*9+1)-22;camX=P.x-140;EL.wave=P.x-200;`, 'stand', 100],
  ['07-stage-select', `save.cleared=[1,1,1,0,0,1,0,1,0];save.rooms={r01:420,r02:600,r04:800};state='select';sel=7;`, null, 30],
  ['08-challenges', `save.cleared=[1,1,1,0,0,1,0,1,0];save.rooms={r01:420,r02:600,r04:800,r10:700};save.endless=164;state='rooms';rsel=1;`, null, 30],
];
// the GIF montage: [setup, driver, frames, frames to skip first, then-setup]; 1800 frames = 30 s at 12 fps
const MONTAGE = [
  [`startStage(0,1);MBdone=true;introT=0;`, 'feed', 720],
  [`save.cleared=[1,1,1,1,0,1,0,1,1];startStage(7,3);introT=0;P.x=(ARENA+6)*16;P.y=150;`, 'bot', 420, 260],
  [`startStage(8,4);introT=0;MBdone=true;P.x=112*16;P.y=150;`, 'run', 240],
  [`save.cleared=[1,1,1,1,0,1,0,1,1];startStage(8,6);introT=0;P.x=(ARENA+6)*16;P.y=150;`, 'bot', 300, 200],
  [`startEndless();introT=0;enExtend(8);P.x=(16*9+1)*16;P.y=groundY(16*9+1)-22;camX=P.x-140;EL.wave=P.x-200;`, 'stand', 120],
];
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const pg = await b.newPage(); await pg.setViewport({ width: 1100, height: 900, deviceScaleFactor: 2 });
  await pg.goto(URL); await new Promise(r => setTimeout(r, 1200));
  await pg.evaluate(`window.requestAnimationFrame=()=>0;OPT.gq=1;OPT.mv=0;OPT.sv=0;save.story=1;fit();${BOT}`);
  const grab = async file => { const d = await pg.evaluate('cv.toDataURL("image/png")'); fs.writeFileSync(file, Buffer.from(d.split(',')[1], 'base64')); };
  const run = (drv, n, from = 0) => pg.evaluate(`(()=>{for(let i=${from};i<${from + n};i++){${drv ? `__${drv}(i);` : ''}step()}draw()})()`);
  for (const [name, setup, drv, n, then] of SCENES) {
    await pg.evaluate(setup); await run(drv, n); if (then) { await pg.evaluate(then); await run(null, 1); }
    await grab(path.join(TMP, name + '.png'));
    execSync(`ffmpeg -loglevel error -y -i ${TMP}/${name}.png -vf scale=960:544:flags=lanczos ${OUT}/screenshots/${name}.png`);
    console.log('screenshot', name);
  }
  let f = 0;
  for (const [setup, drv, n, skip = 0, then] of MONTAGE) {
    await pg.evaluate(setup); if (skip) await run(drv === 'stand' ? 'run' : drv, skip); if (then) await pg.evaluate(then);
    for (let i = 0; i < n; i += 5) { await run(drv, 5, skip + i); await grab(path.join(TMP, `g${String(f++).padStart(4, '0')}.png`)); }
  }
  console.log('montage frames', f);
  // logo: the icon's helmet and the wordmark in the bundled font, on transparent and dark backgrounds
  for (const dark of [false, true]) {
    const d = await pg.evaluate(`(async()=>{await document.fonts.load('700 120px "Chakra Petch"');const c=document.createElement('canvas');c.width=1200;c.height=360;const x=c.getContext('2d');
      if(${dark}){x.fillStyle='#120726';x.fillRect(0,0,1200,360)}
      const im=new Image();im.src='icon-512.png';await im.decode();x.save();x.beginPath();x.arc(190,180,150,0,6.283);x.clip();x.drawImage(im,40,30,300,300);x.restore();
      x.font='700 150px "Chakra Petch"';x.textBaseline='middle';x.fillStyle='#5ef2c4';x.shadowColor='#5ef2c4';x.shadowBlur=30;x.fillText('VOLTLINE',360,170);x.shadowBlur=0;x.fillText('VOLTLINE',360,170);
      x.font='500 34px "Chakra Petch"';x.fillStyle='#ffe9c7';x.fillText('a vector action platformer',366,268);return c.toDataURL('image/png')})()`);
    fs.writeFileSync(path.join(OUT, dark ? 'logo-dark.png' : 'logo.png'), Buffer.from(d.split(',')[1], 'base64'));
  }
  await b.close();
  execSync(`ffmpeg -loglevel error -y -framerate 12 -i ${TMP}/g%04d.png -vf "scale=480:272:flags=lanczos,palettegen=max_colors=96:stats_mode=diff" ${TMP}/pal.png`);
  execSync(`ffmpeg -loglevel error -y -framerate 12 -i ${TMP}/g%04d.png -i ${TMP}/pal.png -lavfi "scale=480:272:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" ${OUT}/voltline-30s.gif`);
  execSync(`ffmpeg -loglevel error -y -framerate 12 -i ${TMP}/g%04d.png -vf "scale=960:544:flags=lanczos,format=yuv420p" -c:v libx264 -preset veryfast -crf 24 ${OUT}/voltline-30s.mp4`);
  for (const n of ['voltline-30s.gif', 'voltline-30s.mp4']) console.log(n, (fs.statSync(path.join(OUT, n)).size / 1048576).toFixed(1) + ' MB');
  fs.rmSync(TMP, { recursive: true, force: true });
})();
