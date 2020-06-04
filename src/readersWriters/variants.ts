import { get } from 'lodash'
import { genReadFields } from './'
import { UnionStrict, EnumStrict, VariantGetter, Readers, Lookup } from '../types'
import { findDiscType, getEnumLookup } from '../utils'

export const genVariantGetter = (type: UnionStrict, readers: Readers, lookup: Lookup): VariantGetter => {
  const variantName = type.members[0]
  // get the typeName of the discriminator of this union
  const discTypeName = findDiscType(variantName, type.discriminator, lookup)
  const discType = lookup[discTypeName]
  const enumLookup = getEnumLookup(<EnumStrict>discType)
  const lookupString = `const lookup = ${JSON.stringify(enumLookup)}\n`

  // create functions to resolve variant of the union
  const [intermediate] = genReadFields(readers, lookup, false)(variantName)
  const funcDecodeReturn = get(intermediate, type.discriminator)
  const funcDecodeBody = `${lookupString} return buffer => lookup[${funcDecodeReturn}]`
  const decode =  new Function('', funcDecodeBody)()

  const funcEncodeReturn = type.discriminator.join('.')
  const funcEncodeBody = `${lookupString} return union => lookup[union.${funcEncodeReturn}]`
  const encode =  new Function('', funcEncodeBody)()

  return { encode, decode }
}
