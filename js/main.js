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

  /* ----------------------- Hero "focus" typewriter ---------------------- */
  var motionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersReduced = motionQuery ? motionQuery.matches : false;
  var motionVideos = Array.prototype.slice.call(document.querySelectorAll('video[data-motion-video]'));

  function syncMotionVideos(reduce) {
    motionVideos.forEach(function (video) {
      if (reduce) {
        video.pause();
        video.currentTime = 0;
      } else {
        var play = video.play();
        if (play && typeof play.catch === 'function') play.catch(function () {});
      }
    });
  }
  if (motionVideos.length) {
    syncMotionVideos(prefersReduced);
    if (motionQuery && motionQuery.addEventListener) {
      motionQuery.addEventListener('change', function (event) { syncMotionVideos(event.matches); });
    }
  }

  var rotator = document.querySelector('.hero__rotator-track[data-rotate]');
  if (rotator) {
    var words = [];
    try { words = JSON.parse(rotator.getAttribute('data-rotate')); } catch (e) { words = []; }
    if (words.length > 1 && !prefersReduced) {
      var wi = 0, ci = words[0].length, deleting = true;
      var step = function () {
        var word = words[wi];
        if (deleting) {
          ci--;
          if (ci <= 0) { ci = 0; deleting = false; wi = (wi + 1) % words.length; return after(320); }
          rotator.textContent = word.slice(0, ci);
          after(40);
        } else {
          ci++;
          rotator.textContent = word.slice(0, ci);
          if (ci >= word.length) { deleting = true; return after(1700); }
          after(72);
        }
      };
      var after = function (ms) { setTimeout(step, ms); };
      after(1700); // hold the initial word before cycling
    }
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

  /* Sliding "magic-line" indicator under the active desktop link */
  var indicator = document.querySelector('.nav__indicator');
  var linksWrap = document.querySelector('.nav__links');

  function moveIndicator(link) {
    if (!indicator || !linksWrap || !link) return;
    var lr = link.getBoundingClientRect();
    if (!lr.width) { indicator.classList.remove('is-on'); return; }
    var wr = linksWrap.getBoundingClientRect();
    indicator.style.setProperty('--ind-w', lr.width + 'px');
    indicator.style.setProperty('--ind-x', (lr.left - wr.left) + 'px');
    indicator.classList.add('is-on');
  }
  function syncIndicator() {
    var a = linksWrap ? linksWrap.querySelector('.nav__link.is-active') : null;
    if (a) moveIndicator(a);
    else if (indicator) indicator.classList.remove('is-on');
  }

  function setActive(id) {
    navLinks.forEach(function (l) {
      var on = l.getAttribute('href') === '#' + id;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
    syncIndicator();
  }

  // Hover follows the pointer; snaps back to the active link on leave.
  if (indicator && linksWrap) {
    Array.prototype.slice.call(linksWrap.querySelectorAll('.nav__link'))
      .forEach(function (l) {
        l.addEventListener('mouseenter', function () { moveIndicator(l); });
      });
    linksWrap.addEventListener('mouseleave', syncIndicator);
    window.addEventListener('resize', syncIndicator);
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

  /* --------------------- Interactive version timeline ------------------ */
  var versionTimelines = Array.prototype.slice.call(document.querySelectorAll('[data-version-timeline]'));
  versionTimelines.forEach(function (timeline) {
    var tabs = Array.prototype.slice.call(timeline.querySelectorAll('[role="tab"][data-version-target]'));
    var panels = Array.prototype.slice.call(timeline.querySelectorAll('[role="tabpanel"]'));
    var rail = timeline.querySelector('.sentry-version-rail');
    var trackScroller = timeline.querySelector('.sentry-version-track');
    if (!tabs.length || !panels.length) return;

    function activateVersion(tab, moveFocus, scrollTab) {
      var targetId = tab.getAttribute('data-version-target');
      var activeIndex = tabs.indexOf(tab);
      tabs.forEach(function (candidate) {
        var selected = candidate === tab;
        candidate.classList.toggle('is-active', selected);
        candidate.setAttribute('aria-selected', String(selected));
        candidate.setAttribute('tabindex', selected ? '0' : '-1');
      });
      panels.forEach(function (panel) {
        var selected = panel.id === targetId;
        panel.hidden = !selected;
        panel.tabIndex = selected ? 0 : -1;
        panel.classList.toggle('is-active', selected);
      });
      if (rail) {
        var span = tabs.length > 1 ? (activeIndex / (tabs.length - 1)) * 66.666 : 0;
        rail.style.setProperty('--timeline-progress', span.toFixed(3) + '%');
      }
      if (scrollTab) {
        tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: prefersReduced ? 'auto' : 'smooth' });
      } else if (trackScroller && trackScroller.scrollWidth > trackScroller.clientWidth) {
        trackScroller.scrollLeft = Math.max(0, tab.offsetLeft - (trackScroller.clientWidth - tab.offsetWidth) / 2);
      }
      if (moveFocus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { activateVersion(tab, false, true); });
      tab.addEventListener('keydown', function (event) {
        var nextIndex = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        activateVersion(tabs[nextIndex], true, true);
      });
    });

    activateVersion(tabs.find(function (tab) { return tab.getAttribute('aria-selected') === 'true'; }) || tabs[0], false, false);
  });

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

  /* ------------------------ Whole-card project links -------------------- */
  var linkedCards = Array.prototype.slice.call(document.querySelectorAll('[data-card-link]'));
  linkedCards.forEach(function (card) {
    function openCard() {
      var href = card.getAttribute('data-card-link');
      if (href) window.location.href = href;
    }
    card.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.target.closest('a, button')) return;
      openCard();
    });
    card.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' || event.target !== card) return;
      event.preventDefault();
      openCard();
    });
  });

  /* -------------------- Scroll progress + condensed nav ----------------- */
  var siteNav = document.getElementById('site-nav');
  var progress = document.getElementById('nav-progress');
  var scrollTicking = false;
  function onNavScroll() {
    var st = window.pageYOffset || document.documentElement.scrollTop || 0;
    var max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    var ratio = Math.min(1, Math.max(0, st / max));
    if (progress) progress.style.setProperty('--nav-progress', ratio.toFixed(4));
    if (siteNav) siteNav.classList.toggle('is-scrolled', st > 24);
    scrollTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!scrollTicking) { scrollTicking = true; window.requestAnimationFrame(onNavScroll); }
  }, { passive: true });
  window.addEventListener('resize', onNavScroll);
  onNavScroll();

  /* Footer year */
  var y = document.getElementById('footer-year');
  if (y) y.textContent = new Date().getFullYear();
})();
