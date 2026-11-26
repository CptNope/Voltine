// Voltline · render.js · All drawing: backgrounds, tiles, sprites, HUD, menus and overlays.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
/* ---------- drawing ---------- */
const hash=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
function glow(c,b=6){ctx.strokeStyle=c;ctx.shadowColor=c;ctx.shadowBlur=b}
function ridge(par,step,amp,base,col,fill,blocky){
  const off=camX*par,i0=Math.floor(off/step)-1;ctx.beginPath();
  for(let i=i0;i<=i0+Math.ceil(VW/step)+2;i++){const x=i*step-off,y=base-amp*hash(i);if(i===i0)ctx.moveTo(x,y);else if(blocky){ctx.lineTo(x,ctx._ly);ctx.lineTo(x,y)}else ctx.lineTo(x,y);ctx._ly=y;
    if(blocky&&hash(i+50)>.6){ctx.lineTo(x+6,y);ctx.lineTo(x+6,y-30*hash(i+9)-10);ctx.lineTo(x+12,y-30*hash(i+9)-10);ctx.lineTo(x+12,y)}}
  ctx.lineTo(VW+step,VH);ctx.lineTo(-step,VH);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=1;ctx.globalAlpha=blocky?.32:.6;glow(col,blocky?0:4);ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;
}
// high-contrast palette (Okabe-Ito based): each role keeps one colour that stays distinct under common colour-blindness
// roles chosen after simulating protanopia, deuteranopia and tritanopia: hero blue vs enemy orange stays apart in all three
const HCP={terrain:'#ffffff',hazard:'#ff4f00',enemy:'#ffab00',eshot:'#fff04a',hero:'#56b4e9',hero2:'#ffffff',shot:'#ffffff',health:'#00e08a',energy:'#fff04a',interact:'#fff04a',surf:'#2f8fd8'};
const hc=(c,r)=>OPT.hc?HCP[r]:c;
function drawBG(th){
  if(OPT.hc){ctx.fillStyle='#000';ctx.fillRect(0,0,VW,VH);return}
  const g=ctx.createLinearGradient(0,0,0,VH);g.addColorStop(0,th.sky[0]);g.addColorStop(.7,th.sky[1]);g.addColorStop(1,th.sky[2]);
  ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);
  if(th.deco!=='clouds'){ctx.fillStyle='#e9dcff';for(const s of stars){const x=((s.x-camX*.08)%(VW*2)+VW*2)%(VW*2);if(x<VW){ctx.globalAlpha=.4+.4*Math.sin(tick*.03+s.x);ctx.fillRect(x,s.y,s.r,s.r)}}ctx.globalAlpha=1}
  if(th.deco==='planet'){const px=360-camX*.04;ctx.lineWidth=1.2;glow(PINK,10);ctx.beginPath();ctx.arc(px,64,22,0,6.283);ctx.stroke();ctx.beginPath();ctx.ellipse(px,64,40,8,-.3,0,6.283);glow(GOLD,6);ctx.stroke();ctx.shadowBlur=0;
    ridge(.18,48,60,210,th.r1[0],th.r1[1]);ridge(.4,36,46,236,th.r2[0],th.r2[1])}
  else if(th.deco==='stacks'){ctx.beginPath();ctx.arc(110-camX*.03,70,30,0,6.283);ctx.fillStyle='rgba(255,138,61,.18)';ctx.fill();
    ridge(.18,40,50,200,th.r1[0],th.r1[1],1);
    for(let i=0;i<6;i++){const x=((i*97-camX*.18)%560+560)%560-40,y=150-hash(i)*40-((tick*.3+i*40)%80);ctx.beginPath();ctx.arc(x,y,8+((tick*.3+i*40)%80)/8,0,6.283);ctx.strokeStyle='rgba(255,179,71,.18)';ctx.stroke()}
    ridge(.4,30,40,236,th.r2[0],th.r2[1],1)}
  else if(th.deco==='tide'){
    for(let i=0;i<5;i++){const x=((i*140-camX*.12)%700+700)%700-110;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+40,0);ctx.lineTo(x+110,VH);ctx.lineTo(x+60,VH);ctx.closePath();ctx.fillStyle='rgba(127,216,255,.05)';ctx.fill()}
    ctx.strokeStyle='rgba(180,240,255,.25)';ctx.lineWidth=1;for(let i=0;i<14;i++){const x=((i*53-camX*.2)%560+560)%560-40,y=VH-((tick*.35+i*37)%VH);ctx.beginPath();ctx.arc(x+Math.sin(tick*.03+i)*4,y,1.5+i%3,0,6.283);ctx.stroke()}
    ctx.globalAlpha=.16;ctx.lineWidth=1.2;for(let i=0;i<8;i++){const x=((i*83-camX*.3)%660+660)%660-60;ctx.beginPath();ctx.moveTo(x,VH);for(let k=1;k<=6;k++)ctx.lineTo(x+Math.sin(tick*.02+i+k*.7)*6,VH-k*14);ctx.strokeStyle='#2bb38f';ctx.stroke()}ctx.globalAlpha=1}
  else if(th.deco==='orbit'){const px=330-camX*.03;ctx.beginPath();ctx.arc(px,120,70,0,6.283);ctx.fillStyle='rgba(127,140,255,.08)';ctx.fill();ctx.strokeStyle='rgba(199,210,255,.35)';ctx.lineWidth=1.2;ctx.stroke();
    ctx.beginPath();ctx.ellipse(px,120,120,18,-.25,0,6.283);ctx.strokeStyle='rgba(199,210,255,.25)';ctx.stroke();
    for(let i=0;i<3;i++){const sx=((i*190-camX*.12+tick*.2)%640+640)%640-80,sy=40+i*28;ctx.strokeStyle='rgba(199,210,255,.4)';ctx.strokeRect(sx,sy,10,4);ctx.beginPath();ctx.moveTo(sx-8,sy+2);ctx.lineTo(sx+18,sy+2);ctx.stroke()}
    ridge(.3,44,26,250,th.r1[0],th.r1[1])}
  else if(th.deco==='phase'){ctx.lineWidth=1;for(let i=0;i<9;i++){const y=150+i*i*2.2;ctx.strokeStyle=`rgba(255,157,245,${.06+i*.02})`;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(VW,y);ctx.stroke()}
    for(let i=-6;i<=6;i++){const x=VW/2+i*60-((camX*.4)%60);ctx.beginPath();ctx.moveTo(VW/2+(x-VW/2)*.2,150);ctx.lineTo(x,VH);ctx.strokeStyle='rgba(255,157,245,.12)';ctx.stroke()}
    for(let i=0;i<6;i++){const x=((i*97-camX*.15)%560+560)%560-40,y=30+(i*53)%90,on=(i+PHASE)%2===0;ctx.strokeStyle=on?'rgba(255,157,245,.35)':'rgba(127,216,255,.15)';ctx.strokeRect(x,y,14,14)}}
  else if(th.deco==='core'){const cx=300-camX*.05,cy=96,r0=tick*.003;ctx.lineWidth=1;
    ctx.globalAlpha=.55;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(cx,cy,40+k*28,0,6.283);glow(k===1?'#ff3b5c':'rgba(185,180,214,.5)',k===1?6:0);ctx.stroke()}ctx.globalAlpha=1;
    ctx.beginPath();for(let i=0;i<12;i++){const a=r0+i*.5236;ctx.moveTo(cx+Math.cos(a)*40,cy+Math.sin(a)*40);ctx.lineTo(cx+Math.cos(a)*96,cy+Math.sin(a)*96)}ctx.strokeStyle='rgba(185,180,214,.25)';ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,10+Math.sin(tick*.05)*2,0,6.283);ctx.fillStyle='rgba(255,59,92,.5)';ctx.shadowColor='#ff3b5c';ctx.shadowBlur=16;ctx.fill();ctx.shadowBlur=0;
    ridge(.2,44,40,214,th.r1[0],th.r1[1],1);ridge(.42,32,30,240,th.r2[0],th.r2[1],1)}
  else{ctx.lineWidth=1.2;for(let L=0;L<3;L++){const par=.1+L*.18,yb=60+L*55;ctx.globalAlpha=.35+L*.12;glow(L===2?'#e6efff':th.r1[0],0);
      for(let i=-1;i<6;i++){const x=((i*130+L*50-camX*par)%(650)+650)%650-100;ctx.beginPath();ctx.ellipse(x,yb+hash(i+L*7)*20,40+hash(i+3)*30,8+L*2,0,0,6.283);ctx.fillStyle=th.r1[1];ctx.fill();ctx.stroke()}}ctx.globalAlpha=1;
    ctx.shadowBlur=0;for(let i=0;i<4;i++){const x=((i*170-camX*.25)%680+680)%680-60;ctx.strokeStyle='rgba(207,224,255,.4)';ctx.beginPath();ctx.moveTo(x,272);ctx.lineTo(x,150);ctx.moveTo(x-8,170);ctx.lineTo(x+8,170);ctx.stroke();if(tick%60<30){ctx.fillStyle=CORAL;ctx.fillRect(x-1,148,2,2)}}}
}
function drawTiles(){
  const th=ST.th,a=Math.floor(camX/TS),b=Math.min(W-1,a+VW/TS+1);ctx.fillStyle=OPT.hc?'#0a0a0a':th.fill;
  ctx.beginPath();
  for(let y=0;y<H;y++)for(let x=a;x<=b;x++){const ch=tile(x,y);if(ch==='A'||ch==='B'||!solid(x,y))continue;const X=x*TS,Y=y*TS;ctx.fillRect(X,Y,TS,TS);
    if(!solid(x,y-1)){ctx.moveTo(X,Y+.5);ctx.lineTo(X+TS,Y+.5)}
    if(y<H-1&&!solid(x,y+1)){ctx.moveTo(X,Y+TS-.5);ctx.lineTo(X+TS,Y+TS-.5)}
    if(!solid(x-1,y)){ctx.moveTo(X+.5,Y);ctx.lineTo(X+.5,Y+TS)}
    if(!solid(x+1,y)){ctx.moveTo(X+TS-.5,Y);ctx.lineTo(X+TS-.5,Y+TS)}}
  ctx.lineWidth=OPT.hc?2:1.2;glow(hc(th.edge,'terrain'),OPT.hc?0:6);ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();for(let y=0;y<H;y++)for(let x=a;x<=b;x++)if(tile(x,y)==='#'&&(x+y)%3===0){const X=x*TS,Y=y*TS;ctx.moveTo(X+4,Y+12);ctx.lineTo(X+12,Y+4)}
  ctx.globalAlpha=.15;ctx.strokeStyle=th.edge;ctx.lineWidth=1;ctx.stroke();ctx.globalAlpha=1;
  // low-gravity fields: faint dotted fill
  ctx.fillStyle=OPT.hc?'rgba(255,255,255,.12)':'rgba(199,210,255,.10)';for(let y=0;y<H;y++)for(let x=a;x<=b;x++)if(tile(x,y)==='o'&&(x+y+Math.floor(tick/20))%3===0)ctx.fillRect(x*TS+7,y*TS+7,2,2);
  // phase blocks: solid ones filled, the others dashed; both flash in the last 20 frames before a switch
  if(HASPHASE){const warn=(tick%90)>=70;for(let y=0;y<H;y++)for(let x=a;x<=b;x++){const ch=tile(x,y);if(ch!=='A'&&ch!=='B')continue;const X=x*TS,Y=y*TS,on=solid(x,y),col=ch==='A'?hc('#ff9df5','hero2'):hc('#7fd8ff','interact');
    if(on){ctx.fillStyle=OPT.hc?'#222':'#2a1238';ctx.fillRect(X+1,Y+1,TS-2,TS-2);glow(col,warn&&!OPT.rf&&tick%8<4?0:8);ctx.lineWidth=1.6;ctx.strokeRect(X+1.5,Y+1.5,TS-3,TS-3);ctx.shadowBlur=0}
    else{ctx.setLineDash([2,3]);ctx.strokeStyle=col;ctx.globalAlpha=warn?(OPT.rf?.7:(tick%8<4?.9:.3)):.3;ctx.lineWidth=1;ctx.strokeRect(X+1.5,Y+1.5,TS-3,TS-3);ctx.setLineDash([]);ctx.globalAlpha=1}}}
  ctx.beginPath();const o=(tick*.8)%8;for(let y=0;y<H;y++)for(let x=a;x<=b;x++){const c=tile(x,y);if(c!=='>'&&c!=='<')continue;const X=x*TS,Y=y*TS,d=c==='>'?1:-1;
    for(let k=0;k<2;k++){const cx=X+((k*8+(d>0?o:8-o))%16);ctx.moveTo(cx-2*d,Y+4);ctx.lineTo(cx+1*d,Y+8);ctx.lineTo(cx-2*d,Y+12)}}
  ctx.lineWidth=1.2;glow(hc(GOLD,'interact'),4);ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();for(let y=0;y<H;y++)for(let x=a;x<=b;x++)if(tile(x,y)==='^'){const X=x*TS,Y=y*TS;
    if(th.spike==='lava'){ctx.moveTo(X,Y+TS);for(let k=0;k<=4;k++)ctx.lineTo(X+k*4,Y+5+Math.sin(tick*.1+x+k)*2);ctx.lineTo(X+TS,Y+TS)}
    else for(let k=0;k<2;k++){ctx.moveTo(X+k*8,Y+TS);ctx.lineTo(X+k*8+4,Y+5);ctx.lineTo(X+k*8+8,Y+TS)}}
  if(th.spike==='lava'){ctx.fillStyle=OPT.hc?HCP.hazard:'rgba(255,110,40,.55)';ctx.fill();glow(hc('#ffb347','hazard'),10)}else{glow(hc(th.spike==='barb'?SKY:CORAL,'hazard'),8);if(OPT.hc){ctx.fillStyle=HCP.hazard;ctx.fill()}}ctx.lineWidth=OPT.hc?2:1.3;ctx.stroke();
  ctx.beginPath();for(let y=0;y<H;y++)for(let x=a;x<=b;x++)if(tile(x,y)==='H'){const X=x*TS,Y=y*TS;ctx.moveTo(X+3,Y);ctx.lineTo(X+3,Y+TS);ctx.moveTo(X+13,Y);ctx.lineTo(X+13,Y+TS);ctx.moveTo(X+3,Y+4);ctx.lineTo(X+13,Y+4);ctx.moveTo(X+3,Y+12);ctx.lineTo(X+13,Y+12)}
  glow(hc(GOLD,'interact'),5);ctx.lineWidth=1.2;ctx.stroke();ctx.shadowBlur=0;
  ST.cps.forEach((c,i)=>{if(i===0)return;const X=c*TS+8,gy=groundY(c),lit=cp>=i;ctx.beginPath();ctx.moveTo(X,gy);ctx.lineTo(X,gy-48);ctx.moveTo(X-5,gy-53);ctx.lineTo(X,gy-58);ctx.lineTo(X+5,gy-53);ctx.lineTo(X,gy-48);ctx.closePath();glow(lit?hc(GOLD,'interact'):'#6b5a8e',lit?10:0);ctx.lineWidth=1.3;ctx.stroke();ctx.shadowBlur=0});
  for(const m of MV){if(m.x<camX-40||m.x>camX+VW)continue;ctx.fillStyle=th.fill;ctx.fillRect(m.x,m.y,m.w,m.h);glow(hc(SKY,'terrain'),8);ctx.lineWidth=1.3;ctx.strokeRect(m.x+.5,m.y+.5,m.w-1,m.h-1);
    ctx.beginPath();ctx.moveTo(m.x+8,m.y+m.h);ctx.lineTo(m.x+10,m.y+m.h+3+(tick%6<3?2:0));ctx.moveTo(m.x+24,m.y+m.h);ctx.lineTo(m.x+22,m.y+m.h+3+(tick%6<3?0:2));glow(ORG,6);ctx.stroke()}
  for(const c of CR){if(c.cx<camX-30||c.cx>camX+VW+30)continue;const top=c.bot-16;ctx.fillStyle=th.fill;ctx.fillRect(c.cx-5,-2,10,top+2);ctx.fillRect(c.cx-12,top,24,16);
    glow(hc('#ffb347','hazard'),6);ctx.lineWidth=1.2;ctx.strokeRect(c.cx-5,-2,10,top+2);glow(hc(c.bot>40&&c.bot<240?CORAL:ORG,'hazard'),10);ctx.lineWidth=1.6;ctx.strokeRect(c.cx-12,top,24,16);
    ctx.beginPath();for(let k=0;k<3;k++){ctx.moveTo(c.cx-10+k*8,top+16);ctx.lineTo(c.cx-6+k*8,top+12);ctx.lineTo(c.cx-2+k*8,top+16)}ctx.stroke()}
  ctx.shadowBlur=0;
}
function poly(pts,close=true){ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);if(close)ctx.closePath()}
function drawHero(){
  const p=P;if(state==='dead')return;if(p.inv&&p.hurt===0&&(p.inv>>2)%2){if(!OPT.rf)return;ctx.globalAlpha=.45}
  const WC=WPN[p.wpn].c;
  ctx.save();ctx.translate(Math.round(p.x+p.w/2),Math.round(p.y+p.h));ctx.scale(p.face,1);
  ctx.lineWidth=1.5;ctx.lineJoin='round';ctx.lineCap='round';ctx.fillStyle='#2a1440';
  if(p.slide){
    poly([-9,0,-7,-8,3,-11,10,-6,9,0]);ctx.fill();glow(hc(ORG,'hero'));ctx.stroke();
    poly([3,-8,8,-6],false);glow(WC);ctx.lineWidth=2;ctx.stroke();
    poly([-12,-3,-18,-3],false);ctx.lineWidth=1;glow(hc(CRM,'hero2'),3);ctx.stroke();
  }else if(p.climb){
    const ph=(Math.floor(p.anim/6)%2)?1:-1;
    poly([-2,-7,-3+ph,0],false);glow(hc(ORG,'hero'));ctx.stroke();poly([2,-7,3-ph,-2],false);ctx.stroke();
    poly([-5,-7,-6,-14,5,-14,6,-7]);ctx.fill();ctx.stroke();
    poly([-5,-14,-5,-20,5,-20,5,-14]);ctx.fill();glow(hc(CRM,'hero2'));ctx.stroke();
    poly([-5,-13,-7,-19+ph*2],false);glow(hc(ORG,'hero'));ctx.stroke();poly([5,-13,7,-19-ph*2],false);ctx.stroke();
  }else{
    const air=!p.onG,ph=p.vx&&!air?Math.sin(p.anim*.32):0;
    glow(hc(ORG,'hero'));
    if(air){poly([-2,-7,-5,-4,-3,-1],false);ctx.stroke();poly([2,-7,5,-5,6,-2],false);ctx.stroke()}
    else{poly([-2,-7,-2-ph*3,-3,-2-ph*5,0],false);ctx.stroke();poly([2,-7,2+ph*3,-3,2+ph*5,0],false);ctx.stroke()}
    poly([-5,-7,-6,-14,5,-15,6,-7]);ctx.fill();ctx.stroke();
    const cg=p.charge>30;ctx.beginPath();ctx.arc(0,-11,1.8,0,6.283);ctx.fillStyle=cg&&tick%6<3?GOLD:WC;ctx.fill();ctx.fillStyle='#2a1440';
    poly([-5,-15,-6,-20,-2,-22,5,-21,6,-16,4,-15]);ctx.fill();glow(hc(CRM,'hero2'));ctx.stroke();
    poly([1,-19,6,-18],false);ctx.lineWidth=2;glow(WC,8);ctx.stroke();ctx.lineWidth=1.5;
    poly([-4,-21,-9,-24,-6,-19],false);glow(hc(ORG,'hero'));ctx.stroke();
    if(p.shootT>0){ctx.strokeStyle=hc(CRM,'hero2');ctx.strokeRect(4,-13,9,4);poly([13,-12,13,-10],false);glow(WC);ctx.stroke()}
    else{poly([4,-13,6,-8],false);ctx.stroke()}
  }
  ctx.restore();ctx.globalAlpha=1;
  if(p.charge>30){const r=13+Math.sin(tick*.5)*2;ctx.beginPath();ctx.arc(p.x+p.w/2,p.y+p.h/2,r,0,6.283);glow(p.charge>=55?(OPT.rf||tick%4<2?GOLD:MINT):VIO,8);ctx.lineWidth=1;ctx.stroke()}
  ctx.shadowBlur=0;
}
function drawEnemies(){
  ctx.lineWidth=1.4;ctx.lineJoin='round';
  for(const e of E){if(e.dead||e.x<camX-30||e.x>camX+VW+30)continue;
    const c=e.flash&&!OPT.rf?'#fff':hc({w:GOLD,f:PINK,t:CORAL,s:GOLD,h:ORG,g:'#e6efff',j:'#c89bff',a:'#b9a58c',u:SKY,b:'#ff9df5',q:PHASE===1?CORAL:'#6b5a8e'}[e.type]||CORAL,'enemy'),x=e.x,y=e.y;ctx.fillStyle='#1b0f35';glow(c,7);
    if(e.type==='w'){const l=Math.sin(e.t*.25)*2;ctx.beginPath();ctx.arc(x+7,y+9,7,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();
      poly([x+2,y+9,x+1+l,y+14],false);ctx.stroke();poly([x+12,y+9,x+13-l,y+14],false);ctx.stroke();poly([x+7,y+9,x+7,y+14],false);ctx.stroke();
      ctx.beginPath();ctx.arc(x+7+e.dir*3,y+6,1.6,0,6.283);ctx.fillStyle=CORAL;ctx.fill()}
    else if(e.type==='f'){const w=Math.sin(e.t*.4)*4;poly([x+7,y,x+13,y+6,x+7,y+12,x+1,y+6]);ctx.fill();ctx.stroke();
      poly([x+1,y+5,x-5,y+2+w],false);ctx.stroke();poly([x+13,y+5,x+19,y+2+w],false);ctx.stroke();
      ctx.beginPath();ctx.arc(x+7,y+6,1.6,0,6.283);ctx.fillStyle=MINT;ctx.fill()}
    else if(e.type==='s'){ctx.beginPath();ctx.arc(x+7,y+9,7,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();
      poly([x+3,y+9,x+3,y+14],false);ctx.stroke();poly([x+11,y+9,x+11,y+14],false);ctx.stroke();
      ctx.beginPath();ctx.arc(x+7+e.dir*2,y+6,1.6,0,6.283);ctx.fillStyle=e.open?GOLD:CORAL;ctx.fill();
      const sx=x+7+e.dir*9;if(e.open){poly([sx,y+12,sx+e.dir*4,y+15],false)}else{poly([sx,y-1,sx+e.dir*2,y+6,sx,y+14],false)}glow(OPT.hc?'#fff':SKY,8);ctx.lineWidth=2.2;ctx.stroke();ctx.lineWidth=1.4}
    else if(e.type==='h'){const sq=e.onG?2:0,pts=[];for(let i=0;i<10;i++){const a=i*.628+e.t*.05,r=i%2?3:7;pts.push(x+7+Math.cos(a)*r*(1+sq*.08),y+8+sq+Math.sin(a)*r*(1-sq*.12))}poly(pts);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.arc(x+7,y+8+sq,1.8,0,6.283);ctx.fillStyle=GOLD;ctx.fill()}
    else if(e.type==='j'){ctx.beginPath();ctx.arc(x+7,y+6,6,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.lineWidth=1;for(let k=0;k<3;k++){const tx=x+3+k*4;ctx.beginPath();ctx.moveTo(tx,y+6);ctx.quadraticCurveTo(tx+Math.sin(e.t*.12+k)*3,y+11,tx+Math.sin(e.t*.12+k+1)*2,y+16);ctx.stroke()}ctx.lineWidth=1.4}
    else if(e.type==='a'){const pts=[];for(let i=0;i<8;i++){const a=i*.785+e.t*.01,r=6+((i*37)%5)*.6;pts.push(x+7+Math.cos(a)*r,y+7+Math.sin(a)*r)}poly(pts);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(x+5,y+6,1.5,0,6.283);ctx.stroke()}
    else if(e.type==='u'){ctx.beginPath();ctx.ellipse(x+7,y+9,9,3.5,0,0,6.283);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(x+7,y+7,4,Math.PI,0);ctx.stroke();
      for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(x+2+k*5,y+10,1,0,6.283);ctx.fillStyle=tick%30<15===(k%2===0)?GOLD:'#334';ctx.fill()}}
    else if(e.type==='b'){const ph=e.t%130,s2=ph<10?ph/10:1;poly([x+7,y+7-7*s2,x+7+7*s2,y+7,x+7,y+7+7*s2,x+7-7*s2,y+7]);ctx.fill();ctx.stroke();if(ph>15&&ph<25){ctx.beginPath();ctx.arc(x+7,y+7,9,0,6.283);ctx.stroke()}}
    else if(e.type==='q'){const on=PHASE===1;ctx.beginPath();ctx.arc(x+7,y+8,on?6:4,0,6.283);ctx.fill();ctx.stroke();if(on)for(let k=0;k<6;k++){const a=k*1.047+e.t*.05;poly([x+7+Math.cos(a)*6,y+8+Math.sin(a)*6,x+7+Math.cos(a)*10,y+8+Math.sin(a)*10],false);ctx.stroke()}}
    else if(e.type==='g'){const fl=e.mode?-3:Math.sin(e.t*.3)*3;poly([x-3,y+3+fl,x+4,y+7,x+7,y+10,x+10,y+7,x+17,y+3+fl],false);ctx.lineWidth=1.8;ctx.stroke();ctx.lineWidth=1.4;
      ctx.beginPath();ctx.arc(x+7,y+8,1.5,0,6.283);ctx.fillStyle=GOLD;ctx.fill()}
    else{poly([x,y+14,x+3,y+6,x+13,y+6,x+16,y+14]);ctx.fill();ctx.stroke();const a=e.aim||Math.PI;
      ctx.beginPath();ctx.arc(x+8,y+6,4,Math.PI,0);ctx.stroke();poly([x+8,y+5,x+8+Math.cos(a)*10,y+5+Math.sin(a)*10],false);ctx.lineWidth=2.2;ctx.stroke();ctx.lineWidth=1.4;
      if(e.t%110>90){ctx.beginPath();ctx.arc(x+8+Math.cos(a)*10,y+5+Math.sin(a)*10,2,0,6.283);ctx.fillStyle=GOLD;ctx.fill()}}
  }
  for(const u of PU){const bb=Math.sin(u.t*.1)*1.5,cx=u.x+u.w/2,cy=u.y+u.h/2+bb,r=u.w/2;poly([cx,cy-r,cx+r,cy,cx,cy+r,cx-r,cy]);glow(u.en?hc(GOLD,'energy'):hc(MINT,'health'),8);ctx.stroke();
    if(u.en){poly([cx-2,cy+2,cx,cy-2,cx+2,cy+2],false);ctx.stroke()}else{poly([cx-2,cy,cx+2,cy],false);ctx.stroke();poly([cx,cy-2,cx,cy+2],false);ctx.stroke()}}
  ctx.shadowBlur=0;
}
function drawWarden(b){
  const enr=b.hp<=14,c=b.inv>6&&!OPT.rf?'#fff':OPT.hc?HCP.enemy:enr?CORAL:VIO,x=b.x+14,y=b.y,hov=b.onG?0:2;
  ctx.lineWidth=1.6;ctx.lineJoin='round';ctx.fillStyle='#1b0f35';glow(c,12);
  poly([x,y+hov,x+13,y+10,x+11,y+28,x,y+34,x-11,y+28,x-13,y+10]);ctx.fill();ctx.stroke();
  const sp=tick*.04;poly([x+Math.cos(sp)*7,y+18+Math.sin(sp)*7,x+Math.cos(sp+2.09)*7,y+18+Math.sin(sp+2.09)*7,x+Math.cos(sp+4.19)*7,y+18+Math.sin(sp+4.19)*7]);glow(GOLD,8);ctx.stroke();
  const arm=b.st==='dash'&&b.t<26?-6:b.st==='spread'?-4:0;
  poly([x-13,y+12,x-22,y+20+arm,x-15,y+26],false);glow(c,10);ctx.stroke();poly([x+13,y+12,x+22,y+20+arm,x+15,y+26],false);ctx.stroke();
  poly([x+b.face*2-4,y+9,x+b.face*2+4,y+9],false);ctx.lineWidth=2.4;glow(MINT,10);ctx.stroke();
}
function drawHound(b){
  const enr=b.hp<=14,c=b.inv>6&&!OPT.rf?'#fff':OPT.hc?HCP.enemy:enr?CORAL:GOLD,f=b.face,x=b.x,y=b.y,run=b.vx!==0||!b.onG,lp=run?Math.sin(tick*.5)*4:0;
  ctx.save();ctx.translate(x+17,y);ctx.scale(f,1);ctx.lineWidth=1.6;ctx.lineJoin='round';ctx.fillStyle='#22100e';glow(c,10);
  poly([-15,6,-10,3,9,3,13,7,9,14,-12,14]);ctx.fill();ctx.stroke();
  poly([9,4,14,-3,20,-1,21,5,16,9,11,8]);ctx.fill();ctx.stroke();
  poly([13,-2,12,-7,16,-3],false);ctx.stroke();
  poly([-11,14,-13+lp,22],false);ctx.stroke();poly([-6,14,-4-lp,22],false);ctx.stroke();poly([4,14,2+lp,22],false);ctx.stroke();poly([9,14,11-lp,22],false);ctx.stroke();
  poly([-15,7,-19,3,-17,0,-21,-3,-19,-6],false);glow(SKY,8);ctx.stroke();
  if(b.st==='storm'||tick%20<10){poly([-8,3,-6,-1,-3,2,0,-2,3,2,6,-1],false);glow(SKY,8);ctx.lineWidth=1;ctx.stroke()}
  poly([16,1,19,1],false);ctx.lineWidth=2.4;glow(MINT,10);ctx.stroke();
  ctx.restore();
}
function drawKite(b){
  const enr=b.hp<=14,c=b.inv>6&&!OPT.rf?'#fff':OPT.hc?HCP.enemy:enr?PINK:SKY,x=b.x,y=b.y,fl=Math.sin(tick*.2)*4;
  ctx.lineWidth=1.6;ctx.lineJoin='round';ctx.fillStyle='#0e1a3a';
  ctx.beginPath();ctx.moveTo(x+16,y+20);for(let i=1;i<=6;i++)ctx.lineTo(x+16-b.face*Math.sin(tick*.15+i)*4-b.face*i*2,y+20+i*6);glow(GOLD,6);ctx.stroke();
  for(let i=2;i<=6;i+=2){const tx=x+16-b.face*Math.sin(tick*.15+i)*4-b.face*i*2,ty=y+20+i*6;poly([tx-3,ty-2,tx+3,ty+2],false);ctx.stroke();poly([tx-3,ty+2,tx+3,ty-2],false);ctx.stroke()}
  glow(c,12);poly([x-6,y+8+fl,x+2,y+10],false);ctx.stroke();poly([x+38,y+8+fl,x+30,y+10],false);ctx.stroke();
  poly([x+16,y,x+32,y+10,x+16,y+20,x,y+10]);ctx.fill();ctx.stroke();
  poly([x+16,y+2,x+16,y+18],false);ctx.lineWidth=1;ctx.stroke();poly([x+3,y+10,x+29,y+10],false);ctx.stroke();
  ctx.beginPath();ctx.arc(x+16+b.face*3,y+9,2.2,0,6.283);ctx.fillStyle=GOLD;ctx.shadowColor=GOLD;ctx.fill();
}
function drawNull(b){
  const x=b.x+20,y=b.y+20,c=b.inv>6&&!OPT.rf?'#fff':OPT.hc?HCP.enemy:b.ph===2?CORAL:'#e8e8ff',rot=tick*(b.ph===2?.02:.006),al=b.st==='intro'?Math.min(1,b.t/60):1;
  ctx.globalAlpha=al;ctx.lineWidth=1.6;ctx.lineJoin='round';
  if(b.ph===1&&b.st!=='intro'){ctx.setLineDash([3,5]);ctx.strokeStyle='rgba(185,180,214,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-10,y-20);ctx.lineTo(x-30,0);ctx.moveTo(x+10,y-20);ctx.lineTo(x+30,0);ctx.moveTo(x+20,y);ctx.lineTo(AR(),y-30);ctx.stroke();ctx.setLineDash([]);ctx.lineWidth=1.6}
  const pts=[];for(let i=0;i<8;i++){const a=rot+i*.785;pts.push(x+Math.cos(a)*22,y+Math.sin(a)*22)}poly(pts);ctx.fillStyle='#14101f';ctx.fill();glow(c,12);ctx.stroke();
  const p2=[];for(let i=0;i<4;i++){const a=-rot*2+i*1.571;p2.push(x+Math.cos(a)*15,y+Math.sin(a)*15)}poly(p2);ctx.lineWidth=1;glow(b.ph===2?GOLD:'#b9b4d6',6);ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,8,0,6.283);glow(CORAL,10);ctx.lineWidth=1.6;ctx.stroke();
  const a=Math.atan2(P.y+11-y,P.x+6-x);ctx.beginPath();ctx.arc(x+Math.cos(a)*3.5,y+Math.sin(a)*3.5,3,0,6.283);ctx.fillStyle=GOLD;ctx.shadowColor=GOLD;ctx.fill();
  if(b.ph===2){poly([x-16,y-6,x-9,y-2,x-12,y+6],false);ctx.strokeStyle=CORAL;ctx.lineWidth=1;ctx.stroke();poly([x+14,y-10,x+8,y-4,x+12,y+2],false);ctx.stroke()}
  if(b.sh)for(const o of b.sh){if(o.hp<=0)continue;const q=orbPos(b,o);ctx.beginPath();ctx.arc(q.x,q.y,6,0,6.283);ctx.fillStyle='#14101f';ctx.fill();glow(o.fl?'#fff':'#e8e8ff',10);ctx.lineWidth=1.6;ctx.stroke();
    ctx.beginPath();ctx.arc(q.x,q.y,2+o.hp*.6,0,6.283);ctx.fillStyle=CORAL;ctx.fill()}
  ctx.globalAlpha=1;
}
function drawWater(){
  const a=Math.floor(camX/TS),b=Math.min(W-1,a+VW/TS+1);let any=0;ctx.fillStyle=OPT.hc?'rgba(0,114,178,.4)':'rgba(79,209,197,.16)';
  for(let y=0;y<H;y++)for(let x=a;x<=b;x++)if(tile(x,y)==='~'){ctx.fillRect(x*TS,y*TS,TS,TS);any=1}
  if(!any)return;ctx.beginPath();
  for(let y=0;y<H;y++)for(let x=a;x<=b;x++)if(tile(x,y)==='~'&&tile(x,y-1)!=='~'){const X=x*TS,Y=y*TS;ctx.moveTo(X,Y+1);for(let k=1;k<=4;k++)ctx.lineTo(X+k*4,Y+1+Math.sin(tick*.08+x*2+k)*1.2)}
  ctx.lineWidth=OPT.hc?2:1.2;glow(hc(TEAL,'surf'),6);ctx.globalAlpha=.8;ctx.stroke();ctx.globalAlpha=1;ctx.shadowBlur=0;
}
function drawUndertow(b){
  const enr=b.hp<=14,c=b.inv>6&&!OPT.rf?'#fff':OPT.hc?HCP.enemy:enr?CORAL:TEAL;
  const tr=b.trail&&b.trail.length>30?b.trail:Array.from({length:60},(_,i)=>({x:b.x+13+i*1.3,y:b.y+9+Math.sin(i*.2+tick*.08)*6}));
  ctx.lineWidth=1.5;ctx.lineJoin='round';
  for(let i=36;i>=6;i-=6){const p=tr[Math.min(i,tr.length-1)],r=8-i/7;ctx.beginPath();ctx.arc(p.x,p.y,r,0,6.283);ctx.fillStyle='#071a24';ctx.fill();glow(c,8);ctx.stroke()}
  const t=tr[Math.min(48,tr.length-1)];poly([t.x,t.y,t.x-4,t.y-6,t.x+4,t.y-6]);glow(c,6);ctx.stroke();
  const h=tr[0],n=tr[Math.min(4,tr.length-1)],a=Math.atan2(h.y-n.y,h.x-n.x)||(b.face<0?Math.PI:0);
  ctx.save();ctx.translate(h.x,h.y);ctx.rotate(a);poly([12,0,4,-7,-8,-6,-10,0,-8,6,4,7]);ctx.fillStyle='#071a24';ctx.fill();glow(c,12);ctx.stroke();
  poly([-2,-6,-6,-13,-8,-6],false);ctx.stroke();ctx.beginPath();ctx.arc(4,-2,2,0,6.283);ctx.fillStyle=GOLD;ctx.shadowColor=GOLD;ctx.fill();ctx.restore();ctx.shadowBlur=0;
}
function drawOrbiter(b){
  const enr=b.hp<=14,c=b.inv>6&&!OPT.rf?'#fff':OPT.hc?HCP.enemy:enr?CORAL:'#c7d2ff',x=b.x+15,y=b.y+15,rot=tick*.01;
  if(b.beams)for(const a of b.beams){const on=b.t>45;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*440,y+Math.sin(a)*440);
    if(on){glow(hc(CORAL,'eshot'),14);ctx.lineWidth=5;ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke()}else{ctx.setLineDash([4,6]);ctx.strokeStyle=OPT.rf||b.t%8<4?hc(GOLD,'eshot'):'rgba(255,209,102,.3)';ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([])}}
  ctx.lineWidth=1.6;ctx.lineJoin='round';ctx.fillStyle='#0b0e24';glow(c,10);
  for(const d of[-1,1]){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillRect(d*14-(d>0?0:16),-5,16,10);ctx.strokeRect(d*14-(d>0?0:16),-5,16,10);ctx.beginPath();ctx.moveTo(d*14,0);ctx.lineTo(d*30,0);ctx.lineWidth=.8;ctx.stroke();ctx.lineWidth=1.6;ctx.restore()}
  ctx.beginPath();ctx.arc(x,y,12,0,6.283);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(x,y,6,0,6.283);glow(hc(GOLD,'enemy'),8);ctx.stroke();
  const a=Math.atan2(P.y+11-y,P.x+6-x);ctx.beginPath();ctx.arc(x+Math.cos(a)*3,y+Math.sin(a)*3,2.4,0,6.283);ctx.fillStyle=MINT;ctx.fill();
  if(b.ms)for(const m of b.ms){ctx.beginPath();ctx.arc(m.x,m.y,4,0,6.283);ctx.fillStyle=hc(CORAL,'eshot');ctx.fill()}
}
function drawMirror(b){
  const enr=b.hp<=14,c=b.inv>6&&!OPT.rf?'#fff':OPT.hc?HCP.enemy:enr?CORAL:'#ff9df5';
  ctx.save();ctx.translate(Math.round(b.x+6),Math.round(b.y+22));ctx.scale(b.face||-1,1);ctx.lineWidth=1.5;ctx.lineJoin='round';ctx.lineCap='round';ctx.fillStyle='#140a1c';glow(c,10);
  const ph=b.onG&&b.vx?Math.sin(tick*.3):0;
  poly([-2,-7,-2-ph*3,-3,-2-ph*5,0],false);ctx.stroke();poly([2,-7,2+ph*3,-3,2+ph*5,0],false);ctx.stroke();
  poly([-5,-7,-6,-14,5,-15,6,-7]);ctx.fill();ctx.stroke();poly([-5,-15,-6,-20,-2,-22,5,-21,6,-16,4,-15]);ctx.fill();ctx.stroke();
  poly([1,-19,6,-18],false);ctx.lineWidth=2;glow(WPN[P.wpn].c,8);ctx.stroke();ctx.lineWidth=1.5;poly([-4,-21,-9,-24,-6,-19],false);glow(c,8);ctx.stroke();
  ctx.strokeRect(4,-13,9,4);ctx.restore();
  if(b.shield>0){ctx.beginPath();ctx.arc(b.x+6,b.y+11,18+Math.sin(tick*.4)*2,0,6.283);glow('#ff9df5',10);ctx.lineWidth=1.4;ctx.stroke()}
}
function drawBoss(b){if(!b)return;if(b.st==='boom'&&b.t%4<2)return;({warden:drawWarden,hound:drawHound,kite:drawKite,undertow:drawUndertow,orbiter:drawOrbiter,mirror:drawMirror,null:drawNull})[b.kind](b);ctx.shadowBlur=0}
function drawShots(){
  for(const w of WARN){ctx.setLineDash([4,4]);ctx.strokeStyle=OPT.rf||w.t%6<3?hc(GOLD,'eshot'):'rgba(255,209,102,.3)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w.x,0);ctx.lineTo(w.x,240);ctx.stroke();ctx.setLineDash([])}
  for(const s of PB){ctx.beginPath();
    if(s.k==='B'){ctx.arc(s.x,s.y,s.r+Math.sin(tick*.6),0,6.283);glow(tick%4<2?hc(MINT,'shot'):hc(GOLD,'shot'),14);ctx.lineWidth=2;ctx.stroke()}
    else if(s.k==='b'){ctx.ellipse(s.x,s.y,4,2,0,0,6.283);ctx.fillStyle=hc(MINT,'shot');ctx.shadowColor=hc(MINT,'shot');ctx.shadowBlur=8;ctx.fill()}
    else if(s.k==='p'){ctx.arc(s.x,s.y,2.6,0,6.283);ctx.fillStyle=hc(PINK,'shot');ctx.shadowColor=hc(PINK,'shot');ctx.shadowBlur=8;ctx.fill()}
    else if(s.k==='a'){ctx.arc(s.x,s.y,s.r,0,6.283);glow(hc(GOLD,'shot'),10);ctx.lineWidth=2;ctx.stroke();ctx.beginPath();for(let i=0;i<3;i++){const a=tick*.5+i*2.1;ctx.moveTo(s.x,s.y);ctx.lineTo(s.x+Math.cos(a)*7,s.y+Math.sin(a)*7)}ctx.lineWidth=1;ctx.stroke()}
    else if(s.k==='d'){ctx.ellipse(s.x,s.y,6,2.5,tick*.5,0,6.283);glow(hc('#c7d2ff','shot'),10);ctx.lineWidth=2;ctx.stroke()}
    else if(s.k==='c'){ctx.arc(s.x,s.y,s.echo>0?3:2.4,0,6.283);ctx.fillStyle=hc('#ff9df5','shot');ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8;ctx.fill();if(s.echo>0){ctx.beginPath();ctx.arc(s.ox,s.oy,3+(18-s.echo)*.3,0,6.283);ctx.strokeStyle='rgba(255,157,245,.4)';ctx.lineWidth=1;ctx.stroke()}}
    else if(s.k==='l'){const d=Math.sign(s.vx);ctx.moveTo(s.x-d*18,s.y);ctx.lineTo(s.x,s.y);glow(hc(TEAL,'shot'),10);ctx.lineWidth=2.4;ctx.stroke();ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-d*5,s.y-3);ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-d*5,s.y+3);ctx.lineWidth=1.4;ctx.stroke()}
    else{ctx.arc(s.x,s.y,s.r,0,6.283);glow(hc(SKY,'shot'),10);ctx.lineWidth=1.6;ctx.stroke()}}
  for(const s of EB){ctx.beginPath();ctx.arc(s.x,s.y,s.r+(OPT.hc?1:0),0,6.283);ctx.fillStyle=hc(s.c||CORAL,'eshot');ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8;ctx.fill();if(OPT.hc){ctx.shadowBlur=0;ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.stroke()}}
  ctx.shadowBlur=0;
  for(const q of PT){ctx.globalAlpha=Math.min(1,q.l/20);ctx.strokeStyle=q.c;ctx.lineWidth=q.orb?2:1.2;ctx.beginPath();if(q.orb){ctx.arc(q.x,q.y,3,0,6.283)}else{ctx.moveTo(q.x,q.y);ctx.lineTo(q.x-q.vx*2,q.y-q.vy*2)}ctx.stroke()}
  ctx.globalAlpha=1;
  for(const q of POP)text(q.s,q.x,q.y,9,q.c,'center',6);
}
function bar(x,y,v,max,col,right){for(let i=0;i<max;i++){const X=right?x-(max-i)*4:x+i*4;if(i<v){ctx.fillStyle=col;ctx.fillRect(X,y,3,7)}else{ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1;ctx.strokeRect(X+.5,y+.5,2,6)}}}
function text(s,x,y,size,col,align='center',bl=8,mw){if(OPT.big&&size<13)size=Math.max(10,size*1.2);ctx.font=`700 ${size}px "Chakra Petch",monospace`;ctx.textAlign=align;ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=bl;if(mw)ctx.fillText(s,x,y,mw);else ctx.fillText(s,x,y);ctx.shadowBlur=0}
const fmt=f=>{const s=Math.floor(f/60);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const dim=a=>{ctx.fillStyle=`rgba(8,3,20,${a})`;ctx.fillRect(0,0,VW,VH)};
function portrait(i,cx,cy,zs=1){const k=STAGES[i].kind,fake={kind:k,x:0,y:0,w:28,h:34,face:-1,inv:0,hp:28,onG:true,st:'idle',t:tick,vx:0,ph:1};
  if(k==='hound'){fake.w=34;fake.h=22}if(k==='kite'){fake.w=32;fake.h=20}let z=1.5;
  if(k==='undertow'){fake.w=26;fake.h=18;z=1.3}
  if(k==='orbiter'){fake.w=30;fake.h=30;z=1.2}
  if(k==='mirror'){fake.w=12;fake.h=22;z=1.7}
  if(k==='null'){fake.w=40;fake.h=40;fake.st='p1';fake.sh=[0,1,2,3].map(j=>({a:j*1.571+tick*.025,hp:3,fl:0}));z=.95}
  z*=zs;ctx.save();ctx.translate(cx-fake.w*z/2,cy-fake.h*z/2);ctx.scale(z,z);drawBoss(fake);ctx.restore()}
function drawSelect(){
  dim(.45);text('SELECT A SECTOR',VW/2,30,18,CRM,'center',6);if(hard)text('HARD',VW-20,30,10,CORAL,'right',6);
  CARD.forEach((i,c)=>{const {x,y,w,h}=cardRect(c),on=c===sel,st=STAGES[i],th=st.th,lock=i===3&&!coreOpen();
    ctx.fillStyle='rgba(14,6,30,.88)';ctx.fillRect(x,y,w,h);glow(on?(lock?'#6b5a8e':th.edge):'rgba(183,163,214,.35)',on&&!lock?12:0);ctx.lineWidth=on?2:1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.shadowBlur=0;
    if(lock){text('?',x+w/2,y+42,28,'#6b5a8e','center',0);text('Beat all six wardens',x+w/2,y+66,8,'rgba(243,233,255,.6)','center',0,w-8);return}
    ctx.save();ctx.beginPath();ctx.rect(x+2,y+2,w-4,46);ctx.clip();portrait(i,x+w/2,y+27,.62);ctx.restore();
    text(st.name,x+w/2,y+60,9,on?th.edge:CRM,'center',on?6:0,w-8);text(st.boss,x+w/2,y+72,7,'rgba(243,233,255,.7)','center',0,w-8);
    if(save.cleared[i]){const bt=(hard?save.bestH:save.best)[i];text(bt?fmt(bt):'✓',x+w-5,y+11,7,GOLD,'right',4)}});
  {const r=cardRect(CARD.length),n=[0,1,2,5,7,8].filter(i=>save.cleared[i]).length;ctx.strokeStyle='rgba(183,163,214,.25)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.strokeRect(r.x+.5,r.y+.5,r.w-1,r.h-1);ctx.setLineDash([]);
   text('WARDENS',r.x+r.w/2,r.y+22,8,'rgba(243,233,255,.6)','center',0);text(n+' / 6',r.x+r.w/2,r.y+46,18,n===6?MINT:CRM,'center',n===6?8:0);text(n===6?'Null Core open':'beat all six',r.x+r.w/2,r.y+64,7,'rgba(243,233,255,.6)','center',0,r.w-8)}
  const bar3=(k,x,label,col,lock)=>{const on=sel===k;ctx.fillStyle='rgba(14,6,30,.85)';ctx.fillRect(x,208,106,22);glow(on?(lock?'#6b5a8e':col):'rgba(183,163,214,.35)',on&&!lock?12:0);ctx.lineWidth=on?2:1;ctx.strokeRect(x+.5,208.5,105,21);ctx.shadowBlur=0;text(label,x+53,223,9,lock?'#6b5a8e':on?col:CRM,'center',on&&!lock?6:0,98)};
  {const rb=save.rush[hard?1:0],lock=!save.cleared[3];bar3(B_RUSH,20,lock?'RUSH · locked':'BOSS RUSH'+(rb?' '+fmt(rb):''),PINK,lock)}
  bar3(B_GAL,131,'GALLERY',SKY,false);
  bar3(B_EDIT,242,'LEVEL EDITOR',GOLD,false);
  {const n=ACH_IDS.filter(id=>save.ach&&save.ach[id]).length;bar3(B_REC,353,'RECORDS '+n+'/'+ACH.length,MINT,false)}
  for(const q of POP)text(q.s,q.x,q.y,10,q.c,'center',6);
  text('ARSENAL',20,252,8,'rgba(243,233,255,.6)','left',0);
  let ax=62;for(let w=0;w<WPN.length;w++){const u=unlocked(w);ctx.strokeStyle=u?WPN[w].c:'rgba(255,255,255,.15)';ctx.lineWidth=1;ctx.strokeRect(ax+.5,243.5,23,12);text(u?WPN[w].s:'--',ax+11.5,253,7,u?WPN[w].c:'rgba(255,255,255,.25)','center',0);ax+=26}
  text(save.cleared[3]?'Grid restored. Chase best times.':coreOpen()?'The Null Core is open.':'← → ↑ ↓ choose · Enter deploy',VW-20,253,8,GOLD,'right',0,190);
}
function drawEdit(){
  drawBG(ST.th);ctx.save();ctx.translate(-Math.round(camX),0);drawTiles();drawEnemies();drawWater();
  const a=Math.floor(camX/TS);ctx.beginPath();for(let x=a;x<=a+31;x++){ctx.moveTo(x*TS+.5,0);ctx.lineTo(x*TS+.5,VH)}for(let y=0;y<=H;y++){ctx.moveTo(a*TS,y*TS+.5);ctx.lineTo((a+31)*TS,y*TS+.5)}ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle='rgba(255,94,168,.08)';ctx.fillRect(ED.w*TS,0,31*TS,VH);text('BOSS ARENA · '+BN[ED.b],ED.w*TS+12,44,10,PINK,'left',4);
  ctx.fillStyle='rgba(94,242,196,.12)';ctx.fillRect(TS,15*TS,4*TS,2*TS);text('START',3*TS,14*TS-4,9,MINT,'center',4);
  for(const c of ED.cr){ctx.setLineDash([2,4]);ctx.strokeStyle='rgba(255,138,61,.5)';ctx.beginPath();ctx.moveTo(c*TS+8,40);ctx.lineTo(c*TS+8,240);ctx.stroke();ctx.setLineDash([])}
  const cx=edc.x*TS,cy=edc.y*TS;glow(tick%30<15?GOLD:CRM,6);ctx.lineWidth=1.5;ctx.strokeRect(cx+.5,cy+.5,TS-1,TS-1);ctx.shadowBlur=0;
  ctx.restore();
  ctx.fillStyle='rgba(8,3,20,.88)';ctx.fillRect(0,0,VW,40);
  TOOLS.forEach((t,i)=>{const x=3+(i%15)*31.6,on=i===edc.tool,ty=Math.floor(i/15)*19;ctx.fillStyle=on?'rgba(255,255,255,.12)':'transparent';ctx.fillRect(x,3+ty,28,16);ctx.strokeStyle=on?t[3]:'rgba(255,255,255,.2)';ctx.lineWidth=on?1.5:1;ctx.strokeRect(x+.5,3.5+ty,27,15);text(t[1],x+14,15+ty,8,on?t[3]:'rgba(243,233,255,.7)','center',0)});
  ctx.fillStyle='rgba(8,3,20,.88)';ctx.fillRect(0,VH-16,VW,16);
  text(TOOLS[edc.tool][2],8,VH-5,9,GOLD,'left',0);text('Z paint · X erase · Q/E tool · R route · Enter test · Esc exit',VW-8,VH-5,9,CRM,'right',0);
  ctx.fillStyle='rgba(8,3,20,.6)';ctx.fillRect(0,110,18,60);ctx.fillRect(VW-18,110,18,60);text('◀',9,144,12,CRM,'center',0);text('▶',VW-9,144,12,CRM,'center',0);
  text('col '+edc.x,VW-24,VH-22,9,'rgba(243,233,255,.6)','right',0);
  if(routeMsg&&routeMsg.t>0){const c=routeMsg.ok?MINT:CORAL;ctx.fillStyle='rgba(8,3,20,.85)';ctx.fillRect(VW/2-170,30,340,20);ctx.strokeStyle=c;ctx.strokeRect(VW/2-169.5,30.5,339,19);text(routeMsg.s,VW/2,44,10,c,'center',4)}
}
const INTRO={prism:'Hold jump to go higher. Down + jump slides under low gaps.',foundry:'Belts push you. Crushers shake before they drop.',sky:'Ride the platforms. Gusts push you back, so wait them out.',core:'Everything you have learned, all at once.',tide:'Tap jump to swim up. Break the surface to leap out.',orbit:'Inside the faint fields you float: jumps go higher and much further.',phase:'Pink and blue blocks take turns being solid. They flash before they switch.',rush:'Four bosses, one clock. A refill comes between fights.'};
function drawOpts(){dim(.93);text('SETTINGS',VW/2,40,20,MINT,'center',8);
  const n=OPT_ITEMS.length,vis=9,off=Math.max(0,Math.min(n-vis,om-4));
  if(off>0)text('▲',VW/2,56,9,'rgba(243,233,255,.5)','center',0);if(off+vis<n)text('▼',VW/2,248,9,'rgba(243,233,255,.5)','center',0);
  OPT_ITEMS.slice(off,off+vis).forEach((it,r)=>{const i=off+r,on=i===om,y=74+r*19,c=on?MINT:'rgba(243,233,255,.8)';
    if(it.k==='back'){text((on?'▸ ':'')+'Back',VW/2,y+2,11,c,'center',on?6:0);return}
    text((on?'▸ ':'')+it.n,VW/2-10,y,11,c,'right',on?6:0);text(optLabel(it.k),VW/2+10,y,11,on?GOLD:CRM,'left',0)});
  if(assistOn())text('Assist or slow mode is on, so best times are not recorded.',VW/2,240,9,CORAL,'center',0);
  text('↑ ↓ choose · ← → change · Esc back',VW/2,262,9,'rgba(243,233,255,.6)','center',0)}
function drawKeys(){dim(.95);text('CONTROLS',VW/2,34,18,MINT,'center',8);
  const rows=[...BIND_ACTS.map(a=>a[0]),'reset','back'],vis=10,off=Math.max(0,Math.min(rows.length-vis,kr-5));
  text('Action',40,52,9,'rgba(243,233,255,.55)','left',0);text('Keyboard',250,52,9,kc===0?GOLD:'rgba(243,233,255,.55)','left',0);text('Gamepad',372,52,9,kc===1?GOLD:'rgba(243,233,255,.55)','left',0);
  rows.slice(off,off+vis).forEach((a,r)=>{const i=off+r,on=i===kr,y=70+r*17;
    if(a==='reset'||a==='back'){text((on?'▸ ':'')+(a==='reset'?'Reset to defaults':'Back'),VW/2,y,10,on?MINT:CRM,'center',on?6:0);return}
    text((on?'▸ ':'')+actName(a),40,y,10,on?MINT:CRM,'left',on?6:0);
    const kk=(BIND[a]||[]).map(keyName).join(' / ')||'—',pp=a in DEF_PAD?((PADB[a]||[]).map(padName).join(' / ')||'—'):'D-pad / stick';
    const cap=capture&&capture.act===a;
    text(cap&&capture.kind==='key'?'press a key…':kk,250,y,10,cap&&capture.kind==='key'?GOLD:on&&kc===0?GOLD:(kk==='—'?CORAL:'rgba(243,233,255,.85)'),'left',0);
    text(cap&&capture.kind==='pad'?'press a button…':pp,372,y,10,cap&&capture.kind==='pad'?GOLD:on&&kc===1&&a in DEF_PAD?GOLD:(pp==='—'?CORAL:'rgba(243,233,255,.6)'),'left',0)});
  if(bindMsg&&bindMsg.t>0)text(bindMsg.s,VW/2,246,9,bindMsg.bad?CORAL:MINT,'center',0);
  text(capture?'Esc cancels':'↑ ↓ choose · ← → keyboard or gamepad · Enter change · Esc back',VW/2,262,9,'rgba(243,233,255,.6)','center',0)}
function draw(){drawMain();drawToasts()}
function drawMain(){
  ctx.setTransform(sc,0,0,sc,0,0);ctx.textBaseline='alphabetic';
  if(state==='route'&&RT){drawBG(ST.th);dim(.6);text('CHECKING ROUTE',VW/2,96,20,GOLD,'center',8);
    const f=Math.max(0,Math.min(1,RT.best/RT.goal));ctx.strokeStyle='rgba(243,233,255,.4)';ctx.lineWidth=1;ctx.strokeRect(VW/2-120.5,120.5,240,10);ctx.fillStyle=GOLD;ctx.fillRect(VW/2-119,122,238*f,7);
    text('furthest column '+Math.floor(RT.best/TS)+' of '+(RT.goal/TS-3)+'  ·  search step '+RT.it,VW/2,150,10,CRM,'center',0);
    text('Enemies are ignored. Esc cancels.',VW/2,170,9,'rgba(243,233,255,.6)','center',0);return}
  if(state==='records'){drawRecords();return}
  if(state==='gallery'){drawGallery();return}
  if(state==='edit'){drawEdit();return}
  const view=(state==='opts'||state==='keys')&&optsFrom!=='pause'?optsFrom:state;
  if(view==='title'||view==='select'){drawBG(STAGES[view==='select'&&sel<CARD.length?CARD[sel]:0].th);
    if(view==='title'){dim(.35);text('VOLTLINE',VW/2,104,46,MINT,'center',18);text('a vector action run across seven sectors',VW/2,128,12,CRM,'center',0);
      text('◀  '+(hard?'HARD':'NORMAL')+'  ▶',VW/2,160,14,hard?CORAL:MINT,'center',8);text(hard?'Hits sting harder, enemies are tougher, pickups heal less':'The standard run',VW/2,176,10,'rgba(243,233,255,.7)','center',0);if(tick%60<40)text('Press Enter or tap to start',VW/2,204,13,GOLD);text('Z jump · X fire (hold to charge) · Down+Z slide · Q/E weapons · O settings',VW/2,240,10,'rgba(243,233,255,.75)','center',0);text('v'+VERSION,VW-8,VH-8,8,'rgba(243,233,255,.4)','right',0);if(pendingShared){ctx.fillStyle='rgba(8,3,20,.9)';ctx.fillRect(60,186,360,34);ctx.strokeStyle=GOLD;ctx.lineWidth=1;ctx.strokeRect(60.5,186.5,359,33);text('Shared level: '+(pendingShared.n||'Untitled')+(pendingShared.a?' by '+pendingShared.a:''),VW/2,200,10,GOLD,'center',4,340);text('Press Enter to play it',VW/2,213,9,CRM,'center',0)}}
    else drawSelect();if(state==='opts')drawOpts();else if(state==='keys')drawKeys();return}
  drawBG(ST.th);
  ctx.save();const sx=shake?(Math.random()-.5)*shake:0,sy=shake?(Math.random()-.5)*shake:0;ctx.translate(-Math.round(camX)+sx,sy);
  drawTiles();drawEnemies();drawMid();drawBoss(B);drawHero();drawShots();drawWater();ctx.restore();
  text('CORE',8,15,9,CRM,'left',0);bar(36,8,P.hp,28,MINT);
  if(P.wpn){text(WPN[P.wpn].s,8,27,9,WPN[P.wpn].c,'left',0);bar(36,20,EN[P.wpn],28,WPN[P.wpn].c)}
  drawMidHUD();
  if(B&&B.st!=='drop'){text(BN[B.kind],VW-8,28,9,CRM,'right',0,150);bar(VW-8,8,Math.min(B.shown,B.hp),28,B.hp<=14?CORAL:PINK,true)}
  text(fmt(clock)+(hard?'  HARD':''),VW/2,15,9,hard?CORAL:'rgba(243,233,255,.7)','center',0);
  if(ST.wind&&gust&&!arena)text('GUST',VW/2,28,9,SKY,'center',4);
  if(B&&B.st==='intro')text(BN[B.kind],VW/2,110,22,ST.th.edge);
  if(ST.rush)text('RUSH '+(rushIdx+1)+'/'+RUSH.length,VW/2,28,9,PINK,'center',4);
  if(ST.custom&&state==='play')text(sharedMode?'Enter: leave level':'Enter: back to editor',VW-8,VH-6,9,'rgba(243,233,255,.55)','right',0);
  if(state==='pause'){dim(.7);text('PAUSED',VW/2,58,24,GOLD);
    const L={resume:'Resume',weapon:'Weapon  ◀ '+WPN[P.wpn].n+' ▶',restart:'Restart from checkpoint',settings:'Settings',quit:ST.custom?'Back to editor':'Quit to stage select'};
    PAUSE_ITEMS.forEach((it,i)=>{const on=i===pm;text((on?'▸ ':'')+L[it],VW/2,92+i*22,12,on?(it==='weapon'?WPN[P.wpn].c:MINT):'rgba(243,233,255,.75)','center',on?6:0)});
    let x=VW/2-WPN.length*28;for(let w=0;w<WPN.length;w++){const u=unlocked(w);text(u?WPN[w].s:'--',x+22,214,9,u?WPN[w].c:'rgba(255,255,255,.25)','center',0);if(u&&w)bar(x+2,219,Math.round(EN[w]/2.8),10,WPN[w].c);x+=56}
    text('↑ ↓ choose · Enter select · Q/E weapon · O settings · Esc resume',VW/2,252,9,'rgba(243,233,255,.6)','center',0)}
  else if(state==='opts')drawOpts();else if(state==='keys')drawKeys();
  else if(state==='play'&&introT>0&&!B){const al=Math.max(0,Math.min(1,introT/40,(200-introT)/20));ctx.globalAlpha=al;ctx.fillStyle='rgba(8,3,20,.8)';ctx.fillRect(VW/2-170,44,340,52);ctx.strokeStyle=ST.th.edge;ctx.lineWidth=1;ctx.strokeRect(VW/2-169.5,44.5,339,51);
    text((ST.custom?(ED.n||(sharedMode?'Shared level':'Your level')):ST.name).toUpperCase(),VW/2,66,16,ST.th.edge,'center',8,320);text(ST.custom?(ED.a?'by '+ED.a:'')+(isVerified()?(ED.a?'  ·  ':'')+'route verified':''):(INTRO[ST.key]||''),VW/2,84,9,CRM,'center',0,320);ctx.globalAlpha=1}
  else if(state==='dead'&&deadT>40){text('SIGNAL LOST',VW/2,130,20,CORAL);text('rebooting at checkpoint',VW/2,150,10,CRM,'center',0)}
  else if(state==='got'&&lastWin.custom){dim(Math.min(.8,gotT/50));text('LEVEL CLEAR',VW/2,100,28,GOLD,'center',12);if(ED.n)text(ED.n,VW/2,120,11,CRM,'center',0,400);text('Time '+fmt(clock)+'  ·  Reboots '+deaths,VW/2,130,12,CRM,'center',0);
    if(gotT>60&&tick%60<40)text(lastWin.shared?(sharedMode==='gallery'?'Press Enter to return to the gallery':'Press Enter to continue'):'Press Enter to return to the editor',VW/2,200,12,GOLD)}
  else if(state==='got'&&lastWin.rush){dim(Math.min(.8,gotT/50));
    text('BOSS RUSH COMPLETE',VW/2,90,24,PINK,'center',12);text(fmt(clock),VW/2,136,34,MINT,'center',14);
    text((lastWin.pb?'New best':'Best '+fmt(save.rush[hard?1:0]))+'  ·  Reboots '+deaths+(hard?'  ·  Hard':''),VW/2,164,11,CRM,'center',0);
    if(gotT>60&&tick%60<40)text('Press Enter to continue',VW/2,230,12,GOLD)}
  else if(state==='got'&&lastWin.fin){dim(Math.min(.8,gotT/50));
    text('NULL ENGINE OFFLINE',VW/2,70,22,CORAL,'center',12);text('Run time '+fmt(clock)+'  ·  Reboots '+deaths,VW/2,92,11,CRM,'center',0);
    if(gotT>30){text('THE GRID IS FREE',VW/2,138,30,MINT,'center',16);const tot=(hard?save.bestH:save.best).reduce((a,b)=>a+b,0);text((hard?'Hard mode best':'Best')+' times across every sector: '+fmt(tot),VW/2,166,11,CRM,'center',0)}
    if(gotT>60){text('Thanks for playing Voltline.',VW/2,196,12,GOLD,'center',6)}
    if(gotT>60&&tick%60<40)text('Press Enter to continue',VW/2,240,12,GOLD)}
  else if(state==='got'){dim(Math.min(.75,gotT/50));const w=WPN[lastWin.w];
    text(STAGES[S].boss+' OFFLINE',VW/2,74,22,ST.th.edge,'center',12);text('Run time '+fmt(clock)+'  ·  Reboots '+deaths,VW/2,96,11,CRM,'center',0);
    if(gotT>20){text('WEAPON ACQUIRED',VW/2,132,11,'rgba(243,233,255,.7)','center',0);text(w.n,VW/2,156,22,w.c,'center',12);text(w.d+' Press Q/E to switch.',VW/2,176,10,CRM,'center',0)}
    if(lastWin.all&&lastWin.first&&gotT>40)text('All six wardens are down. The Null Core has opened.',VW/2,206,12,GOLD,'center',6);
    if(gotT>60&&tick%60<40)text('Press Enter to continue',VW/2,240,12,GOLD)}
}
let acc=0,last=performance.now();
function frame(now){acc+=Math.min(100,now-last);last=now;if(state==='route'){step();acc=0}const dt=state==='play'?1000/60/[1,.75,.5][OPT.spd||0]:1000/60;while(acc>=dt){step();acc-=dt}draw();musicTick();requestAnimationFrame(frame)}
