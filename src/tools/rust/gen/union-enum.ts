import { max } from 'lodash'
import { TypeMetaStrict } from '../../rust/types'
import { EnumStrict } from '../../../'
import { UnionStrict } from '../../../types'
import { doc } from '../../rust/utils'
import { hexPad, indent, smoosh } from '../../utils'

// Union represented as enum
const getUnionEnum = (
  { name, members, description }: UnionStrict,
  discTypeDef: EnumStrict,
  meta: TypeMetaStrict,
) => {
  const annotationsString = meta.annotations.join('\n')
  const discTypeVariantLookup = Object.fromEntries(
    discTypeDef.variants.map(([variant, variantInt, _desc]) => [variant, variantInt]))
  const { underlying = 'u8', discFn = v => v } = meta.union

  const padDigits = { u8: 2, u16: 4, u32: 8, u64: 16 }[underlying]

  const unionMembers: [string, number][] = members.map(member => {
    const variantInt = discTypeVariantLookup[member]
    if (variantInt == undefined) {
      const error = `There is no ${member} in enum ${discTypeDef.name}`
      const variants = `Possible variants: ${Object.keys(discTypeVariantLookup)}`
      throw new Error([error, variants].join('\n'))
    }
    const value = hexPad(discFn(variantInt), padDigits)
    return [`  ${member}(${member}) = ${value},`, variantInt]
  })

  // So we can align the commends like rustfmt does by default
  const longestVariant = max(unionMembers.map(([v]) => v.length))

  const unionMembersWithComment = unionMembers
    .map(([variant, variantInt]: [string, number]) => {

      const value = hexPad(variantInt, padDigits)
      return variant.padEnd(longestVariant) + ' // ' + value
    })
    .join('\n')

  // prettier-ignore
  const union = smoosh([
    doc(description),
    `#[repr(${underlying})]`,
    annotationsString,
    `#[derive(Serialize)]`,
    `#[serde(untagged)]`,
    `pub enum ${name} {`,
    `  ${unionMembersWithComment}`,
    `} `
  ])

  // prettier-ignore
  const unionDeserializeMembers = members.map(member => {
    return `${discTypeDef.name}::${member} => ${member}::deserialize(de).map(Self::${member}), `
  }).map(indent(6)).join('\n')

  // prettier-ignore
  const unionDeserializeJson = `impl ${name} {
  pub fn deserialize<'de, D>(de: D, disc: ${discTypeDef.name}) -> Result<Self, D::Error>
  where
  D: Deserializer<'de>,
  {
    match disc {
      ${ unionDeserializeMembers}
    }
  }
} `

  return [union, unionDeserializeJson].join('\n\n')
}

export { getUnionEnum }
