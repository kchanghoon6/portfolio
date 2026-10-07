/* =========================================================================
   sentry.js — SENTRY project page
   - Language switch for the original poster panels / poster pages
   - Document reader: English / Korean / side by side, page images rendered
     from the submitted PDFs (docs/sentry/pages/<doc>-<lang>/<n>.webp)
   ========================================================================= */
(function () {
  'use strict';

  var BASE = '../docs/sentry/';
  var ROUNDS = { 1: 'Round 1 · Written review', 2: 'Round 2 · Preliminary', 3: 'Round 3 · Finals' };
  // pages = body pages shown in the reader; pdf = pages in the full PDF
  var DOCS = {
    r3: { title: 'Project report', round: 3, pages: 16, pdf: 40, ratio: 1.4128, langs: ['en', 'ko'] },
    poster: { title: 'Poster', round: 3, pages: 2, pdf: 2, ratio: 1.4136, langs: ['en', 'ko'], wide: true },
    s3: { title: 'Project summary', round: 3, pages: 1, pdf: 1, ratio: 1.4128, langs: ['en', 'ko'] },
    r2: { title: 'Project report', round: 2, pages: 16, pdf: 38, ratio: 1.4128, langs: ['en', 'ko'] },
    s2: { title: 'Project summary', round: 2, pages: 1, pdf: 1, ratio: 1.4128, langs: ['en', 'ko'] },
    slides: { title: 'Presentation slides', round: 2, pages: 12, pdf: 12, ratio: 0.5625, langs: ['ko'], wide: true },
    r1: { title: 'Project report', round: 1, pages: 16, pdf: 16, ratio: 1.4128, langs: ['en', 'ko'] },
    s1: { title: 'Project summary', round: 1, pages: 1, pdf: 1, ratio: 1.4145, langs: ['en', 'ko'] }
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  /* --------------------------- Figure language -------------------------- */
  var figLang = load('sentry-lang') === 'ko' ? 'ko' : 'en';

  function applyFigLang(lang) {
    figLang = lang;
    $all('img[data-src-en]').forEach(function (img) {
      var src = img.getAttribute('data-src-' + lang);
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
    $all('a[data-href-en]').forEach(function (a) { a.setAttribute('href', a.getAttribute('data-href-' + lang)); });
    $all('[data-lang-switch] button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
  }
  $all('[data-lang-switch] button').forEach(function (b) {
    b.addEventListener('click', function () {
      applyFigLang(b.getAttribute('data-lang'));
      store('sentry-lang', figLang);
    });
  });
  if (figLang !== 'en') applyFigLang(figLang);

  /* -------------------------------- Reader ------------------------------- */
  var reader = $('#sx-reader');
  if (!reader) return;

  var state = { doc: 'r3', lang: figLang, page: 1 };
  var desk = $('[data-reader-desk]', reader);
  var sheetA = $('[data-sheet="a"]', reader);
  var sheetB = $('[data-sheet="b"]', reader);
  var thumbs = $('[data-reader-thumbs]', reader);
  var pdfLink = $('[data-reader-pdf]', reader);
  var note = $('[data-reader-note]', reader);
  var langBtns = $all('[data-reader-lang] button', reader);
  var stepBtns = $all('[data-step]', reader);

  function pageSrc(doc, lang, n, thumb) {
    return BASE + 'pages/' + doc + '-' + lang + '/' + (thumb ? 't' : '') + n + '.webp';
  }

  function effectiveLang() {
    var d = DOCS[state.doc];
    if (d.langs.indexOf('en') === -1) return 'ko';
    return state.lang;
  }

  function setSheet(fig, lang, n) {
    var d = DOCS[state.doc];
    var img = $('img', fig);
    img.setAttribute('width', '1000');
    img.setAttribute('height', String(Math.round(1000 * d.ratio)));
    img.setAttribute('src', pageSrc(state.doc, lang, n));
    img.setAttribute('alt', d.title + ' (' + ROUNDS[d.round] + '), page ' + n + (lang === 'en' ? ', English translation' : ', Korean original'));
    $('[data-sheet-page]', fig).textContent = n;
  }

  function preload(n) {
    var d = DOCS[state.doc];
    if (n < 1 || n > d.pages) return;
    var langs = effectiveLang() === 'both' ? ['en', 'ko'] : [effectiveLang()];
    langs.forEach(function (l) { var i = new Image(); i.src = pageSrc(state.doc, l, n); });
  }

  function renderPage() {
    var d = DOCS[state.doc];
    var lang = effectiveLang();
    var both = lang === 'both';

    setSheet(sheetA, both ? 'en' : lang, state.page);
    $('[data-sheet-label]', sheetA).textContent = (both || lang === 'en') ? 'English translation' : 'Original · 한국어';
    sheetB.hidden = !both;
    if (both) setSheet(sheetB, 'ko', state.page);
    desk.classList.toggle('sx-desk--both', both);
    desk.classList.toggle('sx-desk--wide', !!d.wide && !both);

    $('[data-page-now]', reader).textContent = state.page;
    stepBtns[0].disabled = state.page <= 1;
    stepBtns[1].disabled = state.page >= d.pages;

    $all('button', thumbs).forEach(function (b, i) {
      var on = i + 1 === state.page;
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    preload(state.page + 1);
  }

  function renderDoc() {
    var d = DOCS[state.doc];
    var lang = effectiveLang();

    $('[data-reader-title]', reader).textContent = d.title;
    $('[data-reader-round]', reader).textContent = ROUNDS[d.round];
    $('[data-page-total]', reader).textContent = d.pages;
    $all('.sx-item', reader).forEach(function (b) {
      if (b.getAttribute('data-doc') === state.doc) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });

    var koOnly = d.langs.indexOf('en') === -1;
    langBtns.forEach(function (b) {
      var l = b.getAttribute('data-lang');
      b.disabled = koOnly && l !== 'ko';
      b.setAttribute('aria-pressed', String(l === lang));
    });

    var pdfLang = lang === 'both' ? 'en' : lang;
    pdfLink.setAttribute('href', BASE + state.doc + '-' + pdfLang + '.pdf');

    var msgs = [];
    if (d.pdf > d.pages) msgs.push('Showing the ' + d.pages + '-page report body. The PDF also contains the source-code appendix (pp. ' + (d.pages + 1) + '–' + d.pdf + '), left untranslated.');
    if (koOnly) msgs.push('Available in Korean only — most slide headings are part of the slide artwork.');
    note.textContent = msgs.join(' ');

    thumbs.classList.toggle('sx-thumbs--wide', !!d.wide);
    thumbs.innerHTML = '';
    var thumbLang = lang === 'both' ? 'en' : lang;
    for (var n = 1; n <= d.pages; n++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'listitem');
      b.setAttribute('aria-label', 'Page ' + n);
      b.setAttribute('data-goto', String(n));
      var img = document.createElement('img');
      img.src = pageSrc(state.doc, thumbLang, n, true);
      img.alt = '';
      img.loading = 'lazy';
      img.width = 150;
      img.height = Math.round(150 * d.ratio);
      b.appendChild(img);
      thumbs.appendChild(b);
    }
    thumbs.hidden = d.pages < 2;
    renderPage();
  }

  function openDoc(doc, page, scroll) {
    if (!DOCS[doc]) return;
    state.doc = doc;
    state.page = Math.min(Math.max(page || 1, 1), DOCS[doc].pages);
    renderDoc();
    if (scroll) {
      var top = reader.getBoundingClientRect().top + window.pageYOffset - 88;
      window.scrollTo({ top: top, behavior: 'smooth' });
      reader.focus({ preventScroll: true });
    }
  }

  function go(n) {
    var d = DOCS[state.doc];
    state.page = Math.min(Math.max(n, 1), d.pages);
    renderPage();
    var cur = $('button[aria-current="true"]', thumbs);
    if (cur && thumbs.scrollTo) {
      thumbs.scrollTo({ left: cur.offsetLeft - (thumbs.clientWidth - cur.offsetWidth) / 2, behavior: 'smooth' });
    }
  }

  $all('.sx-item', reader).forEach(function (b) {
    b.addEventListener('click', function () { openDoc(b.getAttribute('data-doc'), 1, false); });
  });
  langBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.disabled) return;
      state.lang = b.getAttribute('data-lang');
      if (state.lang !== 'both') store('sentry-lang', state.lang);
      renderDoc();
    });
  });
  stepBtns.forEach(function (b) {
    b.addEventListener('click', function () { go(state.page + Number(b.getAttribute('data-step'))); });
  });
  thumbs.addEventListener('click', function (e) {
    var b = e.target.closest('[data-goto]');
    if (b) go(Number(b.getAttribute('data-goto')));
  });
  reader.addEventListener('keydown', function (e) {
    if (e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowRight') { go(state.page + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(state.page - 1); e.preventDefault(); }
  });

  // Links elsewhere on the page that open a document in the reader
  $all('[data-open-doc]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      if (el.closest('#poster') || el.closest('#experiments')) state.lang = figLang;
      openDoc(el.getAttribute('data-open-doc'), Number(el.getAttribute('data-page') || 1), true);
    });
  });

  renderDoc();
})();
