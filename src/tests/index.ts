import test from 'tape'
import * as _ from 'lodash'
import { MsgType, types, enums, unions, arrays } from './fixtures'
import {
  Bendec,
  invertLookup,
  fastReaders,
  fastWriters,
  asciiReader,
  asciiWriter,
} from '../'
import { BufferWrapper } from '../types'
import { Zebra, Zebra2, AnimalKind, AnimalKind2 } from './generated/ts/unionsEnums'
import { Uri, User, Header, UserAdd } from './types'

// lets override readers and writers so we can deal with ascii
const readers = { 'char[]': asciiReader }
const writers = { 'char[]': asciiWriter }


const user: User = {
  firstName: 'Genezyp',
  lastName: 'Bazakbal',
  age: 45,
  uri: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 666
  }
}

const userAdd: UserAdd = {
  header: {
    msgType: MsgType.USER_ADD,
  },
  user
}

const emptyUser = {
  firstName: '',
  lastName: '',
  age: 0,
  uri: {
    protocol: '',
    host: '',
    port: 0
  }
}

const group = {
  header: {
    msgType: MsgType.GROUP
  },
  ints: [1, 2, 3],
  users: [user, user]
}

const groupResult = {
  header: {
    msgType: MsgType.GROUP
  },
  // pad with zeros
  ints: [1, 2, 3, 0, 0, 0, 0, 0],
  // pad with empty users
  users: [user, user, emptyUser, emptyUser, emptyUser]
}

const lookup = invertLookup(MsgType)

const getVariant = {
  encode: message => lookup[message.header.msgType],
  decode: buffer => lookup[buffer.readUInt8()]
}

const bendec = new Bendec<any>({ types, getVariant, readers, writers })

const allFastReaders = { ...fastReaders, ...readers }
const allFastWriters = { ...fastWriters, ...writers }

const bendec2 = new Bendec<any>({
  types,
  getVariant,
  readers: allFastReaders,
  writers: allFastWriters
})

test('Bendec test', t => {

  const encodedUser = bendec.encodeAs(userAdd, 'UserAdd')
  const decodedUser = bendec.decodeAs(encodedUser, 'UserAdd')

  t.equal(encodedUser.length, 78, 'UserAdd buffer length')
  t.deepEqual(userAdd, decodedUser, 'UserAdd encode / decode')

  const encodedGroup = bendec.encodeAs(group, 'Group')

  const groupLength = 394
  t.equal(encodedGroup.length, groupLength, 'Group buffer length')

  const decodedGroup = bendec.decodeAs(encodedGroup, 'Group')
  t.deepEqual(decodedGroup, groupResult, 'Group encode / decode')

  t.end()
})

test('Bendec write zeroes', t => {

  const partialUser = {
    firstName: 'Donkey',
    lastName: 'Kong',
    age: 56
  }

  const partialUserAdd = {
    header: {
      msgType: MsgType.USER_ADD
    },
    user: partialUser
  }

  const partialUserDecoded = {
    firstName: 'Donkey',
    lastName: 'Kong',
    age: 56,
    uri: {
      protocol: '',
      host: '',
      port: 0
    }
  }

  const partialUserAddDecoded = {
    header: {
      msgType: MsgType.USER_ADD,
    },
    user: partialUserDecoded
  }

  const encoded = bendec.encodeAs(partialUserAdd, 'UserAdd')
  const decoded = bendec.decodeAs(encoded, 'UserAdd')

  t.deepEqual(partialUserAddDecoded, decoded, 'Object with empty property')
  t.end()
})

test('Bendec wrapper', t => {

  let size = bendec.getSize('UserAdd')
  let buffer = Buffer.alloc(size)

  let userAdd: BufferWrapper<UserAdd> = bendec.wrap('UserAdd', buffer)

  let user: User = {
    firstName: 'genezyp',
    lastName: 'bazakbal',
    age: 255,
    uri: {
      protocol: 'aabbaabbaa',
      host: '1122334455',
      port: 123
    }
  }

  userAdd.header.msgType = MsgType.USER_ADD
  userAdd.user.firstName = 'genezyp'
  userAdd.user.lastName = 'bazakbal' 
  userAdd.user.age = 255
  userAdd.user.uri.protocol = 'aabbaabbaa'
  userAdd.user.uri.host = '1122334455'
  userAdd.user.uri.port = 123

  let typedBuffer = userAdd.getBuffer()

  let decoded = bendec.decodeAs(typedBuffer, 'UserAdd')

  t.deepEqual({
    header: {
      msgType: MsgType.USER_ADD
    },
    user
  }, decoded)

  t.end()
})

test('Bendec wrapper slice', t => {

  let size = bendec.getSize('UserAdd')
  let buffer = Buffer.alloc(size)

  let userAdd: BufferWrapper<UserAdd> = bendec.wrap('UserAdd', buffer)

  userAdd.user.uri.protocol = 'https'
  userAdd.user.uri.host = '127.0.0.1'
  userAdd.user.uri.port = 666

  let bufferSlice: Buffer = (<any>userAdd.user.uri).getBuffer()

  t.deepEqual(
    [...bufferSlice],
    [...bendec.encodeAs(user.uri, 'Uri')],
    'Uri slice read / encode'
  )

  t.end()
})

