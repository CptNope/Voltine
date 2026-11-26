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
  G.set('sel', G.get('B_RUSH')); tap(G, 'start'); check('Boss Rush is locked on a fresh save', G.get('state') === 'select');
  G.set('sel', G.get('CARD').indexOf(3)); tap(G, 'start');
  check('Null Core is locked on a fresh save', G.get('state') === 'select');
  G.get('save').cleared = [1, 1, 1, 0, 0, 1, 0, 1, 0]; tap(G, 'start');
  check('Null Core stays locked until all six wardens are down', G.get('state') === 'select');
  G.get('save').cleared = [1, 1, 1, 0, 0, 1, 0, 1, 1]; tap(G, 'start');
  check('Null Core opens after all six wardens', G.get('state') === 'play' && G.get('ST').final === true);
  tap(G, 'start'); check('Enter pauses', G.get('state') === 'pause'); tap(G, 'back'); check('Esc resumes', G.get('state') === 'play');
}

for (const [s, kind] of [[0, 'warden'], [1, 'hound'], [2, 'kite'], [5, 'undertow'], [7, 'orbiter'], [8, 'mirror'], [3, 'null']]) { // every boss can be beaten
  const G = load({ seed: 2 + s });
  G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1];
  toArena(G, s);
  const B = G.get('B');
  const r = fightBoss(G, { weapon: s === 3 || s === 5 ? 2 : 0 });
  check(`${kind} spawns and can be beaten`, B && B.kind === kind && r.state === 'got', `${(r.frames / 60).toFixed(0)}s`);
}

{ // weaknesses deal extra damage
  const G = load({ seed: 9 });
  G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1];
  toArena(G, 1); G.step(120, {});
  const B = G.get('B'); B.st = 'idle'; B.inv = 0; const hp = B.hp;
  G.call('hitBoss', { w: 1, dmg: 1, x: B.x, y: B.y });
  check('Coil Hound takes 4 from Prism Spread', hp - B.hp === 4);
}

{ // boss rush
  const G = load({ seed: 11 });
  G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1];
  G.call('startStage', 4); G.step(5, {});
  const seen = new Set();
  for (let f = 0; f < 60 * 900 && G.get('state') === 'play'; f++) {
    const P = G.get('P'), B = G.get('B'), EN = G.get('EN'); if (B) seen.add(B.kind);
    P.inv = 5; P.hp = 28; EN.fill(28); P.wpn = B ? ({ warden: 6, hound: 1, kite: 4, undertow: 2, orbiter: 3, mirror: 5 }[B.kind] || 2) : 0;
    const tgt = B ? B.x + B.w / 2 : P.x;
    G.step(1, { fire: f % 8 < 4, left: P.x > tgt + 20, right: P.x < tgt - 70, jump: f % 26 < 14 });
  }
  check('Boss Rush runs all seven bosses and finishes', seen.size === 7 && G.get('state') === 'got', [...seen].join(' > '));
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
  G.set('om', G.get('OPT_ITEMS').findIndex(o => o.k === 'as')); tap(G, 'right'); check('assist cycles', OPT.as === 1);
  tap(G, 'back'); check('Esc returns to the pause menu', G.get('state') === 'pause');
  tap(G, 'down'); tap(G, 'start'); check('Quit returns to stage select', G.get('state') === 'select');
  G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1]; G.get('save').best = Array(9).fill(0);
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

