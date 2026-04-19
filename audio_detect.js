const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Inject exactly what creates AudioContext and oscillators
  await page.evaluateOnNewDocument(() => {
    window._audioStarts = [];
    const OriginalCtx = window.AudioContext || window.webkitAudioContext;
    class HookedCtx extends OriginalCtx {
      constructor() {
        super();
        console.log('HOOK: AudioContext created');
      }
      createOscillator() {
        const osc = super.createOscillator();
        const origStart = osc.start;
        osc.start = function(...args) {
          console.log(`HOOK: osc.start() - frequency: ${this.frequency?.value}, type: ${this.type}`);
          return origStart.apply(this, args);
        };
        return osc;
      }
      createGain() {
        const gain = super.createGain();
        const origSetValue = gain.gain.setValueAtTime;
        gain.gain.setValueAtTime = function(...args) {
          console.log(`HOOK: gain.setValueAtTime() - ${args}`);
          return origSetValue.apply(this, args);
        }
        return gain;
      }
    }
    window.AudioContext = HookedCtx;
  });

  page.on('console', msg => console.log('BROWSER:', msg.text()));

  await page.goto('http://localhost:5173');
  
  // Simulate scroll or click to trigger auto-play policies
  await page.mouse.click(500, 500);
  await page.waitForTimeout(2000);
  await page.mouse.wheel({ deltaY: 500 });
  await page.waitForTimeout(2000);

  await browser.close();
})();
