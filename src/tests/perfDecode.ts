import { performance } from 'perf_hooks'
import { types, largeMessage, largeMessageEncoded, getVariant } from './fixtures'
import { Bendec,  invertLookup, fastReaders, fastWriters } from '../'

const bendec = new Bendec({ types, getVariant })

const COUNT = 1e7

console.log('DECODE')

const now = performance.now()

for (let i = 0; i < COUNT; i ++) {
  bendec.decodeAs(largeMessageEncoded, 'LargeMessage')
}

const time = performance.now() - now

console.log('count:   ', COUNT)
console.log('total time ms: ', Math.round(time))
console.log('msg / s: ', Math.round(COUNT / time * 1e3))

const bendec2 = new Bendec({ types, getVariant, readers: fastReaders, writers: fastWriters })

console.log('DECODE FAST')

const now2 = performance.now()

for (let i = 0; i < COUNT; i ++) {
  bendec.decodeAs(largeMessageEncoded, 'LargeMessage')
}

const time2 = performance.now() - now2

console.log('count:   ', COUNT)
console.log('total time ms: ', Math.round(time2))
console.log('msg / s: ', Math.round(COUNT / time2 * 1e3))