{ // achievements, splits, records, progress codes
  const G = load({ seed: 19 });
  const save = G.get('save');
  G.call('startStage', 0); G.step(5, {});
  const P = G.get('P'); P.x = 75 * 16; P.y = 100; P.inv = 9999; G.step(30, { right: 1 });
  check('passing a checkpoint records a split', G.get('runSplits')[0] > 0);
  toArena(G, 0); const r = fightBoss(G);
  check('clearing a sector unlocks First Light', save.ach.first_clear === 1);
  check('a new best time stores splits', Array.isArray(save.splits[0]) && save.splits[0].length >= 1);
  check('an achievement shows a toast', G.get('TOASTS').length > 0);
  const before = save.stats.kills || 0; G.call('stat', 'kills'); check('stats count up', save.stats.kills === before + 1);
  G.get('OPT').as = 1; G.call('ach', 'hard_core'); check('skill achievements need assist off', !save.ach.hard_core); G.get('OPT').as = 0;
  const code = G.call('exportProgress'), back = G.call('importProgress', code);
  check('progress code round-trips', back && back.cleared[0] === 1 && back.ach.first_clear === 1 && back.best[0] === save.best[0], code.length + ' chars');
  check('bad progress codes are rejected', G.call('importProgress', 'nope') === null);
  const evil = G.call('importProgress', 'VS1.' + btoa(JSON.stringify({ cleared: [1, 'x', -5], best: ['<b>', 3.7], ach: { fake: 1, weak: 1 }, stats: { kills: -9 } })));
  check('progress codes are sanitised', evil && evil.cleared[1] === 0 && evil.best[0] === 0 && evil.best[1] === 3 && !evil.ach.fake && evil.ach.weak === 1 && evil.stats.kills === 0);
  G.set('state', 'select'); G.set('sel', G.get('B_REC')); tap(G, 'start'); check('Records screen opens from select', G.get('state') === 'records');
  tap(G, 'right'); check('Records has a Times page', G.get('recPage') === 1); tap(G, 'back'); check('Esc leaves Records', G.get('state') === 'select');
  G.call('enterEditor'); G.call('routeStart'); for (let i = 0; i < 5 && G.get('state') === 'route'; i++) G.step(1);
  check('route checks do not touch stats', (save.stats.reboots || 0) === 0, 'reboots ' + (save.stats.reboots || 0));
}

{ // older or minimal saves (as written by Reset progress before 0.13, or by tools) must not crash
  const G = load({ seed: 20 });
  G.set('save', { cleared: [1, 1, 1, 1, 0, 1], best: [0, 0, 0, 0, 0, 0], bestH: [0, 0, 0, 0, 0, 0], rush: [0, 0] });
  let ok = true;
  try { G.call('startStage', 0); G.call('die'); G.step(100, {}); G.call('stat', 'kills'); G.call('ach', 'weak'); G.set('state', 'records'); G.draw(); G.set('recPage', 1); G.draw(); toArena(G, 0); fightBoss(G); }
  catch (e) { ok = false; console.log(e.stack); }
  check('a save missing achievement and stats fields still works', ok);
}

{ // 0.14 feel: coyote time, jump buffering, hit-stop
  const G = load({ seed: 21 });
  const offLedge = late => { // walk off the ledge at the end of Prism Grid's first ground strip, press jump `late` frames after leaving it
    G.call('startStage', 0); G.step(2, {}); G.set('E', []); G.set('introT', 0);
    const P = G.get('P'); P.x = 29 * 16; P.y = 15 * 16 - 22; P.inv = 9999; G.step(3, {});
    let n = 0; while (G.get('P').onG && n++ < 60) G.step(1, { right: 1 });
    G.step(late, { right: 1 }); G.step(1, { right: 1, jump: 1 }); G.step(1, { right: 1, jump: 1 });
    return G.get('P').vy;
  };
  check('coyote time: jump 3 frames after leaving a ledge', offLedge(3) < -3);
  check('no coyote jump 9 frames after leaving a ledge', offLedge(9) > 0);
  G.call('startStage', 0); G.step(2, {}); G.set('E', []);
  const P = G.get('P'); P.x = 10 * 16; P.y = 150; P.vy = 0; P.inv = 9999;
  while (P.y + P.h < 15 * 16 - 8) G.step(1, {});
  G.step(1, { jump: 1 }); let jumped = false, landed = G.get('P').onG;
  for (let i = 0; i < 12; i++) { G.step(1, { jump: 1 }); if (G.get('P').onG) landed = true; if (landed && G.get('P').vy < -3) jumped = true; }
  check('jump buffering: a press just before landing still jumps', jumped);
  G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1]; toArena(G, 0); G.step(140, {});
  const B = G.get('B'); B.inv = 0; B.st = 'idle'; G.call('hitBoss', { w: 3, dmg: 1, x: B.x, y: B.y });
  const x0 = G.get('P').x; G.step(2, { right: 1 });
  check('hit-stop freezes play briefly on a boss hit', G.get('P').x === x0 && G.get('hitStop') >= 0);
  G.step(6, { right: 1 }); check('play resumes after hit-stop', G.get('P').x !== x0);
}

