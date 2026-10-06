/* NEBULA MART — login + register (show/hide password, strength meter, demo submit) */
(function () {
  'use strict';
  var form = document.getElementById('auth-form');
  if (!form) return;
  var msg = document.getElementById(form.getAttribute('data-msg'));

  function say(text, ok) {
    if (!msg) return;
    msg.textContent = text;
    msg.hidden = false;
    msg.classList.toggle('is-ok', !!ok);
  }

  document.querySelectorAll('[data-eye]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentNode.querySelector('input');
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', show);
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      var ic = btn.querySelector('.ic');
      ic.classList.toggle('ic-eye', !show);
      ic.classList.toggle('ic-eye-off', show);
    });
  });

  var pw = form.querySelector('[data-strength]');
  var meter = document.getElementById('pw-meter');
  var label = document.getElementById('pw-label');
  if (pw && meter && label) {
    pw.addEventListener('input', function () {
      var v = pw.value, s = 0;
      if (v.length >= 8) s++;
      if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
      if (/\d/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      if (v && s < 1) s = 1;
      meter.setAttribute('data-level', s);
      label.textContent = v ? ['', 'Weak', 'Fair', 'Good', 'Strong'][s] : 'Use at least 8 characters';
    });
  }

  document.querySelectorAll('[data-social]').forEach(function (b) {
    b.addEventListener('click', function () {
      say(b.getAttribute('data-social') + ' sign-in is a demo. Connect your provider to enable it.', false);
    });
  });

  var forgot = document.querySelector('[data-forgot]');
  if (forgot) forgot.addEventListener('click', function (e) {
    e.preventDefault();
    say('Password reset is a demo. Connect it to your backend.', false);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var login = form.getAttribute('data-kind') === 'login';
    say(login ? 'Signed in. This is a demo form, connect it to your backend.' : 'Account created. This is a demo form, connect it to your backend.', true);
    if (!login) { form.reset(); if (meter) meter.setAttribute('data-level', 0); if (label) label.textContent = 'Use at least 8 characters'; }
  });
})();
