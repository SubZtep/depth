interface Single {
  foo: () => void
  xxx: string
}

class Singleton {
  static instance: Single

  constructor() {
    if (Singleton.instance) {
      return Singleton.instance
    }

    Singleton.instance = this
  }

  xxx: string = ""

  foo() {
    // ...
  }
}

const s = new Singleton()
s.xxx = "xy"

console.log([s, s === new Singleton()])
