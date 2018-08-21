import { performance } from 'perf_hooks'
import { types, largeMessage, largeMessage2, getVariant } from './fixtures'
import { Bender, invertLookup } from '../'

const bender = new Bender({ types, getVariant })

const COUNT = 1e6

console.log('ENCODE')

const now = performance.now()

for (let i = 0; i < COUNT; i ++) {
  bender.encode(largeMessage2)
}

const time = performance.now() - now

console.log('count:   ', COUNT)
console.log('Total time ms: ', Math.round(time))
console.log('msg / s: ', Math.round(COUNT / time * 1e3))

