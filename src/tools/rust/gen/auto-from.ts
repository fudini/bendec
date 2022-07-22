import { EnumStrict } from '../../../types'

// Generate From for same type from different namespaces
export const generateFrom = (
  { name, variants }: EnumStrict,
  fromNs: string,
  toNs: string
) => {
  const padding = "      "
  const variantsFieldsRev = variants
    .map(([key, value]) => `${padding}${fromNs}::${name}::${key} => Self::${key},`)
    .join('\n')

  return `impl std::convert::From<${fromNs}::${name}> for ${toNs}::${name} {
  fn from(value: ${fromNs}::${name}) -> Self {
    match value {
${variantsFieldsRev}
    }
  }
}`
}
