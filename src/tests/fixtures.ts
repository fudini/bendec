import { invertLookup, EnumVariant } from '../'
import { TypeDefinition } from '../types'

const MsgType = {
  HEADER: 0,
  USER_ADD: 1,
  GROUP: 2,
  CUSTOMER_ADD: 20,
  LARGE_MESSAGE: 100
}

const types: TypeDefinition[] = [
  {name: 'u8', size: 1},
  {name: 'u16', size: 2},
  {name: 'u32', size: 4},
  {name: 'char', alias: 'u8'},
  {name: 'Age', alias: 'u8'},
  {
    name: 'Header',
    desc: 'struct description',
    fields: [{
      name: 'msgType',
      desc: 'field description',
      type: 'u8',
    }]
  }, {
    name: 'Uri',
    fields: [{
      name: 'protocol',
      type: 'char',
      length: 10 
    }, {
      name: 'host',
      type: 'char',
      length: 32
    }, {
      name: 'port',
      type: 'u16'
    }]
  },
  // has alias and custom type with nested alias
  {
    name: 'User',
    fields: [{
      name: 'firstName',
      type: 'char',
      length: 16
    }, {
      name: 'lastName',
      type: 'char',
      length: 16
    }, {
      name: 'uri',
      type: 'Uri'
    }, {
      name: 'age',
      type: 'Age'
    }]
  }, {
    // added custom fixed size array
    name: 'UserExtra',
    fields: [{
      name: 'firstName',
      type: 'char',
      length: 16
    }, {
      name: 'lastName',
      type: 'char',
      length: 16
    }, {
      name: 'uri',
      type: 'Uri'
    }, {
      name: 'age',
      type: 'Age'
    }, {
      name: 'uris',
      type: 'Uri',
      length: 4
    }]
  }, {
    name: 'UserAdd',
    fields: [{
      name: 'header',
      type: 'Header'
    }, {
      name: 'user',
      type: 'User'
    }]
  }, {
    name: 'CustomerAdd',
    alias: 'UserAdd'
  }, {
    name: 'Group',
    fields: [{
      name: 'header',
      type: 'Header'
    }, {
      name: 'ints',
      type: 'u8',
      length: 8
    }, {
      name: 'users',
      type: 'User',
      length: 5
    }]
  }, {
    name: 'Price',
    alias: 'u32'
  }, {
    name: 'Person',
    fields: [{
      name: 'a',
      type: 'u16'
    }, {
      name: 'b',
      type: 'u32'
    }, {
      name: 'c',
      type: 'u32'
    }, {
      name: 'd',
      type: 'u8'
    }]
  }, {
    name: 'LargeMessage',
    fields: [{
      name: 'header',
      type: 'Header'
    }, {
      name: 'person1',
      type: 'Person'
    }, {
      name: 'person2',
      type: 'Person'
    }, {
      name: 'aaa',
      type: 'u32'
    }, {
      name: 'bbb',
      type: 'Price'
    }, {
      name: 'ccc',
      type: 'u32'
    }, {
      name: 'ddd',
      type: 'u32'
    }, {
      name: 'eee',
      type: 'u32'
    }, {
      name: 'fff',
      type: 'u8'
    }, {
      name: 'ggg',
      type: 'u8'
    }, {
      name: 'name1',
      type: 'char',
      length: 64
    }, {
      name: 'name2',
      type: 'char',
      length: 64
    }, {
      name: 'name3',
      type: 'char',
      length: 64
    }, {
      name: 'name4',
      type: 'char',
      length: 64
    }]
  }
]

const enums: TypeDefinition[] = [
  {name: 'u8', size: 1},
{
  // Enum definition
  name: 'Foo',
  underlying: 'u8',
  variants: [
    ['variant1', 1],
    ['variant2', 2],
    ['variant3', 3],
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

const unions: TypeDefinition[] = [
  {name: 'u8', size: 1},
  {name: 'u16', size: 2},
{
  name: 'AnimalKind',
  underlying: 'u16',
  offset: "0x1000",
  variants: [['Zebra', 1], ['Toucan', 2]]
}, {
  name: 'Zebra',
  fields: [{
    name: 'kind',
    type: 'AnimalKind'
  }, {
    name: 'legs',
    type: 'u8'
  }]
}, {
  name: 'Toucan',
  fields: [{
    name: 'kind',
    type: 'AnimalKind'
  }, {
    name: 'wingspan',
    type: 'u16'
  }]
}, {
  name: 'Animal',
  members: ['Zebra', 'Toucan'],
  discriminator: ['kind']
}, {
  name: 'AnimalKind2',
  underlying: 'u8',
  variants: [['Zebra2', 1], ['Toucan2', 2]]
}, {
  name: 'Header',
  fields: [{
    name: 'animalKind',
    type: 'AnimalKind2'
  }]
}, {
  name: 'Zebra2',
  fields: [{
    name: 'header',
    type: 'Header'
  }, {
    name: 'legs',
    type: 'u8'
  }]
}, {
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
  name: 'Animal2',
  members: ['Zebra2', 'Toucan2'],
  discriminator: ['header', 'animalKind']
}]

const largeMessage = {
  header: {
    msgType: 100
  },
  person1: {
    a: 1,
    b: 1,
    c: 123,
    d: 1
  },
  person2: {
    a: 1,
    b: 1,
    c: 123,
    d: 1
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
  name4: "oiuoiuoiuoiuoiuoiuoiuoiuoiu"
}

const largeMessage2 = Object.assign({}, largeMessage, {
  name1: Buffer.from('hello', 'ascii'),
  name2: Buffer.from('qwerqwerqwerqwerqwerqwerqewr', 'ascii'),
  name3: Buffer.from('asdfasdfasdfasdfasdfadsfasdf', 'ascii'),
  name4: Buffer.from('oiuoiuoiuoiuoiuoiuoiuoiuoiu', 'ascii')
})

const largeMessageEncoded = Buffer.from([100,1,0,1,0,0,0,123,0,0,0,1,1,0,1,0,0,0,123,0,0,0,1,160,134,1,0,70,97,188,0,100,0,0,0,1,0,0,0,2,0,0,0,3,4,104,101,108,108,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,113,119,101,114,113,119,101,114,113,119,101,114,113,119,101,114,113,119,101,114,113,119,101,114,113,101,119,114,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,115,100,102,97,115,100,102,97,115,100,102,97,115,100,102,97,115,100,102,97,100,115,102,97,115,100,102,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,111,105,117,111,105,117,111,105,117,111,105,117,111,105,117,111,105,117,111,105,117,111,105,117,111,105,117,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])

const lookup = invertLookup(MsgType)
const getVariant = {
  encode: message => lookup[message.header.msgType],
  decode: buffer => lookup[buffer.readUInt8()]
}

export {
  MsgType,
  types,
  largeMessage,
  largeMessage2,
  largeMessageEncoded,
  getVariant,
  enums,
  unions,
}
