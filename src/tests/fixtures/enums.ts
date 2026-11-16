import { TypeDefinition, EnumVariant } from "../..";

export const enums: TypeDefinition[] = [
  { name: 'u8', size: 1 },
  {
    // Enum definition
    name: 'Foo',
    underlying: 'u8',
    variants: [
      ['Variant1', 1],
      ['Variant2', 2],
      ['Variant3', 3],
    ] as EnumVariant[]
  }, {
    // Enum field
    name: 'Bar',
    fields: [{
      name: 'int',
      type: 'u8'
    }, {
      name: 'foo',
      type: 'Foo'
    }]
  }]

