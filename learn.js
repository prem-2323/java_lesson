/* Interactive Visual Inheritance Simulator & Embedded Self-Tests for learn.html */
(function (global) {
  'use strict';

  const JS = global.JavaStudio;
  const TOPIC_ORDER = ['single', 'multilevel', 'hierarchical', 'multiple', 'hybrid'];

  const LESSONS = {
    single: {
      kicker: 'PATTERN 01 · THE FOUNDATION',
      title: 'Single Inheritance',
      filename: 'SingleDemo.java',
      summary:
        'One child class (subclass) extends exactly one parent class (superclass). The child automatically inherits all accessible fields and methods, then adds specialized behavior of its own.',
      analogy:
        'Think of a Student ID card inheriting basic details from a Person record—name and age stay reusable, while rollNumber is added specifically for Student.',
      rule: 'Declare class Child extends Parent { ... }. Always place extends before the opening brace.',
      remember:
        'A Dog IS-A Animal. Calling dog.eat() checks Dog first, then follows the extends pointer up to Animal.',
      mistake:
        'Private members of Parent are NOT directly accessible inside Child, even though the object exists in memory.',
      code:
        'class Vehicle {\n' +
        '    void move() {\n' +
        '        System.out.println("Vehicle is moving");\n' +
        '    }\n' +
        '}\n\n' +
        'class Car extends Vehicle {\n' +
        '    void openTrunk() {\n' +
        '        System.out.println("Trunk opened");\n' +
        '    }\n' +
        '}\n\n' +
        'class Main {\n' +
        '    public static void main(String[] args) {\n' +
        '        Car c = new Car();\n' +
        '        c.move();       // inherited from Vehicle\n' +
        '        c.openTrunk();  // defined in Car\n' +
        '    }\n' +
        '}',
      output: 'Vehicle is moving\nTrunk opened',
      sim: {
        rows: [
          [
            {
              id: 'Vehicle',
              role: 'PARENT (SUPERCLASS)',
              type: 'is-parent',
              methods: [
                { id: 'move', label: 'move()' },
                { id: 'VehicleCtor', label: 'Vehicle()' }
              ]
            }
          ],
          [
            {
              id: 'Car',
              role: 'CHILD (extends Vehicle)',
              type: 'is-child',
              methods: [
                { id: 'openTrunk', label: 'openTrunk()' },
                { id: 'move_inh', label: 'move() ↳', inherited: true },
                { id: 'CarCtor', label: 'Car()' }
              ]
            }
          ]
        ],
        edges: [{ from: 'Vehicle', to: 'Car', label: 'extends', kind: 'extends' }],
        defaultTrace: [
          'Click any simulation button below to trace JVM execution on the diagram.'
        ],
        defaultOutput: 'Ready to simulate Single Inheritance.',
        actions: [
          {
            label: 'car.move()',
            steps: [
              { node: 'Car', state: 'state-origin', badge: 'START', text: '1. Call car.move() on Car object. Not defined inside Car.' },
              { edge: 'Vehicle->Car', reverse: true, methodOn: { Vehicle: 'move' } },
              { node: 'Vehicle', state: 'state-found', badge: 'FOUND ✓', method: 'move', text: '2. Follow extends upward → found move() in Vehicle!' }
            ],
            output: 'Vehicle is moving'
          },
          {
            label: 'car.openTrunk()',
            steps: [
              { node: 'Car', state: 'state-found', badge: 'FOUND ✓', method: 'openTrunk', text: '1. Call car.openTrunk(). Found directly inside Car!' }
            ],
            output: 'Trunk opened'
          },
          {
            label: 'new Car() [Constructor Order]',
            steps: [
              { node: 'Vehicle', state: 'state-found', badge: '1ST', method: 'VehicleCtor', text: '1. super() automatically invokes Parent Vehicle() first.' },
              { edge: 'Vehicle->Car', reverse: false },
              { node: 'Car', state: 'state-origin', badge: '2ND', method: 'CarCtor', text: '2. Next, Child Car() constructor executes.' }
            ],
            output: '1. Vehicle() runs\n2. Car() runs'
          }
        ]
      },
      checks: [
        {
          q: 'Which keyword connects a child class to its single parent class in Java?',
          options: ['implements', 'extends', 'inherits', 'superclass'],
          correct: 1,
          why: 'Java uses extends for class-to-class inheritance (e.g., class Car extends Vehicle).'
        },
        {
          q: 'What is printed when running main()?',
          code: 'class A { A() { System.out.print("A "); } }\nclass B extends A { B() { System.out.print("B"); } }\n// In main: new B();',
          options: ['B only', 'B A', 'A B', 'Compile error'],
          correct: 2,
          why: 'Parent constructor A() always finishes before Child constructor B() via implicit super().'
        },
        {
          q: 'In Single Inheritance, can the Parent class call methods defined ONLY inside the Child class?',
          options: ['Yes, always', 'No, inheritance flows from Parent to Child only', 'Yes, using super', 'Only if main() is inside Parent'],
          correct: 1,
          why: 'Car IS-A Vehicle, but a generic Vehicle is NOT necessarily a Car—Parent cannot access Child-only methods.'
        }
      ]
    },

    multilevel: {
      kicker: 'PATTERN 02 · A CHAIN OF CLASSES',
      title: 'Multilevel Inheritance',
      filename: 'MultilevelDemo.java',
      summary:
        'Inheritance forms a vertical chain across three or more levels (Grandparent → Parent → Child). The bottom class inherits accessible methods from every ancestor above it.',
      analogy:
        'Like an engineering track: Person → EngineeringStudent → BTechCSEStudent. A CSE student shares general student rules AND general person attributes.',
      rule: 'Each class still extends only ONE direct parent class, keeping the hierarchy unambiguous.',
      remember:
        'ElectricCar extends Car, and Car extends Vehicle. Method lookup climbs up one level at a time until a match is found.',
      mistake:
        'Multilevel inheritance is NOT multiple inheritance—each class still has only one immediate parent!',
      code:
        'class Vehicle {\n' +
        '    void move() { System.out.println("Moving"); }\n' +
        '}\n' +
        'class Car extends Vehicle {\n' +
        '    void honk() { System.out.println("Beep!"); }\n' +
        '}\n' +
        'class ElectricCar extends Car {\n' +
        '    void charge() { System.out.println("Charging"); }\n' +
        '}\n\n' +
        'class Main {\n' +
        '    public static void main(String[] args) {\n' +
        '        ElectricCar ev = new ElectricCar();\n' +
        '        ev.move();    // from Vehicle\n' +
        '        ev.honk();    // from Car\n' +
        '        ev.charge();  // from ElectricCar\n' +
        '    }\n' +
        '}',
      output: 'Moving\nBeep!\nCharging',
      sim: {
        rows: [
          [
            {
              id: 'Vehicle',
              role: 'LEVEL 1 · GRANDPARENT',
              type: 'is-parent',
              methods: [
                { id: 'move', label: 'move()' },
                { id: 'vCtor', label: 'Vehicle()' }
              ]
            }
          ],
          [
            {
              id: 'Car',
              role: 'LEVEL 2 · extends Vehicle',
              type: 'is-child',
              methods: [
                { id: 'honk', label: 'honk()' },
                { id: 'cCtor', label: 'Car()' }
              ]
            }
          ],
          [
            {
              id: 'ElectricCar',
              role: 'LEVEL 3 · extends Car',
              type: 'is-child',
              methods: [
                { id: 'charge', label: 'charge()' },
                { id: 'move_inh', label: 'move() ↳', inherited: true },
                { id: 'eCtor', label: 'ElectricCar()' }
              ]
            }
          ]
        ],
        edges: [
          { from: 'Vehicle', to: 'Car', label: 'extends', kind: 'extends' },
          { from: 'Car', to: 'ElectricCar', label: 'extends', kind: 'extends' }
        ],
        defaultTrace: ['Click ev.move() to watch a 2-hop lookup climb all the way to Vehicle.'],
        defaultOutput: 'Ready to simulate Multilevel Inheritance.',
        actions: [
          {
            label: 'ev.move()',
            steps: [
              { node: 'ElectricCar', state: 'state-origin', badge: 'START', text: '1. Check ElectricCar for move() — not defined here.' },
              { edge: 'Car->ElectricCar', reverse: true },
              { node: 'Car', state: 'state-visited', badge: 'CHECK ↑', text: '2. Check parent Car for move() — not defined here either.' },
              { edge: 'Vehicle->Car', reverse: true },
              { node: 'Vehicle', state: 'state-found', badge: 'FOUND ✓', method: 'move', text: '3. Climb to Grandparent Vehicle — found move()!' }
            ],
            output: 'Moving'
          },
          {
            label: 'ev.honk()',
            steps: [
              { node: 'ElectricCar', state: 'state-origin', badge: 'START', text: '1. Check ElectricCar — move up to direct parent.' },
              { edge: 'Car->ElectricCar', reverse: true },
              { node: 'Car', state: 'state-found', badge: 'FOUND ✓', method: 'honk', text: '2. Found honk() in Car!' }
            ],
            output: 'Beep!'
          },
          {
            label: 'new ElectricCar() [Constructors]',
            steps: [
              { node: 'Vehicle', state: 'state-found', badge: '1ST', method: 'vCtor', text: '1. Topmost Grandparent Vehicle() initializes first.' },
              { edge: 'Vehicle->Car', reverse: false },
              { node: 'Car', state: 'state-visited', badge: '2ND', method: 'cCtor', text: '2. Middle Parent Car() initializes next.' },
              { edge: 'Car->ElectricCar', reverse: false },
              { node: 'ElectricCar', state: 'state-origin', badge: '3RD', method: 'eCtor', text: '3. Child ElectricCar() initializes last.' }
            ],
            output: '1. Vehicle()\n2. Car()\n3. ElectricCar()'
          }
        ]
      },
      checks: [
        {
          q: 'If ElectricCar extends Car and Car extends Vehicle, which class is the direct parent of ElectricCar?',
          options: ['Vehicle', 'Car', 'Both Vehicle and Car directly', 'Object only'],
          correct: 1,
          why: 'Car is the immediate superclass of ElectricCar; Vehicle is its indirect ancestor.'
        },
        {
          q: 'What is the constructor execution order for new ElectricCar()?',
          options: [
            'ElectricCar() → Car() → Vehicle()',
            'Car() → Vehicle() → ElectricCar()',
            'Vehicle() → Car() → ElectricCar()',
            'Only ElectricCar() runs'
          ],
          correct: 2,
          why: 'Constructor chaining always travels top-down from the highest superclass to the lowest subclass.'
        },
        {
          q: 'If Car overrides move(), which version does ev.move() execute?',
          options: ['Vehicle.move() always', 'Car.move() (closest match going upward)', 'Compile error', 'Neither runs'],
          correct: 1,
          why: 'Method lookup stops at the first matching implementation moving upward—so Car.move() runs!'
        }
      ]
    },

    hierarchical: {
      kicker: 'PATTERN 03 · ONE PARENT, MANY CHILDREN',
      title: 'Hierarchical Inheritance',
      filename: 'HierarchicalDemo.java',
      summary:
        'Two or more sibling child classes inherit from the exact same parent class. Each child shares the parent’s common methods while staying completely independent from its siblings.',
      analogy:
        'Like SavingsAccount and CurrentAccount extending BankAccount: both inherit checkBalance(), yet Savings features do not leak into CurrentAccount.',
      rule: 'Each sibling writes extends Parent separately. Siblings NEVER inherit from one another.',
      remember:
        'Both Car and Bike get Vehicle.move(), but Car cannot call Bike.kickStart() and Bike cannot call Car.openTrunk().',
      mistake:
        'Beginners often assume sibling classes share methods with each other—they do NOT! Only Parent → Child shares.',
      code:
        'class Vehicle {\n' +
        '    void move() { System.out.println("Vehicle moves"); }\n' +
        '}\n' +
        'class Car extends Vehicle {\n' +
        '    void openTrunk() { System.out.println("Trunk open"); }\n' +
        '}\n' +
        'class Bike extends Vehicle {\n' +
        '    void kickStart() { System.out.println("Kick started"); }\n' +
        '}\n\n' +
        'class Main {\n' +
        '    public static void main(String[] args) {\n' +
        '        new Car().move();   // works!\n' +
        '        new Bike().move();  // works!\n' +
        '    }\n' +
        '}',
      output: 'Vehicle moves\nVehicle moves',
      sim: {
        rows: [
          [
            {
              id: 'Vehicle',
              role: 'SHARED PARENT',
              type: 'is-parent',
              methods: [{ id: 'move', label: 'move()' }]
            }
          ],
          [
            {
              id: 'Car',
              role: 'CHILD 1 (extends Vehicle)',
              type: 'is-child',
              methods: [
                { id: 'openTrunk', label: 'openTrunk()' },
                { id: 'carMove', label: 'move() ↳', inherited: true }
              ]
            },
            {
              id: 'Bike',
              role: 'CHILD 2 (extends Vehicle)',
              type: 'is-child',
              methods: [
                { id: 'kickStart', label: 'kickStart()' },
                { id: 'bikeMove', label: 'move() ↳', inherited: true }
              ]
            }
          ]
        ],
        edges: [
          { from: 'Vehicle', to: 'Car', label: 'extends', kind: 'extends' },
          { from: 'Vehicle', to: 'Bike', label: 'extends', kind: 'extends' }
        ],
        defaultTrace: ['Test calling move() on both siblings, or try an illegal cross-sibling call!'],
        defaultOutput: 'Ready to simulate Hierarchical Inheritance.',
        actions: [
          {
            label: 'car.move()',
            steps: [
              { node: 'Car', state: 'state-origin', badge: 'START', text: '1. Start at Car object.' },
              { edge: 'Vehicle->Car', reverse: true },
              { node: 'Vehicle', state: 'state-found', badge: 'FOUND ✓', method: 'move', text: '2. Car inherits move() from shared parent Vehicle!' }
            ],
            output: 'Vehicle moves'
          },
          {
            label: 'bike.move()',
            steps: [
              { node: 'Bike', state: 'state-origin', badge: 'START', text: '1. Start at Bike object.' },
              { edge: 'Vehicle->Bike', reverse: true },
              { node: 'Vehicle', state: 'state-found', badge: 'FOUND ✓', method: 'move', text: '2. Bike also inherits move() from shared parent Vehicle!' }
            ],
            output: 'Vehicle moves'
          },
          {
            label: 'car.kickStart() ✕',
            invalid: true,
            steps: [
              { node: 'Car', state: 'state-error', badge: 'ERROR ✕', text: '1. Check Car → no kickStart(). Check Vehicle → no kickStart().' },
              { node: 'Bike', state: 'state-error', badge: 'ISOLATED', method: 'kickStart', text: '2. kickStart() belongs only to sibling Bike—Car cannot access it!' }
            ],
            output: 'Compile Error: cannot find symbol method kickStart() on Car',
            isError: true
          }
        ]
      },
      checks: [
        {
          q: 'Which class structure demonstrates Hierarchical Inheritance?',
          options: [
            'A extends B; B extends C',
            'Circle extends Shape; Square extends Shape',
            'Duck implements Flyable, Swimmable',
            'Shape extends Circle, Square'
          ],
          correct: 1,
          why: 'Two separate child classes (Circle and Square) sharing one parent (Shape) is hierarchical inheritance.'
        },
        {
          q: 'Given Car extends Vehicle and Bike extends Vehicle, what happens on: new Car().kickStart(); ?',
          code: 'class Vehicle {}\nclass Car extends Vehicle {}\nclass Bike extends Vehicle { void kickStart() {} }',
          options: ['Prints Kick started', 'Calls Vehicle method', 'Compile-time error', 'Runtime warning only'],
          correct: 2,
          why: 'Car and Bike are siblings; Car has no inheritance relationship with Bike.'
        },
        {
          q: 'How many child classes can extend the same parent class in Java?',
          options: ['Only 2', 'Maximum 5', 'Any number of subclasses', 'Only 1'],
          correct: 2,
          why: 'Any number of classes can inherit from a single non-final superclass.'
        }
      ]
    },

    multiple: {
      kicker: 'PATTERN 04 · THE DIAMOND RULE',
      title: 'Multiple Inheritance (Interfaces)',
      filename: 'MultipleInterfaceDemo.java',
      summary:
        'Java does NOT allow a class to extend multiple classes because of the Diamond Problem (method ambiguity). Instead, Java achieves multiple inheritance cleanly through interfaces using implements.',
      analogy:
        'A SmartPhone cannot have two conflicting biological parents, but it CAN hold multiple skill certificates (Camera + MusicPlayer interfaces) and implement both.',
      rule: 'NOT allowed: class C extends A, B. Allowed: class C implements Interface1, Interface2.',
      remember:
        'Remember for viva: Java avoids the Diamond Problem by prohibiting multiple class inheritance and allowing multiple interface implementation.',
      mistake:
        'Writing class Duck extends Flyable fails! Classes MUST use implements (not extends) for interfaces.',
      code:
        'interface Flyable {\n' +
        '    void fly();\n' +
        '}\n' +
        'interface Swimmable {\n' +
        '    void swim();\n' +
        '}\n\n' +
        'class Duck implements Flyable, Swimmable {\n' +
        '    public void fly() { System.out.println("Duck flying"); }\n' +
        '    public void swim() { System.out.println("Duck swimming"); }\n' +
        '}',
      output: 'Duck implements both contracts safely—zero ambiguity!',
      hasToggle: true,
      simModes: {
        solution: {
          label: '✓ Java Interface Solution',
          rows: [
            [
              {
                id: 'Flyable',
                role: 'INTERFACE 1',
                type: 'is-interface',
                methods: [{ id: 'fly', label: 'void fly();' }]
              },
              {
                id: 'Swimmable',
                role: 'INTERFACE 2',
                type: 'is-interface',
                methods: [{ id: 'swim', label: 'void swim();' }]
              }
            ],
            [
              {
                id: 'Duck',
                role: 'CLASS (implements both)',
                type: 'is-child',
                methods: [
                  { id: 'duckFly', label: 'public void fly()' },
                  { id: 'duckSwim', label: 'public void swim()' }
                ]
              }
            ]
          ],
          edges: [
            { from: 'Flyable', to: 'Duck', label: 'implements', kind: 'implements' },
            { from: 'Swimmable', to: 'Duck', label: 'implements', kind: 'implements' }
          ],
          defaultTrace: ['Switch above to compare the Diamond Problem vs Java Interfaces!'],
          defaultOutput: 'Valid Java: multiple interfaces implemented cleanly.',
          actions: [
            {
              label: 'duck.fly()',
              steps: [
                { node: 'Duck', state: 'state-origin', badge: 'START', method: 'duckFly', text: '1. Duck provides its own clear public void fly() body.' },
                { edge: 'Flyable->Duck', reverse: true },
                { node: 'Flyable', state: 'state-found', badge: 'CONTRACT ✓', method: 'fly', text: '2. Satisfies Flyable interface contract!' }
              ],
              output: 'Duck flying'
            },
            {
              label: 'duck.swim()',
              steps: [
                { node: 'Duck', state: 'state-origin', badge: 'START', method: 'duckSwim', text: '1. Duck provides public void swim() body.' },
                { edge: 'Swimmable->Duck', reverse: true },
                { node: 'Swimmable', state: 'state-found', badge: 'CONTRACT ✓', method: 'swim', text: '2. Satisfies Swimmable interface contract!' }
              ],
              output: 'Duck swimming'
            }
          ]
        },
        diamond: {
          label: '✕ Why Multiple Classes Fail (Diamond)',
          rows: [
            [
              {
                id: 'Device',
                role: 'TOP CLASS A',
                type: 'is-parent',
                methods: [{ id: 'showA', label: 'show()' }]
              }
            ],
            [
              {
                id: 'Camera',
                role: 'CLASS B (extends A)',
                type: 'is-child',
                methods: [{ id: 'showB', label: 'show() { "Cam" }' }]
              },
              {
                id: 'Phone',
                role: 'CLASS C (extends A)',
                type: 'is-child',
                methods: [{ id: 'showC', label: 'show() { "Call" }' }]
              }
            ],
            [
              {
                id: 'SmartPhone',
                role: 'ILLEGAL: extends B, C',
                type: 'is-child',
                methods: [{ id: 'ambig', label: 'which show() ?' }]
              }
            ]
          ],
          edges: [
            { from: 'Device', to: 'Camera', label: 'extends', kind: 'extends' },
            { from: 'Device', to: 'Phone', label: 'extends', kind: 'extends' },
            { from: 'Camera', to: 'SmartPhone', label: 'conflict!', kind: 'conflict' },
            { from: 'Phone', to: 'SmartPhone', label: 'conflict!', kind: 'conflict' }
          ],
          defaultTrace: ['Click phone.show() ✕ to see why Java forbids extending two classes!'],
          defaultOutput: 'Illegal syntax in Java: class SmartPhone extends Camera, Phone',
          actions: [
            {
              label: 'phone.show() ✕',
              invalid: true,
              steps: [
                { node: 'SmartPhone', state: 'state-error', badge: 'AMBIGUOUS!', method: 'ambig', text: '1. SmartPhone tries to inherit show() from BOTH Camera and Phone...' },
                { node: 'Camera', state: 'state-error', badge: 'CONFLICT 1', method: 'showB', text: '2. Camera says show() prints "Cam"...' },
                { node: 'Phone', state: 'state-error', badge: 'CONFLICT 2', method: 'showC', text: '3. Phone says show() prints "Call"! Compiler rejects ambiguous extends B, C!' }
              ],
              output: 'Compile Error: Java does not support multiple class inheritance (Diamond Problem).',
              isError: true
            }
          ]
        }
      },
      checks: [
        {
          q: 'Why does Java disallow a class from extending two parent classes?',
          options: [
            'To reduce file size',
            'To prevent the Diamond Problem (ambiguous method/field resolution)',
            'Because Java has no extends keyword',
            'Only interfaces can have methods'
          ],
          correct: 1,
          why: 'If both parent classes define the same method, the compiler cannot decide which one the child should inherit.'
        },
        {
          q: 'Which declaration is valid Java for implementing two abilities?',
          options: [
            'class Robot extends Walker, Talker',
            'class Robot implements Walker, Talker',
            'interface Robot implements Walker, Talker',
            'class Robot uses Walker, Talker'
          ],
          correct: 1,
          why: 'A Java class uses implements followed by comma-separated interface names.'
        },
        {
          q: 'When implementing an interface method in a concrete class, what access modifier is required?',
          options: ['private', 'protected', 'public', 'static'],
          correct: 2,
          why: 'Interface methods are implicitly public, so the implementing class method MUST also be public.'
        }
      ]
    },

    hybrid: {
      kicker: 'PATTERN 05 · COMBINE PATTERNS',
      title: 'Hybrid Inheritance',
      filename: 'HybridDemo.java',
      summary:
        'Hybrid inheritance combines two or more inheritance patterns in one hierarchy—most commonly a class inheritance chain (Single/Multilevel/Hierarchical) paired with one or more interfaces.',
      analogy:
        'An ElectricCar IS-A Car (which IS-A Vehicle), AND it also supports the Chargeable ability—combining a family tree with an extra capability contract.',
      rule: 'Always write extends ParentClass FIRST, then implements Interface1, Interface2.',
      remember:
        'Hybrid inheritance lets you reuse code through a superclass while adding flexible cross-cutting abilities via interfaces.',
      mistake:
        'Reversing keyword order (class ElectricCar implements Chargeable extends Car) causes an immediate compile error!',
      code:
        'class Vehicle {\n' +
        '    void move() { System.out.println("Moving"); }\n' +
        '}\n' +
        'class Car extends Vehicle {\n' +
        '    void park() { System.out.println("Parked"); }\n' +
        '}\n' +
        'interface Chargeable {\n' +
        '    void charge();\n' +
        '}\n\n' +
        'class ElectricCar extends Car implements Chargeable {\n' +
        '    public void charge() { System.out.println("Charging 100%"); }\n' +
        '}',
      output: 'ElectricCar gets move() & park() via classes + charge() via interface!',
      sim: {
        rows: [
          [
            {
              id: 'Vehicle',
              role: 'BASE CLASS',
              type: 'is-parent',
              methods: [
                { id: 'move', label: 'move()' },
                { id: 'vCtor', label: 'Vehicle()' }
              ]
            }
          ],
          [
            {
              id: 'Car',
              role: 'MID CLASS (extends Vehicle)',
              type: 'is-child',
              methods: [
                { id: 'park', label: 'park()' },
                { id: 'cCtor', label: 'Car()' }
              ]
            },
            {
              id: 'Chargeable',
              role: 'INTERFACE',
              type: 'is-interface',
              methods: [{ id: 'chargeContract', label: 'void charge();' }]
            }
          ],
          [
            {
              id: 'ElectricCar',
              role: 'HYBRID (extends Car implements Chargeable)',
              type: 'is-child',
              methods: [
                { id: 'chargeImpl', label: 'public void charge()' },
                { id: 'move_inh', label: 'move() ↳', inherited: true },
                { id: 'eCtor', label: 'ElectricCar()' }
              ]
            }
          ]
        ],
        edges: [
          { from: 'Vehicle', to: 'Car', label: 'extends', kind: 'extends' },
          { from: 'Car', to: 'ElectricCar', label: 'extends', kind: 'extends' },
          { from: 'Chargeable', to: 'ElectricCar', label: 'implements', kind: 'implements' }
        ],
        defaultTrace: ['Test calling class-inherited methods (move, park) and interface method (charge)!'],
        defaultOutput: 'Ready to simulate Hybrid Inheritance.',
        actions: [
          {
            label: 'ev.move()',
            steps: [
              { node: 'ElectricCar', state: 'state-origin', badge: 'START', text: '1. Start at ElectricCar.' },
              { edge: 'Car->ElectricCar', reverse: true },
              { node: 'Car', state: 'state-visited', badge: 'CHECK ↑', text: '2. Climb to Car — check for move().' },
              { edge: 'Vehicle->Car', reverse: true },
              { node: 'Vehicle', state: 'state-found', badge: 'FOUND ✓', method: 'move', text: '3. Found move() at top of class chain in Vehicle!' }
            ],
            output: 'Moving'
          },
          {
            label: 'ev.park()',
            steps: [
              { node: 'ElectricCar', state: 'state-origin', badge: 'START', text: '1. Start at ElectricCar.' },
              { edge: 'Car->ElectricCar', reverse: true },
              { node: 'Car', state: 'state-found', badge: 'FOUND ✓', method: 'park', text: '2. Found park() in parent Car!' }
            ],
            output: 'Parked'
          },
          {
            label: 'ev.charge()',
            steps: [
              { node: 'ElectricCar', state: 'state-origin', badge: 'RUN', method: 'chargeImpl', text: '1. Execute ElectricCar’s concrete charge() implementation.' },
              { edge: 'Chargeable->ElectricCar', reverse: true },
              { node: 'Chargeable', state: 'state-found', badge: 'CONTRACT ✓', method: 'chargeContract', text: '2. Matches Chargeable interface contract!' }
            ],
            output: 'Charging 100%'
          },
          {
            label: 'new ElectricCar() [Constructors]',
            steps: [
              { node: 'Vehicle', state: 'state-found', badge: '1ST', method: 'vCtor', text: '1. Vehicle() constructor runs first (interfaces have no constructors!).' },
              { edge: 'Vehicle->Car', reverse: false },
              { node: 'Car', state: 'state-visited', badge: '2ND', method: 'cCtor', text: '2. Car() constructor runs next.' },
              { edge: 'Car->ElectricCar', reverse: false },
              { node: 'ElectricCar', state: 'state-origin', badge: '3RD', method: 'eCtor', text: '3. ElectricCar() constructor runs last.' }
            ],
            output: '1. Vehicle()\n2. Car()\n3. ElectricCar()'
          }
        ]
      },
      checks: [
        {
          q: 'Which class declaration is syntactically valid in Java?',
          options: [
            'class EV implements Chargeable extends Car',
            'class EV extends Car implements Chargeable',
            'class EV extends Car, Chargeable',
            'class EV implements Car extends Chargeable'
          ],
          correct: 1,
          why: 'Java syntax strictly requires extends ParentClass BEFORE implements InterfaceList.'
        },
        {
          q: 'In hybrid inheritance (class ElectricCar extends Car implements Chargeable), do interfaces run constructors during new ElectricCar()?',
          options: [
            'Yes, interfaces run first',
            'Yes, right after Vehicle()',
            'No, interfaces do not have constructors in Java',
            'Only if interface has 1 method'
          ],
          correct: 2,
          why: 'Interfaces cannot be instantiated and cannot declare constructors—only the class chain runs constructors.'
        },
        {
          q: 'What makes ElectricCar extends Car implements Chargeable an example of Hybrid Inheritance?',
          options: [
            'It uses two main() methods',
            'It combines multilevel class inheritance with interface implementation',
            'It extends two superclasses',
            'It avoids using objects'
          ],
          correct: 1,
          why: 'Combining a class hierarchy (Vehicle → Car → ElectricCar) with an interface (Chargeable) creates a hybrid structure.'
        }
      ]
    }
  };

  let activeTopic = 'single';
  let activeSimMode = 'solution';
  let activePaths = {};
  let runToken = 0;

  function updateMasteryHeader() {
    const state = JS.readState();
    const masteredCount = TOPIC_ORDER.filter(function (id) {
      return Boolean(state.mastered && state.mastered[id]);
    }).length;
    const countEl = document.getElementById('mastery-count');
    const barEl = document.getElementById('mastery-bar');
    if (countEl) countEl.textContent = String(masteredCount);
    if (barEl) barEl.style.width = masteredCount * 20 + '%';

    document.querySelectorAll('.topic-btn').forEach(function (btn) {
      const id = btn.getAttribute('data-topic');
      const isMastered = Boolean(state.mastered && state.mastered[id]);
      btn.classList.toggle('active', id === activeTopic);
      btn.classList.toggle('mastered', isMastered);
      const badge = btn.querySelector('.t-badge');
      if (badge) {
        badge.textContent = isMastered ? '✓' : id === activeTopic ? '●' : '→';
      }
    });
  }

  function getCurrentSimSpec() {
    const lesson = LESSONS[activeTopic];
    if (lesson.hasToggle) {
      return lesson.simModes[activeSimMode] || lesson.simModes.solution;
    }
    return lesson.sim;
  }

  function renderSimulator() {
    const lesson = LESSONS[activeTopic];
    const sim = getCurrentSimSpec();
    const toggleBar = document.getElementById('diamond-toggle-bar');
    const canvas = document.getElementById('sim-canvas');
    const svg = document.getElementById('sim-svg');
    const nodesEl = document.getElementById('sim-nodes');
    const actionsBar = document.getElementById('sim-actions-bar');
    const traceList = document.getElementById('sim-trace-list');
    const outputPre = document.getElementById('sim-output');

    if (lesson.hasToggle) {
      toggleBar.classList.remove('hidden');
      toggleBar.innerHTML = ['solution', 'diamond']
        .map(function (modeKey) {
          const spec = lesson.simModes[modeKey];
          return (
            '<button type="button" class="mode-pill-btn ' +
            (activeSimMode === modeKey ? 'active' : '') +
            '" data-sim-mode="' +
            modeKey +
            '">' +
            JS.escapeHtml(spec.label) +
            '</button>'
          );
        })
        .join('');
      toggleBar.querySelectorAll('[data-sim-mode]').forEach(function (b) {
        b.addEventListener('click', function () {
          activeSimMode = b.getAttribute('data-sim-mode');
          runToken++;
          renderSimulator();
        });
      });
    } else {
      toggleBar.classList.add('hidden');
      toggleBar.innerHTML = '';
    }

    nodesEl.innerHTML = sim.rows
      .map(function (row) {
        return (
          '<div class="sim-row">' +
          row
            .map(function (node) {
              const methodsHtml = node.methods
                .map(function (m) {
                  return (
                    '<span class="sim-method-pill' +
                    (m.inherited ? ' inherited' : '') +
                    '" data-method-id="' +
                    m.id +
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
                '">' +
                '<span class="sim-node-badge">STEP</span>' +
                '<span class="sim-node-role">' +
                JS.escapeHtml(node.role) +
                '</span>' +
                '<strong class="sim-node-name">' +
                JS.escapeHtml(node.id) +
                '</strong>' +
                '<div class="sim-methods">' +
                methodsHtml +
                '</div></div>'
              );
            })
            .join('') +
          '</div>'
        );
      })
      .join('');

    traceList.innerHTML = sim.defaultTrace
      .map(function (t) {
        return '<li>' + JS.escapeHtml(t) + '</li>';
      })
      .join('');
    outputPre.textContent = sim.defaultOutput;
    outputPre.classList.remove('is-err');

    actionsBar.innerHTML =
      '<span class="sim-actions-label">TRY CALLING:</span>' +
      sim.actions
        .map(function (act, idx) {
          return (
            '<button type="button" class="sim-action-btn' +
            (act.invalid ? ' is-invalid' : '') +
            '" data-action-idx="' +
            idx +
            '">' +
            JS.escapeHtml(act.label) +
            '</button>'
          );
        })
        .join('');

    actionsBar.querySelectorAll('[data-action-idx]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = Number(btn.getAttribute('data-action-idx'));
        actionsBar.querySelectorAll('.sim-action-btn').forEach(function (x) {
          x.classList.toggle('active', x === btn);
        });
        runSimulationAction(sim.actions[idx]);
      });
    });

    requestAnimationFrame(function () {
      activePaths = JS.drawSvgConnectors(canvas, svg, sim.edges);
    });
  }

  function clearSimulationHighlights() {
    document.querySelectorAll('#sim-nodes .sim-node').forEach(function (n) {
      n.classList.remove('state-origin', 'state-visited', 'state-found', 'state-error');
    });
    document.querySelectorAll('#sim-nodes .sim-method-pill').forEach(function (m) {
      m.classList.remove('active-method');
    });
    document.querySelectorAll('#sim-svg .svg-link-line').forEach(function (p) {
      p.classList.remove('is-lit');
    });
  }

  function runSimulationAction(action) {
    if (!action) return;
    const currentRun = ++runToken;
    clearSimulationHighlights();

    const svg = document.getElementById('sim-svg');
    const traceList = document.getElementById('sim-trace-list');
    const outputPre = document.getElementById('sim-output');

    traceList.innerHTML = '';
    outputPre.textContent = 'Tracing JVM lookup...';
    outputPre.classList.remove('is-err');

    let stepIndex = 0;

    function nextStep() {
      if (currentRun !== runToken) return;
      if (stepIndex >= action.steps.length) {
        outputPre.textContent = action.output;
        outputPre.classList.toggle('is-err', Boolean(action.isError));
        return;
      }

      const step = action.steps[stepIndex++];

      if (step.edge && activePaths[step.edge]) {
        const path = activePaths[step.edge];
        path.classList.add('is-lit');
        JS.animateOrbAlongPath(svg, path, Boolean(step.reverse), 440, nextStep);
        return;
      }

      if (step.node) {
        const nodeEl = document.querySelector('#sim-nodes [data-node-id="' + step.node + '"]');
        if (nodeEl) {
          nodeEl.classList.add(step.state);
          const badge = nodeEl.querySelector('.sim-node-badge');
          if (badge && step.badge) badge.textContent = step.badge;
          if (step.method) {
            const pill = nodeEl.querySelector('[data-method-id="' + step.method + '"]');
            if (pill) pill.classList.add('active-method');
          }
        }
      }

      if (step.text) {
        const li = document.createElement('li');
        li.textContent = step.text;
        traceList.appendChild(li);
      }

      setTimeout(nextStep, 380);
    }

    nextStep();
  }

  function renderSelfChecks() {
    const lesson = LESSONS[activeTopic];
    const state = JS.readState();
    const saved = (state.lessonChecks && state.lessonChecks[activeTopic]) || [];

    const titleEl = document.getElementById('self-test-title');
    const listEl = document.getElementById('self-check-list');
    const badgeEl = document.getElementById('self-test-badge');
    const statusEl = document.getElementById('self-test-status');

    titleEl.textContent = 'Quick Check: ' + lesson.title;

    listEl.innerHTML = lesson.checks
      .map(function (chk, qIdx) {
        const chosen = typeof saved[qIdx] === 'number' ? saved[qIdx] : null;
        const codeHtml = chk.code
          ? '<div class="code-block self-check-code"><pre><code>' + JS.highlightJava(chk.code) + '</code></pre></div>'
          : '';
        const optionsHtml = chk.options
          .map(function (opt, oIdx) {
            let cls = 'check-opt';
            if (chosen !== null) {
              if (oIdx === chk.correct) cls += ' is-right';
              else if (oIdx === chosen) cls += ' is-wrong';
            }
            return (
              '<button type="button" class="' +
              cls +
              '" data-chk-q="' +
              qIdx +
              '" data-chk-o="' +
              oIdx +
              '"><span class="letter">' +
              String.fromCharCode(65 + oIdx) +
              '</span><span>' +
              JS.escapeHtml(opt) +
              '</span></button>'
            );
          })
          .join('');

        let fbHtml = '';
        if (chosen !== null) {
          const ok = chosen === chk.correct;
          fbHtml =
            '<div class="check-feedback ' +
            (ok ? 'good' : 'bad') +
            '">' +
            (ok ? '✓ Correct! ' : '✕ Not quite. ') +
            JS.escapeHtml(chk.why) +
            '</div>';
        } else {
          fbHtml = '<div class="check-feedback"></div>';
        }

        return (
          '<div class="self-check-item">' +
          '<div class="self-check-q">' +
          (qIdx + 1) +
          '. ' +
          JS.escapeHtml(chk.q) +
          '</div>' +
          codeHtml +
          '<div class="check-options">' +
          optionsHtml +
          '</div>' +
          fbHtml +
          '</div>'
        );
      })
      .join('');

    let rightCount = 0;
    let answeredCount = 0;
    lesson.checks.forEach(function (chk, i) {
      if (typeof saved[i] === 'number') {
        answeredCount++;
        if (saved[i] === chk.correct) rightCount++;
      }
    });

    const isMastered = rightCount === lesson.checks.length;
    badgeEl.textContent = isMastered
      ? '3 / 3 Mastered ✓'
      : rightCount + ' / ' + lesson.checks.length + ' Correct';
    badgeEl.classList.toggle('mastered', isMastered);

    if (isMastered) {
      statusEl.textContent = 'Awesome! You mastered ' + lesson.title + '. Move on to the next pattern!';
    } else if (answeredCount === lesson.checks.length) {
      statusEl.textContent = 'Review the highlighted explanations above and click Retry checks to aim for 3/3!';
    } else {
      statusEl.textContent = 'Answer all 3 self-checks right here to master ' + lesson.title + '.';
    }

    listEl.querySelectorAll('[data-chk-q]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const qIdx = Number(btn.getAttribute('data-chk-q'));
        const oIdx = Number(btn.getAttribute('data-chk-o'));

        const nextState = JS.updateState(function (s) {
          if (!s.lessonChecks) s.lessonChecks = {};
          if (!Array.isArray(s.lessonChecks[activeTopic])) s.lessonChecks[activeTopic] = [];
          s.lessonChecks[activeTopic][qIdx] = oIdx;

          const allCorrect = lesson.checks.every(function (chk, idx) {
            return s.lessonChecks[activeTopic][idx] === chk.correct;
          });
          if (!s.mastered) s.mastered = {};
          s.mastered[activeTopic] = allCorrect;
          return s;
        });

        void nextState;
        renderSelfChecks();
        updateMasteryHeader();
      });
    });
  }

  function selectTopic(topicId) {
    if (!LESSONS[topicId]) topicId = 'single';
    activeTopic = topicId;
    activeSimMode = 'solution';
    runToken++;

    const lesson = LESSONS[topicId];
    const index = TOPIC_ORDER.indexOf(topicId);

    document.getElementById('lesson-kicker').innerHTML = '<i></i> ' + JS.escapeHtml(lesson.kicker);
    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-count').textContent = '0' + (index + 1) + ' / 05';
    document.getElementById('lesson-summary').textContent = lesson.summary;
    document.getElementById('lesson-analogy').textContent = lesson.analogy;
    document.getElementById('lesson-rule').textContent = lesson.rule;
    document.getElementById('lesson-remember').textContent = lesson.remember;
    document.getElementById('lesson-mistake').textContent = lesson.mistake;
    document.getElementById('lesson-filename').textContent = lesson.filename;
    document.getElementById('lesson-code').innerHTML = JS.highlightJava(lesson.code);
    document.getElementById('lesson-output').textContent = lesson.output;

    const nextBtn = document.getElementById('next-topic-btn');
    if (nextBtn) {
      if (index < TOPIC_ORDER.length - 1) {
        nextBtn.textContent = 'Next: ' + LESSONS[TOPIC_ORDER[index + 1]].title + ' →';
        nextBtn.onclick = function () {
          selectTopic(TOPIC_ORDER[index + 1]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
      } else {
        nextBtn.textContent = 'Take Final Assessment ✓';
        nextBtn.onclick = function () {
          window.location.href = 'assessment.html';
        };
      }
    }

    try {
      history.replaceState(null, '', '?topic=' + topicId);
    } catch (_) {}

    updateMasteryHeader();
    renderSimulator();
    renderSelfChecks();
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('lesson-card')) return;

    document.querySelectorAll('.topic-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectTopic(btn.getAttribute('data-topic'));
      });
    });

    const retryBtn = document.getElementById('reset-topic-checks');
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        JS.updateState(function (s) {
          if (s.lessonChecks) delete s.lessonChecks[activeTopic];
          if (s.mastered) delete s.mastered[activeTopic];
          return s;
        });
        renderSelfChecks();
        updateMasteryHeader();
      });
    }

    window.addEventListener('resize', function () {
      const sim = getCurrentSimSpec();
      activePaths = JS.drawSvgConnectors(
        document.getElementById('sim-canvas'),
        document.getElementById('sim-svg'),
        sim.edges
      );
    });

    const urlTopic = new URLSearchParams(window.location.search).get('topic') || 'single';
    selectTopic(urlTopic);
  });
})(window);
