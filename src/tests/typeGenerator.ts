import test from 'tape'

import { generateString } from '../tools/typeGenerator'
import { types } from './fixtures'

test('fixtures without namespace', t => {
  const result = generateString(types, { namespace: null })
  t.equals(result, `
export type u8 = number

export type u16 = number

export type u32 = number

export type char = u8

export type Age = u8

export interface Header {
  msgType: u8
}

export interface Uri {
  protocol: Buffer
  host: Buffer
  port: u16
}

export interface User {
  firstName: Buffer
  lastName: Buffer
  uri: Uri
  age: Age
}

export interface UserExtra {
  firstName: Buffer
  lastName: Buffer
  uri: Uri
  age: Age
  uris: Uri[]
}

export interface UserAdd {
  header: Header
  user: User
}

export type CustomerAdd = UserAdd

export interface Group {
  header: Header
  ints: u8[]
  users: User[]
}

export type Price = u32

export interface Person {
  a: u16
  b: u32
  c: u32
  d: u8
}

export interface LargeMessage {
  header: Header
  person1: Person
  person2: Person
  aaa: u32
  bbb: Price
  ccc: u32
  ddd: u32
  eee: u32
  fff: u8
  ggg: u8
  name1: Buffer
  name2: Buffer
  name3: Buffer
  name4: Buffer
}
  `.trim())

  t.end()
})

test('custom type mapping', t => {
  const types = [{name: 'u64', size: 8}]
  const typeMapping = {'u64': 'bigint'}
  const without = generateString(types, { namespace: null })
  const withMapping = generateString(types, { typeMapping, namespace: null })

  t.equals(without, `export type u64 = number`.trim())
  t.equals(withMapping, `export type u64 = bigint`.trim())

  t.end()
})