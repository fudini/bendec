import { invertLookup, EnumVariant } from "../";
import { Kind, TypeDefinition } from "../types";

// TODO: Split this file
const MsgType = {
  HEADER: 0,
  USER_ADD: 1,
  GROUP: 2,
  CUSTOMER_ADD: 20,
  LARGE_MESSAGE: 100,
};

const types: TypeDefinition[] = [
  { name: "u8", size: 1 },
  { name: "u16", size: 2 },
  { name: "u32", size: 4 },
  { name: "char", alias: "u8" },
  { name: "Age", alias: "u8" },
  {
    name: "Header",
    desc: "struct description",
    fields: [
      {
        name: "msgType",
        desc: "field description",
        type: "u8",
      },
    ],
  },
  {
    name: "Uri",
    fields: [
      {
        name: "protocol",
        type: "char",
        length: 10,
      },
      {
        name: "host",
        type: "char",
        length: 32,
      },
      {
        name: "port",
        type: "u16",
      },
    ],
  },
  {
    name: "Login",
    fields: [
      {
        name: "header",
        type: "Header",
      },
      {
        name: "connectionId",
        type: "u16",
      },
      {
        name: "token",
        type: "char",
        length: 8,
      },
    ],
  },
  // has alias and custom type with nested alias
  {
    name: "User",
    fields: [
      {
        name: "firstName",
        type: "char",
        length: 16,
      },
      {
        name: "lastName",
        type: "char",
        length: 16,
      },
      {
        name: "uri",
        type: "Uri",
      },
      {
        name: "age",
        type: "Age",
      },
    ],
  },
  {
    // added custom fixed size array
    name: "UserExtra",
    fields: [
      {
        name: "firstName",
        type: "char",
        length: 16,
      },
      {
        name: "lastName",
        type: "char",
        length: 16,
      },
      {
        name: "uri",
        type: "Uri",
      },
      {
        name: "age",
        type: "Age",
      },
      {
        name: "uris",
        type: "Uri",
        length: 4,
      },
    ],
  },
  {
    name: "UserAdd",
    fields: [
      {
        name: "header",
        type: "Header",
      },
      {
        name: "user",
        type: "User",
      },
    ],
  },
  {
    name: "CustomerAdd",
    alias: "UserAdd",
  },
  {
    name: "Group",
    fields: [
      {
        name: "header",
        type: "Header",
      },
      {
        name: "ints",
        type: "u8",
        length: 8,
      },
      {
        name: "users",
        type: "User",
        length: 5,
      },
    ],
  },
  {
    name: "Price",
    alias: "u32",
  },
  {
    name: "Person",
    fields: [
      {
        name: "a",
        type: "u16",
      },
      {
        name: "b",
        type: "u32",
      },
      {
        name: "c",
        type: "u32",
      },
      {
        name: "d",
        type: "u8",
      },
    ],
  },
  {
    name: "LargeMessage",
    fields: [
      {
        name: "header",
        type: "Header",
      },
      {
        name: "person1",
        type: "Person",
      },
      {
        name: "person2",
        type: "Person",
      },
      {
        name: "aaa",
        type: "u32",
      },
      {
        name: "bbb",
        type: "Price",
      },
      {
        name: "ccc",
        type: "u32",
      },
      {
        name: "ddd",
        type: "u32",
      },
      {
        name: "eee",
        type: "u32",
      },
      {
        name: "fff",
        type: "u8",
      },
      {
        name: "ggg",
        type: "u8",
      },
      {
        name: "name1",
        type: "char",
        length: 64,
      },
      {
        name: "name2",
        type: "char",
        length: 64,
      },
      {
        name: "name3",
        type: "char",
        length: 64,
      },
      {
        name: "name4",
        type: "char",
        length: 64,
      },
    ],
  },
];

const enums: TypeDefinition[] = [
  { name: "u8", size: 1 },
  {
    // Enum definition
    name: "Foo",
    underlying: "u8",
    variants: [
      ["variant1", 1],
      ["variant2", 2],
      ["variant3", 3],
    ] as EnumVariant[],
  },
  {
    // Enum field
    name: "Bar",
    fields: [
      {
        name: "int",
        type: "u8",
      },
      {
        name: "foo",
        type: "Foo",
      },
    ],
  },
];

const unions: TypeDefinition[] = [
  {
    kind: Kind.Primitive,
    name: "u8",
    size: 1,
  },
  {
    kind: Kind.Primitive,
    name: "u16",
    size: 2,
  },
  {
    kind: Kind.Enum,
    name: "AnimalKind",
    underlying: "u16",
    offset: "0x1000",
    variants: [
      ["Zebra", 1],
      ["Toucan", 2],
    ],
  },
  {
    kind: Kind.Struct,
    name: "Zebra",
    fields: [
      {
        name: "kind",
        type: "AnimalKind",
      },
      {
        name: "legs",
        type: "u8",
      },
    ],
  },
  {
    kind: Kind.Struct,
    name: "Toucan",
    fields: [
      {
        name: "kind",
        type: "AnimalKind",
      },
      {
        name: "wingspan",
        type: "u16",
      },
    ],
  },
  {
    kind: Kind.Union,
    name: "Animal",
    members: ["Zebra", "Toucan"],
    discriminator: ["kind"],
  },
  {
    kind: Kind.Enum,
    name: "AnimalKind2",
    underlying: "u8",
    variants: [
      ["Zebra2", 1],
      ["Toucan2", 2],
    ],
  },
  {
    kind: Kind.Struct,
    name: "Header",
    fields: [
      {
        name: "animalKind",
        type: "AnimalKind2",
      },
    ],
  },
  {
    kind: Kind.Struct,
    name: "Zebra2",
    fields: [
      {
        name: "header",
        type: "Header",
      },
      {
        name: "legs",
        type: "u8",
      },
    ],
  },
  {
    kind: Kind.Struct,
    name: "Toucan2",
    fields: [
      {
        name: "header",
        type: "Header",
      },
      {
        name: "wingspan",
        type: "u16",
      },
    ],
  },
  {
    // union with nested discriminator
    kind: Kind.Union,
    name: "Animal2",
    members: ["Zebra2", "Toucan2"],
    discriminator: ["header", "animalKind"],
  },
];

