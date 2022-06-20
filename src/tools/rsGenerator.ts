/**
 * Rust code generator
 */
import * as fs from 'fs'
import { range, snakeCase, get, keyBy, flatten } from 'lodash'
import { normalizeTypes } from '../utils'
import { TypeDefinition, TypeDefinitionStrict, Field } from '../'
import {
  Lookup, Kind, StructStrict, AliasStrict, EnumStrict, UnionStrict
} from '../types'
export * from './rust/types'

import {
  TypeName, TypeMapping, NewtypeKind, NewtypePublic, NewtypePrivate,
  NewtypeInCrate, NewtypeDef, TypeMeta, Options,
  FieldName, FieldMeta
} from './rust/types'
import { getUnion } from './rust/gen/union'
import { getEnum } from './rust/gen/enum'
import { getStruct } from './rust/gen/struct'
import { hexPad, indent, smoosh } from './utils'
import { doc, createDerives, toRustNS } from './rust/utils'

let globalBigArraySizes = []

export const defaultOptions = {
  lookupTypes: [[]],
  extras: [],
  extraDerives: {},
  meta: {},
  camelCase: false,
  enumConversionError: {
    type: '{{ underlying }}',
    constructor: 'other'
  },
  forEachType: ([generated, context]) => generated
}

export const defaultMapping: TypeMapping = {
  'char[]': size => `[u8; ${size}]`,
}

const pushBigArray = (length: number): string => {
  if (globalBigArraySizes.indexOf(length) == -1) {
    globalBigArraySizes.push(length)
  }
  return '  #[serde(with = "BigArray")]\n'
}

// Returns a deref code for newtype impl Deref
const getNewtypeDeref = (
  typeName: string,
  rustAlias: string
): string => {
  return `impl std::ops::Deref for ${typeName} {
  type Target = ${rustAlias};
  fn deref(&self) -> &Self::Target {
    &self.0
  }
}` 
}

// Returns a deref code for newtype impl Deref
const getNewtypeIntoInner = (
  typeName: string,
  rustAlias: string,
): string => {
  return `impl ${typeName} {
  pub fn into_inner(&self) -> ${rustAlias} {
    self.0
  }
}` 
}

const getNewtypeConstr = (
  typeName: string,
  rustAlias: string
): string => {
  return `impl ${typeName} {
  pub fn new(v: ${rustAlias}) -> Self {
    Self(v)
  }
}`
}


// Return the body of new type
const getNewtypeVisibility = (
  name: string, 
  alias: string,
  newtype: NewtypeDef
): string => {

  let rustAlias = toRustNS(alias);

  switch (newtype.kind) {
    case NewtypeKind.Public:
      return `pub struct ${name}(pub ${rustAlias});`
    case NewtypeKind.Private:
      return `pub struct ${name}(${rustAlias});`
    case NewtypeKind.InPath:
      return `pub struct ${name}(pub(in ${newtype.module}) ${rustAlias});`
    case NewtypeKind.InCrate:
      return `pub struct ${name}(pub(crate) ${rustAlias});`
  }

}

const getNewtypeBody = (
  name: string, 
  alias: string,
  newtype: NewtypeDef
): string => {

  let rustAlias = toRustNS(alias);
  let visibility = [getNewtypeVisibility(name, alias, newtype)]

  if (newtype.constr == true) {
    visibility.push(getNewtypeConstr(name, rustAlias))
  }

  if (newtype.inner == true) {
    visibility.push(getNewtypeIntoInner(name, rustAlias))
  }

  if (newtype.deref == true) {
    visibility.push(getNewtypeDeref(name, rustAlias))
  }

  return smoosh(visibility)
}

// Generate code for alias
const getAlias = (
  name: string,
  alias: string,
  meta: Record<string, TypeMeta>,
  extraDerivesArray: string[],
  description?: string,
): string => {
 
  let newtype = meta[name]?.newtype;
  let rustAlias = toRustNS(alias);
  let docString = doc(description)

  if (newtype === undefined) {
    return smoosh([
      docString,
      `pub type ${name} = ${rustAlias};`
    ])
  }

  let derivesString = createDerives(extraDerivesArray)
  let newtypeCode = getNewtypeBody(name, alias, newtype)

  return smoosh([docString, derivesString, newtypeCode])
}

/**
 * Generate Rust types from Bendec types definitions
 */
export const generateString = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions
) => {

  globalBigArraySizes = []
  const ignoredTypes = ['char']

  const types: TypeDefinitionStrict[] = normalizeTypes(typesDuck)
  const lookupTypes = normalizeTypes(flatten(options.lookupTypes))
  const lookup = keyBy(types.concat(lookupTypes), i => i.name)

  options = { ...defaultOptions, ...options }

  const { typeMapping, extraDerives = [], meta } = options 
  const typeMap: TypeMapping = { ...defaultMapping, ...typeMapping }

  const definitions = types.map(typeDef => {
    // This is what we pass into callback function for each type def
    const context = typeDef

    const typeName = typeDef.name

    const extraDerivesArray = get(extraDerives, typeName, [])

    if (typeMap[typeName]) {
      return [`pub type ${typeName} = ${typeMap[typeName]()};`, context]
    }

    if (ignoredTypes.includes(typeName)) {
      return [`// ignored: ${typeName}`, context]
    }

    if (typeDef.kind === Kind.Primitive) {
      return [`// primitive built-in: ${typeName}`, context]
    }

    if (typeDef.kind === Kind.Alias) {
      return [
        getAlias(typeName, typeDef.alias, meta, extraDerivesArray, typeDef.description),
        context
      ]
    }

    if (typeDef.kind === Kind.Union) {
      return [getUnion(typeDef, types), context]
    }

    if (typeDef.kind === Kind.Enum) {
      return [getEnum(typeDef, options.enumConversionError, extraDerivesArray), context]
    }

    if (typeDef.kind === Kind.Struct) {
      return [
        getStruct(typeDef, lookup, typeMap, meta, extraDerivesArray, options.camelCase),
        context
      ]
    }

    if (typeDef.kind === Kind.Array) {
      const { name, type, length } = typeDef
      const alias = `[${toRustNS(typeDef.type)}; ${typeDef.length}]`
      return [
        getAlias(typeName, alias, meta, extraDerivesArray, typeDef.description),
        context
      ]
    }
  })

  const result = definitions.map(options.forEachType).join('\n\n')
  const extrasString = options.extras.join('\n')
  const bigArraySizesString = globalBigArraySizes.length > 0
    ? `big_array! { BigArray; ${globalBigArraySizes.join(',')}, }`
    : ''

  return smoosh([
`/** GENERATED BY BENDEC TYPE GENERATOR */
#[allow(unused_imports)]
use serde::{Deserialize, Deserializer, Serialize, Serializer};`,
bigArraySizesString,
extrasString,
result])
}

/**
 * Generate Rust types from Bendec types definitions
 */
export const generate = (types: TypeDefinition[], fileName: string, options?: Options) => {
  const moduleWrapped = generateString(types, options)

  fs.writeFileSync(fileName, moduleWrapped)
  console.log(`WRITTEN: ${fileName}`)
}
