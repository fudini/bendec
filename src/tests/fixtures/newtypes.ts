import { TypeDefinition, Kind } from "../..";

export const newtypes: TypeDefinition[] = [{
  kind: Kind.Primitive,
  name: 'u8',
  size: 1
}, {
  kind: Kind.Alias,
  name: 'Public',
  description: 'Public description',
  alias: 'u8'
}, {
  kind: Kind.Alias,
  name: 'WithNew',
  description: 'Generated description',
  alias: 'u8'
}, {
  kind: Kind.Alias,
  name: 'WithDeref',
  description: 'Generated description',
  alias: 'u8'
}, {
  kind: Kind.Alias,
  name: 'WithIntoInner',
  description: 'Generated description',
  alias: 'u8'
}, {
  kind: Kind.Alias,
  name: 'WithAsInner',
  description: 'Generated description',
  alias: 'u8'
}, {
  kind: Kind.Alias,
  name: 'InPath',
  description: 'InPath description',
  alias: 'u8'
}, {
  kind: Kind.Alias,
  name: 'InCrate',
  description: 'InCrate description',
  alias: 'u8'
}, {
  // The Array can also be promoted to a newtype
  kind: Kind.Array,
  name: 'FooArray',
  type: 'u8',
  length: 10,
}]

