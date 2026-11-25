/* Shared browser-safe utilities for Java Inheritance Studio (works over http:// and file://) */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'javaInheritanceStudioV2';

  const TOPICS_META = [
    { id: 'single', num: '01', name: 'Single' },
    { id: 'multilevel', num: '02', name: 'Multilevel' },
    { id: 'hierarchical', num: '03', name: 'Hierarchical' },
    { id: 'multiple', num: '04', name: 'Multiple' },
    { id: 'hybrid', num: '05', name: 'Hybrid' }
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* Single-pass Java tokenizer: never double-highlights HTML attributes */
  const JAVA_TOKEN_RE =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*")|(@[A-Za-z_][A-Za-z0-9_]*)|\b(class|interface|extends|implements|public|private|protected|void|int|double|boolean|char|new|return|super|this|final|static|abstract|if|else|for|while|import|package)\b|\b([A-Z][A-Za-z0-9_]*)\b|\b(\d+(?:\.\d+)?)\b/g;

  function highlightJava(code) {
    const src = String(code || '');
    let out = '';
    let lastIndex = 0;
    JAVA_TOKEN_RE.lastIndex = 0;

    let match;
    while ((match = JAVA_TOKEN_RE.exec(src)) !== null) {
      if (match.index > lastIndex) {
        out += escapeHtml(src.slice(lastIndex, match.index));
      }
      const [full, com, str, ann, kw, type, num] = match;
      if (com) out += '<span class="tok-com">' + escapeHtml(com) + '</span>';
      else if (str) out += '<span class="tok-str">' + escapeHtml(str) + '</span>';
      else if (ann) out += '<span class="tok-ann">' + escapeHtml(ann) + '</span>';
      else if (kw) out += '<span class="tok-kw">' + escapeHtml(kw) + '</span>';
      else if (type) out += '<span class="tok-type">' + escapeHtml(type) + '</span>';
      else if (num) out += '<span class="tok-num">' + escapeHtml(num) + '</span>';
      else out += escapeHtml(full);
      lastIndex = JAVA_TOKEN_RE.lastIndex;
    }

    if (lastIndex < src.length) {
      out += escapeHtml(src.slice(lastIndex));
    }
    return out;
  }

  function defaultState() {
    return {
      mastered: {},
      lessonChecks: {},
      bestScore: 0,
      lastAssessment: null
    };
  }

  function readState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed || {});
    } catch (_) {
      return defaultState();
    }
  }

  function writeState(next) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_) {
      /* Ignore storage quota or private mode restrictions */
    }
  }

  function updateState(mutator) {
    const current = readState();
    const updated = mutator(current) || current;
    writeState(updated);
    return updated;
  }

  function initNavigation() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.topbar nav');
    if (!toggle || !nav) return;

    function closeMenu() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== toggle) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  function initCopyButtons() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.copy-code');
      if (!btn) return;
      const block = btn.closest('.code-block') || btn.closest('.code-line');
      if (!block) return;
      let text = '';
      const pre = block.querySelector('pre');
      if (pre) {
        text = pre.textContent;
      } else {
        const clone = block.cloneNode(true);
        const insideBtn = clone.querySelector('.copy-code');
        if (insideBtn) insideBtn.remove();
        text = clone.textContent.trim();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {});
      }
      const prev = btn.textContent;
      btn.textContent = 'Copied ✓';
      setTimeout(function () {
        btn.textContent = prev;
      }, 1300);
    });
  }

  function initRevealObserver() {
    const items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    const obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach(function (el) {
      obs.observe(el);
    });
  }

  function drawSvgConnectors(canvasEl, svgEl, edges) {
    if (!canvasEl || !svgEl) return {};
    const rect = canvasEl.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    svgEl.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svgEl.setAttribute('width', String(width));
    svgEl.setAttribute('height', String(height));

    const ns = 'http://www.w3.org/2000/svg';
    while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

    const defs = document.createElementNS(ns, 'defs');
    const markers = [
      { id: 'arrow-green', color: '#0b4f3e' },
      { id: 'arrow-orange', color: '#f57c00' },
      { id: 'arrow-conflict', color: '#d9381e' }
    ];
    markers.forEach(function (m) {
      const marker = document.createElementNS(ns, 'marker');
      marker.setAttribute('id', m.id);
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '8');
      marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '6');
      marker.setAttribute('markerHeight', '6');
      marker.setAttribute('orient', 'auto-start-reverse');
      const poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', '0,1 10,5 0,9');
      poly.setAttribute('fill', m.color);
      marker.appendChild(poly);
      defs.appendChild(marker);
    });
    svgEl.appendChild(defs);

    const pathMap = {};
    edges.forEach(function (edge) {
      const fromEl = canvasEl.querySelector('[data-node-id="' + edge.from + '"]');
      const toEl = canvasEl.querySelector('[data-node-id="' + edge.to + '"]');
      if (!fromEl || !toEl) return;

      const f = fromEl.getBoundingClientRect();
      const t = toEl.getBoundingClientRect();

      const x1 = f.left - rect.left + f.width / 2;
      const y1 = f.bottom - rect.top;
      const x2 = t.left - rect.left + t.width / 2;
      const y2 = t.top - rect.top;

      let d;
      if (Math.abs(y2 - y1) < 12) {
        // Horizontal neighbor fallback
        const sx = f.right - rect.left;
        const sy = f.top - rect.top + f.height / 2;
        const ex = t.left - rect.left;
        const ey = t.top - rect.top + t.height / 2;
        d = 'M ' + sx + ' ' + sy + ' L ' + ex + ' ' + ey;
      } else {
        const midY = (y1 + y2) / 2;
        d = 'M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + midY + ', ' + x2 + ' ' + midY + ', ' + x2 + ' ' + y2;
      }

      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d);
      const cls =
        'svg-link-line' +
        (edge.kind === 'implements' ? ' is-interface' : '') +
        (edge.kind === 'conflict' ? ' is-conflict' : '');
      path.setAttribute('class', cls);
      const markerId =
        edge.kind === 'conflict'
          ? 'url(#arrow-conflict)'
          : edge.kind === 'implements'
            ? 'url(#arrow-orange)'
            : 'url(#arrow-green)';
      path.setAttribute('marker-end', markerId);
      svgEl.appendChild(path);

      if (edge.label) {
        const len = path.getTotalLength();
        const mid = path.getPointAtLength(len * 0.5);
        const labelW = edge.label.length * 6.5 + 12;

        const pillBg = document.createElementNS(ns, 'rect');
        pillBg.setAttribute('x', String(mid.x - labelW / 2));
        pillBg.setAttribute('y', String(mid.y - 9));
        pillBg.setAttribute('width', String(labelW));
        pillBg.setAttribute('height', '18');
        pillBg.setAttribute('rx', '9');
        pillBg.setAttribute('fill', '#f6ebd3');
        pillBg.setAttribute('stroke', edge.kind === 'implements' ? '#f57c00' : '#c9d9cf');
        pillBg.setAttribute('stroke-width', '1');
        svgEl.appendChild(pillBg);

        const text = document.createElementNS(ns, 'text');
        text.setAttribute('x', String(mid.x));
        text.setAttribute('y', String(mid.y + 3.5));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'svg-link-label' + (edge.kind === 'implements' ? ' is-interface' : ''));
        text.textContent = edge.label;
        svgEl.appendChild(text);
      }

      pathMap[edge.from + '->' + edge.to] = path;
    });

    return pathMap;
  }

  function animateOrbAlongPath(svgEl, pathEl, reverse, durationMs, done) {
    if (!svgEl || !pathEl) {
      if (done) done();
      return;
    }
    const ns = 'http://www.w3.org/2000/svg';
    const orb = document.createElementNS(ns, 'circle');
    orb.setAttribute('r', '6');
    orb.setAttribute('class', 'svg-pulse-orb');
    svgEl.appendChild(orb);

    const total = pathEl.getTotalLength();
    const start = performance.now();

    function frame(now) {
      const progress = Math.min(1, (now - start) / durationMs);
      const dist = reverse ? total * (1 - progress) : total * progress;
      const pt = pathEl.getPointAtLength(dist);
      orb.setAttribute('cx', String(pt.x));
      orb.setAttribute('cy', String(pt.y));
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        orb.remove();
        if (done) done();
      }
    }
    requestAnimationFrame(frame);
  }

  function initAmbientBackground() {
    if (document.querySelector('.bg-ambient') || !document.body) return;
    const layer = document.createElement('div');
    layer.className = 'bg-ambient';
    layer.setAttribute('aria-hidden', 'true');

    const tokens = [
      { text: 'extends', top: '14%', left: '3%', delay: '0s', amber: true },
      { text: 'implements', top: '26%', right: '3%', delay: '-2.5s', amber: false },
      { text: 'super()', top: '52%', left: '2%', delay: '-5s', amber: false, hideMobile: true },
      { text: '@Override', top: '68%', right: '2.5%', delay: '-3.5s', amber: true, hideMobile: true },
      { text: 'IS-A →', top: '82%', left: '4%', delay: '-7s', amber: true },
      { text: '{ class }', top: '86%', right: '4%', delay: '-1.5s', amber: false }
    ];

    const tokensHtml = tokens
      .map(function (t) {
        const pos =
          'top:' +
          t.top +
          ';' +
          (t.left ? 'left:' + t.left + ';' : 'right:' + t.right + ';') +
          'animation-delay:' +
          t.delay +
          ';';
        return (
          '<span class="bg-float-token' +
          (t.amber ? ' is-amber' : '') +
          (t.hideMobile ? ' hide-mobile' : '') +
          '" style="' +
          pos +
          '">' +
          escapeHtml(t.text) +
          '</span>'
        );
      })
      .join('');

    layer.innerHTML =
      '<div class="bg-grid-drift"></div>' +
      '<div class="bg-orb bg-orb-1"></div>' +
      '<div class="bg-orb bg-orb-2"></div>' +
      '<div class="bg-orb bg-orb-3"></div>' +
      '<svg class="bg-svg-traces" viewBox="0 0 1440 900" preserveAspectRatio="none">' +
      '<path class="bg-trace-path" d="M -40 160 C 260 60, 420 320, 740 210 S 1220 90, 1480 220" />' +
      '<path class="bg-trace-path is-orange" d="M -40 690 C 280 570, 520 790, 860 660 S 1260 540, 1480 710" />' +
      '<path class="bg-trace-path" d="M 110 -20 C 160 260, 40 520, 130 920" />' +
      '<path class="bg-trace-path is-orange" d="M 1330 -20 C 1270 300, 1400 580, 1310 920" />' +
      '</svg>' +
      tokensHtml;

    document.body.insertBefore(layer, document.body.firstChild);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAmbientBackground();
    initNavigation();
    initCopyButtons();
    initRevealObserver();
  });

  global.JavaStudio = {
    TOPICS_META: TOPICS_META,
    escapeHtml: escapeHtml,
    highlightJava: highlightJava,
    readState: readState,
    writeState: writeState,
    updateState: updateState,
    drawSvgConnectors: drawSvgConnectors,
    animateOrbAlongPath: animateOrbAlongPath
  };
})(window);
