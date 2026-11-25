// Loads the game's scripts into a headless Node VM so tools can drive the real engine.
// Usage: const G = require('./harness')(); G.get('P'); G.set('hard', true); G.step(); G.input({right:1});
const fs = require('fs'), path = require('path'), vm = require('vm');

module.exports = function load(opts = {}) {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script src="(js\/[a-z]+\.js)"><\/script>/g)].map(m => m[1]);
  if (!files.length) throw new Error('No game scripts found in index.html');
  const src = files.map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n') +
    '\nglobalThis.__get=n=>eval(n);globalThis.__set=(n,v)=>{globalThis.__v=v;eval(n+"=globalThis.__v")};\n';

  // Minimal stand-ins for the browser APIs the game touches.
  const ctx = new Proxy({}, { get: (t, k) => k in t ? t[k] : (k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {}), set: (t, k, v) => (t[k] = v, true) });
  const el = () => ({ getContext: () => ctx, getBoundingClientRect: () => ({ left: 0, top: 0, width: 960, height: 544 }), addEventListener() {}, focus() {}, setAttribute() {}, select() {}, value: '', hidden: true, textContent: '', dataset: {}, classList: { add() {}, remove() {} }, width: 0, height: 0 });
  const els = {};
  const store = {};
  const sb = {
    document: { getElementById: id => els[id] || (els[id] = el()), querySelectorAll: () => [], body: el() },
    window: { devicePixelRatio: 1 }, navigator: {}, location: { protocol: 'file:', hostname: '' },
    ResizeObserver: class { observe() {} }, addEventListener() {}, matchMedia: () => ({ matches: false }),
    performance: { now: () => 0 }, requestAnimationFrame() {}, setTimeout: () => 0, clearTimeout() {},
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v) } },
    Math: opts.seed != null ? seeded(opts.seed) : Math, console, Object, Array, String, Number, JSON, btoa, atob, Float32Array, Set, Map,
  };
  sb.globalThis = sb;
  vm.createContext(sb);
  vm.runInContext(src, sb, { filename: 'voltline-bundle.js' });

  const KEYS = ['left', 'right', 'up', 'down', 'jump', 'fire', 'next', 'prev', 'start', 'back', 'music', 'sfx'];
  const K = sb.__get('K');
  return {
    get: n => sb.__get(n),
    set: (n, v) => sb.__set(n, v),
    call: (fn, ...a) => sb.__get(fn)(...a),
    input(k = {}) { for (const key of KEYS) K[key] = !!k[key]; },
    step(n = 1, k) { for (let i = 0; i < n; i++) { if (k) this.input(typeof k === 'function' ? k(i) : k); sb.__get('step')(); } },
    draw() { sb.__get('draw')(); },
  };
};

// Deterministic Math.random so tool runs are repeatable.
function seeded(seed) {
  let s = seed >>> 0 || 1;
  const m = Object.create(Math);
  m.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  return m;
}
