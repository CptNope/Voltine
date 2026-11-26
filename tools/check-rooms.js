// Route-checks every challenge room and keeps its medal times honest.
// node tools/check-rooms.js          check: every room has a route and gold is at least the route's time
// node tools/check-rooms.js --write  also rewrite the medal times in js/rooms.js from the route times
// node tools/check-rooms.js r07      check one room
//
// Gold is the route checker's time plus 5%, rounded up to the next half second, so gold is always
// reachable (the checker found a way) without being generous. Silver is gold × 1.35, bronze gold × 1.8.
const fs = require('fs'), path = require('path');
const runStage = require('./ghost');
const load = require('./harness');
const file = path.join(__dirname, '..', 'js', 'rooms.js');
const write = process.argv.includes('--write'), only = process.argv.find(a => /^r\d\d$/.test(a));
const ROOMS = load({ seed: 1 }).get('ROOMS');
const half = f => Math.ceil(f / 30) * 30;
let src = fs.readFileSync(file, 'utf8'), failed = 0;
for (const r of ROOMS) {
  if (only && r.id !== only) continue;
  const t = Date.now(), res = runStage(0, { room: r.id, beam: 60, iters: 200 });
  if (!res.ok) { console.log(`FAIL  ${r.id} ${r.n}: furthest tile ${res.bestTile} of ${res.goalTile}`); failed++; continue; }
  const gold = half(res.frames * 1.05), m = [gold, half(gold * 1.35), half(gold * 1.8)];
  if (write) src = src.replace(new RegExp(`(id:'${r.id}'[^\\n]*?m:)\\[[^\\]]*\\]`), `$1[${m.join(',')}]`);
  else if (r.m[0] < res.frames) { console.log(`FAIL  ${r.id} ${r.n}: gold ${r.m[0]} is faster than the route (${res.frames} frames); run with --write`); failed++; continue; }
  console.log(`PASS  ${r.id} ${r.n}: route ${(res.frames / 60).toFixed(1)}s · gold ${((write ? m : r.m)[0] / 60).toFixed(1)}s (${((Date.now() - t) / 1000).toFixed(1)}s)`);
}
if (write) fs.writeFileSync(file, src);
console.log(failed ? `\n${failed} room(s) failed` : `\nAll rooms passed${write ? ' (medal times written)' : ''}`);
process.exit(failed ? 1 : 0);