test('Bendec wrapper 2', t => {

  let size = bendec.getSize('UserAdd')
  let buffer = Buffer.alloc(size)

  let userAdd = bendec.wrap2('UserAdd', buffer)

  let user = {
    firstName: 'genezyp',
    lastName: 'bazakbal',
    age: 255,
    uri: {
      protocol: 'aabbaabbaa',
      host: '1122334455',
      port: 123
    }
  }

  userAdd.set_header_msgType(MsgType.USER_ADD)
  userAdd.set_user_firstName('genezyp')
  userAdd.set_user_lastName('bazakbal' )
  userAdd.set_user_age(255)
  userAdd.set_user_uri_protocol('aabbaabbaa')
  userAdd.set_user_uri_host('1122334455')
  userAdd.set_user_uri_port(123)

  let decoded = bendec.decodeAs(buffer, 'UserAdd')

  t.deepEqual({
    header: {
      msgType: MsgType.USER_ADD
    },
    user
  }, decoded)

  t.end()
})

test('Bendec fast readers / writers test', t => {

  const encodedUser = bendec2.encodeAs(userAdd, 'UserAdd')
  const decodedUser = bendec2.decodeAs(encodedUser, 'UserAdd')

  t.equal(encodedUser.length, 78, 'UserAdd buffer length')
  t.deepEqual(userAdd, decodedUser, 'UserAdd encode / decode')

  const encodedGroup = bendec2.encodeAs(group, 'Group')

  const groupLength = 394
  t.equal(encodedGroup.length, groupLength, 'Group buffer length')

  const decodedGroup = bendec2.decodeAs(encodedGroup, 'Group')
  t.deepEqual(decodedGroup, groupResult, 'Group encode / decode')

  t.end()
})

test('Bendec enums', t => {

  const bendec3 = new Bendec<any>({ types: enums, getVariant, readers, writers })
  const size = bendec3.getSize('Foo')
  t.equals(size, 1, 'underlying type size')
  const buffer = bendec3.encodeAs({ int: 1, foo: 2 }, 'Bar')
  t.deepEqual([...buffer], [1, 2])
  t.end()
})

test('Bendec union size', t => {

  const b = new Bendec<any>({ types: unions, readers, writers })

  const sizeZebra = b.getSize('Zebra')
  const sizeToucan = b.getSize('Toucan')
  const sizeAnimal = b.getSize('Animal')

  t.equals(sizeZebra, 3)
  t.equals(sizeToucan, 4)
  t.equals(sizeAnimal, sizeToucan, 'the biggest member is the size of the union')

  t.end()
})

test('Bendec union encodeAs / decodeAs simple path', t => {

  const b = new Bendec<any>({ types: unions, readers, writers })

  const zebra: Zebra = {
    kind: AnimalKind.Zebra,
    legs: 4
  }

  const encodedZebra = b.encodeAs(zebra, 'Zebra')
  const decodedAnimal = b.decodeAs(encodedZebra, 'Animal')

  t.deepEqual(zebra, decodedAnimal)

  const encodedAnimal = b.encodeAs(zebra, 'Animal')
  const decodedZebra = b.decodeAs(encodedZebra, 'Animal')

  t.deepEqual(decodedAnimal, decodedZebra)
  t.end()
})

test('Bendec union encodeAs / decodeAs nested path', t => {

  const b = new Bendec<any>({ types: unions, readers, writers })

  const zebra: Zebra2 = {
    header: {
      animalKind: AnimalKind2.Zebra2,
    },
    legs: 4
  }

  const encodedZebra = b.encodeAs(zebra, 'Zebra2')
  const decodedAnimal = b.decodeAs(encodedZebra, 'Animal2')

  t.deepEqual(zebra, decodedAnimal)

  const decodedZebra = b.decodeAs(encodedZebra, 'Animal2')

  t.deepEqual(decodedAnimal, decodedZebra)
  t.end()
})

test('Bendec show error in case of missing types', t => {

  const b = new Bendec<any>({ types: unions, readers, writers })

  const typeName = 'NonExistingType'

  t.throws(() => b.decodeAs(Buffer.from([]), typeName), typeName)
  t.throws(() => b.encodeAs({}, typeName), typeName)

  t.end()
})

test('Arrays and array alias', t => {

  const b = new Bendec<any>({ types: arrays, readers, writers })

  const foo = {
    id1: [
      { one: 1, two: 2 },
      { one: 3, two: 4 },
      { one: 5, two: 6 }
    ],
    id2: [
      { one: 7, two: 8 },
      { one: 9, two: 10 },
      { one: 11, two: 12 }
    ],
    id3: 'abc',
    id4: 'def',
    id5: 'ghi',
    id6: 'hjk',
  }

  const encoded = b.encodeAs(foo, 'Foo')
  const decoded = b.decodeAs(encoded, 'Foo')
  t.deepEqual(foo, decoded)
  t.end()
})

require('./typeGenerator')
require('./imports')
require('./auto-from')
require('./javaGeneratorTest')
