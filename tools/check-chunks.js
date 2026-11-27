// Route-checks every Endless chunk and reports how fast its route moves, so the null wave stays fair.
// node tools/check-chunks.js        node tools/check-chunks.js c17
// Each chunk is tested alone, between two flat chunks, as a challenge room (start on the left, exit on
// the right). Its route speed is its 16 columns divided by the extra time it takes over a flat chunk.
// The check fails if any chunk has no route, or if the wave's top speed (EN_VMAX) isn't below 90% of
// the slowest chunk's route speed.
const runStage = require('./ghost'), load = require('./harness');
const G = load({ seed: 1 }), CHUNKS = G.get('CHUNKS'), VMAX = G.get('EN_VMAX'), TS = 16;
const only = process.argv.find(a => /^c\d\d$/.test(a));
const asRoom = (c) => ({ id: 'chunk-' + c.id, n: c.id, t: 0, W: 48, m: [1, 2, 3],
  b(f) { f(0, 0, 0, 14); c.b((a, b, y0, y1, ch) => f(a + 16, b + 16, y0, y1, ch)); },
  s: c.s.map(([t, x, y]) => [t, x + 16, y]) });
const flat = runStage(0, { room: asRoom({ id: 'flat', b() {}, s: [] }), beam: 40, iters: 120 });
let failed = 0, slowest = Infinity, slowId = '';
for (const c of CHUNKS) {
  if (only && c.id !== only) continue;
  const r = runStage(0, { room: asRoom(c), beam: 60, iters: 200 });
  if (!r.ok) { console.log(`FAIL  ${c.id} (tier ${c.tier}): furthest tile ${r.bestTile - 16} of 16`); failed++; continue; }
  const extra = Math.max(1, r.frames - flat.frames), v = (16 * TS) / (16 * TS / 1.6 + extra); // px per frame across the chunk
  if (v < slowest) { slowest = v; slowId = c.id; }
  console.log(`PASS  ${c.id} (tier ${c.tier}): route speed ${v.toFixed(2)} px/frame`);
}
if (!only && VMAX > slowest * .9) { console.log(`FAIL  the null wave's top speed ${VMAX} is not below 90% of the slowest chunk (${slowId}, ${slowest.toFixed(2)})`); failed++; }
console.log(failed ? `\n${failed} problem(s)` : `\nAll chunks passed · slowest ${slowId} at ${slowest.toFixed(2)} px/frame · wave tops out at ${VMAX}`);
process.exit(failed ? 1 : 0);
