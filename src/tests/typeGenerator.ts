import { readFileSync } from 'fs'
import path from 'path'
import test from 'tape'
import { trim, isEmpty, negate } from 'lodash'
import { generateString } from '../tools/typeGenerator'
import { types, enums, unions } from './fixtures'
import { generateString as generateStringRust } from '../tools/rsGenerator'
import { generateString as generateStringCpp } from '../tools/cppGenerator'


const clean = (content: string): string => {
  return content.split('\n').map(trim).filter(negate(isEmpty)).join('\n')
}

const getFixture = (filePath: string): string => {
  const filePath2 = path.join(__dirname.replace('dist', 'src'), filePath)
  return readFileSync(filePath2, 'utf8')
}

 test('fixtures without namespace', t => {
   const cleanedGenerated = clean(generateString(types, { namespace: null }))
   const cleanedFixture = clean(getFixture('./generated/fixtures.ts'))
   t.equals(cleanedGenerated, cleanedFixture)
   t.end()
 })

 test('custom type mapping', t => {
   const types = [{name: 'u64', size: 8}]
   const typeMapping = {'u64': 'bigint'}
   const without = generateString(types, { namespace: null })
   const withMapping = generateString(types, { typeMapping, namespace: null })

   t.equals(without, `export type u64 = number`.trim())
   t.equals(withMapping, `export type u64 = bigint`.trim())

   t.end()
 })

 test('unions and enums', t => {
   const cleanedGenerated = clean(generateString(unions))
   const cleanedFixture = clean(getFixture('./generated/unionsEnums.ts'))
   t.equals(cleanedGenerated, cleanedFixture)
   t.end()
 })

test('rust fixtures', t => {
  const cleanedGenerated = clean(generateStringRust(types))
  const cleanedFixture = clean(getFixture('./generated/rust/fixtures.rs'))
  t.equals(cleanedGenerated, cleanedFixture)
  t.end()
})

test('rust unions and enums', t => {
  const cleanedGenerated = clean(generateStringRust(unions))
  const cleanedFixture = clean(getFixture('./generated/rust/unions_enums.rs'))
  t.equals(cleanedGenerated, cleanedFixture)
  t.end()
})

test('cpp fixtures', t => {
  const cleanedGenerated = clean(generateStringCpp(types))
  const cleanedFixture = clean(getFixture('./generated/cpp/fixtures.hpp'))
  t.equals(cleanedGenerated, cleanedFixture)
  t.end()
})

test('cpp unions and enums', t => {
  const cleanedGenerated = clean(generateStringCpp(unions))
  const cleanedFixture = clean(getFixture('./generated/cpp/unions_enums.hpp'))
  t.equals(cleanedGenerated, cleanedFixture)
  t.end()
})
