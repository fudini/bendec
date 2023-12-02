import { hexPad, smoosh } from '../../utils'
import { doc, createDerives } from '../../rust/utils'
import { EnumStrict } from '../../../types'
import { EnumConversionError, DefaultDerives } from '../types'
import { TypeMeta } from '../../rust/types'
import { getBitflags } from './bitflags'
import _ from 'lodash'

export const getEnum = (
  enumStrict: EnumStrict,
  conversionError: EnumConversionError,
  meta: TypeMeta,
  defaultDerives: DefaultDerives,
  extraDerivesArray: string[],
  transparentBitflags: boolean,
): string => {


  const {
    name,
    underlying,
    variants,
    description,
    bitflags,
  } = enumStrict

  // Delegate to bitflags generator if needed
  if (meta?.bitflags || bitflags) {
    return getBitflags(enumStrict, defaultDerives.bitflags, extraDerivesArray, transparentBitflags)
  }

  const implConst = !!(meta?.implConst)
  const typeAnnotation = meta?.annotation
  const typeDeriveHelperAttribute = meta?.deriveHelperAttribute
  const variantsFields = variants
    .map(([key, value, docs, dataType]) => {
      const data = dataType !== undefined
        ? `(${dataType})`
        : ''
      return smoosh([doc(docs, 2), `  ${key}${data} = ${hexPad(value)},`])
    })
    .join('\n')
  const hasData = !variants.every(([, , , dataType]) => dataType === undefined)

  const derivesString = !hasData
    ? createDerives([
      ...defaultDerives.enum,
      ...extraDerivesArray
    ])
    : createDerives([
      ...extraDerivesArray
    ])

  const enumBody =  smoosh([
doc(description),
typeAnnotation,
`#[repr(${underlying})]`,
derivesString,
typeDeriveHelperAttribute,
`pub enum ${name} {
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

  const implTryFromUnderlying = implTryFrom(underlying)
  var impls = [enumBody]

  if (!hasData) {
    impls.push(implDefault, implTryFromUnderlying)
  }

  if (implConst) {
    impls.push(implConstInt)
  }

  return smoosh(impls)
}

