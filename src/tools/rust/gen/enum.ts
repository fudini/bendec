import { hexPad } from '../../utils'
import { doc } from '../../rust/utils'
import { smoosh } from '../../utils'
import { EnumStrict } from '../../../types'

export const getEnum = (
  { name, underlying, variants, desc }: EnumStrict
) => {
  const variantsFields = variants
    .map(([key, value]) => `  ${key} = ${hexPad(value)},`)
    .join('\n')

  const enumBody =  smoosh([
doc(desc),
`#[repr(${underlying})]
#[derive(Debug, Copy, Clone, PartialEq, Serialize, Deserialize)]
pub enum ${name} {
${variantsFields}
}`])

  const [firstVariantName] = variants[0]
  const implDefault = `impl Default for ${name} {
  fn default() -> Self {
    Self::${firstVariantName}
  }
}`

  const variantsFieldsRev = variants
    .map(([key, value]) => `      ${hexPad(value)} => Ok(Self::${key}),`)
    .join('\n')

  const implTryFrom = `impl std::convert::TryFrom<${underlying}> for ${name} {
  type Error = ();
  fn try_from(value: ${underlying}) -> Result<Self, Self::Error> {
    match value {
${variantsFieldsRev}
      _ => Err(()),
    }
  }
}`

  return smoosh([enumBody, implDefault, implTryFrom])
}

