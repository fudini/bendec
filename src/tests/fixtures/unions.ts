import { TypeDefinition, Kind, EnumVariant } from "../..";

export const unions: TypeDefinition[] = [{
  kind: Kind.Primitive,
  name: 'u8',
  size: 1
}, {
  kind: Kind.Primitive,
  name: 'u16',
  size: 2
}, {
  kind: Kind.Enum,
  name: 'AnimalKind',
  underlying: 'u16',
  offset: "0x1000",
  variants: [['Zebra', 1, "This is a zebra"], ['Toucan', 2]]
}, {
  kind: Kind.Struct,
  name: 'Zebra',
  fields: [{
    name: 'kind',
    type: 'AnimalKind'
  }, {
    name: 'legs',
    type: 'u8'
  }]
}, {
  kind: Kind.Struct,
  name: 'Toucan',
  fields: [{
    name: 'kind',
    type: 'AnimalKind'
  }, {
    name: 'wingspan',
    type: 'u16'
  }]
}, {
  kind: Kind.Union,
  name: 'Animal',
  members: ['Zebra', 'Toucan'],
  discriminator: ['kind']
}, {
  kind: Kind.Enum,
  name: 'AnimalKind2',
  underlying: 'u8',
  variants: [['Zebra2', 1], ['Toucan2', 2]]
}, {
  kind: Kind.Struct,
  name: 'Header',
  fields: [{
    name: 'animalKind',
    type: 'AnimalKind2'
  }]
}, {
  kind: Kind.Struct,
  name: 'Zebra2',
  fields: [{
    name: 'header',
    type: 'Header'
  }, {
    name: 'legs',
    type: 'u8'
  }]
}, {
  kind: Kind.Struct,
  name: 'Toucan2',
  fields: [{
    name: 'header',
    type: 'Header'
  }, {
    name: 'wingspan',
    type: 'u16'
  }]
}, {
  // union with nested discriminator
  kind: Kind.Union,
  name: 'Animal2',
  members: ['Zebra2', 'Toucan2'],
  discriminator: ['header', 'animalKind']
}, {
  // Enum bitflags
  name: 'Bitflags',
  underlying: 'u8',
  bitflags: true,
  variants: [
    ['A', 0b0001],
    ['B', 0b0010],
    ['Long', 0b0100],
  ] as EnumVariant[]
}]