{ // playtest log and report
  const G = load({ seed: 22 });
  G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1];
  G.call('startStage', 0); G.step(5, {}); const P = G.get('P'); P.x = 36 * 16; P.y = 260; G.step(120, {});
  const log = G.get('save').log || [];
  check('deaths are logged with place and cause', log.some(e => e.e === 'death' && e.c === 'pit' && e.s === 'prism'));
  toArena(G, 0); fightBoss(G);
  const L2 = G.get('save').log; check('boss fights and clears are logged', L2.some(e => e.e === 'boss' && e.k === 'warden' && e.d > 0) && L2.some(e => e.e === 'clear'));
  const rep = G.call('playtestReport');
  check('playtest report summarises deaths and boss times', /Prism Grid: 1 clear/.test(rep) && /pit/.test(rep) && /boss PRISM WARDEN: 1 win/.test(rep));
  const n = L2.length; G.call('enterEditor'); G.call('routeStart'); for (let i = 0; i < 5 && G.get('state') === 'route'; i++) G.step(1);
  check('route checks and custom levels are not logged', G.get('save').log.length === n);
}

{ // 0.15 access: remapping, auto-fire, hold to swim, slow mode, high contrast, large text
  const G = load({ seed: 23 });
  const KM = () => G.get('KM'), BIND = G.get('BIND');
  G.call('bindKey', 'jump', 'L');
  check('rebinding a key maps it and removes the old keys', KM().l === 'jump' && KM().z === undefined && G.get('BIND').jump.length === 1);
  G.call('bindKey', 'fire', 'l');
  check('taking a key from another action warns when it leaves that action without a key', G.get('BIND').jump.length === 0 && G.get('bindMsg').bad === true);
  check('Esc and Enter always work in menus', KM().Escape === 'back' && KM().Enter === 'start');
  G.call('resetBinds'); check('reset restores the default keys', KM().z === 'jump' && KM().x === 'fire');
  G.call('bindPad', 'jump', 3); check('gamepad buttons can be rebound', G.get('PADB').jump[0] === 3 && !G.get('PADB').next.includes(3));
  G.call('resetBinds');
  G.set('state', 'opts'); G.set('optsFrom', 'title'); G.set('om', G.get('OPT_ITEMS').findIndex(o => o.k === 'keys')); tap(G, 'start');
  check('Settings > Controls opens the controls screen', G.get('state') === 'keys');
  tap(G, 'start'); check('Enter on a row waits for a new key', G.get('capture') && G.get('capture').kind === 'key');
  G.set('capture', null);
  const OPT = G.get('OPT');
  OPT.af = 1; G.call('startStage', 0); G.step(5, {}); G.set('E', []); G.set('introT', 0);
  let shots = 0, before = 0; for (let i = 0; i < 40; i++) { G.step(1, { fire: 1 }); const n = G.get('PB').length; if (n > before) shots += n - before; before = n; }
  check('auto-fire keeps shooting while fire is held', shots >= 3, shots + ' shots');
  OPT.af = 0; OPT.hs = 1; G.get('save').cleared = [1, 1, 1, 0, 0, 1]; G.call('startStage', 5); G.step(3, {}); G.set('E', []);
  const P = G.get('P'); P.x = 66 * 16; P.y = 13 * 16 + 4; P.vy = 0; P.inv = 9999; G.step(2, {}); const y0 = G.get('P').y;
  G.step(1, { jump: 1 }); G.step(60, { jump: 1 }); check('hold to swim keeps rising while jump is held', G.get('P').y < y0 - 10);
  OPT.hs = 0; OPT.spd = 1; check('slow mode counts as assist', G.call('assistOn') === true);
  G.get('save').best[0] = 0; toArena(G, 0); fightBoss(G); check('slow mode runs do not record best times', G.get('save').best[0] === 0);
  OPT.spd = 0; OPT.hc = 1; OPT.big = 1; let ok = true;
  try { for (const st of ['title', 'select', 'records', 'opts', 'keys', 'pause', 'play', 'edit']) { G.set('state', st); if (st === 'edit') G.call('enterEditor'); G.draw(); } G.call('startStage', 5); G.step(10, {}); G.draw(); }
  catch (e) { ok = false; console.log(e.stack); }
  check('high contrast and large text draw every screen', ok);
}

