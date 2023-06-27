import { binPad, smoosh } from '../../utils'
import { doc, createDerives } from '../../rust/utils'
import { EnumStrict } from '../../../types'
import { padEnd, toUpper, snakeCase } from 'lodash'
import _ from 'lodash'
import { defaultDerives } from '../utils'

const getPadder = (underlying: string) => {
  switch (underlying) {
    case 'u8':
      return binPad(8)
    case 'u16':
      return binPad(16)
    default:
      return binPad(32)
  }
}

export const getBitflags = (
  enumStrict: EnumStrict,
  defaultDerives: string[],
  extraDerivesArray: string[],
): string => {

  const { name, underlying, variants, description } = enumStrict
  const padder = getPadder(underlying)
  const maxNameLength = _.max(variants.map(variant => snakeCase(variant[0]).length))

  const variantsFields = variants
    .map(([key, value, docs]) => {
      const alignedKey = padEnd(toUpper(snakeCase(key)), maxNameLength, ' ')
      return smoosh([
        doc(docs),
        `    const ${alignedKey} = ${padder(value)};`
      ])
    })
    .join('\n')

  // As opposed to enum - bitflags implements Copy, Clone and Debug so we don't need it
  const derivesString = createDerives([
    ...defaultDerives,
    ...extraDerivesArray,
  ])

  return smoosh([
`bitflags::bitflags! {
  ${doc(description)}
  ${derivesString}
  #[repr(transparent)]
  pub struct ${name}: ${underlying} {
${variantsFields}
  }
}`
  ])
}

