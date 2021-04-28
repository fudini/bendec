import { readFileSync } from 'fs'
import path from 'path'
import test from 'tape'
import { generateString } from '../tools/typeGenerator'
import { types, enums, unions, arrays, newtypes, camel } from './fixtures'
import {
  generateString as generateStringRust,
  NewtypeKind,
  NewtypePublic,
  NewtypeGenerated,
  NewtypeInCrate,
  Options,
} from '../tools/rsGenerator'
import { generateString as generateStringCpp } from '../tools/cppGenerator'
import { codeEquals, clean } from './utils'

const getFixture = (filePath: string): string => {
  const filePath2 = path.join(__dirname.replace('dist', 'src'), filePath)
  return readFileSync(filePath2, 'utf8')
}

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
  t.equals(cleanedGenerated, cleanedFixture)
  t.end()
})

test('TypeScript arrays', t => {
  const cleanedGenerated = clean(generateString(arrays))
  const cleanedFixture = clean(getFixture('./generated/ts/arrays.ts'))
  t.equals(cleanedGenerated, cleanedFixture)
  t.end()
})

test('Rust - fixtures', t => {
  const generated = generateStringRust(types)
  const fixture = getFixture('./generated/rust/fixtures.rs')
  codeEquals(t)(generated, fixture)
  t.end()
})

test('Rust - camel case annotation on structs', t => {
  const options = { camelCase: true }
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
      'Zebra': ['Copy', 'Clone']         
    }
  }
  const cleanedGenerated = clean(generateStringRust(unions, options))
  const cleanedFixture = clean(getFixture('./generated/rust/unions_enums.rs'))
  t.equals(cleanedGenerated, cleanedFixture)
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

  const cleanedGenerated = clean(generateStringRust(arrays, options))
  const cleanedFixture = clean(getFixture('./generated/rust/arrays.rs'))
  t.equals(cleanedGenerated, cleanedFixture)
  t.end()
})

test('Rust - newtypes', t => {

  const options: Options = {
    meta: {
      "Public": {
        newtype: { kind: NewtypeKind.Public }
      },
      "Generated": {
        newtype: { kind: NewtypeKind.Generated }
      },
      "InCrate": {
        newtype: {
          kind: NewtypeKind.InCrate,
          module: 'crate::foo::bar',
        }
      },
      "FooArray": {
        newtype: { kind: NewtypeKind.Public }
      },
      "FieldMetaTest": {
        fields: { }
      }
    },
    extraDerives: {
      'Generated': ['Foo', 'Bar']
    }
  }

  const generated = generateStringRust(newtypes, options)
  const fixture = getFixture('./generated/rust/newtypes.rs')

  codeEquals(t)(generated, fixture)
  t.end()
})

test('CPP fixtures', t => {
  const cleanedGenerated = clean(generateStringCpp(types))
  const cleanedFixture = clean(getFixture('./generated/cpp/fixtures.hpp'))
  t.equals(cleanedGenerated, cleanedFixture)
  t.end()
})

test('CPP unions and enums', t => {
  const cleanedGenerated = clean(generateStringCpp(unions))
  const cleanedFixture = clean(getFixture('./generated/cpp/unions_enums.hpp'))
  t.equals(cleanedGenerated, cleanedFixture)
  t.end()
})

test('CPP arrays', t => {
  const cleanedGenerated = clean(generateStringCpp(arrays))
  const cleanedFixture = clean(getFixture('./generated/cpp/arrays.hpp'))
  t.equals(cleanedGenerated, cleanedFixture)
  t.end()
})
