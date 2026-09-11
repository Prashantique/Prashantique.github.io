/* ==========================================================================
   prashantique.github.io — behaviour
   --------------------------------------------------------------------------
   Theme choice, staggered reveals and the footer year. One stored value, and
   it is the theme. Motion is skipped entirely when the visitor has asked for
   reduced motion, rather than merely shortened.
   ========================================================================== */

(function () {
  'use strict';

  var KEY = 'ps-theme';
  var root = document.documentElement;

  /* --- theme ----------------------------------------------------------- */

  function stored() {
    try { return localStorage.getItem(KEY); } catch (_) { return null; }
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme');
    if (!btn) { return; }
    var next = theme === 'dark' ? 'light' : 'dark';
    btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    var use = btn.querySelector('use');
    if (use) { use.setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon'); }
  }

  var initial = stored();
  if (!initial) {
    initial = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  apply(initial);

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('#theme');
    if (!btn) { return; }
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (_) { /* private mode */ }
  });

  /* --- reveals --------------------------------------------------------- */

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var el = entry.target;
        /* Stagger by position within the section, so a row of cards arrives
           in sequence rather than all at once. */
        var peers = el.parentNode ? Array.prototype.slice.call(
          el.parentNode.querySelectorAll(':scope > .reveal')) : [];
        var i = Math.max(0, peers.indexOf(el));
        el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* --- stat count-up --------------------------------------------------- */

  /* Counting is decoration, so it is skipped outright under reduced motion
     rather than run faster: the final number is what matters. */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-to'), 10);
    if (!target || reduced) { el.textContent = target ? target + '+' : el.textContent; return; }
    var start = null, dur = 1100;
    function frame(ts) {
      if (start === null) { start = ts; }
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + '+';
      if (p < 1) { window.requestAnimationFrame(frame); }
    }
    window.requestAnimationFrame(frame);
  }

  var stats = Array.prototype.slice.call(document.querySelectorAll('.stats b[data-to]'));
  if (stats.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      stats.forEach(countUp);
    } else {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) { return; }
          countUp(e.target); so.unobserve(e.target);
        });
      }, { threshold: 0.5 });
      stats.forEach(function (el) { so.observe(el); });
    }
  }

  /* --- footer year ----------------------------------------------------- */

  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
