// Builds levels.json from the level recipes below. Every level must pass the route check
// (the same search as the editor's Check route) or the build stops.
// node tools/build-gallery.js
const fs = require('fs'), path = require('path');
const load = require('./harness');
const H = 17, AUTHOR = 'Voltline team';

// --- tiny level-building helpers ------------------------------------------------------
function level(name, w, th, b) {
  const m = Array.from({ length: H }, (_, y) => Array(w).fill(y >= 15 ? '#' : ' '));
  const L = { n: name, a: AUTHOR, w, th, b, ok: '', m, sp: [], mv: [], cr: [], cps: [] };
  const api = {
    L,
    fill(x0, x1, y0, y1, c = '#') { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (x > 0 && x < w && y >= 0 && y < H) m[y][x] = c; return api; },
    gap(x0, x1) { return api.fill(x0, x1, 15, 16, ' '); },
    spikes(x0, x1, y = 14) { return api.fill(x0, x1, y, y, '^'); },
    raise(x0, x1, top) { return api.fill(x0, x1, top, 16); },        // solid ground from row `top` down
    ent(t, x, y) { L.sp.push([t, x, y]); return api; },
    mover(x, y, vertical = 0) { L.mv.push([x, y, vertical ? 1 : 0]); return api; },
    crusher(x) { L.cr.push(x); return api; },
    cp(x) { L.cps.push(x); return api; },
  };
  return api;
}

