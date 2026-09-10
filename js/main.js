/* ==========================================================================
   THE HITCHING POST COFFEE CO - homepage concept
   Vanilla JS. No libraries, no build step.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky nav shading ---------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('stuck', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  function closeMenu() {
    if (!links || !toggle) return;
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', function (e) {
      if (!links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });
  }

  /* ---------- Scroll spy ---------- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('in'); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(revealables, function (el) { revealer.observe(el); });
  }

  /* ---------- Autoplay guard for self-hosted video ----------
     Muted inline autoplay is allowed on modern mobile, but a data-saver
     setting or low-power mode can refuse it. If a clip will not start we
     leave the poster frame in place rather than showing a dead black box. */
  Array.prototype.forEach.call(document.querySelectorAll('video[autoplay]'), function (v) {
    var attempt = v.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        v.setAttribute('controls', '');
        v.removeAttribute('autoplay');
      });
    }
  });

  /* ---------- Concept inquiry form (no backend) ---------- */
  var form = document.getElementById('inquiry-form');
  var status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = (form.querySelector('#f-name') || {}).value || '';
      var first = name.trim().split(/\s+/)[0];
      var greeting = first ? first : 'there';

      status.innerHTML =
        '<strong>Thanks, ' + escapeHtml(greeting) + '. This is a concept preview.</strong>' +
        'On the live site this form emails The Hitching Post directly and drops the ' +
        'request into their inbox with the date, headcount, and location filled in. ' +
        'Nothing was sent just now.';
      status.classList.add('show');
      status.setAttribute('role', 'status');
      form.reset();

      var top = status.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
