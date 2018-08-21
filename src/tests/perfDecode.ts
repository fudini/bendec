import { performance } from 'perf_hooks'
import { types, largeMessage, largeMessageEncoded, getVariant } from './fixtures'
import { Bender,  invertLookup } from '../'

const bender = new Bender({ types, getVariant })

const COUNT = 1e6

console.log('DECODE')

const now = performance.now()

for (let i = 0; i < COUNT; i ++) {
  bender.decode(largeMessageEncoded)
}

const time = performance.now() - now

console.log('count:   ', COUNT)
console.log('total time ms: ', Math.round(time))
console.log('msg / s: ', Math.round(COUNT / time * 1e3))
