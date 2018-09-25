import { performance } from 'perf_hooks'

const COUNT = 1e9

const measure = (msg, f) => {
  const now = performance.now()
  f()
  const time = performance.now() - now
  console.log(msg)
  console.log('total time ms: ', Math.round(time))
}

const directRead = () => {

  let a = 0
  let o = { a: 1, b: 1, c: 1, d: 1, e: 1 }

  for (let i = 0; i < COUNT; i++) {
    a += o.a
    a += o.b
    a += o.c
    a += o.d
    a += o.e
  }
}

const directWrite = () => {

  let o = { a: 1, b: 1, c: 1, d: 1, e: 1 }

  for (let i = 0; i < COUNT; i++) {
    o.a = i
    o.b = i
    o.c = i
    o.d = i
    o.e = i
  }
}

const functionRead = () => {

  let a = 0
  let o = {
    a: 1, b: 1, c: 1, d: 1, e: 1,
    getA() {
      return this.a
    },
    getB() {
      return this.b
    },
    getC() {
      return this.c
    },
    getD() {
      return this.d
    },
    getE() {
      return this.e
    }
  }

  for (let i = 0; i < COUNT; i++) {
    a += o.getA()
    a += o.getB()
    a += o.getC()
    a += o.getD()
    a += o.getE()
  }
}

const functionWrite = () => {

  let o = {
    a: 1, b: 1, c: 1, d: 1, e: 1,
    setA(v) {
      this.a = v
    },
    setB(v) {
      this.b = v
    },
    setC(v) {
      this.c = v
    },
    setD(v) {
      this.d = v
    },
    setE(v) {
      this.e = v
    }
  }

  for (let i = 0; i < COUNT; i++) {
    o.setA(i)
    o.setB(i)
    o.setC(i)
    o.setD(i)
    o.setE(i)
  }
}

// regular class with own property
class Test {
  private _a
  private _b
  private _c
  private _d
  private _e
  constructor() {
    this._a = 0
    this._b = 0
    this._c = 0
    this._d = 0
    this._e = 0
  }
  get a() {
    return this._a
  }
  set a(v) {
    this._a = v
  }
  get b() {
    return this._b
  }
  set b(v) {
    this._b = v
  }
  get c() {
    return this._c
  }
  set c(v) {
    this._c = v
  }
  get d() {
    return this._d
  }
  set d(v) {
    this._d = v
  }
  get e() {
    return this._e
  }
  set e(v) {
    this._e = v
  }
}

const getter = () => {

  let a = 0
  let o = new Test()

  for (let i = 0; i < COUNT; i++) {
    a += o.a
    a += o.b
    a += o.c
    a += o.d
    a += o.e
  }
}

const setter = () => {

  let o = new Test()

  for (let i = 0; i < COUNT; i++) {
    o.a = i
    o.b = i
    o.c = i
    o.d = i
    o.e = i
  }
}

measure('direct read', directRead)
measure('direct write', directWrite)
measure('function read', functionRead)
measure('function write', functionWrite)
measure('class getter', getter)
measure('class setter', setter)