const RECIPES = [
  () => { // 1
    const l = level('First Steps', 100, 0, 'warden');
    l.fill(14, 16, 13, 14).ent('w', 22, 14).gap(30, 31).fill(40, 42, 13, 14).ent('t', 41, 12).ent('p', 46, 14)
     .gap(52, 53).fill(60, 61, 12, 14).ent('w', 66, 14).ent('f', 72, 9).cp(70).spikes(80, 81).ent('e', 88, 14);
    return l.L;
  },
  () => { // 2
    const l = level('Belt Run', 125, 1, 'hound');
    l.fill(12, 40, 15, 15, '>').crusher(22).crusher(32).spikes(44, 45, 15).fill(44, 45, 16, 16).ent('h', 50, 14)
     .fill(55, 80, 15, 15, '<').crusher(62).crusher(70).ent('p', 84, 14).cp(86)
     .spikes(92, 93, 15).fill(92, 93, 16, 16).fill(98, 112, 15, 15, '>').crusher(104).ent('h', 116, 14).ent('e', 120, 14);
    return l.L;
  },
  () => { // 3
    const l = level('Lift Lines', 125, 2, 'kite');
    l.gap(18, 24).mover(20, 12).gap(34, 40).mover(36, 11, 1).ent('g', 30, 5).ent('p', 46, 14).cp(48)
     .gap(56, 66).mover(58, 12).mover(63, 11).ent('f', 70, 9).gap(80, 86).mover(82, 12, 1).ent('w', 94, 14).cp(96)
     .gap(104, 110).mover(106, 12).ent('e', 116, 14);
    return l.L;
  },
  () => { // 4
    const l = level('Deep Dive', 125, 4, 'undertow');
    l.raise(1, 124, 12).fill(16, 34, 12, 15, '~').spikes(24, 26, 15).ent('j', 20, 13).ent('j', 30, 13)
     .ent('w', 40, 11).fill(46, 72, 12, 15, '~').fill(56, 57, 12, 13).fill(64, 65, 14, 15).ent('j', 52, 14).ent('j', 68, 13).cp(78)
     .ent('p', 80, 11).fill(86, 108, 12, 15, '~').spikes(92, 94, 15).spikes(100, 102, 15).fill(96, 98, 9, 9).ent('j', 104, 13).ent('e', 114, 11);
    return l.L;
  },
  () => { // 5
    const l = level('Spike Garden', 125, 0, 'warden');
    l.spikes(14, 15).spikes(24, 27).fill(25, 26, 12, 12).ent('w', 32, 14).spikes(38, 39).fill(44, 46, 13, 14).ent('s', 50, 14)
     .spikes(56, 60).fill(57, 58, 12, 12).cp(66).ent('p', 68, 14).spikes(74, 75).spikes(80, 81).ent('t', 86, 14)
     .spikes(92, 96).fill(93, 94, 12, 12).ent('s', 104, 14).spikes(110, 111).ent('e', 118, 14);
    return l.L;
  },
  () => { // 6
    const l = level('Crusher Alley', 150, 1, 'hound');
    l.crusher(14).crusher(20).crusher(26).ent('h', 34, 14).fill(40, 70, 15, 15, '>').crusher(46).crusher(52).crusher(58).crusher(64)
     .cp(74).ent('p', 76, 14).spikes(82, 83, 15).fill(82, 83, 16, 16).fill(88, 110, 15, 15, '<').crusher(94).crusher(100).crusher(106)
     .cp(114).ent('e', 116, 14).crusher(124).crusher(130).ent('h', 138, 14);
    return l.L;
  },
  () => { // 7
    const l = level('Gull Coast', 125, 2, 'kite');
    l.ent('g', 16, 5).gap(22, 23).ent('g', 30, 6).fill(36, 38, 13, 14).ent('t', 37, 12).gap(44, 50).mover(46, 12).ent('g', 52, 5)
     .cp(58).ent('p', 60, 14).gap(66, 67).ent('g', 72, 6).fill(78, 79, 12, 14).gap(86, 92).mover(88, 11, 1).ent('g', 96, 5)
     .ent('w', 104, 14).gap(110, 111).ent('e', 118, 14);
    return l.L;
  },
  () => { // 8
    const l = level('Ladder Climb', 100, 3, 'null');
    l.fill(16, 18, 9, 14).fill(15, 15, 9, 14, 'H').ent('t', 17, 8).fill(30, 33, 6, 14).fill(29, 29, 6, 14, 'H').ent('s', 38, 14)
     .cp(42).fill(50, 52, 9, 14).fill(49, 49, 9, 14, 'H').fill(53, 62, 9, 9).gap(55, 62).spikes(55, 62, 16).ent('f', 58, 6)
     .fill(66, 68, 7, 14).fill(65, 65, 7, 14, 'H').ent('p', 74, 14).cp(76).ent('h', 84, 14).ent('e', 92, 14);
    return l.L;
  },
  () => { // 9
    const l = level('Tide Pools', 150, 4, 'undertow');
    l.raise(1, 149, 12).fill(14, 28, 12, 15, '~').ent('j', 20, 13).fill(36, 38, 9, 11).ent('t', 37, 8).ent('g', 44, 5)
     .fill(48, 70, 12, 15, '~').fill(58, 59, 12, 13).spikes(64, 66, 15).ent('j', 54, 14).ent('j', 68, 13).cp(76).ent('p', 78, 11)
     .fill(86, 112, 12, 15, '~').spikes(90, 92, 15).spikes(100, 102, 15).fill(95, 97, 9, 9).ent('j', 106, 13).cp(118)
     .fill(124, 140, 12, 15, '~').fill(130, 131, 14, 15).ent('j', 134, 13).ent('e', 144, 11);
    return l.L;
  },
  () => { // 10
    const l = level('Null Gauntlet', 200, 3, 'null');
    l.spikes(14, 15).ent('s', 22, 14).gap(28, 29).fill(34, 50, 15, 15, '>').crusher(40).crusher(46).ent('h', 54, 14).cp(58)
     .gap(64, 70).mover(66, 12).ent('g', 74, 5).fill(80, 82, 10, 14).fill(79, 79, 10, 14, 'H').ent('t', 81, 9).cp(90).ent('p', 92, 14)
     .raise(100, 140, 12).fill(104, 124, 12, 15, '~').fill(112, 113, 12, 13).ent('j', 108, 13).ent('j', 118, 14).cp(146)
     .spikes(150, 151).fill(156, 170, 15, 15, '<').crusher(162).gap(176, 182).mover(178, 11, 1).ent('e', 190, 14);
    return l.L;
  },
];

// --- build and verify ------------------------------------------------------------------
const G = load({ seed: 31 });
G.call('enterEditor'); G.step(2, {});
const out = [];
let failed = 0;
RECIPES.forEach((make, i) => {
  const L = make();
  G.set('ED', L); G.call('enterEditor'); G.step(1, {});
  const t = Date.now(); G.call('routeStart');
  for (let k = 0; k < 6 && G.get('state') === 'route'; k++) G.step(1);
  const msg = G.get('routeMsg'), ED = G.get('ED');
  const ok = msg && msg.ok === 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${String(i + 1).padStart(2)} ${L.n.padEnd(14)} ${L.w} cols  ${((Date.now() - t) / 1000).toFixed(1)}s${ok ? '' : '  ' + msg.s}`);
  if (!ok) { failed++; return; }
  out.push({ code: G.call('encodeLevel', ED) });
});
if (failed) { console.log(`\n${failed} level(s) failed the route check; levels.json not written.`); process.exit(1); }
fs.writeFileSync(path.join(__dirname, '..', 'levels.json'), JSON.stringify({ version: 1, levels: out }, null, 1) + '\n');
console.log(`\nWrote levels.json with ${out.length} levels.`);
