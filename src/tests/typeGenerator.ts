import { readFileSync } from 'fs'
import path from 'path'
import test from 'tape'
import { trim, isEmpty, negate } from 'lodash'
import { generateString } from '../tools/typeGenerator'
import { types, enums, unions, arrays } from './fixtures'
import { generateString as generateStringRust } from '../tools/rsGenerator'
import { generateString as generateStringCpp } from '../tools/cppGenerator'

const clean = (content: string): string => {
  return content.split('\n').map(trim).filter(negate(isEmpty)).join('\n')
}

const getFixture = (filePath: string): string => {
  const filePath2 = path.join(__dirname.replace('dist', 'src'), filePath)
  return readFileSync(filePath2, 'utf8')
}

test('TypeScript - custom type mapping', t => {
  const types = [{name: 'u64', size: 8}]
  const typeMapping = {'u64': 'bigint'}
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
  const cleanedGenerated = clean(generateStringRust(types))
  const cleanedFixture = clean(getFixture('./generated/rust/fixtures.rs'))
  t.equals(cleanedGenerated, cleanedFixture)
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

test('Rust - fixtures', t => {
  const cleanedGenerated = clean(generateStringRust(arrays))
  const cleanedFixture = clean(getFixture('./generated/rust/arrays.rs'))
  t.equals(cleanedGenerated, cleanedFixture)
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

