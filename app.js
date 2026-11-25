/* Interactive home page visualizations for index.html */
(function (global) {
  'use strict';

  const JS = global.JavaStudio;

  const HERO_PATTERNS = {
    single: {
      call: 'car.move()',
      traceDefault: 'Vehicle passes move() down to Car.',
      traceRunning: 'car.move() → checks Car → found in Parent Vehicle!',
      edges: [{ from: 'vehicle', to: 'car', label: 'extends', kind: 'extends' }],
      animPath: 'vehicle->car',
      rows: [
        [
          {
            id: 'vehicle',
            role: 'PARENT CLASS',
            name: 'Vehicle',
            type: 'is-parent',
            methods: [
              { label: 'move()', target: true },
              { label: 'fuelType', target: false }
            ]
          }
        ],
        [
          {
            id: 'car',
            role: 'CHILD (extends Vehicle)',
            name: 'Car',
            type: 'is-child',
            methods: [
              { label: 'openTrunk()', target: false },
              { label: 'move() ↳', inherited: true, target: true }
            ]
          }
        ]
      ]
    },
    multilevel: {
      call: 'ev.move()',
      traceDefault: 'ElectricCar inherits across Car → Vehicle.',
      traceRunning: 'ev.move() → ElectricCar → Car → found in Vehicle!',
      edges: [
        { from: 'vehicle', to: 'car', label: 'extends', kind: 'extends' },
        { from: 'car', to: 'ev', label: 'extends', kind: 'extends' }
      ],
      animPath: 'car->ev',
      rows: [
        [
          {
            id: 'vehicle',
            role: 'GRANDPARENT',
            name: 'Vehicle',
            type: 'is-parent',
            methods: [{ label: 'move()', target: true }]
          }
        ],
        [
          {
            id: 'car',
            role: 'PARENT (extends Vehicle)',
            name: 'Car',
            type: 'is-child',
            methods: [{ label: 'honk()', target: false }]
          }
        ],
        [
          {
            id: 'ev',
            role: 'CHILD (extends Car)',
            name: 'ElectricCar',
            type: 'is-child',
            methods: [
              { label: 'charge()', target: false },
              { label: 'move() ↳', inherited: true, target: true }
            ]
          }
        ]
      ]
    },
    hierarchical: {
      call: 'bike.move()',
      traceDefault: 'Car and Bike both reuse Vehicle.move().',
      traceRunning: 'bike.move() → Bike → found in shared Parent Vehicle!',
      edges: [
        { from: 'vehicle', to: 'car', label: 'extends', kind: 'extends' },
        { from: 'vehicle', to: 'bike', label: 'extends', kind: 'extends' }
      ],
      animPath: 'vehicle->bike',
      rows: [
        [
          {
            id: 'vehicle',
            role: 'SHARED PARENT',
            name: 'Vehicle',
            type: 'is-parent',
            methods: [{ label: 'move()', target: true }]
          }
        ],
        [
          {
            id: 'car',
            role: 'CHILD 1',
            name: 'Car',
            type: 'is-child',
            methods: [{ label: 'openTrunk()', target: false }]
          },
          {
            id: 'bike',
            role: 'CHILD 2',
            name: 'Bike',
            type: 'is-child',
            methods: [
              { label: 'kickStart()', target: false },
              { label: 'move() ↳', inherited: true, target: true }
            ]
          }
        ]
      ]
    },
    multiple: {
      call: 'duck.fly()',
      traceDefault: 'Java uses interfaces for multiple capabilities.',
      traceRunning: 'duck.fly() → implements Flyable & Swimmable cleanly!',
      edges: [
        { from: 'flyable', to: 'duck', label: 'implements', kind: 'implements' },
        { from: 'swimmable', to: 'duck', label: 'implements', kind: 'implements' }
      ],
      animPath: 'flyable->duck',
      rows: [
        [
          {
            id: 'flyable',
            role: 'INTERFACE',
            name: 'Flyable',
            type: 'is-interface',
            methods: [{ label: 'fly()', target: true }]
          },
          {
            id: 'swimmable',
            role: 'INTERFACE',
            name: 'Swimmable',
            type: 'is-interface',
            methods: [{ label: 'swim()', target: false }]
          }
        ],
        [
          {
            id: 'duck',
            role: 'CLASS (implements both)',
            name: 'Duck',
            type: 'is-child',
            methods: [
              { label: 'fly()', target: true },
              { label: 'swim()', target: false }
            ]
          }
        ]
      ]
    }
  };

  const WALKTHROUGH_CODE = [
    'class Animal {',
    '    void eat() {',
    '        System.out.println("Animal is eating");',
    '    }',
    '}',
    '',
    'class Dog extends Animal {',
    '    void bark() {',
    '        System.out.println("Dog is barking");',
    '    }',
    '}',
    '',
    'class Main {',
    '    public static void main(String[] args) {',
    '        Dog pet = new Dog();',
    '        pet.eat();   // inherited from Animal',
    '        pet.bark();  // defined inside Dog',
    '    }',
    '}'
  ];

  const WALKTHROUGH_STEPS = [
    { lines: [0, 1, 2, 3, 4], output: 'Animal class defines eat() — ready to be shared.' },
    { lines: [6, 7, 8, 9, 10], output: 'Dog extends Animal → Dog inherits eat() and adds bark().' },
    { lines: [14, 15, 16], output: 'Animal is eating\nDog is barking' }
  ];

  function initHomeStats() {
    const state = JS.readState();
    const masteredCount = JS.TOPICS_META.filter(function (t) {
      return Boolean(state.mastered && state.mastered[t.id]);
    }).length;
    const masteredEl = document.getElementById('home-mastered-count');
    if (masteredEl) masteredEl.textContent = masteredCount + '/5';

    const bestEl = document.getElementById('home-best-score');
    if (bestEl) {
      bestEl.textContent = state.bestScore ? state.bestScore + '/12' : '—';
    }

    document.querySelectorAll('[data-topic-card]').forEach(function (card) {
      const id = card.getAttribute('data-topic-card');
      if (state.mastered && state.mastered[id]) {
        card.classList.add('mastered');
      }
    });
  }

  function initHeroVisual() {
    const stage = document.getElementById('hero-sim-stage');
    if (!stage) return;

    const box = document.getElementById('hero-diagram-box');
    const svg = document.getElementById('hero-sim-svg');
    const tabs = document.querySelectorAll('[data-hero-pattern]');
    const animateBtn = document.getElementById('hero-animate-btn');
    const traceText = document.getElementById('hero-trace-text');
    const traceCall = document.getElementById('hero-trace-call');

    let current = 'single';
    let animTimer = null;
    let heroPaths = {};

    function renderPattern(key) {
      current = key;
      const spec = HERO_PATTERNS[key] || HERO_PATTERNS.single;

      tabs.forEach(function (t) {
        t.classList.toggle('active', t.getAttribute('data-hero-pattern') === key);
      });

      traceText.textContent = spec.traceDefault;
      traceCall.textContent = spec.call;

      stage.innerHTML = spec.rows
        .map(function (row) {
          return (
            '<div class="sim-row">' +
            row
              .map(function (node) {
                const pills = node.methods
                  .map(function (m) {
                    return (
                      '<span class="sim-method-pill' +
                      (m.inherited ? ' inherited' : '') +
                      '" data-target="' +
                      (m.target ? '1' : '0') +
                      '">' +
                      JS.escapeHtml(m.label) +
                      '</span>'
                    );
                  })
                  .join('');
                return (
                  '<div class="sim-node ' +
                  node.type +
                  '" data-node-id="' +
                  node.id +
                  '" data-hero-node="' +
                  node.id +
                  '">' +
                  '<span class="sim-node-badge">ACTIVE</span>' +
                  '<span class="sim-node-role">' +
                  JS.escapeHtml(node.role) +
                  '</span>' +
                  '<strong class="sim-node-name">' +
                  JS.escapeHtml(node.name) +
                  '</strong>' +
                  '<div class="sim-methods">' +
                  pills +
                  '</div></div>'
                );
              })
              .join('') +
            '</div>'
          );
        })
        .join('');

      requestAnimationFrame(function () {
        heroPaths = JS.drawSvgConnectors(box, svg, spec.edges || []);
      });
    }

    function runHeroAnimation() {
      if (animTimer) {
        clearTimeout(animTimer);
        animTimer = null;
      }
      const spec = HERO_PATTERNS[current];
      const nodes = Array.prototype.slice.call(stage.querySelectorAll('[data-hero-node]'));
      nodes.forEach(function (n) {
        n.classList.remove('state-origin', 'state-visited', 'state-found');
        n.querySelectorAll('.sim-method-pill').forEach(function (p) {
          p.classList.remove('active-method');
        });
      });

      traceText.textContent = spec.traceRunning;

      if (spec.animPath && heroPaths[spec.animPath]) {
        heroPaths[spec.animPath].classList.add('is-lit');
        JS.animateOrbAlongPath(svg, heroPaths[spec.animPath], true, 650);
      }

      // Animate reverse order from child up to parent (method lookup!)
      const ordered = nodes.slice().reverse();
      ordered.forEach(function (node, idx) {
        setTimeout(function () {
          const isLast = idx === ordered.length - 1;
          node.classList.add(idx === 0 ? 'state-origin' : isLast ? 'state-found' : 'state-visited');
          const badge = node.querySelector('.sim-node-badge');
          if (badge) {
            badge.textContent = idx === 0 ? 'CALL' : isLast ? 'FOUND ✓' : 'CHECK ↑';
          }
          node.querySelectorAll('[data-target="1"]').forEach(function (p) {
            p.classList.add('active-method');
          });
        }, idx * 420);
      });

      animTimer = setTimeout(function () {
        renderPattern(current);
      }, ordered.length * 420 + 1800);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        if (animTimer) clearTimeout(animTimer);
        renderPattern(tab.getAttribute('data-hero-pattern'));
      });
    });

    if (animateBtn) {
      animateBtn.addEventListener('click', runHeroAnimation);
    }

    window.addEventListener('resize', function () {
      const spec = HERO_PATTERNS[current];
      if (spec) heroPaths = JS.drawSvgConnectors(box, svg, spec.edges || []);
    });

    renderPattern('single');
  }

  function initWalkthrough() {
    const container = document.getElementById('spotlight-code');
    if (!container) return;

    const outputPre = document.getElementById('spotlight-output');
    const stepButtons = document.querySelectorAll('[data-step]');

    function renderStep(stepIndex) {
      const step = WALKTHROUGH_STEPS[stepIndex] || WALKTHROUGH_STEPS[0];
      stepButtons.forEach(function (btn) {
        btn.classList.toggle('active', Number(btn.getAttribute('data-step')) === stepIndex);
      });

      container.innerHTML = WALKTHROUGH_CODE.map(function (line, idx) {
        const isLit = step.lines.indexOf(idx) !== -1;
        return (
          '<div class="code-line-row ' +
          (isLit ? 'lit' : 'dim') +
          '"><span class="ln">' +
          (idx + 1) +
          '</span><span>' +
          (line ? JS.highlightJava(line) : '&nbsp;') +
          '</span></div>'
        );
      }).join('');

      if (outputPre) {
        outputPre.textContent = step.output;
      }
    }

    stepButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        renderStep(Number(btn.getAttribute('data-step')));
      });
    });

    renderStep(0);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHomeStats();
    initHeroVisual();
    initWalkthrough();
  });
})(window);
