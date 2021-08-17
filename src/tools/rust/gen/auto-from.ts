import { hexPad } from '../../utils'
import { EnumStrict } from '../../../types'

// Generate From for same type from different namespaces
export const generateFrom = (
  { name, variants }: EnumStrict,
  fromNs: string,
  toNs: string
) => {
  const variantsFieldsRev = variants
    .map(([key, value]) => {
      return `      ${fromNs}::${key} => Self::${key},`
    })
    .join('\n')

  const implFrom = (fromName: string) => {
    return `impl std::convert::From<${fromNs}::${fromName}> for ${toNs}::${name} {
  fn from(value: ${fromNs}::${fromName}) -> Self {
    match value {
${variantsFieldsRev}
    }
  }
}`
  }
  return implFrom(name)
}
