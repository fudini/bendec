import test from 'tape'
import {
  Bendec,
  asciiReader,
  asciiWriter,
} from '../'
import { TypeDefinition, Kind } from '../types'
import { MsgType, types, enums, unions } from './fixtures'

const rootTypes: TypeDefinition[] = [
  { name: 'u8', size: 1 },
  {
    name: 'Gender',
    underlying: 'u8',
    variants: [
      ['Male', 1],
      ['Female', 2]
    ]
  }
]

const sharedTypes: TypeDefinition[] = [
  {
    name: 'Request',
    fields: [{
      name: 'from',
      type: 'u8'
    }, {
      name: 'to',
      type: 'u8'
    }]
  },
]

const extraTypes: TypeDefinition[] = [
  {
    name: 'User',
    fields: [{
      name: 'age',
      type: 'u8'
    }, {
      name: 'gender',
      type: 'Gender'
    }]
  }, {
    name: 'Book',
    fields: [{
      name: 'pages',
      type: 'u8'
    }, {
      name: 'request',
      type: 'shared.Request'
    }, {
      name: 'user',
      type: 'User'
    }]
  }
]

enum Gender {
  Male = 1,
  Female = 2,
}

interface User {
  age: number
  gender: Gender
}

interface Book {
  pages: number
  count: number
}

// lets override readers and writers so we can deal with ascii
const readers = { 'char[]': asciiReader }
const writers = { 'char[]': asciiWriter }

test('Bendec test', t => {

  const bendec = new Bendec<any>({ readers, writers })

  bendec.addTypes(rootTypes)
  bendec.addTypes(sharedTypes, 'shared')
  bendec.addTypes(extraTypes, 'extra')

  let user = {
    age: 10,
    gender: Gender.Male,
  }

  let encoded = bendec.encodeAs(user, 'extra.User')
  let decoded = bendec.decodeAs(encoded, 'extra.User')

  t.deepEqual(user, decoded)
  t.end()
})
