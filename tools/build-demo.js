// Builds the title screen's attract-mode demo: finds a route through the start of Prism Grid with the
// route checker, turns it into per-frame inputs, adds regular shots, and writes them into js/demo.js.
// The game replays those inputs on a fixed seed with the hero invulnerable, so it plays out the same way
// every time. Run it again after changing Prism Grid: node tools/build-demo.js
const fs = require('fs'), path = require('path');
const runStage = require('./ghost'), { MACROS } = runStage;
const load = require('./harness');
const FRAMES = 60 * 32; // the first 32 seconds are plenty for a demo
const res = runStage(0, { beam: 60, iters: 260 });
if (!res.ok) { console.log('FAIL  no route through Prism Grid'); process.exit(1); }
// expand the macros exactly the way the route checker plays them
const G = load({ seed: 1 });
const expand = mac => { const f = [];
  if (mac.r) for (let i = 0; i < mac.r; i++) f.push({ right: 1 });
  if (mac.l) for (let i = 0; i < mac.l; i++) f.push({ left: 1 });
  if (mac.w) for (let i = 0; i < mac.w; i++) f.push({});
  if (mac.jr) for (let i = 0; i < mac.n; i++) f.push({ right: i < mac.a, jump: i < mac.jr });
  if (mac.jl) for (let i = 0; i < mac.n; i++) f.push({ left: 1, jump: i < mac.jl });
  if (mac.jn) for (let i = 0; i < mac.n; i++) f.push({ jump: i < mac.jn });
  if (mac.slide) { f.push({ down: 1, jump: 1 }); for (let i = 0; i < 40; i++) f.push({ right: 1 }); }
  if (mac.up) for (let i = 0; i < mac.up; i++) f.push({ up: 1, right: i > mac.up - 20 });
  if (mac.down) for (let i = 0; i < mac.down; i++) f.push({ down: 1 });
  if (mac.sw) for (let i = 0; i < mac.sw; i++) f.push({ right: 1, jump: i % 14 < 3 });
  if (mac.su) for (let i = 0; i < mac.su; i++) f.push({ jump: i % 12 < 3 });
  f.push({}); return f; };
const frames = [...Array(5).fill({}), ...res.path.flatMap(i => expand(MACROS[i]))].slice(0, FRAMES);
const BITS = ['right', 'left', 'jump', 'down', 'up'];
const G64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
let out = '', last = -1, run = 0;
const flush = () => { while (run > 0) { const n = Math.min(run, 4095); out += G64[last] + G64[n >> 6] + G64[n & 63]; run -= n; } };
for (const f of frames) { const m = BITS.reduce((a, k, i) => a | (f[k] ? 1 << i : 0), 0); if (m !== last) { flush(); last = m; } run++; }
flush();
const file = path.join(__dirname, '..', 'js', 'demo.js');
let src = fs.readFileSync(file, 'utf8');
src = src.replace(/const DEMO_INPUT='[^']*';/, `const DEMO_INPUT='${out}';`);
fs.writeFileSync(file, src);
console.log(`Wrote ${frames.length} frames (${(frames.length / 60).toFixed(1)}s) as ${out.length} characters`);
