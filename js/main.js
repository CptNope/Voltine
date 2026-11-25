// Voltline · main.js · Starts the game loop and registers the offline service worker.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
requestAnimationFrame(frame);
try{if('serviceWorker' in navigator&&location.protocol==='https:'&&/github\.io$/.test(location.hostname))navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}
