import { snakeCase } from 'lodash'
import { TypeMeta } from '../../rust/types'
import { EnumStrict } from '../../../'
import { UnionStrict } from '../../../types'
import { doc } from '../../rust/utils'
import { hexPad, indent } from '../../utils'

// Union represented as enum
const getUnionEnum = (
  { name, members, description }: UnionStrict,
  discTypeDef: EnumStrict,
  meta: TypeMeta,
) => {
  const discTypeVariantLookup = Object.fromEntries(
    discTypeDef.variants.map(([variant, variantInt, desc]) => [variant, variantInt]))

  const { underlying = 'u8', discFn = v => v } = meta.union

  const padDigits = { u8: 2, u16: 4, u32: 8, u64: 16 }[underlying]

  const unionMembers = members.map(member => {
    const variantInt = discTypeVariantLookup[member]
    const value = hexPad(discFn(variantInt), padDigits)
    return `  ${member}(${member}) = ${value},` // ${variantInt}`
  }).join('\n')

  // prettier-ignore
  const union = `${doc(description)}
#[repr(${ underlying})]
#[derive(Serialize)]
#[serde(untagged)]
    pub enum ${name} {
      ${ unionMembers}
    } `

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
