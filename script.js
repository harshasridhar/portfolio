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

  document.querySelectorAll('a,button,.tc,.wc,.pill,.cr,.mem-card,.pill-dot').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });

  // ── 3. SCROLL REVEAL OBSERVER (must run first to ensure content is visible) ──
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('go');
      e.target.querySelectorAll('.pill').forEach((p, i) =>
        setTimeout(() => p.classList.add('go'), i * 55)
      );
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

  // ── GA4 SCROLL DEPTH PER CHAPTER ──
  if (typeof gtag === 'function') {
    const chapterNames = { hero: 'Hero', origin: 'Ch1 Origin', career: 'Ch2 Career', stack: 'Ch3 Stack', places: 'Ch4 Places', cosmos: 'Ch5 Cosmos', contact: 'Ch6 Contact' };
    const seen = new Set();
    const depthObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        if (seen.has(id)) return;
        seen.add(id);
        gtag('event', 'scroll_depth', { event_category: 'engagement', event_label: chapterNames[id] || id, value: seen.size });
      });
    }, { threshold: 0.3 });
    sectionIds.forEach(id => { const el = document.getElementById(id); if (el) depthObs.observe(el); });

    // ── GA4 CONTACT CLICKS ──
    const emlLink = document.getElementById('eml');
    if (emlLink) emlLink.addEventListener('click', () => {
      gtag('event', 'contact_click', { event_category: 'conversion', event_label: 'email' });
    });
    document.querySelectorAll('.clink[href*="linkedin"]').forEach(el => {
      el.addEventListener('click', () => {
        gtag('event', 'contact_click', { event_category: 'conversion', event_label: 'linkedin' });
      });
    });

    // ── GA4 ARTICLE CLICKS ──
    document.querySelectorAll('.wc[href]').forEach(el => {
      el.addEventListener('click', () => {
        const title = el.querySelector('.wtit');
        gtag('event', 'article_click', { event_category: 'engagement', event_label: title ? title.textContent.slice(0, 80) : el.href });
      });
    });

    // ── GA4 OUTBOUND LINK CLICKS ──
    document.querySelectorAll('a[target="_blank"]').forEach(el => {
      el.addEventListener('click', () => {
        gtag('event', 'outbound_click', { event_category: 'engagement', event_label: el.href });
      });
    });

    // ── GA4 TIME ENGAGED MILESTONES ──
    [30, 60, 90, 180].forEach(sec => {
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          gtag('event', 'time_on_page', { event_category: 'engagement', event_label: sec + 's', value: sec });
        }
      }, sec * 1000);
    });
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

  // ── 8. SKILL CONSTELLATION ──
  try { (function () {
    const wrap = document.getElementById('constellationWrap');
    const canvas = document.getElementById('constellation');
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');

    const nodes = [
      
      { name: 'Java',             x: 0.10, y: 0.30, cluster: 0, level: 'daily' },
      { name: 'Python',           x: 0.16, y: 0.55, cluster: 0, level: 'daily' },
      { name: 'Spring Boot',      x: 0.22, y: 0.25, cluster: 0, level: 'fluent' },
      { name: 'Spring Reactive',  x: 0.26, y: 0.48, cluster: 0, level: 'fluent' },
      { name: 'Hibernate',        x: 0.13, y: 0.42, cluster: 0, level: 'fluent' },
      { name: 'Microservices',    x: 0.20, y: 0.65, cluster: 0, level: 'fluent' },
      { name: 'REST APIs',        x: 0.28, y: 0.38, cluster: 0, level: 'daily' },
      { name: 'React',            x: 0.08, y: 0.62, cluster: 0, level: 'working' },
      
      { name: 'Kafka',            x: 0.48, y: 0.28, cluster: 1, level: 'fluent' },
      { name: 'Flink',            x: 0.56, y: 0.22, cluster: 1, level: 'fluent' },
      { name: 'SQL',              x: 0.50, y: 0.50, cluster: 1, level: 'daily' },
      { name: 'Docker',           x: 0.58, y: 0.42, cluster: 1, level: 'daily' },
      { name: 'Kubernetes',       x: 0.64, y: 0.32, cluster: 1, level: 'working' },
      { name: 'Pulsar',           x: 0.53, y: 0.60, cluster: 1, level: 'certified' },
      { name: 'Git',              x: 0.46, y: 0.65, cluster: 1, level: 'daily' },
      
      { name: 'ML',               x: 0.76, y: 0.50, cluster: 2, level: 'fluent' },
      { name: 'NLP',              x: 0.82, y: 0.42, cluster: 2, level: 'fluent' },
      { name: 'Gen AI',           x: 0.88, y: 0.58, cluster: 2, level: 'exploring' },
      { name: 'Agentic Systems',  x: 0.80, y: 0.70, cluster: 2, level: 'exploring' },
      { name: 'Data Science',     x: 0.73, y: 0.64, cluster: 2, level: 'fluent' },
    ];

    const edges = [
      [0,2],[0,4],[0,1],[2,3],[2,5],[5,6],[6,7],[1,7],
      [8,9],[8,13],[10,9],[11,12],[10,13],[13,14],
      [15,16],[15,19],[16,17],[17,18],[18,19],
      [1,15],[1,19],[9,10]
    ];

    const clusterColors = [
      { r: 139, g: 131, b: 232 }, // purple
      { r: 31, g: 173, b: 128 },  // teal
      { r: 240, g: 168, b: 48 }   // amber
    ];

    let W, H, dpr;
    let hoveredNode = -1;
    let mouseCanvasX = -1000, mouseCanvasY = -1000;
    let frame = 0;
    let revealed = false;
    let revealProgress = [];

    function resize() {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    
    nodes.forEach(() => revealProgress.push(0));

    
    const driftPhase = nodes.map(() => Math.random() * Math.PI * 2);
    const driftAmp = nodes.map(() => 4 + Math.random() * 2);
    const driftPeriod = nodes.map(() => 3000 + Math.random() * 3000);

    
    const mouseOff = nodes.map(() => ({ x: 0, y: 0 }));

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouseCanvasX = e.clientX - rect.left;
      mouseCanvasY = e.clientY - rect.top;

      
      hoveredNode = -1;
      for (let i = 0; i < nodes.length; i++) {
        const nx = nodes[i].x * W + mouseOff[i].x;
        const ny = nodes[i].y * H + mouseOff[i].y;
        const drift = getDrift(i);
        const dx = mouseCanvasX - (nx + drift.x);
        const dy = mouseCanvasY - (ny + drift.y);
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
          hoveredNode = i;
          break;
        }
      }
      canvas.style.cursor = hoveredNode >= 0 ? 'none' : 'default';
    });

    canvas.addEventListener('mouseleave', () => {
      mouseCanvasX = -1000;
      mouseCanvasY = -1000;
      hoveredNode = -1;
    });

    function getDrift(i) {
      const t = performance.now();
      return {
        x: Math.sin(t / driftPeriod[i] + driftPhase[i]) * driftAmp[i],
        y: Math.cos(t / driftPeriod[i] + driftPhase[i] * 1.3) * driftAmp[i] * 0.7
      };
    }

    function getNodePos(i) {
      const drift = getDrift(i);
      let nx = nodes[i].x * W + drift.x + mouseOff[i].x;
      let ny = nodes[i].y * H + drift.y + mouseOff[i].y;
      return { x: nx, y: ny };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      frame++;

      
      for (let i = 0; i < nodes.length; i++) {
        if (revealProgress[i] < 1) continue;
        const pos = getNodePos(i);
        const dx = mouseCanvasX - pos.x;
        const dy = mouseCanvasY - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          mouseOff[i].x += dx * 0.04;
          mouseOff[i].y += dy * 0.04;
          const mag = Math.sqrt(mouseOff[i].x ** 2 + mouseOff[i].y ** 2);
          if (mag > 20) {
            mouseOff[i].x *= 20 / mag;
            mouseOff[i].y *= 20 / mag;
          }
        } else {
          mouseOff[i].x *= 0.94;
          mouseOff[i].y *= 0.94;
        }
      }

      
      edges.forEach(([a, b]) => {
        if (revealProgress[a] < 0.5 || revealProgress[b] < 0.5) return;
        const pa = getNodePos(a);
        const pb = getNodePos(b);
        const c = clusterColors[nodes[a].cluster];
        const bright = (hoveredNode === a || hoveredNode === b) ? 0.4 : 0.12;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${bright})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      
      for (let i = 0; i < nodes.length; i++) {
        const alpha = revealProgress[i];
        if (alpha <= 0) continue;
        const pos = getNodePos(i);
        const c = clusterColors[nodes[i].cluster];
        const isHovered = hoveredNode === i;
        const r = isHovered ? 6 : 4;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${(isHovered ? 0.25 : 0.08) * alpha})`;
        ctx.fill();

        if (nodes[i].level === 'exploring') {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.7 * alpha})`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.85 * alpha})`;
          ctx.fill();
        }

        ctx.font = (isHovered ? "bold 12px" : "11px") + " 'DM Sans', sans-serif";
        ctx.textAlign = 'center';
        const labelAlpha = isHovered ? alpha : alpha * 0.7;
        ctx.fillStyle = `rgba(240,237,232,${labelAlpha})`;
        ctx.fillText(nodes[i].name, pos.x, pos.y - 18);
      }

      requestAnimationFrame(draw);
    }

    const constObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !revealed) {
          revealed = true;
          nodes.forEach((_, i) => {
            setTimeout(() => {
              const start = performance.now();
              (function fade() {
                const elapsed = performance.now() - start;
                revealProgress[i] = Math.min(1, elapsed / 500);
                if (revealProgress[i] < 1) requestAnimationFrame(fade);
              })();
            }, i * 50);
          });
        }
      });
    }, { threshold: 0.2 });
    constObs.observe(wrap);

    draw();
  })(); } catch(e) { console.warn('Constellation error:', e); }

  

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
