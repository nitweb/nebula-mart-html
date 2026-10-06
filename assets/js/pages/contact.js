/* NEBULA MART — contact form (character counter + demo submit) */
(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var msg = document.getElementById('c-msg');
  var ta = form.querySelector('textarea');
  var cnt = document.getElementById('c-count');
  if (ta && cnt) ta.addEventListener('input', function () { cnt.textContent = ta.value.length + ' / ' + ta.maxLength; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    msg.textContent = 'Thank you! Your message has been received. We reply within one working day.';
    msg.hidden = false;
    msg.classList.add('is-ok');
    form.reset();
    if (cnt) cnt.textContent = '0 / ' + ta.maxLength;
    msg.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
})();