{ // 0.16 community levels
  const G = load({ seed: 24 });
  G.call('enterEditor'); G.step(2, {});
  const ED = () => G.get('ED'), edc = G.get('edc');
  const before = ED().m[10][30]; G.call('edPushUndo'); G.call('edCell', 30, 10, 0);
  check('editor paints a block', ED().m[10][30] === '#');
  G.call('edUndo'); check('undo restores the previous state', ED().m[10][30] === before);
  G.call('edRedo'); check('redo re-applies the change', ED().m[10][30] === '#');
  G.call('edResize', 150); check('levels can be widened to 150 columns', ED().w === 150 && ED().m[15].length === 150 && G.get('W') === 181);
  ED().n = 'Test <b>Level</b>'; ED().a = 'Me';
  const code = G.call('encodeLevel'), back = G.call('decodeLevel', code);
  check('wide levels, names and authors survive a code round trip', back && back.w === 150 && back.a === 'Me' && !/[<>]/.test(back.n));
  const old = 'VL1.' + btoa(JSON.stringify({ b: 'kite', t: 1, r: Array(15).fill('99 1 ').concat(['99#1#', '99#1#']), s: [], v: [], c: [], k: [] }));
  check('older 100-column codes still load', G.call('decodeLevel', old).w === 100);
  check('a level is not verified before its route check', !G.call('isVerified'));
  G.call('routeStart', { share: 'code' }); for (let i = 0; i < 6 && G.get('state') === 'route'; i++) G.step(1);
  check('a passing route check marks the level verified', G.call('isVerified') && /Press Copy code again/.test(G.get('routeMsg').s));
  G.call('edCell', 50, 8, 0); check('editing a verified level clears the mark', !G.call('isVerified'));
  G.call('edCell', 41, 10, G.get('TOOLS').findIndex(t => t[0] === 'k'));
  check('checkpoints cannot be placed over a pit', !ED().cps.includes(41));
  const mine = G.call('encodeLevel');
  const gal = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'levels.json'), 'utf8')).levels;
  check('the gallery has at least 10 levels', gal.length >= 10);
  const L = G.call('decodeLevel', gal[0].code); G.set('state', 'gallery');
  G.call('playShared', L, 'gallery'); check('playing a shared level starts it', G.get('state') === 'play' && G.get('sharedMode') === 'gallery' && G.get('ED').n === L.n);
  tap(G, 'start'); check('leaving a shared level returns to the gallery and restores your own level', G.get('state') === 'gallery' && G.call('encodeLevel') === mine);
  G.call('playShared', L, 'gallery'); toArena(G, 6); fightBoss(G);
  check('clearing a gallery level records a gallery best, not Architect', Object.keys(G.get('save').gal || {}).length === 1 && !G.get('save').ach.maker);
  G.step(70, {}); tap(G, 'start'); check('after a gallery clear Enter returns to the gallery', G.get('state') === 'gallery' && G.call('encodeLevel') === mine);
  G.set('state', 'select'); G.set('sel', G.get('B_RUSH')); tap(G, 'right'); check('the Gallery bar sits next to Boss Rush', G.get('sel') === G.get('B_GAL'));
  check('play links point at the Pages site', /^https:\/\/cptnope\.github\.io\/Voltline\/\?level=VL1\./.test(G.call('playLink', mine)));
}

