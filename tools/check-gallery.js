// Checks levels.json: every entry must decode, carry a valid "verified" mark, have a name and author,
// and pass the route check again here (the mark alone can be copied, so CI re-runs the search).
// node tools/check-gallery.js
const fs = require('fs'), path = require('path');
const load = require('./harness');
const file = path.join(__dirname, '..', 'levels.json');
let failed = 0;
const fail = (i, why) => { console.log(`FAIL  #${i + 1}: ${why}`); failed++; };

let data;
try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.log('FAIL  levels.json is not valid JSON: ' + e.message); process.exit(1); }
if (!Array.isArray(data.levels) || !data.levels.length) { console.log('FAIL  levels.json has no "levels" array'); process.exit(1); }

const G = load({ seed: 41 });
G.call('enterEditor'); G.step(2, {});
const seen = new Set();
data.levels.forEach((e, i) => {
  const L = G.call('decodeLevel', e && e.code);
  if (!L) return fail(i, 'code does not decode');
  if (!L.n || !L.a) return fail(i, 'missing name or author');
  if (!G.call('isVerified', L)) return fail(i, `"${L.n}" has no valid verified mark (run Check route in the editor before copying the code)`);
  const h = G.call('levelHash', L);
  if (seen.has(h)) return fail(i, `"${L.n}" is a duplicate of an earlier level`); seen.add(h);
  G.set('ED', L); G.call('enterEditor'); G.step(1, {});
  const t = Date.now(); G.call('routeStart');
  for (let k = 0; k < 6 && G.get('state') === 'route'; k++) G.step(1);
  const msg = G.get('routeMsg');
  if (!msg || msg.ok !== 1) return fail(i, `"${L.n}" fails the route check: ${msg && msg.s}`);
  console.log(`PASS  #${i + 1} ${L.n} by ${L.a} (${L.w} cols, ${((Date.now() - t) / 1000).toFixed(1)}s)`);
});
console.log(failed ? `\n${failed} gallery level(s) failed` : `\nAll ${data.levels.length} gallery levels passed`);
process.exit(failed ? 1 : 0);
