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