{ // 0.17 sectors: low gravity, phase blocks, new enemies, new weapons, select grid
  const G = load({ seed: 25 });
  G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1];
  const jumpHeight = (stage, x) => { G.call('startStage', stage); G.step(5, {}); G.set('E', []); G.set('introT', 0); const P = G.get('P'); P.x = x * 16; P.y = 15 * 16 - 22; P.inv = 9999; G.step(5, {});
    const y0 = G.get('P').y; let top = y0; G.step(1, { jump: 1 }); for (let i = 0; i < 90; i++) { G.step(1, { jump: 1 }); top = Math.min(top, G.get('P').y); } return y0 - top; };
  const normal = jumpHeight(7, 90), floaty = jumpHeight(7, 12);
  check('low-gravity fields make jumps higher', floaty > normal + 15, `${normal.toFixed(0)} px vs ${floaty.toFixed(0)} px`);
  G.call('startStage', 8); G.step(2, {});
  const A = () => G.call('solid', 18, 13), Bk = () => G.call('solid', 22, 12);
  G.set('tick', 89); G.step(1, {}); const a1 = A(), b1 = Bk(); G.set('tick', 179); G.step(1, {}); const a2 = A(), b2 = Bk();
  check('phase blocks take turns being solid', a1 !== a2 && b1 !== b2 && a1 !== b1);
  G.set('E', []); const P = G.get('P'); P.inv = 0; P.hp = 28;
  G.set('tick', 89); G.step(1, {}); const ph = G.get('PHASE'); const tx = ph === 0 ? 22 : 18, ty = ph === 0 ? 12 : 13; P.x = tx * 16 + 2; P.y = ty * 16 - 4; P.vy = 0;
  G.set('tick', 179); G.step(1, {}); check('a block switching on inside you pushes you out', G.call('rectFree', P.x, P.y, P.w, P.h));
  const mine = { type: 'q', x: P.x, y: P.y + 8, w: 14, h: 14, vx: 0, vy: 0, dir: -1, t: 0, hp: 2, flash: 0, onG: false, cd: 0, y0: P.y + 8 };
  G.set('E', [mine]); G.set('PHASE', 0); G.set('tick', 10); P.inv = 0; const hp0 = P.hp; G.get('E')[0].x = P.x; G.step(1, {});
  check('phase mines are harmless on their off beat', G.get('P').hp === hp0 || G.get('PHASE') === 1);
  G.call('startStage', 7); G.step(5, {}); G.set('E', []); const Q = G.get('P'); Q.x = 90 * 16; Q.y = 15 * 16 - 22; Q.wpn = 5; G.step(2, {}); G.step(1, { fire: 1 });
  let maxd = 0, back = false; for (let i = 0; i < 120; i++) { G.step(1, {}); const d = G.get('PB').find(b => b.k === 'd'); if (d) maxd = Math.max(maxd, Math.abs(d.x - Q.x)); else { back = maxd > 40; break; } }
  check('the Orbit Disc flies out and comes back', back, `${maxd.toFixed(0)} px out`);
  Q.wpn = 6; G.step(2, {}); G.step(1, { fire: 1 }); let made = 0; for (let i = 0; i < 25; i++) { G.step(1, {}); made = Math.max(made, G.get('PB').filter(b => b.k === 'c').length); }
  check('the Echo Shot fires a second time', made >= 2);
  check('the weakness loop covers six wardens', JSON.stringify(G.get('WEAK')) === JSON.stringify({ warden: 6, hound: 1, kite: 4, undertow: 2, orbiter: 3, mirror: 5 }));
  toArena(G, 8); G.step(140, {}); const M = G.get('B'); M.shield = 60; M.inv = 0; const h0 = M.hp;
  G.call('hitBoss', { w: 0, dmg: 1, x: M.x, y: M.y }); const blocked = M.hp === h0; G.call('hitBoss', { w: 5, dmg: 2, x: M.x, y: M.y });
  check('Mirror\'s copied shield blocks everything but its weakness', blocked && M.hp === h0 - 4);
  G.set('state', 'select'); G.set('sel', 1); tap(G, 'down'); check('down moves from the first row of cards to the second', G.get('sel') === 5);
  tap(G, 'down'); check('down from the second row reaches the bars', G.get('sel') === G.get('B_RUSH'));
}

