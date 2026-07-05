/* ═══════════════════════════════════════════════════
   HARSHA SRIDHAR — PORTFOLIO v5 SCRIPT
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── 1. EMAIL OBFUSCATION (click-only reveal) ──
  const emlEl = document.getElementById('eml');
  emlEl.addEventListener('click', function(e) {
    if (this.href && this.href.indexOf('mailto:') === 0) return;
    e.preventDefault();
    const p = [115,114,105,100,104,97,114,115,104,97,53,57,56];
    const h = [103,109,97,105,108,46,99,111,109];
    this.href = 'mailto:' + p.map(c => String.fromCharCode(c)).join('') + '@' + h.map(c => String.fromCharCode(c)).join('');
    this.click();
  });

  // ── 2. CUSTOM CURSOR WITH COMET TRAIL ──
  const cur = document.getElementById('cur');
  const trailCv = document.getElementById('curTrail');
  const trailCtx = trailCv ? trailCv.getContext('2d') : null;
  let mx = 0, my = 0, cx = 0, cy = 0;

  if (trailCv) {
    function resizeTrail() { trailCv.width = innerWidth; trailCv.height = innerHeight; }
    resizeTrail();
    window.addEventListener('resize', resizeTrail, { passive: true });
  }

  const trail = [];
  const TRAIL_LEN = 18;

  const curHint = cur.querySelector('.cur-hint');
  let hintShown = false;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!hintShown && curHint) {
      hintShown = true;
      curHint.classList.add('show');
      setTimeout(() => { curHint.classList.add('fade'); curHint.classList.remove('show'); }, 5000);
      setTimeout(() => { curHint.remove(); }, 6500);
    }
  });

  (function tick() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cur.style.transform = `translate(${cx}px,${cy}px)`;

    trail.push({ x: cx, y: cy });
    if (trail.length > TRAIL_LEN) trail.shift();

    if (trailCtx) {
      trailCtx.clearRect(0, 0, trailCv.width, trailCv.height);
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        const frac = i / trail.length;
        const r = 2.5 * frac;
        const alpha = frac * frac * 0.35;
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
        trailCtx.fillStyle = `rgba(240,180,60,${alpha})`;
        trailCtx.fill();
        if (r > 1.2) {
          const grad = trailCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
          grad.addColorStop(0, `rgba(240,180,60,${alpha * 0.3})`);
          grad.addColorStop(1, 'rgba(240,180,60,0)');
          trailCtx.beginPath();
          trailCtx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
          trailCtx.fillStyle = grad;
          trailCtx.fill();
        }
      }
    }

    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('a,button,.tc,.wc,.cr,.mem-card,.pill-dot,.sig-card,.lab-canvas-wrap').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });
  // Delegate for elements created after DOMContentLoaded (chips in reader, mobile system lists).
  document.addEventListener('mouseover', e => {
    if (e.target.closest('.lr-chip, .sys-list li')) cur.classList.add('big');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('.lr-chip, .sys-list li')) cur.classList.remove('big');
  });

  // ── 3. SCROLL REVEAL OBSERVER (must run first to ensure content is visible) ──
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('go');
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fu,.tc').forEach(el => revealObs.observe(el));

  // ── 4. PARTICLE MATERIALIZE HERO ──
  (function heroParticles() {
    const isMobile = window.innerWidth < 768;
    const hpCv = document.getElementById('heroParticles');

    function fallbackAnim() {
      gsap.to('.h-name .ln .i', { opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.5 });
      gsap.to('.h-eye', { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 });
      gsap.to('.h-tag', { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.1 });
      if (hpCv) hpCv.remove();
    }

    if (isMobile || !hpCv) { fallbackAnim(); return; }

    const ctx = hpCv.getContext('2d');
    if (!ctx) { fallbackAnim(); return; }

    const hero = document.getElementById('hero');
    const W = hpCv.width = hero.offsetWidth;
    const H = hpCv.height = hero.offsetHeight;

    try {
      const nameEl = document.querySelector('.h-name');
      const style = getComputedStyle(nameEl);
      const fontSize = parseFloat(style.fontSize);
      const fontFamily = style.fontFamily;
      const fontWeight = style.fontWeight;
      const lineHeight = fontSize * 0.88;

      const heroText = 'MS Harsha.';
      const offCv = document.createElement('canvas');
      const textW = Math.ceil(W * 0.95);
      const textH = Math.ceil(fontSize * 1.2);
      offCv.width = textW;
      offCv.height = textH;
      const offCtx = offCv.getContext('2d');
      offCtx.fillStyle = '#fff';
      offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'top';
      offCtx.fillText(heroText, textW / 2, 0);

      const imgData = offCtx.getImageData(0, 0, textW, textH);
      const pixels = imgData.data;
      const coords = [];
      const step = Math.max(2, Math.floor(fontSize / 40));
      for (let y = 0; y < textH; y += step) {
        for (let x = 0; x < textW; x += step) {
          if (pixels[(y * textW + x) * 4 + 3] > 128) {
            coords.push({ x, y });
          }
        }
      }

      if (coords.length < 20) { fallbackAnim(); return; }

      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]];
      }
      const sampleCount = Math.min(300, coords.length);
      const sampled = coords.slice(0, sampleCount);

      const nameRect = nameEl.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const offsetX = (nameRect.left - heroRect.left) + (nameRect.width - textW) / 2;
      const offsetY = nameRect.top - heroRect.top;

      const particles = sampled.map(c => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 200 + Math.random() * Math.max(W, H) * 0.6;
        const amber = Math.random() < 0.4;
        return {
          sx: W / 2 + Math.cos(angle) * dist,
          sy: H / 2 + Math.sin(angle) * dist,
          tx: c.x + offsetX,
          ty: c.y + offsetY,
          x: 0, y: 0,
          size: 1 + Math.random() * 2,
          hue: amber ? '240,180,60' : '139,131,232',
          alpha: 0.3 + Math.random() * 0.7,
          drift: { x: (Math.random() - 0.5) * 0.8, y: (Math.random() - 0.5) * 0.8 },
          delay: Math.random() * 0.15
        };
      });

      const DURATION = 2800;
      const P1 = 300;     // drift
      const P2 = 1800;    // converge
      const P3 = 2200;    // flash
      const P4 = DURATION; // fade out canvas, reveal text
      const t0 = performance.now();

      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

      function render() {
        const elapsed = performance.now() - t0;
        ctx.clearRect(0, 0, W, H);

        if (elapsed < P4) {
          let canvasAlpha = 1;
          if (elapsed > P3) {
            canvasAlpha = 1 - (elapsed - P3) / (P4 - P3);
          }

          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const t = Math.max(0, elapsed - p.delay * 1000);

            if (t < P1) {
              const f = t / P1;
              p.x = p.sx + p.drift.x * t;
              p.y = p.sy + p.drift.y * t;
            } else if (t < P2) {
              const raw = (t - P1) / (P2 - P1);
              const f = easeOutCubic(raw);
              const driftX = p.sx + p.drift.x * P1;
              const driftY = p.sy + p.drift.y * P1;
              p.x = driftX + (p.tx - driftX) * f;
              p.y = driftY + (p.ty - driftY) * f;
            } else {
              p.x = p.tx;
              p.y = p.ty;
            }

            let alpha = p.alpha * canvasAlpha;
            if (elapsed > P2 && elapsed < P3) {
              const flashT = (elapsed - P2) / (P3 - P2);
              const flash = Math.sin(flashT * Math.PI);
              alpha = Math.min(1, alpha + flash * 0.5) * canvasAlpha;
            }

            const s = p.size;

            if (s > 1.3) {
              const g = s * 3;
              const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, g);
              grad.addColorStop(0, `rgba(${p.hue},${alpha * 0.2})`);
              grad.addColorStop(1, `rgba(${p.hue},0)`);
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(p.x, p.y, g, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.fillStyle = `rgba(${p.hue},${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, s * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }

          requestAnimationFrame(render);
        } else {
          hpCv.remove();
        }
      }

      setTimeout(() => {
        gsap.to('.h-name .ln .i', {
          opacity: 1, duration: 2, ease: 'power1.inOut'
        });
      }, P2);

      setTimeout(() => {
        gsap.to('.h-eye', { opacity: 1, duration: 0.8, ease: 'power2.out' });
        gsap.to('.h-tag', { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 });
      }, P3);

      requestAnimationFrame(render);

    } catch (e) {
      console.warn('Hero particle error:', e);
      fallbackAnim();
    }
  })();

  const scue = document.getElementById('scue');
  window.addEventListener('scroll', () => {
    scue.classList.toggle('hide', scrollY > 80);
  }, { passive: true });

  // ── 4. FLOATING PILL NAV ──
  const pillNav = document.getElementById('pillNav');
  const pillDots = pillNav.querySelectorAll('.pill-dot');
  const sectionIds = ['hero', 'origin', 'career', 'stack', 'places', 'cosmos', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id));

  const heroObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      pillNav.classList.toggle('visible', !e.isIntersecting);
    });
  }, { threshold: 0.15 });
  heroObs.observe(document.getElementById('hero'));

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const idx = sectionIds.indexOf(e.target.id);
      if (idx < 0) return;
      pillDots.forEach((d, i) => d.classList.toggle('active', i === idx));
    });
  }, { threshold: 0.35 });
  sections.forEach(s => { if (s) secObs.observe(s); });

  pillDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── GA4 ENGAGEMENT EVENTS (analysis-ready, deduplicated) ──
  // Custom params (section_name, percent_scrolled, article_title, link_url, link_domain,
  // seconds) are sent in snake_case so they can be registered as GA4 custom dimensions.
  if (typeof gtag === 'function') {
    const sectionLabels = { hero: 'Hero', origin: 'Origin', career: 'Career', stack: 'Stack', places: 'Places', cosmos: 'Cosmos', contact: 'Contact' };

    // 1. Section views — one event per section, with which section + how far through.
    const seen = new Set();
    const sViewObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || seen.has(e.target.id)) return;
        seen.add(e.target.id);
        gtag('event', 'section_view', {
          section_name: sectionLabels[e.target.id] || e.target.id,
          sections_seen: seen.size
        });
      });
    }, { threshold: 0, rootMargin: '-35% 0px -35% 0px' }); // fires when a section crosses the viewport's middle band — reliable for any section height
    sectionIds.forEach(id => { const el = document.getElementById(id); if (el) sViewObs.observe(el); });

    // 2. Scroll depth — GA4-standard 25/50/75/100% milestones.
    const depthHit = new Set();
    window.addEventListener('scroll', () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 0;
      [25, 50, 75, 100].forEach(m => {
        if (pct >= m && !depthHit.has(m)) { depthHit.add(m); gtag('event', 'scroll_depth', { percent_scrolled: m }); } // 'scroll_depth' avoids collision with GA4's built-in 'scroll' auto-event
      });
    }, { passive: true });

    // 3. Email click — mark as a Key Event (conversion) in GA4 → Admin → Events.
    const emlLink = document.getElementById('eml');
    if (emlLink) emlLink.addEventListener('click', () => gtag('event', 'email_click', { link_id: 'contact_email' }));

    // 4. LinkedIn click — also a good Key Event candidate.
    document.querySelectorAll('a[href*="linkedin"]').forEach(el =>
      el.addEventListener('click', () => gtag('event', 'linkedin_click', { link_url: el.href })));

    // 5. Medium article clicks — capture which article.
    document.querySelectorAll('.wc[href]').forEach(el =>
      el.addEventListener('click', () => {
        const t = el.querySelector('.wtit');
        gtag('event', 'article_click', { article_title: t ? t.textContent.trim().slice(0, 100) : el.href, link_url: el.href });
      }));

    // 6. Generic outbound clicks — EXCLUDES LinkedIn + Medium so they aren't double counted.
    document.querySelectorAll('a[target="_blank"]').forEach(el => {
      if (el.closest('.wc') || /linkedin/i.test(el.href)) return;
      el.addEventListener('click', () => {
        let host = ''; try { host = new URL(el.href).hostname; } catch (_) {}
        gtag('event', 'outbound_click', { link_url: el.href, link_domain: host });
      });
    });

    // 7. Engaged-time milestones — only fire if the tab was actually visible.
    [30, 60, 120, 300].forEach(sec => setTimeout(() => {
      if (document.visibilityState === 'visible') gtag('event', 'engaged_time', { seconds: sec });
    }, sec * 1000));
  }

  // ── 5. MOBILE DRAWER ──
  const ham = document.getElementById('ham');
  const drw = document.getElementById('drw');
  const mobNav = document.getElementById('mobNav');
  if (ham && drw) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      drw.classList.toggle('open');
    });
    drw.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open');
      drw.classList.remove('open');
    }));
  }
  if (mobNav) {
    window.addEventListener('scroll', () => {
      mobNav.classList.toggle('scrolled', scrollY > 40);
    }, { passive: true });
  }

  // ── 6. ENHANCED STARFIELD ──
  try { (function () {
    const cv = document.getElementById('starfield');
    const ctx = cv.getContext('2d');
    let W, H, stars = [], shoots = [];
    let mouseX = -1000, mouseY = -1000;

    function resize() {
      W = cv.width = innerWidth;
      H = cv.height = innerHeight;
      init();
    }

    function init() {
      stars = [];
      const n = Math.floor(W * H / 2800);
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          ox: 0, oy: 0,
          r: Math.random() < 0.04 ? Math.random() * 1.8 + 1 : Math.random() * 0.9 + 0.2,
          a: Math.random() * 0.6 + 0.2,
          spd: Math.random() * 0.015 + 0.003,
          off: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.12
            ? (Math.random() < 0.5 ? '180,170,255' : '170,230,255')
            : '240,237,232'
        });
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    function spawnShoot() {
      const ang = (Math.random() * 30 + 10) * Math.PI / 180;
      shoots.push({
        x: Math.random() * W * 0.8,
        y: Math.random() * H * 0.25,
        vx: Math.cos(ang) * (7 + Math.random() * 5),
        vy: Math.sin(ang) * (7 + Math.random() * 5),
        len: 90 + Math.random() * 110,
        a: 0, ma: 0.7 + Math.random() * 0.3,
        life: 0, ml: 55 + Math.random() * 40
      });
    }
    setInterval(() => { if (Math.random() < 0.45) spawnShoot(); }, 4200);

    let f = 0;
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      f++;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (mouseX > -500) {
          const dx = mouseX - (s.x + s.ox);
          const dy = mouseY - (s.y + s.oy);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const tx = dx * 0.03;
            const ty = dy * 0.03;
            s.ox += tx;
            s.oy += ty;
            const mag = Math.sqrt(s.ox * s.ox + s.oy * s.oy);
            if (mag > 8) { s.ox *= 8 / mag; s.oy *= 8 / mag; }
          } else {
            s.ox *= 0.96;
            s.oy *= 0.96;
          }
        } else {
          s.ox *= 0.96;
          s.oy *= 0.96;
        }

        const px = s.x + s.ox;
        const py = s.y + s.oy;
        const tw = Math.sin(f * s.spd + s.off) * 0.35;
        const a = Math.min(1, Math.max(0.05, s.a + tw));

        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.hue},${a})`;
        ctx.fill();

        if (s.r > 1.2) {
          ctx.beginPath();
          ctx.arc(px, py, s.r * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.hue},${a * 0.1})`;
          ctx.fill();
        }
      }

      shoots = shoots.filter(ss => {
        ss.life++;
        ss.x += ss.vx;
        ss.y += ss.vy;
        const p = ss.life / ss.ml;
        ss.a = p < 0.2 ? (p / 0.2) * ss.ma : ss.ma * (1 - (p - 0.2) / 0.8);
        const sp = Math.hypot(ss.vx, ss.vy);
        const tx = ss.x - ss.vx * (ss.len / sp);
        const ty = ss.y - ss.vy * (ss.len / sp);
        const g = ctx.createLinearGradient(tx, ty, ss.x, ss.y);
        g.addColorStop(0, 'rgba(240,237,232,0)');
        g.addColorStop(0.6, `rgba(200,190,255,${ss.a * 0.5})`);
        g.addColorStop(1, `rgba(240,237,232,${ss.a})`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return ss.life < ss.ml;
      });

      requestAnimationFrame(draw);
    })();
  })(); } catch(e) { console.warn('Starfield error:', e); }

  // ── 6b. GALAXY COLLISION (full-page scroll) ──
  try { (function () {
    const cv = document.getElementById('galaxyCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');

    let W, H;
    function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function lerp(a, b, t) { return a + (b - a) * t; }
    function easeIO(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    const ARMS = 3;
    const SPIRAL_B = 0.28;
    const N_ARM = 300;
    const N_CORE = 250;
    const N_HALO = 150;
    const N_TIDAL = 80;
    const TILT = 0.35;

    function makeGalaxy(coreHue, armHue, haloHue) {
      const pts = [];

      for (let i = 0; i < N_CORE; i++) {
        const r = Math.pow(Math.random(), 1.5) * 0.08;
        const a = Math.random() * Math.PI * 2;
        const bright = 1 - r / 0.08;
        pts.push({
          bx: Math.cos(a) * r,
          by: Math.sin(a) * r * TILT,
          size: 1 + bright * 2.5,
          alpha: 0.4 + bright * 0.6,
          hue: coreHue,
          type: 'core',
          ejectA: Math.random() * Math.PI * 2,
          ejectV: 0.05 + Math.random() * 0.15
        });
      }

      for (let arm = 0; arm < ARMS; arm++) {
        const armOffset = (arm / ARMS) * Math.PI * 2;
        for (let i = 0; i < N_ARM; i++) {
          const frac = i / N_ARM;
          const r = 0.03 + frac * 0.35;
          const theta = armOffset + Math.log(r / 0.03) / SPIRAL_B;
          const perpAngle = theta + Math.PI * 0.5;
          const scatter = (Math.random() - 0.5) * (0.015 + frac * 0.06);
          const radScatter = (Math.random() - 0.5) * r * 0.15;
          const px = Math.cos(theta) * (r + radScatter) + Math.cos(perpAngle) * scatter;
          const py = Math.sin(theta) * (r + radScatter) + Math.sin(perpAngle) * scatter;

          const brightness = 1 - frac * 0.7;
          pts.push({
            bx: px,
            by: py * TILT,
            size: 0.5 + brightness * 1.5,
            alpha: 0.15 + brightness * 0.45,
            hue: Math.random() < 0.3 + frac * 0.3 ? armHue : coreHue,
            type: 'arm',
            frac: frac,
            ejectA: Math.atan2(py, px) + (Math.random() - 0.5) * 1.2,
            ejectV: 0.1 + Math.random() * 0.35
          });
        }
      }

      for (let i = 0; i < N_HALO; i++) {
        const r = 0.05 + Math.pow(Math.random(), 0.7) * 0.4;
        const a = Math.random() * Math.PI * 2;
        pts.push({
          bx: Math.cos(a) * r,
          by: Math.sin(a) * r * (TILT + 0.15),
          size: 0.3 + Math.random() * 0.6,
          alpha: 0.06 + Math.random() * 0.12,
          hue: haloHue,
          type: 'halo',
          frac: 0.8 + Math.random() * 0.2,
          ejectA: Math.random() * Math.PI * 2,
          ejectV: 0.15 + Math.random() * 0.4
        });
      }

      for (let i = 0; i < N_TIDAL; i++) {
        const arm = Math.floor(Math.random() * ARMS);
        const armOff = (arm / ARMS) * Math.PI * 2;
        const frac = 0.4 + Math.random() * 0.6;
        const r = 0.03 + frac * 0.3;
        const theta = armOff + Math.log(r / 0.03) / SPIRAL_B;
        pts.push({
          bx: Math.cos(theta) * r,
          by: Math.sin(theta) * r * TILT,
          size: 0.8 + Math.random() * 1.8,
          alpha: 0.25 + Math.random() * 0.35,
          hue: Math.random() < 0.5 ? armHue : coreHue,
          type: 'tidal',
          frac: 1,
          ejectA: Math.atan2(Math.sin(theta), Math.cos(theta)) + (Math.random() - 0.5) * 0.8,
          ejectV: 0.5 + Math.random() * 0.9
        });
      }

      return pts;
    }

    const g1 = makeGalaxy('255,245,220', '170,160,255', '139,131,232');
    const g2 = makeGalaxy('255,240,210', '130,220,190', '31,173,128');

    let scrollT = 0;
    function updateScroll() {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollT = docH > 0 ? Math.max(0, Math.min(1, window.scrollY / docH)) : 0;
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    function drawGalaxy(pts, cx, cy, rot, t, dim, mergeCx, mergeCy, mergeRot, mergeDim) {
      const cosR = Math.cos(rot), sinR = Math.sin(rot);
      const cosM = Math.cos(mergeRot), sinM = Math.sin(mergeRot);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        let lx = p.bx * dim;
        let ly = p.by * dim;
        let rx = lx * cosR - ly * sinR;
        let ry = lx * sinR + ly * cosR;

        let ejX = 0, ejY = 0;
        if (t > 0.2 && p.type !== 'core') {
          const outer = p.type === 'tidal' ? 1.0 : p.type === 'halo' ? 0.9 : (p.frac || 0);
          if (outer > 0.15) {
            const eStart = p.type === 'tidal' ? 0.2 : 0.28;
            const eDur = p.type === 'tidal' ? 0.45 : 0.5;
            const ejectPhase = Math.max(0, Math.min((t - eStart) / eDur, 1));
            const easeEj = ejectPhase * (2 - ejectPhase);
            const mult = p.type === 'tidal' ? 2.0 : 1.0;
            const burst = easeEj * outer * p.ejectV * dim * mult;
            ejX = Math.cos(p.ejectA + rot * 0.3) * burst;
            ejY = Math.sin(p.ejectA + rot * 0.3) * burst * 0.65;
          }
        }

        // Only gravitationally bound particles settle into the new galaxy.
        // Tidal debris and outer halo keep drifting — they're gone.
        const bound = p.type === 'core' || (p.type === 'arm' && (p.frac || 0) < 0.55);
        let settle = 0;
        if (bound) {
          const settleStart = p.type === 'core' ? 0.65 : 0.72;
          settle = t > settleStart ? easeIO(Math.min((t - settleStart) / (1 - settleStart), 1)) : 0;
        }

        let px, py;
        if (settle > 0) {
          let finalLx = p.bx * mergeDim;
          let finalLy = p.by * mergeDim;
          let finalRx = finalLx * cosM - finalLy * sinM;
          let finalRy = finalLx * sinM + finalLy * cosM;
          const fromX = cx + rx + ejX * (1 - settle);
          const fromY = cy + ry + ejY * (1 - settle);
          px = lerp(fromX, mergeCx + finalRx, settle);
          py = lerp(fromY, mergeCy + finalRy, settle);
        } else {
          px = cx + rx + ejX;
          py = cy + ry + ejY;
        }

        let alpha = p.alpha;
        if (t > 0.25 && t < 0.75 && p.type !== 'core') {
          const flare = Math.sin((t - 0.25) / 0.5 * Math.PI);
          const boost = p.type === 'tidal' ? 0.4 : 0.15;
          alpha = Math.min(1, alpha + flare * boost);
        }
        if (!bound && t > 0.7) {
          alpha *= lerp(1, 0.15, easeIO((t - 0.7) / 0.3));
        }

        const s = p.size * (1 + (p.type === 'tidal' && t > 0.25 && t < 0.7 ? 0.5 : 0));

        if (s > 1.5) {
          const g = s * (p.type === 'tidal' ? 5 : 3.5);
          const grad = ctx.createRadialGradient(px, py, 0, px, py, g);
          grad.addColorStop(0, `rgba(${p.hue},${alpha * 0.18})`);
          grad.addColorStop(0.4, `rgba(${p.hue},${alpha * 0.06})`);
          grad.addColorStop(1, `rgba(${p.hue},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, g, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${p.hue},${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, s * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawCoreBulge(x, y, r, alpha, hue1, hue2) {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(255,252,245,${alpha})`);
      grad.addColorStop(0.2, `rgba(${hue1},${alpha * 0.7})`);
      grad.addColorStop(0.5, `rgba(${hue2},${alpha * 0.3})`);
      grad.addColorStop(1, `rgba(${hue2},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const t0 = performance.now();

    (function render() {
      ctx.clearRect(0, 0, W, H);
      const t = scrollT;
      const sec = (performance.now() - t0) / 1000;
      const cx = W * 0.5;
      const cy = H * 0.5;
      const dim = Math.min(W, H);

      const initSep = dim * 0.32;
      let sep, orbit;

      if (t < 0.15) {
        sep = lerp(initSep, initSep * 0.55, easeIO(t / 0.15));
        orbit = t * 0.3;
      } else if (t < 0.45) {
        const p = (t - 0.15) / 0.3;
        sep = lerp(initSep * 0.55, initSep * 0.1, easeIO(p));
        orbit = 0.045 + p * Math.PI * 2.5;
      } else if (t < 0.7) {
        const p = (t - 0.45) / 0.25;
        sep = lerp(initSep * 0.1, 0, easeIO(p));
        orbit = 0.045 + Math.PI * 2.5 + p * Math.PI * 2;
      } else {
        sep = 0;
        orbit = 0.045 + Math.PI * 4.5 + (t - 0.7) * 1.5;
      }

      const g1cx = cx + Math.cos(orbit) * sep;
      const g1cy = cy + Math.sin(orbit) * sep * 0.4;
      const g2cx = cx + Math.cos(orbit + Math.PI) * sep;
      const g2cy = cy + Math.sin(orbit + Math.PI) * sep * 0.4;

      const spin = sec * 0.12 + (t > 0.15 ? (t - 0.15) * 2.5 : 0);

      const mergeDim = dim * 1.8;
      const mergeRot = sec * 0.06;

      drawGalaxy(g1, g1cx, g1cy, spin, t, dim, cx, cy, mergeRot, mergeDim);
      drawGalaxy(g2, g2cx, g2cy, -spin * 0.6 + Math.PI * 0.3, t, dim, cx, cy, mergeRot + Math.PI * 0.15, mergeDim);

      if (sep > 5) {
        const coreA = 0.1 + t * 0.12;
        const coreR = lerp(12, 28, Math.min(t * 2, 1));
        drawCoreBulge(g1cx, g1cy, coreR, coreA, '180,170,255', '139,131,232');
        drawCoreBulge(g2cx, g2cy, coreR, coreA, '150,230,200', '31,173,128');
      }

      if (t > 0.5) {
        const mP = easeIO(Math.min((t - 0.5) / 0.5, 1));
        const mR = lerp(15, Math.min(W, H) * 0.22, mP);
        const mA = lerp(0.02, 0.35, mP);
        drawCoreBulge(cx, cy, mR, mA, '200,195,255', '100,160,140');
      }

      requestAnimationFrame(render);
    })();
  })(); } catch(e) { console.warn('Galaxy collision error:', e); }

  // ── 7. HORIZONTAL TIMELINE ANIMATION ──
  try { (function () {
    const tlH = document.getElementById('tlH');
    const tlGlow = document.getElementById('tlGlow');
    if (!tlH || !tlGlow) return;
    if (window.innerWidth < 768) return;

    const items = [
      document.getElementById('tli0'),
      document.getElementById('tli1'),
      document.getElementById('tli2'),
      document.getElementById('tli3')
    ];
    const thresholds = [0.08, 0.33, 0.58, 0.83];

    let animated = false;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !animated) {
          animated = true;

          gsap.to(tlGlow, {
            width: '100%',
            duration: 2.8,
            ease: 'power2.inOut',
            onUpdate: function () {
              const p = this.progress();
              items.forEach((item, i) => {
                if (item && p >= thresholds[i] && !item.classList.contains('lit')) {
                  item.classList.add('lit');
                }
              });
            }
          });
        }
      });
    }, { threshold: 0.25 });
    obs.observe(tlH);
  })(); } catch(e) { console.warn('Timeline error:', e); }

  // ── 8. STACK — ORBITAL SYSTEMS + READER + MOBILE CARDS ──
  try { (function () {
    // Single source of truth: three "systems" (problem domains), each with a small
    // fleet of tools ordered by how central they are (index 0 = closest orbit).
    // We render this into (a) a canvas orrery on desktop and (b) system cards on mobile.
    const systems = [
      {
        key: 'p', label: 'Services I ship',
        blurb: 'Backend I build against — mostly JVM, always tested under load.',
        color: [139, 131, 232],
        tools: [
          { name: 'Java',            level: 'daily',     note: 'The language I think in. Seven years of muscle memory across services, streams, and batch jobs.' },
          { name: 'Spring Boot',     level: 'daily',     note: 'Default choice for shipping fast without giving up rigor. Config, security, observability — sorted.' },
          { name: 'Spring Reactive', level: 'daily',     note: 'Non-blocking end-to-end at Roku. Backpressure and reactive streams as first-class citizens.' },
          { name: 'REST APIs',       level: 'daily',     note: 'Contract-first. Versioned, documented, and stress-tested — the boring parts done right.' },
          { name: 'Python',          level: 'daily',     note: 'The utility knife — scripts, data cleaning, ML notebooks, and the occasional prototype.' },
          { name: 'Hibernate',       level: 'fluent',    note: 'JPA when it fits, hand-tuned SQL when it doesn\'t. I\'ve seen enough N+1s to have opinions.' },
          { name: 'Microservices',   level: 'fluent',    note: 'Service boundaries as a design discipline — split when the domain earns it, not before.' },
          { name: 'React',           level: 'working',   note: 'Comfortable end-to-end for the checkout surfaces I own. Not my primary craft, still shipping to prod.' }
        ]
      },
      {
        key: 't', label: 'Data I move',
        blurb: 'Pipelines, streams, and the plumbing that keeps them honest.',
        color: [31, 173, 128],
        tools: [
          { name: 'Apache Kafka',    level: 'daily',     note: 'Every large-scale system I\'ve built has Kafka in it. Two years at Amagi turned it into a design instinct.' },
          { name: 'SQL',             level: 'daily',     note: 'Query plans, indexes, and knowing when to stop optimizing. Postgres and MySQL are old friends.' },
          { name: 'Docker',          level: 'daily',     note: 'Reproducible everything. If it runs on my machine, it runs on yours — because the machine is a file.' },
          { name: 'Git',             level: 'daily',     note: 'History as documentation. Branch discipline as a team superpower.' },
          { name: 'Apache Flink',    level: 'fluent',    note: 'Where I got serious about stateful stream processing — event-time semantics, exactly-once, the works.' },
          { name: 'Kubernetes',      level: 'working',   note: 'Enough to debug pods, read manifests, and stay out of the platform team\'s way.' },
          { name: 'Apache Pulsar',   level: 'certified', note: 'Certified. Sometimes the right answer when Kafka isn\'t — geo-replication and tiered storage out of the box.' }
        ]
      },
      {
        key: 'a', label: 'Systems I teach to think',
        blurb: 'The frontier I keep circling back to — from ML foundations to agentic frontiers.',
        color: [240, 168, 48],
        tools: [
          { name: 'Machine Learning', level: 'fluent',    note: 'MTech in Data Science means I actually understand what the model is doing, not just what it outputs.' },
          { name: 'NLP',              level: 'fluent',    note: 'From classical pipelines to transformers — the discipline that made me care about language as data.' },
          { name: 'Data Science',     level: 'fluent',    note: 'Statistics first, dashboards second. The unglamorous half where the real signal lives.' },
          { name: 'Gen AI',           level: 'exploring', note: 'Prompting, evals, RAG, cost curves — building intuition for what the current generation of models actually do well.' },
          { name: 'Agentic Systems',  level: 'exploring', note: 'The question I keep chasing: how do you build software that decides for itself — without going off the rails?' }
        ]
      }
    ];

    const wrap = document.getElementById('stackCanvasWrap');
    const canvas = document.getElementById('stackCanvas');
    const reader = document.getElementById('labReader');
    const lrSystem = document.getElementById('lrSystem');
    const lrTool = document.getElementById('lrTool');
    const lrBody = document.getElementById('lrBody');
    const lrTags = document.getElementById('lrTags');
    const lrMore = document.getElementById('lrMore');
    const lrMoreChips = document.getElementById('lrMoreChips');

    // ── Populate mobile system cards (regardless of viewport — CSS hides them on desktop)
    document.querySelectorAll('.stack-mobile .sys-card').forEach(card => {
      const sys = systems.find(s => s.key === card.dataset.sys);
      if (!sys) return;
      const list = card.querySelector('.sys-list');
      const intro = card.querySelector('.sys-intro');
      if (intro) intro.textContent = sys.blurb;
      const nameEl = card.querySelector('.sys-name');
      if (nameEl) nameEl.textContent = sys.label;
      sys.tools.forEach(t => {
        const li = document.createElement('li');
        li.dataset.level = t.level;
        li.innerHTML = `<span class="sl-name">${t.name}</span><span class="sl-level">${t.level}</span>`;
        list.appendChild(li);
      });
    });

    // ── Signature builds → career card highlight
    document.querySelectorAll('.sig-card').forEach(a => {
      a.addEventListener('click', e => {
        const targetId = a.dataset.target;
        if (!targetId) return;
        // Let the anchor scroll to #career; after it lands, pulse the exact card.
        setTimeout(() => {
          const t = document.getElementById(targetId);
          if (!t) return;
          const card = t.querySelector('.mem-card');
          if (!card) return;
          card.classList.remove('pulse');
          void card.offsetWidth; // restart animation
          card.classList.add('pulse');
          setTimeout(() => card.classList.remove('pulse'), 1700);
        }, 650);
      });
    });

    // ── Canvas orrery (desktop only)
    if (!wrap || !canvas || getComputedStyle(wrap).display === 'none') return;
    const ctx = canvas.getContext('2d');

    // Layout: 3 systems side-by-side. Each system has a max orbit radius (maxR)
    // sized to the canvas; ring fractions below are relative to that.
    // Proficiency → ring: daily inner (but not so inner it collides with the sun),
    // fluent middle, working/exploring outer.
    const levelToRing  = { daily: 0.52, fluent: 0.75, working: 0.96, certified: 0.96, exploring: 1.05 };
    const levelToSize  = { daily: 5.4,  fluent: 4.6,  working: 3.8,  certified: 4.2,  exploring: 3.8 };
    const levelToSpeed = { daily: 0.00055, fluent: 0.00042, working: 0.00033, certified: 0.00033, exploring: 0.00028 };

    // For each tool assign an angle so planets don't overlap within a system.
    // We stagger by level ring so same-radius planets sit at different angles.
    systems.forEach((sys, si) => {
      const byLevel = {};
      sys.tools.forEach(t => { (byLevel[t.level] = byLevel[t.level] || []).push(t); });
      Object.keys(byLevel).forEach(lvl => {
        const arr = byLevel[lvl];
        arr.forEach((t, i) => {
          // Evenly distribute planets on the same ring; rotate per system so
          // the three systems don't look identical when viewed together.
          t._angle = (i / arr.length) * Math.PI * 2 + si * 1.15 + (lvl === 'fluent' ? 0.4 : 0);
          t._speed = levelToSpeed[t.level] * (1 + (i % 2 ? 0.15 : -0.1));
          t._size = levelToSize[t.level];
          t._ring = levelToRing[t.level];
        });
      });
    });

    let W, H, dpr;
    let mouseCanvasX = -1000, mouseCanvasY = -1000;
    let hovered = null; // { sysIdx, toolIdx }
    let pinned = null;  // sticky hover after mouseleave

    function resize() {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Centre of each system's sun. Three horizontal slots with breathing room
    // at the edges so the outermost planets don't clip the canvas frame.
    // maxR: pixel radius of the outermost visible ring; sized so 3 systems fit
    // side-by-side comfortably in W and don't collide with each other.
    function systemCentre(i) { return { cx: W * (0.18 + i * 0.32), cy: H * 0.54 }; }
    function maxR() {
      // Constrain to whichever dimension is tighter so orbits never clip the frame.
      const slotW = W * 0.30;           // horizontal room per system (avoids collisions with neighbors)
      const slotH = H * 0.72;           // vertical room (leave headroom for the sun label + legend)
      return Math.min(slotW, slotH) * 0.5;
    }

    function toolPosition(sysIdx, tool, t) {
      const { cx, cy } = systemCentre(sysIdx);
      const r = tool._ring * maxR();
      const a = tool._angle + t * tool._speed;
      // Slightly squashed orbits for a subtle top-down perspective.
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.78, r };
    }

    // Renders "the rest of this system" as clickable chips so users can browse
    // once they've hovered once — solves the dead-end after the first interaction.
    function renderMoreChips(sysIdx, activeToolIdx) {
      const sys = systems[sysIdx];
      lrMoreChips.innerHTML = '';
      sys.tools.forEach((t, i) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'lr-chip' + (i === activeToolIdx ? ' active' : '');
        chip.dataset.sys = sysIdx;
        chip.dataset.tool = i;
        chip.textContent = t.name;
        lrMoreChips.appendChild(chip);
      });
      lrMore.classList.add('show');
      lrMore.setAttribute('aria-hidden', 'false');
    }

    function updateReader(sysIdx, toolIdx) {
      const sys = systems[sysIdx];
      const tool = sys.tools[toolIdx];
      reader.classList.remove('acc-p', 'acc-t', 'acc-a');
      reader.classList.add('acc-' + sys.key);
      lrSystem.textContent = sys.label;
      lrTool.textContent = tool.name;
      lrBody.textContent = tool.note;
      lrTags.innerHTML = `<span class="lr-tag" data-level="${tool.level}">${tool.level}</span>`;
      renderMoreChips(sysIdx, toolIdx);
    }

    function resetReader() {
      reader.classList.remove('acc-p', 'acc-t', 'acc-a');
      lrSystem.textContent = 'Hover a planet';
      lrTool.textContent = "Or wait — the systems keep spinning.";
      lrBody.textContent = "Each cluster is one kind of problem I've spent years solving. The closer a planet orbits its sun, the more days I actually reach for it.";
      lrTags.innerHTML = '';
      lrMore.classList.remove('show');
      lrMore.setAttribute('aria-hidden', 'true');
      lrMoreChips.innerHTML = '';
    }
    resetReader();

    // Click-to-pin: chips update reader + pin the corresponding planet so the
    // orbital canvas visually reflects the selection too.
    lrMoreChips.addEventListener('click', e => {
      const chip = e.target.closest('.lr-chip');
      if (!chip) return;
      const sysIdx = +chip.dataset.sys;
      const toolIdx = +chip.dataset.tool;
      pinned = { sysIdx, toolIdx };
      hovered = null;
      updateReader(sysIdx, toolIdx);
    });

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouseCanvasX = e.clientX - rect.left;
      mouseCanvasY = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
      mouseCanvasX = -1000; mouseCanvasY = -1000;
      // Keep last shown reader — feels less flickery than snapping back.
    });
    canvas.addEventListener('click', () => {
      if (hovered) pinned = { ...hovered };
    });

    function draw(now) {
      ctx.clearRect(0, 0, W, H);

      // Detect hovered planet (nearest under 16px)
      let bestDist = 22, bestHit = null;

      const outerR = maxR();

      // First pass: sun + orbit rings + label. Label sits above the outermost ring.
      systems.forEach((sys, si) => {
        const { cx, cy } = systemCentre(si);
        const [cr, cg, cb] = sys.color;

        // Orbit rings — one per unique ring in the system
        const seen = new Set();
        sys.tools.forEach(t => {
          if (seen.has(t._ring)) return;
          seen.add(t._ring);
          const r = t._ring * outerR;
          ctx.beginPath();
          ctx.ellipse(cx, cy, r, r * 0.78, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.09)`;
          ctx.lineWidth = 1;
          ctx.setLineDash(t.level === 'exploring' || t.level === 'working' ? [3, 5] : []);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Sun — soft radial glow only, no bright disk (label carries the identity)
        const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
        sunGrad.addColorStop(0, `rgba(${cr},${cg},${cb},0.55)`);
        sunGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.14)`);
        sunGrad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad;
        ctx.fill();

        // Sun label — above the outermost orbit
        ctx.font = "700 11px 'Syne', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(${cr},${cg},${cb},0.9)`;
        ctx.fillText(sys.label.toUpperCase(), cx, cy - outerR * 0.78 - 14);
      });

      // Second pass: planets
      systems.forEach((sys, si) => {
        const [cr, cg, cb] = sys.color;
        sys.tools.forEach((tool, ti) => {
          const p = toolPosition(si, tool, now);
          const dx = mouseCanvasX - p.x, dy = mouseCanvasY - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < bestDist) { bestDist = dist; bestHit = { sysIdx: si, toolIdx: ti }; }

          const isHover = hovered && hovered.sysIdx === si && hovered.toolIdx === ti;
          const isPinned = pinned && pinned.sysIdx === si && pinned.toolIdx === ti && !hovered;

          // Glow halo
          const glowR = isHover ? 16 : isPinned ? 12 : 9;
          const glowA = isHover ? 0.35 : isPinned ? 0.22 : 0.12;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${glowA})`;
          ctx.fill();

          // Planet body
          const r = isHover ? tool._size + 1.6 : tool._size;
          if (tool.level === 'exploring') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.9)`;
            ctx.lineWidth = 1.4;
            ctx.setLineDash([2.5, 2.5]);
            ctx.stroke();
            ctx.setLineDash([]);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${tool.level === 'daily' ? 0.98 : 0.78})`;
            ctx.fill();
          }

          // Labels only when actually hovered/pinned — always-on labels stack
          // and become noise, especially on the tight inner "daily" ring.
          if (isHover || isPinned) {
            ctx.font = isHover ? "600 12px 'DM Sans', sans-serif" : "500 11px 'DM Sans', sans-serif";
            ctx.textAlign = 'center';
            const labelA = isHover ? 1 : 0.88;
            // Slight text shadow so labels stay legible over other planets/orbits.
            ctx.fillStyle = 'rgba(7,7,10,0.75)';
            ctx.fillText(tool.name, p.x + 0.6, p.y - r - 8 + 0.6);
            ctx.fillStyle = `rgba(240,237,232,${labelA})`;
            ctx.fillText(tool.name, p.x, p.y - r - 8);
          }
        });
      });

      // Commit hover state
      if (bestHit) {
        if (!hovered || hovered.sysIdx !== bestHit.sysIdx || hovered.toolIdx !== bestHit.toolIdx) {
          hovered = bestHit;
          updateReader(hovered.sysIdx, hovered.toolIdx);
          canvas.style.cursor = 'pointer';
        }
      } else if (hovered) {
        // Keep the last hovered card up (don't flicker back to placeholder)
        pinned = hovered;
        hovered = null;
        canvas.style.cursor = 'default';
      }

      requestAnimationFrame(draw);
    }

    // Delay initial draw start until section is scrolled near — cheap.
    let started = false;
    const startObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          requestAnimationFrame(draw);
        }
      });
    }, { threshold: 0.1 });
    startObs.observe(wrap);
  })(); } catch(e) { console.warn('Stack orbital error:', e); }

  

  // ── 10. TILT PHOTO CARDS ──
  (function () {
    if (window.innerWidth < 768) return;
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
      const img = card.querySelector('img');

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rx = (e.clientY - centerY) / rect.height * 12;
        const ry = (e.clientX - centerX) / rect.width * -12;

        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
        card.style.transition = 'transform 0.1s ease-out';

        if (img) {
          const tx = (e.clientX - centerX) / rect.width * 8;
          const ty = (e.clientY - centerY) / rect.height * 8;
          img.style.transform = `translate(${tx}px, ${ty}px) scale(1.06)`;
          img.style.transition = 'transform 0.1s ease-out';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s ease-out';
        if (img) {
          img.style.transform = '';
          img.style.transition = 'transform 0.6s ease-out';
        }
      });
    });
  })();

  // ── 11. ORRERY CANVAS ──
  try { (function () {
    const canvas = document.getElementById('orrery');
    const section = document.getElementById('cosmos');
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');

    const planets = [
      { orbit: 80, speed: 0.008, size: 4, color: '139,131,232', angle: Math.random() * Math.PI * 2 },
      { orbit: 130, speed: 0.005, size: 6, color: '31,173,128', angle: Math.random() * Math.PI * 2 },
      { orbit: 185, speed: 0.003, size: 5, color: '240,168,48', angle: Math.random() * Math.PI * 2 },
      { orbit: 240, speed: 0.002, size: 7, color: '240,237,232', angle: Math.random() * Math.PI * 2 },
      { orbit: 300, speed: 0.001, size: 4, color: '100,95,180', angle: Math.random() * Math.PI * 2 }
    ];

    let running = false;

    function resize() {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function draw() {
      const w = section.clientWidth;
      const h = section.clientHeight;
      const cx = w * 0.55;
      const cy = h * 0.45;

      ctx.clearRect(0, 0, w, h);

      planets.forEach(p => {
        ctx.beginPath();
        ctx.arc(cx, cy, p.orbit, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      [20, 32, 48].forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,168,48,${0.35 - i * 0.12})`;
        ctx.fill();
      });

      planets.forEach(p => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.orbit;
        const py = cy + Math.sin(p.angle) * p.orbit;

        ctx.beginPath();
        ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},0.12)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},0.8)`;
        ctx.fill();
      });

      if (running) requestAnimationFrame(draw);
    }

    const orreryObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          canvas.classList.add('visible');
          if (!running) { running = true; draw(); }
        } else {
          running = false;
        }
      });
    }, { threshold: 0.1 });
    orreryObs.observe(section);
  })(); } catch(e) { console.warn('Orrery error:', e); }

  // ── 12. PARALLAX SYSTEM ──
  (function () {
    if (window.innerWidth < 768) return;
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      els.forEach(el => {
        const speed = el.dataset.parallax === 'slow' ? 0.3 : 0.6;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (center - window.innerHeight / 2) * speed * -0.15;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  })();

})();
