import { performance } from 'perf_hooks'
import { types, largeMessage, largeMessage2, getVariant } from './fixtures'
import { Bendec, invertLookup } from '../'
import { measure } from './utils'
import {
  LargeMessageWrap,
  LargeMessageWrapClass,
  LargeMessageWrap2,
  LargeMessageWrap3,
  LargeMessageWrap4,
  LargeMessageWrap5
} from './LargeMessageWrap'

const bendec = new Bendec({ types, getVariant })

const COUNT = 1e6

const encodeClassic = () => {

  const buffer = Buffer.alloc(bendec.getSize('LargeMessage'))
  for (let i = 0; i < COUNT; i ++) {
    bendec.encode(largeMessage2, buffer)
  }
}

const encodeWrapLoop = wrap => {

  for (let i = 0; i < COUNT; i ++) {
    wrap.header.msgType = 100
    let person1 = wrap.person1
    person1.a = 1
    person1.b = 1
    person1.c = 123
    person1.d = 1
    let person2 = wrap.person2
    person2.a = 1
    person2.b = 1
    person2.c = 123
    person2.d = 1
    wrap.aaa = 100000
    wrap.bbb = 12345670
    wrap.ccc = 100
    wrap.ddd = 1
    wrap.eee = 2
    wrap.fff = 3
    wrap.ggg = 4
    wrap.name1 = Buffer.from('hello', 'ascii'),
    wrap.name2 = Buffer.from('qwerqwerqwerqwerqwerqwerqewr', 'ascii'),
    wrap.name3 = Buffer.from('asdfasdfasdfasdfasdfadsfasdf', 'ascii'),
    wrap.name4 = Buffer.from('oiuoiuoiuoiuoiuoiuoiuoiuoiu', 'ascii')
  }

}

const encodeWrapLoopFlat = wrap => {

  for (let i = 0; i < COUNT; i ++) {
    wrap.msgType = 100
    wrap.a = 1
    wrap.b = 1
    wrap.c = 123
    wrap.a2 = 1
    wrap.b2 = 1
    wrap.c2 = 123
    wrap.d2 = 1
    wrap.aaa = 100000
    wrap.bbb = 12345670
    wrap.ccc = 100
    wrap.ddd = 1
    wrap.eee = 2
    wrap.fff = 3
    wrap.ggg = 4
    wrap.name1 = Buffer.from('hello', 'ascii'),
    wrap.name2 = Buffer.from('qwerqwerqwerqwerqwerqwerqewr', 'ascii'),
    wrap.name3 = Buffer.from('asdfasdfasdfasdfasdfadsfasdf', 'ascii'),
    wrap.name4 = Buffer.from('oiuoiuoiuoiuoiuoiuoiuoiuoiu', 'ascii')
  }

}

const encodeWrap1 = () => {

  let buffer = Buffer.alloc(bendec.getSize('LargeMessage'))
  let wrap = bendec.wrap('LargeMessage', buffer)

  encodeWrapLoop(wrap)
}

const encodeWrap2 = () => {

  let buffer = Buffer.alloc(bendec.getSize('LargeMessage'))
  let wrap = LargeMessageWrap(buffer)

  encodeWrapLoop(wrap)
}

const encodeWrap2b = () => {

  let buffer = Buffer.alloc(bendec.getSize('LargeMessage'))
  let wrap = LargeMessageWrap4(buffer)

  encodeWrapLoopFlat(wrap)
}

const encodeWrap2c = () => {

  let buffer = Buffer.alloc(bendec.getSize('LargeMessage'))
  let wrap = LargeMessageWrap5(buffer)

  encodeWrapLoopFlat(wrap)
}

const encodeWrap2d = () => {

  let buffer = Buffer.alloc(bendec.getSize('LargeMessage'))
  let wrap = LargeMessageWrapClass(buffer)

  encodeWrapLoopFlat(wrap)
}


const encodeWrap3 = () => {

  let buffer = Buffer.alloc(bendec.getSize('LargeMessage'))
  let wrap = LargeMessageWrap2(buffer)

  for (let i = 0; i < COUNT; i ++) {
    wrap.msgType(100)
    wrap.a(1)
    wrap.b(1)
    wrap.c(123)
    wrap.d(1)
    wrap.a2(1)
    wrap.b2(1)
    wrap.c2(123)
    wrap.d2(1)
    wrap.aaa(100000)
    wrap.bbb(12345670)
    wrap.ccc(100)
    wrap.ddd(1)
    wrap.eee(2)
    wrap.fff(3)
    wrap.ggg(4)
    wrap.name1(Buffer.from('hello', 'ascii'))
    wrap.name2(Buffer.from('qwerqwerqwerqwerqwerqwerqewr', 'ascii'))
    wrap.name3(Buffer.from('asdfasdfasdfasdfasdfadsfasdf', 'ascii'))
    wrap.name4(Buffer.from('oiuoiuoiuoiuoiuoiuoiuoiuoiu', 'ascii'))
  }
}

const encodeWrap4 = () => {

  let buffer = Buffer.alloc(bendec.getSize('LargeMessage'))
  let wrap = LargeMessageWrap3(buffer)

  for (let i = 0; i < COUNT; i ++) {
    wrap.msgType(100)
    wrap.a(1)
    wrap.b(1)
    wrap.c(123)
    wrap.d(1)
    wrap.a2(1)
    wrap.b2(1)
    wrap.c2(123)
    wrap.d2(1)
    wrap.aaa(100000)
    wrap.bbb(12345670)
    wrap.ccc(100)
    wrap.ddd(1)
    wrap.eee(2)
    wrap.fff(3)
    wrap.ggg(4)
    wrap.name1(Buffer.from('hello', 'ascii'))
    wrap.name2(Buffer.from('qwerqwerqwerqwerqwerqwerqewr', 'ascii'))
    wrap.name3(Buffer.from('asdfasdfasdfasdfasdfadsfasdf', 'ascii'))
    wrap.name4(Buffer.from('oiuoiuoiuoiuoiuoiuoiuoiuoiu', 'ascii'))
  }
}

measure('ENCODE CLASSIC', encodeClassic)
measure('ENCODE WRAP getters / setters', encodeWrap1)
measure('ENCODE WRAP IMPORTED getters / setters', encodeWrap2)
measure('ENCODE WRAP IMPORTED getters / setters FLAT', encodeWrap2b)
measure('ENCODE WRAP IMPORTED getters / setters CLASS FLAT', encodeWrap2c)
measure('ENCODE WRAP IMPORTED getters / setters CLASS', encodeWrap2d)
measure('ENCODE WRAP IMPORTED functions', encodeWrap3)
measure('ENCODE WRAP IMPORTED prototype functions', encodeWrap4)