for (const s of [0, 1, 2, 5, 7, 8]) { // 0.17.1 mid-bosses: lock, beat, walls back, stays beaten after a death
  const G = load({ seed: 40 + s });
  G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1]; G.call('startStage', s);
  const m = G.call('midOf'), walls = () => { const o = []; for (let y = 0; y < 15; y++) o.push(G.call('solid', m.l, y), G.call('solid', m.r, y)); return o.join(); };
  const before = walls(); let P = G.get('P'); P.x = (m.l + 4) * 16; P.y = G.call('midFloor', m) - 40; G.set('introT', 0); G.step(30, {});
  const name = G.get('MBN')[m.k], locked = G.get('MBlock') && walls() !== before;
  let f = 0, stuck = 0, lx = 0;
  for (; f < 60 * 120 && G.get('MB'); f++) { const P = G.get('P'), B = G.get('MB'); P.hp = 28; const tx = B.x + B.w / 2;
    stuck = Math.abs(P.x - lx) < .1 ? stuck + 1 : 0; lx = P.x; const want = P.x > tx + 20 ? 'left' : P.x < tx - 80 ? 'right' : null;
    G.step(1, { fire: f % 8 < 4, [want || 'x']: 1, jump: (B.y + B.h < P.y + 4 || stuck > 10) && f % 30 < 14 });
    const Q = G.get('P'); if (!want) { if (Q.x > tx && Q.face > 0) G.step(1, { left: 1 }); if (Q.x < tx && Q.face < 0) G.step(1, { right: 1 }); } }
  check(`${name} locks the arena, can be beaten and opens it again`, locked && G.get('MBdone') && walls() === before, `${(f / 60).toFixed(0)}s`);
  G.call('die', 'hit'); G.step(100, {}); P = G.get('P'); P.x = (m.l + 4) * 16; P.y = G.call('midFloor', m) - 40; G.step(30, {});
  check(`${name} stays beaten after a death`, !G.get('MB') && !G.get('MBlock'));
}
{ // dying to a mid-boss resets the fight
  const G = load({ seed: 50 }); G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1]; G.call('startStage', 0);
  const m = G.call('midOf'); const P = G.get('P'); P.x = (m.l + 4) * 16; P.y = 180; G.step(30, {});
  const had = !!G.get('MB'); G.call('die', 'hit'); G.step(100, {});
  check('dying to a mid-boss puts you back before it with the walls down', had && !G.get('MB') && !G.get('MBlock') && !G.get('MBdone') && G.get('cp') === 1);
  check('custom levels and Boss Rush have no mid-boss', (G.call('startStage', 6), G.call('midOf') === null) && (G.call('startStage', 4), G.call('midOf') === null));
}

