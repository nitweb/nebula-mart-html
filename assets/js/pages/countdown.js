/* NEBULA MART: flash deals countdown, resets every day at midnight Dhaka time (UTC+6, no DST) */
(function () {
  'use strict';
  var box = document.getElementById('flash-countdown');
  if (!box) return;
  var h = box.querySelector('[data-fc="h"]'), m = box.querySelector('[data-fc="m"]'), s = box.querySelector('[data-fc="s"]');
  var OFFSET = 6 * 3600 * 1000, DAY = 86400000;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var dhakaNow = Date.now() + OFFSET;
    var left = DAY - (dhakaNow % DAY);                 // ms until next Dhaka midnight
    var t = Math.floor(left / 1000);
    h.textContent = pad(Math.floor(t / 3600));
    m.textContent = pad(Math.floor((t % 3600) / 60));
    s.textContent = pad(t % 60);
  }
  tick();
  setInterval(tick, 1000);
})();
