import { performance } from 'perf_hooks'

type BigInt = number
declare const BigInt: typeof Number

const measure = (msg, f) => {
  const now = performance.now()
  f()
  const time = performance.now() - now
  console.log(msg)
  console.log('total time ms: ', Math.round(time))
}

function toBigInt(buf: Buffer): any {
  const reversed = Buffer.from(buf)
  reversed.reverse()
  const hex = reversed.toString('hex')
  if (hex.length === 0) {
    return BigInt(0)
  }
  return BigInt(`0x${hex}`)
}

function toBigInt2(buf: Buffer): any {
  const reversed = Buffer.from(buf)
  reversed.reverse()
  return reversed.reduce((n, d) => {
    return (n << BigInt(8)) | BigInt(d)
  }, BigInt(0))
}

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7])
const COUNT = 1e6

const one = () => {
  for (let i = 0; i < COUNT; i ++) {
    toBigInt(buf)
  }
}

const two = () => {
  for (let i = 0; i < COUNT; i ++) {
    toBigInt2(buf)
  }
}

measure('one', one)
measure('two', two)

console.log(toBigInt(buf))
console.log(toBigInt2(buf))