{ // 0.18 seeded runs: the same seed and inputs replay exactly; a different seed plays differently
  const run = (seed) => { const G = load({ seed: 99 }); G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1];
    G.call('startStage', 1, seed); G.set('introT', 0); const W = G.get('W'), P = G.get('P'); P.x = (W - 31 + 5) * 16; P.y = 100; P.inv = 9999;
    const log = []; for (let f = 0; f < 60 * 25; f++) { G.get('P').inv = 9999; G.step(1, { right: f % 90 < 20, left: f % 90 > 60, jump: f % 50 < 10, fire: f % 10 < 5 }); const B = G.get('B'); if (f % 30 === 0) log.push(B ? `${B.st}:${Math.round(B.x)}:${B.hp}` : '-', G.get('EB').length); }
    return log.join(); };
  const a = run(1234), b = run(1234), c = run(98765);
  check('the same seed and inputs replay a boss fight exactly', a === b);
  check('a different seed plays the fight differently', a !== c);
}
{ // ghost replays
  const G = load({ seed: 61 });
  const pts = []; for (let i = 0; i < 400; i++) pts.push(16 + i * 3 + (i === 200 ? 900 : 0), 200 - (i % 40) + (i === 300 ? -150 : 0), i % 64);
  const back = G.call('ghostDecode', G.call('ghostEncode', pts));
  check('ghost encoding round-trips, including big jumps', back.length === 400 && back.every((p, i) => p.x === pts[i * 3] && p.y === pts[i * 3 + 1] && p.b === pts[i * 3 + 2]), `${G.call('ghostEncode', pts).length} chars`);
  G.get('save').cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1]; G.get('save').best = Array(9).fill(0);
  G.call('startStage', 0); G.set('introT', 0); G.step(240, { right: 1, jump: 1 });
  const rec = G.get('GREC').length; G.call('winStage');
  const g = G.get('GHOSTS')['0n'];
  check('a new best time saves a ghost for that sector and difficulty', !!g && g.t === G.get('clock') && rec > 300);
  G.call('startStage', 0); check('the next run plays the ghost back', !!G.get('GPLAY') && G.get('GPLAY').length === rec / 3);
  G.get('OPT').gh = 0; G.call('startStage', 0); check('the Ghost replay setting turns it off', !G.get('GPLAY'));
  G.get('OPT').gh = 1; G.call('startStage', 4); check('Boss Rush has no ghost', !G.get('GPLAY') && !G.get('GREC'));
  G.set('hard', true); G.call('startStage', 0); check('Hard keeps its own ghost', !G.get('GPLAY')); G.set('hard', false);
  G.call('startStage', 0); G.step(60, {}); let drew = true; try { G.draw(); } catch (e) { drew = false; } check('the ghost draws without errors', drew);
}
{ // practice mode
  const G = load({ seed: 62 }); const sv = G.get('save'); sv.cleared = [1, 1, 1, 1, 0, 1, 0, 1, 1]; sv.best = Array(9).fill(0); sv.ach = {};
  let safe = true, bad = [];
  for (const si of G.call('pracRows')) for (let c = 0; c < 4; c++) { if (!G.call('pracOk', si, c)) continue;
    G.call('startPractice', si, c); G.set('introT', 0); const near = G.get('E').some(e => Math.abs(e.x - G.get('P').x) < 56); G.step(50, {});
    if (near || G.get('state') !== 'play' || G.get('P').hp < 28 || !G.get('P').onG) { safe = false; bad.push(G.get('ST').name + ' ' + c); } }
  check('every practice start point puts you on safe ground', safe, bad.join(', '));
  G.call('startPractice', 0, 3); G.set('introT', 0); G.step(120, { right: 1 });
  check('Boss practice starts at the boss door', !!G.get('B') || G.get('arena'));
  G.call('die', 'hit'); G.step(100, {}); check('dying in Boss practice puts you back at the door', Math.abs(G.get('P').x - (G.get('ARENA') - 3) * 16) < 2);
  G.call('winStage'); check('a practice clear records nothing', sv.best[0] === 0 && !G.get('GHOSTS')['0n'] && !Object.keys(sv.ach).length && G.get('lastWin').prac === 1);
  G.step(70, {}); tap(G, 'start'); check('a practice clear returns to the Practice page', G.get('state') === 'records' && G.get('recPage') === 2 && G.get('PRAC') === null);
  G.call('startPractice', 3, 2); check('the Null Core has no mid-boss to practise', !G.call('pracOk', 3, 2));
  G.set('state', 'records'); G.set('recPage', 1); tap(G, 'right'); check('Practice is the third Records page', G.get('recPage') === 2);
}

