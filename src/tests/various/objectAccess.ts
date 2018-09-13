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
  let o = { a: 1 }

  for (let i = 0; i < COUNT; i++) {
    a += o.a
  }
}


const directWrite = () => {

  let o = { a: 1 }

  for (let i = 0; i < COUNT; i++) {
    o.a = i
  }
}


const functionRead = () => {

  let a = 0
  let o = {
    a: 1,
    getA() {
      return this.a
    }
  }

  for (let i = 0; i < COUNT; i++) {
    a += o.getA()
  }
}


const functionWrite = () => {

  let o = {
    a: 1,
    setA(v) {
      this.a = v
    }
  }

  for (let i = 0; i < COUNT; i++) {
    o.setA(i)
  }
}

// regular class with own property
class Test {
  private _a
  constructor() {
    this._a = 0
  }
  get a() {
    return this._a
  }
  set a(v) {
    this._a = v
  }
}

const makeTest = () => {
  var _a = 0
  class Test2 {
    get a() {
      return _a
    }
    set a(v) {
      _a = v
    }
  }
  return new Test2()
}

const getter = () => {

  let a = 0
  let o = new Test()

  for (let i = 0; i < COUNT; i++) {
    a += o.a
  }
}

const setter = () => {

  let o = new Test()

  for (let i = 0; i < COUNT; i++) {
    o.a = i
  }
}

const getterClosure = () => {

  let a = 0
  let o = makeTest()

  for (let i = 0; i < COUNT; i++) {
    a += o.a
  }
}

const setterClosure = () => {

  let o = makeTest()

  for (let i = 0; i < COUNT; i++) {
    o.a = i
  }
}

measure('direct read', directRead)
measure('direct write', directWrite)
measure('function read', functionRead)
measure('function write', functionWrite)
measure('getter', getter)
measure('setter', setter)
measure('getterClosure', getterClosure)
measure('setterClosure', setterClosure)
