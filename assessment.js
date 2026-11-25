/* Final 12-Question Java Inheritance Assessment & Review Analytics for assessment.html */
(function (global) {
  'use strict';

  const JS = global.JavaStudio;

  const QUESTIONS = [
    {
      topic: 'Single',
      learnId: 'single',
      q: 'What does the extends keyword establish in Java?',
      options: [
        'A HAS-A composition link',
        'An IS-A inheritance relationship from one child class to one parent class',
        'A package import statement',
        'Multiple inheritance between two superclasses'
      ],
      answer: 1,
      why: 'In Java, class Dog extends Animal establishes an IS-A single inheritance relationship.'
    },
    {
      topic: 'Single',
      learnId: 'single',
      q: 'Which statement is true for the following Single Inheritance code?',
      code: 'class Animal { void eat() {} }\nclass Cat extends Animal { void meow() {} }',
      options: [
        'A Cat object can call eat(), while an Animal object cannot call meow()',
        'An Animal object can call meow()',
        'Cat cannot define its own methods',
        'Cat extends Object and Animal directly at syntax level'
      ],
      answer: 0,
      why: 'Inheritance flows downward from Parent to Child; Animal does not inherit Cat-only methods.'
    },
    {
      topic: 'Multilevel',
      learnId: 'multilevel',
      q: 'What is the output of this Multilevel Inheritance program?',
      code:
        'class A { void show() { System.out.print("A"); } }\n' +
        'class B extends A { void show() { super.show(); System.out.print("B"); } }\n' +
        'class C extends B { }\n' +
        '// In main: new C().show();',
      options: ['A only', 'B only', 'AB', 'Compile error'],
      answer: 2,
      why: 'C inherits B.show(), which calls super.show() (printing "A") and then prints "B".'
    },
    {
      topic: 'Multilevel',
      learnId: 'multilevel',
      q: 'In class Puppy extends Dog and class Dog extends Animal, in what order do constructors execute for new Puppy()?',
      options: [
        'Puppy() → Dog() → Animal()',
        'Animal() → Dog() → Puppy()',
        'Dog() → Animal() → Puppy()',
        'Only Puppy() runs'
      ],
      answer: 1,
      why: 'Implicit super() chaining executes constructors top-down from the highest ancestor.'
    },
    {
      topic: 'Hierarchical',
      learnId: 'hierarchical',
      q: 'Which code snippet demonstrates Hierarchical Inheritance?',
      options: [
        'class Circle extends Shape {} and class Square extends Shape {}',
        'class B extends A {} and class C extends B {}',
        'class SmartPhone implements Camera, Music {}',
        'class Shape extends Circle, Square {}'
      ],
      answer: 0,
      why: 'Multiple child classes inheriting from the exact same parent class form a hierarchy.'
    },
    {
      topic: 'Hierarchical',
      learnId: 'hierarchical',
      q: 'Given Car extends Vehicle and Bike extends Vehicle, what happens on new Car().kickStart() if kickStart() is only in Bike?',
      code: 'class Vehicle { void move() {} }\nclass Car extends Vehicle {}\nclass Bike extends Vehicle { void kickStart() {} }',
      options: [
        'Calls Vehicle.move() instead',
        'Runs kickStart() via sibling sharing',
        'Compile-time error: cannot find symbol kickStart()',
        'Prints null'
      ],
      answer: 2,
      why: 'Sibling subclasses do not share methods with one another.'
    },
    {
      topic: 'Multiple',
      learnId: 'multiple',
      q: 'Why does Java prohibit class C extends A, B?',
      options: [
        'Java does not support the Diamond Problem / ambiguous method resolution between two superclasses',
        'Classes cannot contain methods',
        'Java only allows interfaces to extend classes',
        'To prevent loops inside main()'
      ],
      answer: 0,
      why: 'If both A and B define the same method, extending both creates ambiguity (the Diamond Problem).'
    },
    {
      topic: 'Multiple',
      learnId: 'multiple',
      q: 'How does Java legally support multiple inheritance of type/behavior?',
      options: [
        'class Robot extends Walker, Talker',
        'class Robot implements Walker, Talker',
        'class Robot super Walker, Talker',
        'interface Robot implements Walker, Talker'
      ],
      answer: 1,
      why: 'A single Java class can implement multiple interfaces separated by commas.'
    },
    {
      topic: 'Hybrid',
      learnId: 'hybrid',
      q: 'Choose the valid Java syntax combining a superclass and an interface:',
      options: [
        'class EV implements Chargeable extends Car',
        'class EV extends Car implements Chargeable',
        'class EV extends Car, Chargeable',
        'class EV implements Car, Chargeable'
      ],
      answer: 1,
      why: 'Java syntax always requires extends SuperClass before implements InterfaceList.'
    },
    {
      topic: 'Hybrid',
      learnId: 'hybrid',
      q: 'When ElectricCar extends Car implements Chargeable is instantiated, how many constructors run if Car extends Vehicle?',
      options: [
        'Four (including Chargeable)',
        'Three (Vehicle, Car, ElectricCar — interfaces have no constructors)',
        'One (ElectricCar only)',
        'Zero'
      ],
      answer: 1,
      why: 'Interfaces cannot declare constructors; only the class chain (Vehicle → Car → ElectricCar) runs constructors.'
    },
    {
      topic: 'Core Rules',
      learnId: 'single',
      q: 'Which member of a superclass is NOT directly accessible by name inside its subclass?',
      options: ['public method', 'protected field', 'private field', 'default (package-private) field in the same package'],
      answer: 2,
      why: 'private members are encapsulated inside the declaring class and cannot be accessed directly by subclasses.'
    },
    {
      topic: 'Core Rules',
      learnId: 'single',
      q: 'What effect does marking a class with the final keyword have in Java?',
      code: 'final class SecurityCore { }',
      options: [
        'It makes all methods run twice as fast',
        'No other class can extend SecurityCore (inheritance is blocked)',
        'Only one subclass can extend it',
        'It converts the class into an interface'
      ],
      answer: 1,
      why: 'Declaring a class final prevents any class from inheriting from it (for example, java.lang.String).'
    }
  ];

  let mode = 'guided'; // 'guided' | 'exam'
  let index = 0;
  let answers = Array(QUESTIONS.length).fill(null);
  let timerId = null;
  let secondsLeft = 600;

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    secondsLeft = 600;
    const timerEl = document.getElementById('exam-timer');
    timerEl.classList.remove('hidden');
    timerEl.textContent = formatTime(secondsLeft);

    timerId = setInterval(function () {
      secondsLeft--;
      timerEl.textContent = formatTime(Math.max(0, secondsLeft));
      if (secondsLeft <= 0) {
        stopTimer();
        finishAssessment(true);
      }
    }, 1000);
  }

  function renderDots() {
    const dotsEl = document.getElementById('assessment-dots');
    dotsEl.innerHTML = QUESTIONS.map(function (_, i) {
      return (
        '<button type="button" class="' +
        (i === index ? 'active' : '') +
        (answers[i] !== null ? ' answered' : '') +
        '" aria-label="Question ' +
        (i + 1) +
        '" data-qdot="' +
        i +
        '">' +
        (i + 1) +
        '</button>'
      );
    }).join('');

    dotsEl.querySelectorAll('[data-qdot]').forEach(function (b) {
      b.addEventListener('click', function () {
        showQuestion(Number(b.getAttribute('data-qdot')));
      });
    });
  }

  function updateFeedbackBox() {
    const item = QUESTIONS[index];
    const fb = document.getElementById('assess-feedback');
    const area = document.getElementById('assess-answers');

    area.querySelectorAll('.answer-option').forEach(function (btn, j) {
      btn.classList.toggle('selected', answers[index] === j);
      if (mode === 'guided' && answers[index] !== null) {
        btn.classList.toggle('correct', j === item.answer);
        btn.classList.toggle('wrong', answers[index] === j && j !== item.answer);
      } else {
        btn.classList.remove('correct', 'wrong');
      }
    });

    if (answers[index] === null) {
      fb.textContent = '';
      fb.className = 'feedback';
    } else if (mode === 'exam') {
      fb.textContent = 'Answer recorded. Feedback will appear when you submit the exam.';
      fb.className = 'feedback';
    } else {
      const ok = answers[index] === item.answer;
      fb.textContent = (ok ? '✓ Correct! ' : '✕ Not quite. ') + item.why;
      fb.className = 'feedback ' + (ok ? 'good' : 'bad');
    }
  }

  function showQuestion(i) {
    index = i;
    const item = QUESTIONS[i];
    document.getElementById('assess-topic').textContent = item.topic.toUpperCase() + ' INHERITANCE';
    document.getElementById('assess-number').textContent =
      'QUESTION ' + String(i + 1).padStart(2, '0') + ' / ' + QUESTIONS.length;
    document.getElementById('assess-progress').style.width = ((i + 1) / QUESTIONS.length) * 100 + '%';
    document.getElementById('assess-question').textContent = item.q;

    const codeWrap = document.getElementById('assess-code-wrap');
    const codeEl = document.getElementById('assess-code');
    if (item.code) {
      codeWrap.classList.remove('hidden');
      codeEl.innerHTML = JS.highlightJava(item.code);
    } else {
      codeWrap.classList.add('hidden');
      codeEl.innerHTML = '';
    }

    const area = document.getElementById('assess-answers');
    area.innerHTML = item.options
      .map(function (opt, j) {
        return (
          '<button type="button" class="answer-option" data-opt="' +
          j +
          '"><span class="letter">' +
          String.fromCharCode(65 + j) +
          '</span><span>' +
          JS.escapeHtml(opt) +
          '</span></button>'
        );
      })
      .join('');

    area.querySelectorAll('[data-opt]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        answers[index] = Number(btn.getAttribute('data-opt'));
        renderDots();
        updateFeedbackBox();
      });
    });

    document.getElementById('assess-prev').disabled = i === 0;
    document.getElementById('assess-next').textContent =
      i === QUESTIONS.length - 1 ? 'Submit assessment ✓' : 'Next question →';

    renderDots();
    updateFeedbackBox();
  }

  function finishAssessment(timedOut) {
    stopTimer();
    const score = answers.reduce(function (sum, ans, i) {
      return sum + (ans === QUESTIONS[i].answer ? 1 : 0);
    }, 0);

    const updated = JS.updateState(function (s) {
      s.bestScore = Math.max(s.bestScore || 0, score);
      s.lastAssessment = { score: score, total: QUESTIONS.length, mode: mode, at: new Date().toISOString() };
      return s;
    });

    document.getElementById('best-score').textContent = String(updated.bestScore || score);
    document.getElementById('assessment-shell').classList.add('hidden');
    document.getElementById('results-panel').classList.remove('hidden');

    document.getElementById('final-mark').textContent = score + ' / ' + QUESTIONS.length;
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const prefix = timedOut ? 'Time expired! ' : '';
    document.getElementById('result-message').textContent =
      prefix +
      (pct >= 85
        ? 'Outstanding (' + pct + '%)! You are exam-ready on Java Inheritance.'
        : pct >= 65
          ? 'Solid progress (' + pct + '%). Revisit any Review topic below to lock in 100%.'
          : 'Keep building (' + pct + '%). Use the interactive visual simulator on weaker topics and retry!');

    const topics = [
      { label: 'Single', learnId: 'single' },
      { label: 'Multilevel', learnId: 'multilevel' },
      { label: 'Hierarchical', learnId: 'hierarchical' },
      { label: 'Multiple', learnId: 'multiple' },
      { label: 'Hybrid', learnId: 'hybrid' },
      { label: 'Core Rules', learnId: 'single' }
    ];

    document.getElementById('topic-analysis').innerHTML = topics
      .map(function (t) {
        const ids = QUESTIONS.map(function (q, idx) {
          return q.topic === t.label ? idx : -1;
        }).filter(function (idx) {
          return idx >= 0;
        });
        const got = ids.filter(function (idx) {
          return answers[idx] === QUESTIONS[idx].answer;
        }).length;
        const w = ids.length ? (got / ids.length) * 100 : 0;
        const statusHtml =
          got === ids.length
            ? '<span class="ok-tag">Mastered ✓</span>'
            : '<a href="learn.html?topic=' + t.learnId + '">Review →</a>';

        return (
          '<div class="analysis-row">' +
          '<span>' +
          t.label +
          '</span>' +
          '<div class="analysis-track"><i style="width:' +
          w +
          '%"></i></div>' +
          '<b>' +
          got +
          '/' +
          ids.length +
          '</b>' +
          statusHtml +
          '</div>'
        );
      })
      .join('');

    document.getElementById('review-list').innerHTML =
      '<h3 style="font-family:Manrope,sans-serif; color:var(--green); margin:0 0 6px;">Full Answer Review</h3>' +
      QUESTIONS.map(function (q, i) {
        const picked = answers[i];
        const ok = picked === q.answer;
        const pickedText = picked === null ? 'Unanswered' : q.options[picked];
        return (
          '<div class="review-item ' +
          (ok ? 'ok' : 'miss') +
          '">' +
          '<strong>Q' +
          (i + 1) +
          ' (' +
          q.topic +
          '): ' +
          JS.escapeHtml(q.q) +
          '</strong>' +
          '<div style="margin-top:5px;">Your answer: <strong>' +
          JS.escapeHtml(pickedText) +
          '</strong>' +
          (ok ? ' ✓' : ' · Correct: <strong>' + JS.escapeHtml(q.options[q.answer]) + '</strong>') +
          '</div>' +
          '<div style="margin-top:4px; color:var(--muted);">' +
          JS.escapeHtml(q.why) +
          '</div></div>'
        );
      }).join('');
  }

  function startAssessment() {
    index = 0;
    answers = Array(QUESTIONS.length).fill(null);
    document.getElementById('assessment-shell').classList.remove('hidden');
    document.getElementById('results-panel').classList.add('hidden');
    if (mode === 'exam') {
      startTimer();
    } else {
      stopTimer();
      document.getElementById('exam-timer').classList.add('hidden');
    }
    showQuestion(0);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('assessment-panel')) return;

    const state = JS.readState();
    document.getElementById('best-score').textContent = state.bestScore ? String(state.bestScore) : '—';

    const guidedBtn = document.getElementById('mode-guided');
    const examBtn = document.getElementById('mode-exam');

    guidedBtn.addEventListener('click', function () {
      mode = 'guided';
      guidedBtn.classList.add('active');
      examBtn.classList.remove('active');
      startAssessment();
    });

    examBtn.addEventListener('click', function () {
      mode = 'exam';
      examBtn.classList.add('active');
      guidedBtn.classList.remove('active');
      startAssessment();
    });

    document.getElementById('assess-prev').addEventListener('click', function () {
      if (index > 0) showQuestion(index - 1);
    });

    document.getElementById('assess-next').addEventListener('click', function () {
      if (index < QUESTIONS.length - 1) {
        showQuestion(index + 1);
        return;
      }
      const missing = answers.indexOf(null);
      if (mode === 'guided' && missing !== -1) {
        const fb = document.getElementById('assess-feedback');
        fb.textContent = 'Question ' + (missing + 1) + ' is still unanswered—jumping there or choose an answer.';
        fb.className = 'feedback bad';
        showQuestion(missing);
        return;
      }
      finishAssessment(false);
    });

    document.getElementById('restart-assessment').addEventListener('click', startAssessment);
    document.getElementById('retake-assessment').addEventListener('click', startAssessment);

    startAssessment();
  });
})(window);
