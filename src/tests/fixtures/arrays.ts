import { TypeDefinition, Kind } from "../..";

export const arrays: TypeDefinition[] = [{
  kind: Kind.Primitive,
  name: 'u8',
  size: 1
}, {
  kind: Kind.Alias,
  name: 'char',
  alias: 'u8'
}, {
  kind: Kind.Array,
  name: 'Char3',
  type: 'char',
  length: 3
}, {
  kind: Kind.Array,
  name: 'BigArray',
  type: 'char',
  length: 128
}, {
  kind: Kind.Array,
  name: 'BigArrayNewtype',
  type: 'char',
  length: 128
}, {
  kind: Kind.Struct,
  name: 'Test',
  fields: [{
    name: 'one',
    type: 'u8'
  }, {
    name: 'two',
    type: 'u8'
  }],
}, {
  kind: Kind.Array,
  name: 'Test3',
  type: 'Test',
  length: 3
}, {
  kind: Kind.Alias,
  name: 'Ident',
  alias: 'Test3'
}, {
  kind: Kind.Struct,
  name: 'Foo',
  description: 'This is the description of the struct Foo',
  fields: [{
    name: 'id1', // alias to array of structs
    type: 'Ident'
  }, {
    name: 'id2',
    type: 'Test3', // array of structs
  }, {
    name: 'id3',
    type: 'Char3', // array of chars
  }, {
    name: 'id4', // old way of specifying field length
    type: 'char',
    length: 3
  }, {
    name: 'id5',
    type: 'BigArray'
  }, {
    name: 'id6',
    type: 'BigArrayNewtype'
  }]
}]