{ // 0.18 part 2: challenge rooms and the daily run
  const G = load({ seed: 70 }); const sv = G.get('save'); sv.cleared = Array(9).fill(0); sv.ach = {};
  const ROOMS = G.get('ROOMS');
  check('there are twenty challenge rooms with ordered medal times', ROOMS.length === 20 && ROOMS.every(r => r.m[0] > 0 && r.m[0] < r.m[1] && r.m[1] < r.m[2]));
  G.set('state', 'select'); G.set('sel', 3); tap(G, 'down'); check('the Challenges card sits at the end of the second row', G.get('sel') === G.get('CH_SLOT'));
  tap(G, 'start'); check('the Challenges card opens the room list', G.get('state') === 'rooms');
  G.set('rsel', 3); tap(G, 'start'); check('rooms stay locked until their sector is cleared', G.get('state') === 'rooms');
  G.set('rsel', 0); tap(G, 'start'); check('Prism Grid rooms are open from the start', G.get('state') === 'play' && G.get('ST').room === true);
  const r = ROOMS[0]; let P = G.get('P'); P.x = (G.get('W') - 6) * 16; G.set('clock', r.m[0] - 30); G.step(40, { right: 1 });
  check('reaching the exit clears the room with a gold medal', G.get('state') === 'got' && G.get('lastWin').med === 3 && sv.rooms.r01 > 0 && sv.ach.gold === 1);
  check('a room clear saves a ghost for that room', !!G.get('GHOSTS').r01n);
  G.step(70, {}); tap(G, 'start'); check('Enter returns to the room list', G.get('state') === 'rooms');
  check('medals come from the best time', G.call('medalFor', r, r.m[0]) === 3 && G.call('medalFor', r, r.m[1]) === 2 && G.call('medalFor', r, r.m[2]) === 1 && G.call('medalFor', r, r.m[2] + 1) === 0);
  check('room clears never touch sector best times or clears', sv.best.every(v => !v) && sv.cleared.every(v => !v));
  const a = G.call('dailyRooms', '2026-11-25'), b = G.call('dailyRooms', '2026-11-25'), c = G.call('dailyRooms', '2026-11-26');
  check('the daily run picks the same three different rooms for a date', a.join() === b.join() && new Set(a).size === 3 && a.join() !== c.join());
  G.call('startDaily'); const D = G.get('DAILY'); let ok = true;
  for (let i = 0; i < 3; i++) { if (G.get('roomId') !== D.list[i]) ok = false; const Q = G.get('P'); Q.x = (G.get('W') - 6) * 16; G.step(30, { right: 1 }); }
  check('the daily run chains its three rooms on one clock', ok && G.get('state') === 'got' && G.get('lastWin').daily === 1 && sv.daily && sv.daily.t === G.get('lastWin').total);
  G.call('startStage', 0); check('starting a sector ends any daily run', G.get('DAILY') === null);
  G.call('startRoom', ROOMS[1]); G.set('state', 'pause'); G.set('pm', G.get('PAUSE_ITEMS').indexOf('quit')); tap(G, 'start'); check('quitting a room returns to the room list', G.get('state') === 'rooms');
  const code = G.call('exportProgress'); const back = G.call('importProgress', code); check('progress codes keep room times and the daily best', back && back.rooms.r01 === sv.rooms.r01 && back.daily.t === sv.daily.t);
  G.set('state', 'rooms'); let drew = true; try { G.draw(); G.set('state', 'select'); G.draw(); } catch (e) { drew = false; } check('the room list and select card draw without errors', drew);
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll smoke checks passed');
process.exit(failed ? 1 : 0);
