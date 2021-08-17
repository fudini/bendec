import _ from 'lodash'
import test from 'tape'
import { enums } from './fixtures'
import { Kind, EnumStrict } from '../types'
import { generateFrom } from '../tools/rust/gen/auto-from'
import { normalizeTypes } from '../utils'
import { getFixture, codeEquals } from './utils'

test('Generate From in-between namespaces', t => {

  let enumsNormalized = normalizeTypes(enums)
  let justEnums = enumsNormalized
    .filter((def): def is EnumStrict => def.kind === Kind.Enum)
    .map(def => [
      generateFrom(def, 'foo', 'bar'),
      generateFrom(def, 'bar', 'foo'),
    ])

  let generated = _.flatten(justEnums).join('\n')

  const fixture = getFixture('./generated/rust/auto-from.rs')
  codeEquals(t)(generated, fixture)
  t.end()
})


