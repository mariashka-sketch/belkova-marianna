/* ============================================================
   Марианна Белькова — 3D-скролл эффекты (index.html)
   1) Hero: аудитория собирается в портрет (кадры 1363_0)
   2) Отзывы: стена стикеров -> арена (кадры отзывов)
   Механика по образцу «острова»: canvas-секвенция + GSAP
   ScrollTrigger (scrub) + Lenis. Фолбэк: статичные постеры.
   ============================================================ */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !window.gsap || !window.ScrollTrigger) return; // остаёмся на статичном фолбэке

  document.body.classList.add('fx');
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- плавный скролл (Lenis) ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    // мобильное меню блокирует прокрутку — останавливаем Lenis
    var burger = document.getElementById('burger');
    if (burger) burger.addEventListener('click', function () {
      document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start();
    });
    document.querySelectorAll('#nav a').forEach(function (a) {
      a.addEventListener('click', function () { lenis.start(); });
    });
  }

  /* ---------- секвенция кадров на canvas ---------- */
  function makeSeq(canvasId, dir, count) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');
    var imgs = [];
    var seq = { frame: 0, ready: false, canvas: canvas };

    seq.render = function () {
      var img = imgs[Math.round(seq.frame)];
      if (!img || !img.complete || !img.naturalWidth) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var cw = Math.round(canvas.clientWidth * dpr);
      var ch = Math.round(canvas.clientHeight * dpr);
      if (!cw || !ch) return;
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      var ir = img.width / img.height, cr = cw / ch, dw, dh;
      if (cr > ir) { dw = cw; dh = cw / ir; } else { dh = ch; dw = ch * ir; }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    seq.load = function (onProgress) {
      var loaded = 0;
      return Promise.all(Array.from({ length: count }, function (_, i) {
        var img = new Image();
        img.src = dir + '/frame_' + String(i + 1).padStart(4, '0') + '.webp';
        imgs[i] = img;
        return img.decode().catch(function () {}).then(function () {
          loaded++;
          if (onProgress) onProgress(loaded / count);
        });
      })).then(function () { seq.ready = true; seq.render(); });
    };
    return seq;
  }

  var heroCanvas = document.getElementById('heroSeq');
  if (heroCanvas) {
  var hero = makeSeq('heroSeq', 'assets/hero-seq', 85);
  var testi = document.getElementById('testiSeq') ? makeSeq('testiSeq', 'assets/testi-seq', 81) : null;
  var HERO_LAST = 84, TESTI_LAST = 80;
  var INTRO_END = 26; // до этого кадра толпа «стекается» сама, дальше — скролл

  window.addEventListener('resize', function () { hero.render(); if (testi) testi.render(); });

  /* ---------- hero: загрузка, интро, скраб ---------- */
  var heroLoad = document.getElementById('heroLoad');
  var heroPoster = document.getElementById('heroPoster');
  var introTween = null;

  hero.load(function (p) {
    if (heroLoad) heroLoad.textContent = 'аудитория · ' + Math.round(p * 100) + '%';
  }).then(function () {
    if (heroLoad) gsap.to(heroLoad, { opacity: 0, duration: .4, onComplete: function () { heroLoad.remove(); } });
    hero.frame = Math.max(hero.frame, 0);
    hero.render();
    if (heroPoster) gsap.to(heroPoster, { opacity: 0, duration: .8, onComplete: function () { heroPoster.style.display = 'none'; } });
    // интро: люди стекаются к месту будущего портрета (только пока страница вверху)
    if ((window.scrollY || 0) < 60) {
      introTween = gsap.fromTo(hero, { frame: 0 }, {
        frame: INTRO_END, duration: 2.2, ease: 'power1.inOut', snap: { frame: 1 },
        onUpdate: hero.render
      });
    }
    // сцена отзывов на странице больше не используется
    if (testi) testi.load();
  });

  function killIntro() {
    if (introTween) { introTween.kill(); introTween = null; }
  }

  var mm = gsap.matchMedia();

  /* десктоп: hero пинится, портрет собирается за 130vh скролла */
  mm.add('(min-width:1041px)', function () {
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: '+=130%',
        scrub: 0.6, pin: true, anticipatePin: 1,
        onUpdate: function (st) { if (st.progress > 0.02) killIntro(); }
      }
    });
    tl.fromTo(hero, { frame: INTRO_END }, { frame: HERO_LAST, snap: 'frame', duration: .82, onUpdate: hero.render }, 0);
    tl.fromTo('#sceneCap', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .12, ease: 'power2.out' }, .8);
    tl.to({}, { duration: .06 }, .94);
  });

  /* мобильный: без пина — портрет собирается, пока блок проходит экран */
  mm.add('(max-width:1040px)', function () {
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.hero-visual', start: 'top 88%', end: 'top 8%',
        scrub: 0.5,
        onUpdate: function (st) { if (st.progress > 0.02) killIntro(); }
      }
    });
    tl.fromTo(hero, { frame: INTRO_END }, { frame: HERO_LAST, snap: 'frame', duration: .85, onUpdate: hero.render }, 0);
    tl.fromTo('#sceneCap', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .12, ease: 'power2.out' }, .86);
  });
  } // конец hero-эффекта (портрет теперь статичный)

})();
