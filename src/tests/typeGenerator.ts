import test from 'tape'
import { generateString } from '../tools/typeGenerator'
import { types, unions, arrays, newtypes, camel } from './fixtures'
import {
  generateString as generateStringRust,
  NewtypeKind,
  Options,
} from '../tools/rsGenerator'
import { generateString as generateStringCpp } from '../tools/cppGenerator'
import { getFixture, codeEquals, clean } from './utils'
import { EnumVariantStrict } from '../types'

test('TypeScript - custom type mapping', t => {
  const types = [{ name: 'u64', size: 8 }]
  const typeMapping = { u64: 'bigint' }
  const without = generateString(types, { header: false })
  const withMapping = generateString(types, { typeMapping, header: false })

  t.equals(clean(without), `export type u64 = number`)
  t.equals(clean(withMapping), `export type u64 = bigint`)

  t.end()
})

test('TypeScript - unions and enums', t => {
  const cleanedGenerated = clean(generateString(unions))
  const cleanedFixture = clean(getFixture('./generated/ts/unionsEnums.ts'))
  codeEquals(t)(cleanedGenerated, cleanedFixture)
  t.end()
})

test('TypeScript arrays', t => {
  const cleanedGenerated = generateString(arrays)
  const cleanedFixture = getFixture('./generated/ts/arrays.ts')
  codeEquals(t)(cleanedGenerated, cleanedFixture)
  t.end()
})

test('Rust - fixtures', t => {
  const options: Options = {
    defaultDerives: {
      struct: ['Serialize', 'Deserialize', 'Copy']
    },
    extraDerives: {
      'Header': ['Default']
    }
  }

  const generated = generateStringRust(types, options)
  const fixture = getFixture('./generated/rust/fixtures.rs')
  codeEquals(t)(generated, fixture)
  t.end()
})

test('Rust - camel case annotation on structs and extra gen from function', t => {
  const options = {
    camelCase: true,
    forEachType([generated, context, _meta]) {

      if (context.name == 'Foo') {
        return generated + `\n\n// extra code for ${context.name}`
      }

      return generated
    }
  }
  const generated = generateStringRust(camel, options)
  const fixture = getFixture('./generated/rust/camel.rs')
  codeEquals(t)(generated, fixture)
  t.end()
})


test('Rust - unions and enums', t => {
  const options = {
    // extra imports that you wish to add to the generated file
    extras: ['pub use super::shared::*;'],
    extraDerives: {
      'Zebra': ['Copy', 'Clone'],
      'AnimalKind2': ['ExtraDerive'],
    },
    enumConversionError: {
      type: 'EnumValueError',
      constructor: 'EnumValueError::new(other, "{{ name }}")'
    },
    meta: {
      "AnimalKind": {
        implConst: true
      },
      "AnimalUnionEnum": {
        union: {
          underlying: 'u8',
          discFn(variantInt: number) {
            return variantInt + 100
          },
        }
      }
    }
  }
  const cleanedGenerated = generateStringRust(unions, options)
  const cleanedFixture = getFixture('./generated/rust/unions_enums.rs')

  codeEquals(t)(cleanedGenerated, cleanedFixture)
  t.end()
})

test('Rust - arrays', t => {

  const options: Options = {
    extras: ['big_array! { BigArray; 128, }'],
    meta: {
      "BigArrayNewtype": {
        newtype: { kind: NewtypeKind.Public }
      },
      "Foo": {
        fields: {
          "id5": {
            annotations: ['#[serde(with = "BigArray")]']
          }
        }
      }
    }
  }

  const cleanedGenerated = generateStringRust(arrays, options)
  const cleanedFixture = getFixture('./generated/rust/arrays.rs')
  codeEquals(t)(cleanedGenerated, cleanedFixture)
  t.end()
})

test('Rust - newtypes', t => {

  const options: Options = {
    meta: {
      "Public": {
        newtype: { kind: NewtypeKind.Public }
      },
      "WithNew": {
        newtype: {
          kind: NewtypeKind.Private,
          constr: true,
        }
      },
      "WithDeref": {
        newtype: {
          kind: NewtypeKind.Private,
          deref: true,
        }
      },
      "WithIntoInner": {
        newtype: {
          kind: NewtypeKind.Private,
          intoInner: true,
        }
      },
      "WithAsInner": {
        newtype: {
          kind: NewtypeKind.Private,
          asInner: true,
        }
      },
      "InPath": {
        newtype: {
          kind: NewtypeKind.InPath,
          module: 'path::foo::bar',
        }
      },
      "InCrate": {
        newtype: { kind: NewtypeKind.InCrate }
      },
      "FooArray": {
        newtype: { kind: NewtypeKind.Public }
      },
      "FieldMetaTest": {
        fields: {}
      }
    },
    extraDerives: {
      'WithNew': ['Foo', 'Bar']
    }
  }

  const generated = generateStringRust(newtypes, options)
  const fixture = getFixture('./generated/rust/newtypes.rs')

  codeEquals(t)(generated, fixture)
  t.end()
})

test('CPP fixtures', t => {
  const generated = generateStringCpp(types)
  const fixture = getFixture('./generated/cpp/fixtures.hpp')
  codeEquals(t)(generated, fixture)
  t.end()
})

test('CPP unions and enums', t => {
  const generated = generateStringCpp(unions)
  const fixture = getFixture('./generated/cpp/unions_enums.hpp')
  codeEquals(t)(generated, fixture)
  t.end()
})

test('CPP arrays', t => {
  const generated = generateStringCpp(arrays)
  const fixture = getFixture('./generated/cpp/arrays.hpp')
  codeEquals(t)(generated, fixture)
  t.end()
})
