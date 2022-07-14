import { hexPad, smoosh } from '../../utils'
import { doc, createDerives } from '../../rust/utils'
import { EnumStrict } from '../../../types'
import { EnumConversionError } from '../types'
import { NewtypeInCrate, NewtypeDef, TypeMeta } from '../../rust/types'
import { getBitflags } from './bitflags'
import * as _ from 'lodash'

export const getEnum = (
  enumStrict: EnumStrict,
  conversionError: EnumConversionError,
  meta: TypeMeta,
  extraDerivesArray: string[],
): string => {


  const { name, underlying, variants, description, bitflags } = enumStrict
  // Delegate to bitflags generator if needed
  if (meta?.bitflags || bitflags) {
    return getBitflags(enumStrict, extraDerivesArray)
  }

  const variantsFields = variants
    .map(([key, value, docs]) => smoosh([doc(docs, 2),`  ${key} = ${hexPad(value)},`]))
    .join('\n')

  const derives = ['Debug', 'Copy', 'Clone', 'PartialEq', 'Serialize', 'Deserialize']
  const derivesString = createDerives([
    ...derives,
    ...extraDerivesArray,
  ])

  const enumBody =  smoosh([
doc(description),
`#[repr(${underlying})]
${derivesString}
pub enum ${name} {
${variantsFields}
}`])

  const [firstVariantName] = variants[0]
  const implDefault = `impl Default for ${name} {
  fn default() -> Self {
    Self::${firstVariantName}
  }
}`

  const implConstIntValues = variants
    .map(([key, value]) => `  pub const ${key}: ${underlying} = ${hexPad(value)};`)
    .join('\n')

  const implConstInt = `pub struct ${name}Int;
#[allow(non_upper_case_globals, dead_code)]
impl ${name}Int {
${implConstIntValues}
}
`

  const variantsFieldsRev = variants
    .map(([key, value]) => `      ${hexPad(value)} => Ok(Self::${key}),`)
    .join('\n')

  // The TryFrom
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

  const implTryFrom = (from: string) => {
    const errorType = _.template(conversionError.type)({ underlying: from });
    const errorConstructor = _.template(conversionError.constructor)({ underlying: from, name })
  return `impl std::convert::TryFrom<${from}> for ${name} {
  type Error = ${errorType};
  fn try_from(value: ${from}) -> Result<Self, Self::Error> {
    match value {
${variantsFieldsRev}
      other => Err(${errorConstructor}),
    }
  }
}`
  }

  // Implements using existing implementation for u32
  const implTryFromCast = (from: string) => {
    const errorType = _.template(conversionError.type)({ underlying: 'u32' });
    const errorConstructor = _.template(conversionError.constructor)({ underlying: from, name })
  return `impl std::convert::TryFrom<${from}> for ${name} {
  type Error = ${errorType};
  fn try_from(value: ${from}) -> Result<Self, Self::Error> {
    std::convert::TryInto::try_into(value as u32)
  }
}`
  }
  
  const implTryFromU32 = implTryFrom('u32')

  // We implement from underlying and up
  const froms = ['u8', 'u16']
  const fromIndex = froms.findIndex(f => f == underlying)

  const implTryFroms = froms
    .splice(fromIndex)
    .map(implTryFromCast)

  return smoosh([enumBody, implDefault, implTryFromU32, ...implTryFroms, implConstInt])
}

