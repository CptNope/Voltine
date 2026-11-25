// Smoke tests: drive the real engine headless and check the main flows still work.
// node tools/smoke.js
const load = require('./harness');
let failed = 0;
const check = (name, ok, extra = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  (' + extra + ')' : ''}`); if (!ok) failed++; };
const tap = (G, k) => { G.step(1, {}); G.step(1, { [k]: 1 }); G.step(1, {}); };

// A blunt bot: invincible, refills energy, keeps distance and fires; enough to show a fight can end.
function fightBoss(G, { maxFrames = 60 * 240, weapon = 0 } = {}) {
  G.get('P').wpn = weapon;
  for (let f = 0; f < maxFrames; f++) {
    const P = G.get('P'), B = G.get('B'), EN = G.get('EN');
    P.inv = 5; P.hp = 28; EN.fill(28);
    const tgt = B ? B.x + B.w / 2 : P.x;
    G.step(1, { fire: f % 8 < 4, left: P.x > tgt + 20, right: P.x < tgt - 70, jump: f % 26 < 14 });
    if (G.get('state') !== 'play') return { state: G.get('state'), frames: f };
  }
  return { state: G.get('state'), frames: maxFrames };
}
function toArena(G, s) {
  G.call('startStage', s);
  const W = G.get('W'), P = G.get('P');
  P.x = (W - 31 + 5) * 16; P.y = 100; P.inv = 999;
  G.step(40, { right: 1 });
}

{ // menus and locks
  const G = load({ seed: 1 });
  tap(G, 'start'); check('title opens stage select', G.get('state') === 'select');
  tap(G, 'down'); tap(G, 'start'); check('Boss Rush is locked on a fresh save', G.get('state') === 'select');
  tap(G, 'up'); for (let i = 0; i < 4; i++) tap(G, 'right'); tap(G, 'start');
  check('Null Core is locked on a fresh save', G.get('state') === 'select');
  G.get('save').cleared = [1, 1, 1, 0, 0, 0]; tap(G, 'start');
  check('Null Core stays locked until Tide Vault is cleared', G.get('state') === 'select');
  G.get('save').cleared = [1, 1, 1, 0, 0, 1]; tap(G, 'start');
  check('Null Core opens after all four wardens', G.get('state') === 'play' && G.get('ST').final === true);
  tap(G, 'start'); check('Enter pauses', G.get('state') === 'pause'); tap(G, 'back'); check('Esc resumes', G.get('state') === 'play');
}

for (const [s, kind] of [[0, 'warden'], [1, 'hound'], [2, 'kite'], [5, 'undertow'], [3, 'null']]) { // every boss can be beaten
  const G = load({ seed: 2 + s });
  G.get('save').cleared = [1, 1, 1, 1, 0, 1];
  toArena(G, s);
  const B = G.get('B');
  const r = fightBoss(G, { weapon: s === 3 || s === 5 ? 2 : 0 });
  check(`${kind} spawns and can be beaten`, B && B.kind === kind && r.state === 'got', `${(r.frames / 60).toFixed(0)}s`);
}

{ // weaknesses deal extra damage
  const G = load({ seed: 9 });
  G.get('save').cleared = [1, 1, 1, 1];
  toArena(G, 1); G.step(120, {});
  const B = G.get('B'); B.st = 'idle'; B.inv = 0; const hp = B.hp;
  G.call('hitBoss', { w: 1, dmg: 1, x: B.x, y: B.y });
  check('Coil Hound takes 4 from Prism Spread', hp - B.hp === 4);
}

{ // boss rush
  const G = load({ seed: 11 });
  G.get('save').cleared = [1, 1, 1, 1, 0, 1];
  G.call('startStage', 4); G.step(5, {});
  const seen = new Set();
  for (let f = 0; f < 60 * 900 && G.get('state') === 'play'; f++) {
    const P = G.get('P'), B = G.get('B'), EN = G.get('EN'); if (B) seen.add(B.kind);
    P.inv = 5; P.hp = 28; EN.fill(28); P.wpn = B && B.kind === 'kite' ? 4 : B && B.kind === 'hound' ? 1 : B && B.kind === 'undertow' ? 2 : 0;
    const tgt = B ? B.x + B.w / 2 : P.x;
    G.step(1, { fire: f % 8 < 4, left: P.x > tgt + 20, right: P.x < tgt - 70, jump: f % 26 < 14 });
  }
  check('Boss Rush runs all five bosses and finishes', seen.size === 5 && G.get('state') === 'got', [...seen].join(' > '));
  check('Boss Rush best time saved', G.get('save').rush[0] > 0);
}

{ // hard mode
  const G = load({ seed: 12 });
  G.set('hard', true); G.call('startStage', 0); G.step(80, {});
  const P = G.get('P'); P.inv = 0; G.call('hurt', 4);
  check('Hard mode scales damage by 1.5', P.hp === 22);
}

{ // editor and level codes
  const G = load({ seed: 13 });
  G.call('enterEditor'); check('editor opens', G.get('state') === 'edit');
  const edc = G.get('edc'); edc.tool = 0; edc.x = 30; edc.y = 10; G.step(2, { jump: 1 });
  check('painting places a block', G.get('ED').m[10][30] === '#');
  const code = G.call('encodeLevel'), back = G.call('decodeLevel', code);
  check('level code round-trips', back && JSON.stringify(back.m) === JSON.stringify(G.get('ED').m) && back.sp.length === G.get('ED').sp.length, `${code.length} chars`);
  check('garbage codes are rejected', G.call('decodeLevel', 'not a level') === null && G.call('decodeLevel', 'VL1.' + btoa('{"b":"x"}')) === null);
  check('codes with out-of-range entities are cleaned', G.call('decodeLevel', 'VL1.' + btoa(JSON.stringify({ b: 'kite', t: 1, r: Array(17).fill('100 '), s: [['w', 999, 3], ['w', 10, 3], ['<img>', 1, 1]] }))).sp.length === 1);
  G.call('edTest'); check('playtest starts the custom level', G.get('state') === 'play' && G.get('ST').custom === true);
  tap(G, 'start'); check('Enter returns to the editor', G.get('state') === 'edit');
}

{ // music follows the game state
  const G = load({ seed: 14 });
  G.step(2, {}); const a = G.get('mus').id;
  tap(G, 'start'); tap(G, 'start'); const b = G.get('mus').id;
  check('menu and stage tracks switch', a === 'menu' && b === 'prism', `${a} > ${b}`);
}

{ // pause menu, settings, assist, toggle charge, intro card
  const G = load({ seed: 15 });
  G.call('startStage', 0);
  check('stage intro card shows on start', G.get('introT') > 0);
  G.step(30, { right: 1 }); const x0 = G.get('P').x;
  tap(G, 'start'); check('Enter opens the pause menu', G.get('state') === 'pause' && G.get('pm') === 0);
  tap(G, 'down'); tap(G, 'down'); tap(G, 'start');
  check('Restart from checkpoint returns to the checkpoint', G.get('state') === 'play' && G.get('P').x < x0);
  tap(G, 'start'); tap(G, 'down'); tap(G, 'down'); tap(G, 'down'); tap(G, 'start');
  check('Settings opens from the pause menu', G.get('state') === 'opts');
  const OPT = G.get('OPT'); tap(G, 'left'); check('volume changes with left/right', OPT.mv === 7);
  for (let i = 0; i < 5; i++) tap(G, 'down'); tap(G, 'right'); check('assist cycles', OPT.as === 1);
  tap(G, 'back'); check('Esc returns to the pause menu', G.get('state') === 'pause');
  tap(G, 'down'); tap(G, 'start'); check('Quit returns to stage select', G.get('state') === 'select');
  G.get('save').cleared = [1, 1, 1, 1]; G.get('save').best = [0, 0, 0, 0];
  toArena(G, 0); fightBoss(G); check('assist runs do not record a best time', G.get('save').best[0] === 0);
  OPT.as = 0; OPT.tc = 1; G.call('startStage', 0); G.step(80, {});
  tap(G, 'fire'); G.step(60, {}); const n0 = G.get('PB').length; tap(G, 'fire'); G.step(2, {});
  check('toggle charge: tap starts charging, tap again releases a charged shot', G.get('PB').some(b => b.k === 'B'), `${n0} shots before`);
}

{ // new enemy types
  const G = load({ seed: 16 });
  G.call('startStage', 0); G.step(10, {}); G.set('E', []);
  const P = G.get('P'); P.x = 20 * 16; P.y = 14 * 16 - 22; P.inv = 9999; G.step(5, {});
  const mk = (type, x, y) => { const e = { type, x: x * 16, y: (y + 1) * 16 - 14, w: 14, h: 14, vx: 0, vy: 0, dir: -1, t: 0, hp: 3, flash: 0, onG: false, cd: 1 }; e.y0 = e.y; G.get('E').push(e); return e; };
  const sh = mk('s', 26, 14); G.step(10, {});
  G.get('PB').push({ k: 'b', w: 0, x: sh.x - 10, y: sh.y + 7, vx: 5, vy: 0, r: 2.5, dmg: 1 }); G.step(6, {});
  check('shield walker blocks shots from the front', sh.hp === 3 && sh.dir === -1);
  sh.t = 115; G.step(1, {}); G.get('PB').push({ k: 'b', w: 0, x: sh.x - 10, y: sh.y + 7, vx: 5, vy: 0, r: 2.5, dmg: 1 }); G.step(6, {});
  check('shield walker can be hit while it fires', sh.hp < 3);
  const ho = mk('h', 30, 14); G.step(3, {}); const y0 = ho.y; let minY = y0; for (let i = 0; i < 40; i++) { G.step(1, {}); minY = Math.min(minY, ho.y); }
  check('spark hopper jumps toward the player', minY < y0 - 20 && ho.x < 30 * 16);
  const gu = mk('g', 22, 6); let maxY = gu.y; for (let i = 0; i < 80; i++) { G.step(1, {}); maxY = Math.max(maxY, gu.y); }
  check('gull swoops down toward the player', maxY > 9 * 16);
}

{ // in-editor route check
  const G = load({ seed: 17 });
  G.call('enterEditor'); G.step(2, {});
  G.call('routeStart'); for (let i = 0; i < 5 && G.get('state') === 'route'; i++) G.step(1);
  check('route check passes the starter level', G.get('state') === 'edit' && G.get('routeMsg').ok === 1);
  const ED = G.get('ED'); for (let y = 8; y < 15; y++) ED.m[y][50] = '#';
  G.call('routeStart'); for (let i = 0; i < 5 && G.get('state') === 'route'; i++) G.step(1);
  check('route check reports where a level is blocked', G.get('routeMsg').ok === 0 && Math.abs(G.get('edc').x - 50) <= 2, 'cursor ' + G.get('edc').x);
}

{ // Tide Vault: swimming, lance, jellyfish, new weakness links
  const G = load({ seed: 18 });
  G.get('save').cleared = [1, 1, 1, 0, 0, 1];
  G.call('startStage', 5); G.step(5, {}); G.set('E', []);
  const P = G.get('P'); P.x = 30 * 16; P.y = 12 * 16 + 4; P.vy = 0; P.inv = 9999; G.step(1, {});
  const y0 = P.y; G.step(20, {}); const sink = P.y - y0;
  check('water slows falling', sink > 0 && sink < 40, `sank ${sink.toFixed(1)} px in 20 frames`);
  const y1 = P.y; G.step(1, { jump: 1 }); G.step(10, {});
  check('jump swims upward in water', P.y < y1);
  check('Tide Lance unlocks from Tide Vault', G.call('unlocked', 4) === true);
  P.wpn = 4; G.step(1, {}); G.step(1, { fire: 1 }); const L = G.get('PB').find(b => b.k === 'l');
  check('Tide Lance fires a piercing shot', !!L && L.pierce === 1 && Math.abs(L.vx) === 7);
  const W = G.get('WEAK'); check('weakness cycle: Kite weak to Lance, Undertow weak to Arc', W.kite === 4 && W.undertow === 2);
  G.call('startStage', 5); G.step(2, {});
  check('Tide Vault has jellyfish', G.get('E').some(e => e.type === 'j'));
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll smoke checks passed');
process.exit(failed ? 1 : 0);
