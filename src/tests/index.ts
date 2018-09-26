import test from 'tape'
import * as _ from 'lodash'
import { MsgType, types } from './fixtures'
import { Bendec, invertLookup, asciiReader, asciiWriter } from '../'
import { BufferWrapper, BufferBox } from '../types'

// lets override readers and writers so we can deal with ascii
const readers = { 'char[]': asciiReader }
const writers = { 'char[]': asciiWriter }

interface Uri {
  protocol: string
  host: string
  port: number
}

interface User {
  firstName: string
  lastName: string
  age: number
  uri: Uri
}

interface Header {
  msgType: number
}

interface UserAdd {
  header: Header
  user: User
}

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

test('Bendec test', t => {

  const encodedUser = bendec.encode(userAdd)
  const decodedUser = bendec.decode(encodedUser)

  t.equal(encodedUser.length, 78, 'UserAdd buffer length')
  t.deepEqual(userAdd, decodedUser, 'UserAdd encode / decode')

  const encodedGroup = bendec.encode(group)

  const groupLength = 394
  t.equal(encodedGroup.length, groupLength, 'Group buffer length')

  const decodedGroup = bendec.decode(encodedGroup)
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

  const encoded = bendec.encode(partialUserAdd)
  const decoded = bendec.decode(encoded)

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

  let bufferBox = userAdd.getBuffer()

  let decoded = bendec.decode(buffer)

  t.deepEqual({
    header: {
      msgType: MsgType.USER_ADD
    },
    user
  }, decoded)

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

  let decoded = bendec.decode(buffer)

  t.deepEqual({
    header: {
      msgType: MsgType.USER_ADD
    },
    user
  }, decoded)

  t.end()
})

