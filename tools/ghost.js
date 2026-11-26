// Route checker: searches for a way through each stage using the real engine and physics.
// Enemies and mid-bosses are removed (they can be shot or tanked); pits, spikes, lava, crushers, belts,
// moving platforms and wind all stay on. A run fails if the search cannot reach the boss
// arena from the stage start without taking damage.
//
// node tools/ghost.js            check all four stages
// node tools/ghost.js 2          check one stage (0 Prism, 1 Foundry, 2 Sky, 3 Core, 5 Tide, 7 Orbit, 8 Phase)
const load = require('./harness');

const MACROS = [
  { r: 8 }, { r: 20 }, { l: 8 }, { w: 12 }, { w: 30 },
  // jump (held h frames) while holding right for a frames, then let go until the frame count n
  ...[4, 10, 16, 24].flatMap(h => [12, 20, 28, 40, 60].map(a => ({ jr: h, a, n: Math.max(a, 50) }))),
  { jn: 22, n: 50 }, { jl: 14, n: 40 },
  { slide: 1 }, { up: 100 }, { down: 40 }, { sw: 40 }, { sw: 80 }, { su: 40 }, { w: 45 },
  { jr: 24, a: 90, n: 100 }, { jr: 24, a: 120, n: 130 }, { jr: 24, a: 70, n: 120 }, // long floaty jumps in low-gravity fields
];

function runStage(si, { beam = 60, iters = 260, room = null } = {}) {
  const G = load({ seed: 7 });
  G.set('save', { cleared: [1, 1, 1, 1, 0, 1, 0, 1, 1], best: Array(9).fill(0), bestH: Array(9).fill(0), rush: [0, 0] });
  if (room) { G.call('loadRoom', G.get('ROOMS').find(q => q.id === room)); si = G.get('ROOM_I'); }
  G.call('startStage', si, 1);
  G.set('E', []);
  const ST = G.get('ST'), ARENA = G.get('ARENA'), TS = 16, goal = (ARENA + 3) * TS;
  const MV = () => G.get('MV');
  const timed = MV().length > 0 || G.get('CR').length > 0 || G.get('HASPHASE'); // platforms, crushers and phase blocks make timing matter

  const snap = (f = 0) => { const P = G.get('P'); return { P: { ...P, mv: P.mv ? MV().indexOf(P.mv) : -1 }, tick: G.get('tick'), cp: G.get('cp'), clock: G.get('clock'), f }; };
  const done = () => G.get('arena') || G.get('state') === 'got'; // a boss arena, or a challenge room's exit
  const restore = s => {
    G.set('tick', s.tick); G.set('cp', s.cp); G.set('clock', s.clock); G.set('state', 'play'); G.set('MBdone', true); // mid-bosses are fights, not terrain; the route check skips them like other enemies if (G.get('HASPHASE')) G.set('PHASE', Math.floor(s.tick / 90) % 2); G.set('E', []); G.set('EB', []); G.set('PB', []);
    for (const m of MV()) { const a = s.tick / m.per * 6.283 + m.ph; m.x = m.bx + Math.sin(a) * m.ax; m.y = m.by + Math.sin(a) * m.ay; m.dx = m.dy = 0; }
    const P = { ...s.P }; P.mv = P.mv >= 0 ? MV()[P.mv] : null; G.set('P', P);
  };
  const play = (mac) => {
    const hp0 = G.get('P').hp;
    const frames = [];
    if (mac.r) for (let i = 0; i < mac.r; i++) frames.push({ right: 1 });
    if (mac.l) for (let i = 0; i < mac.l; i++) frames.push({ left: 1 });
    if (mac.w) for (let i = 0; i < mac.w; i++) frames.push({});
    if (mac.jr) for (let i = 0; i < mac.n; i++) frames.push({ right: i < mac.a, jump: i < mac.jr });
    if (mac.jl) for (let i = 0; i < mac.n; i++) frames.push({ left: 1, jump: i < mac.jl });
    if (mac.jn) for (let i = 0; i < mac.n; i++) frames.push({ jump: i < mac.jn });
    if (mac.slide) { frames.push({ down: 1, jump: 1 }); for (let i = 0; i < 40; i++) frames.push({ right: 1 }); }
    if (mac.up) for (let i = 0; i < mac.up; i++) frames.push({ up: 1, right: i > mac.up - 20 });
    if (mac.down) for (let i = 0; i < mac.down; i++) frames.push({ down: 1 });
    if (mac.sw) for (let i = 0; i < mac.sw; i++) frames.push({ right: 1, jump: i % 14 < 3 }); // swim right
    if (mac.su) for (let i = 0; i < mac.su; i++) frames.push({ jump: i % 12 < 3 });           // swim up
    frames.push({});
    for (const f of frames) {
      G.step(1, f);
      if (done()) return true;
      if (G.get('state') !== 'play') return false;
      if (G.get('P').hp < hp0) return false;
    }
    const P = G.get('P');
    return P.onG || P.climb || P.wt ? true : false; // keep states that end standing, climbing or swimming
  };

  G.step(5, {});
  let frontier = [snap()], best = frontier[0].P.x, seen = new Set();
  for (let it = 0; it < iters; it++) {
    const next = [];
    for (const s of frontier) for (const mac of MACROS) {
      restore(s);
      if (!play(mac)) continue;
      const n = snap();
      if (done()) return { ok: true, stage: G.get('ST').name, iters: it, x: n.P.x / TS, frames: G.get('clock') };
      const key = `${Math.round(n.P.x / 8)},${Math.round(n.P.y / 8)},${n.P.climb ? 1 : 0},${n.P.mv}` + (timed ? `,${Math.floor(n.tick / 15) % 16}` : '');
      if (seen.has(key)) continue;
      seen.add(key); next.push(n);
    }
    if (!next.length) break;
    next.sort((a, b) => b.P.x - a.P.x || a.P.y - b.P.y);
    // keep the furthest states plus a spread of higher ones so ladders and upper routes survive
    const byX = next.slice(0, Math.ceil(beam * .7));
    const byHeight = next.slice().sort((a, b) => a.P.y - b.P.y).slice(0, Math.floor(beam * .3));
    frontier = [...new Set([...byX, ...byHeight])];
    best = Math.max(best, next[0].P.x);
  }
  return { ok: false, stage: G.get('ST').name, bestTile: Math.floor(best / TS), goalTile: room ? G.get('W') - 4 : ARENA + 3 };
}

if (require.main === module) {
  const only = process.argv[2];
  const stages = only != null ? [+only] : [0, 1, 2, 5, 7, 8, 3];
  let fail = 0;
  for (const s of stages) {
    const t = Date.now(), r = runStage(s);
    console.log(r.ok ? `PASS  ${r.stage}: route found (${r.iters} search steps, ${((Date.now() - t) / 1000).toFixed(1)}s)`
                     : `FAIL  ${r.stage}: furthest point tile ${r.bestTile} of ${r.goalTile}`);
    if (!r.ok) fail++;
  }
  process.exit(fail ? 1 : 0);
}
module.exports = runStage;
