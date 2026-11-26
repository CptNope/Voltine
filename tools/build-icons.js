// Draws icon-192.png and icon-512.png with headless Chrome (canvas), keeping everything inside the
// maskable-icon safe zone: a centred circle 80% of the icon's width. Run: node tools/build-icons.js
// Needs puppeteer-core and a Chrome binary (CHROME=/path/to/chrome); it isn't part of CI.
const fs = require('fs'), path = require('path');
const puppeteer = require(process.env.PUPPETEER || 'puppeteer-core');
const draw = `(S)=>{const c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d'),k=S/512;x.scale(k,k);
  const g=x.createRadialGradient(256,200,40,256,256,380);g.addColorStop(0,'#2b1150');g.addColorStop(1,'#0d0520');x.fillStyle=g;x.fillRect(0,0,512,512);
  x.lineJoin='round';x.lineCap='round';
  // helmet: the hero's head, centred, with the fin swept back inside the safe zone
  const glow=(c,b)=>{x.strokeStyle=c;x.shadowColor=c;x.shadowBlur=b};
  x.beginPath();x.moveTo(176,214);x.lineTo(138,162);x.lineTo(196,186);x.lineWidth=22;glow('#ff8a3d',26);x.stroke();
  x.beginPath();x.moveTo(186,190);x.lineTo(330,182);x.lineTo(366,236);x.lineTo(356,318);x.lineTo(250,334);x.lineTo(196,300);x.closePath();x.fillStyle='#160a2c';x.fill();x.lineWidth=24;x.stroke();
  x.beginPath();x.moveTo(262,252);x.lineTo(338,250);x.lineWidth=20;glow('#5ef2c4',30);x.stroke();x.strokeStyle='#d9fff2';x.lineWidth=7;x.shadowBlur=0;x.stroke();
  // the volt line
  x.beginPath();x.moveTo(150,388);x.lineTo(218,388);x.lineTo(242,362);x.lineTo(270,410);x.lineTo(294,388);x.lineTo(362,388);x.lineWidth=14;glow('#ffd166',22);x.stroke();
  return c.toDataURL('image/png')}`;
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const pg = await b.newPage();
  for (const S of [192, 512]) {
    const url = await pg.evaluate(`(${draw})(${S})`);
    fs.writeFileSync(path.join(__dirname, '..', `icon-${S}.png`), Buffer.from(url.split(',')[1], 'base64'));
  }
  await b.close(); console.log('Wrote icon-192.png and icon-512.png');
})();