const largeMessage = {
  header: {
    msgType: 100,
  },
  person1: {
    a: 1,
    b: 1,
    c: 123,
    d: 1,
  },
  person2: {
    a: 1,
    b: 1,
    c: 123,
    d: 1,
  },
  aaa: 100000,
  bbb: 12345670,
  ccc: 100,
  ddd: 1,
  eee: 2,
  fff: 3,
  ggg: 4,
  name1: "hello",
  name2: "qwerqwerqwerqwerqwerqwerqewr",
  name3: "asdfasdfasdfasdfasdfadsfasdf",
  name4: "oiuoiuoiuoiuoiuoiuoiuoiuoiu",
};

const largeMessage2 = Object.assign({}, largeMessage, {
  name1: Buffer.from("hello", "ascii"),
  name2: Buffer.from("qwerqwerqwerqwerqwerqwerqewr", "ascii"),
  name3: Buffer.from("asdfasdfasdfasdfasdfadsfasdf", "ascii"),
  name4: Buffer.from("oiuoiuoiuoiuoiuoiuoiuoiuoiu", "ascii"),
});

const arrays: TypeDefinition[] = [
  {
    kind: Kind.Primitive,
    name: "u8",
    size: 1,
  },
  {
    kind: Kind.Alias,
    name: "char",
    alias: "u8",
  },
  {
    kind: Kind.Array,
    name: "Char3",
    type: "char",
    length: 3,
  },
  {
    kind: Kind.Array,
    name: "BigArray",
    type: "char",
    length: 128,
  },
  {
    kind: Kind.Array,
    name: "BigArrayNewtype",
    type: "char",
    length: 128,
  },
  {
    kind: Kind.Struct,
    name: "Test",
    fields: [
      {
        name: "one",
        type: "u8",
      },
      {
        name: "two",
        type: "u8",
      },
    ],
  },
  {
    kind: Kind.Array,
    name: "Test3",
    type: "Test",
    length: 3,
  },
  {
    kind: Kind.Alias,
    name: "Ident",
    alias: "Test3",
  },
  {
    kind: Kind.Struct,
    name: "Foo",
    desc: "This is the description of the struct Foo",
    fields: [
      {
        name: "id1", // alias to array of structs
        type: "Ident",
      },
      {
        name: "id2",
        type: "Test3", // array of structs
      },
      {
        name: "id3",
        type: "Char3", // array of chars
      },
      {
        name: "id4", // old way of specifying field length
        type: "char",
        length: 3,
      },
      {
        name: "id5",
        type: "BigArray",
      },
      {
        name: "id6",
        type: "BigArrayNewtype",
      },
    ],
  },
];

const newtypes: TypeDefinition[] = [
  {
    kind: Kind.Primitive,
    name: "u8",
    size: 1,
  },
  {
    kind: Kind.Alias,
    name: "Public",
    alias: "u8",
  },
  {
    kind: Kind.Alias,
    name: "Generated",
    alias: "u8",
  },
  {
    kind: Kind.Alias,
    name: "InCrate",
    alias: "u8",
  },
  {
    // The Array can also be promoted to a newtype
    kind: Kind.Array,
    name: "FooArray",
    type: "u8",
    length: 10,
  },
];

const camel: TypeDefinition[] = [
  { name: "u8", size: 1 },
  {
    name: "Foo",
    fields: [
      {
        name: "bar",
        type: "u8",
      },
    ],
  },
];

const largeMessageEncoded = Buffer.from([
  100, 1, 0, 1, 0, 0, 0, 123, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 123, 0, 0, 0, 1,
  160, 134, 1, 0, 70, 97, 188, 0, 100, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 4,
  104, 101, 108, 108, 111, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 113, 119, 101, 114, 113, 119,
  101, 114, 113, 119, 101, 114, 113, 119, 101, 114, 113, 119, 101, 114, 113,
  119, 101, 114, 113, 101, 119, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 115,
  100, 102, 97, 115, 100, 102, 97, 115, 100, 102, 97, 115, 100, 102, 97, 115,
  100, 102, 97, 100, 115, 102, 97, 115, 100, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  111, 105, 117, 111, 105, 117, 111, 105, 117, 111, 105, 117, 111, 105, 117,
  111, 105, 117, 111, 105, 117, 111, 105, 117, 111, 105, 117, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
]);

const lookup = invertLookup(MsgType);
const getVariant = {
  encode: (message) => lookup[message.header.msgType],
  decode: (buffer) => lookup[buffer.readUInt8()],
};

export {
  MsgType,
  types,
  largeMessage,
  largeMessage2,
  largeMessageEncoded,
  getVariant,
  enums,
  unions,
  arrays,
  newtypes,
  camel,
};
