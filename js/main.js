// Voltline · main.js · Starts the game loop and registers the offline service worker.
// Classic script (no modules) so the game also runs from file://. Load order is set in index.html.
requestAnimationFrame(frame);
try{if('serviceWorker' in navigator&&location.protocol==='https:'&&/github\.io$/.test(location.hostname))navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}
// the canvas draws with the bundled font, but a canvas alone doesn't make the browser fetch it
try{if(document.fonts&&document.fonts.load){document.fonts.load('700 13px "Chakra Petch"');document.fonts.load('500 13px "Chakra Petch"')}}catch(e){}
