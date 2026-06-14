/* =========================================================================
   main.js — global interactions for the static portfolio
   - Theme toggle  (WHITE default; dark is opt-in & stored in localStorage)
   - Mobile menu
   - Scroll-spy active nav link
   - Reveal-on-scroll
   - Project category filter
   ========================================================================= */
(function () {
  'use strict';

  /* ----------------------------- Theme ---------------------------------- */
  // The no-flash <head> script already applied the stored theme. Here we only
  // wire the toggle and keep localStorage in sync. Default = light.
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      if (next === 'dark') root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', next); } catch (e) {}
      toggle.setAttribute('aria-label', 'Switch to ' + (next === 'dark' ? 'light' : 'dark') + ' mode');
    });
  }

  /* --------------------------- Mobile menu ------------------------------ */
  var navToggle = document.getElementById('nav-toggle');
  var navMobile = document.getElementById('nav-mobile');

  function setMenu(open) {
    if (!navToggle || !navMobile) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) navMobile.removeAttribute('hidden');
    else navMobile.setAttribute('hidden', '');
    navToggle.classList.toggle('is-open', open);
  }
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      setMenu(navMobile.hasAttribute('hidden'));
    });
    navMobile.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* ---------------------------- Scroll-spy ------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
  var byId = {};
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    (byId[id] = byId[id] || []).push(link);
    var el = document.getElementById(id);
    if (el && sections.indexOf(el) === -1) sections.push(el);
  });

  function setActive(id) {
    navLinks.forEach(function (l) {
      var on = l.getAttribute('href') === '#' + id;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  }
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      var vis = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* --------------------------- Reveal-on-scroll ------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reveals.length && 'IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var d = e.target.getAttribute('data-reveal-delay');
          if (d) e.target.style.transitionDelay = d + 'ms';
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (r) { ro.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('is-visible'); });
  }

  /* --------------------------- Project filter --------------------------- */
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter[data-filter]'));
  var grid = document.getElementById('proj-archive-grid');
  var empty = document.getElementById('proj-empty');

  if (filters.length && grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.proj-card'));
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var shown = 0;
        cards.forEach(function (card) {
          var cats = (card.getAttribute('data-category') || '').split(/\s+/);
          var match = f === 'all' || cats.indexOf(f) !== -1;
          card.style.display = match ? '' : 'none';
          if (match) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
      });
    });
  }

  /* Footer year */
  var y = document.getElementById('footer-year');
  if (y) y.textContent = new Date().getFullYear();
})();
