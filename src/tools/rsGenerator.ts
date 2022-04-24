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
  TypeName, TypeMapping, NewtypeKind, NewtypePublic, NewtypeGenerated,
  NewtypeInCrate, NewtypeDef, TypeMeta, Options,
  FieldName, FieldMeta
} from './rust/types'
import { getUnion } from './rust/gen/union'
import { getEnum } from './rust/gen/enum'
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
  }
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

const getMembers = (
  lookup: Lookup,
  fields: Field[],
  typeMap: TypeMapping,
  meta: Record<TypeName, TypeMeta>,
  fieldsMeta: Record<FieldName, FieldMeta>,
): [string[], boolean] => {
  // TODO: remove this when Defaults get removed
  let hasBigArray = false

  let fieldsArr = fields.map(field => {
    // expand the namespace . in to ::
    const fieldTypeName = toRustNS(field.type)
    const key = fieldTypeName + (field.length ? '[]' : '')
    const rustType = field.length ? `[${fieldTypeName}; ${field.length}]` : fieldTypeName
    const finalRustType = (typeMap[key] !== undefined)
      ? typeMap[key](field.length)
      : rustType

    const fieldAnnotations = fieldsMeta?.[field.name]?.annotations || []
    const generatedField =  `  pub ${snakeCase(field.name)}: ${finalRustType},`
    
    const typeMeta = meta[fieldTypeName]
    const isNewtype = typeMeta?.newtype !== undefined

    if (field.length > 32 && !isNewtype) {
      hasBigArray = true
    }

    const type = lookup[field.type]

    if (type === undefined) {
      console.log(`Field type not found ${field.type}`)
    } else if (type.kind === Kind.Array && type.length > 32 && !isNewtype) {
      hasBigArray = true
    }

    return smoosh([
      doc(field.description),
      ...fieldAnnotations.map(indent(2)),
      generatedField
    ])
  })

  return [fieldsArr, hasBigArray]
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

// Return the body of new type
const getNewtypeBody = (
  name: string, 
  alias: string,
  newtype: NewtypeDef
): string => {

  let rustAlias = toRustNS(alias);

  switch (newtype.kind) {
    case NewtypeKind.Public:
      return `pub struct ${name}(pub ${rustAlias});`
    case NewtypeKind.Generated:
      return `pub struct ${name}(${rustAlias});

impl ${name} {
  pub fn new(v: ${rustAlias}) -> Self {
    Self(v)
  }
}`
    case NewtypeKind.InCrate:
      return `pub struct ${name}(pub(in ${newtype.module}) ${rustAlias});`
  }

}

// Generate code for alias
const getAlias = (
  name: string,
  alias: string,
  meta: TypeMeta,
  extraDerivesArray: string[]
): string => {
 
  let newtype = meta[name]?.newtype;
  let rustAlias = toRustNS(alias);

  if (newtype === undefined) {
    return `pub type ${name} = ${rustAlias};`
  }

  let derivesString = createDerives(extraDerivesArray)
  let newtypeCode = getNewtypeBody(name, alias, newtype)
  let newtypeDerefCode = getNewtypeDeref(name, rustAlias)

  return smoosh([derivesString, newtypeCode, newtypeDerefCode])
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
    const typeName = typeDef.name

    const extraDerivesArray = get(extraDerives, typeName, [])

    if (typeMap[typeName]) {
      return `pub type ${typeName} = ${typeMap[typeName]()};`
    }

    if (ignoredTypes.includes(typeName)) {
      return `// ignored: ${typeName}`
    }

    if (typeDef.kind === Kind.Primitive) {
      return `// primitive built-in: ${typeName}`
    }

    if (typeDef.kind === Kind.Alias) {
      return getAlias(typeName, typeDef.alias, meta, extraDerivesArray)
    }

    if (typeDef.kind === Kind.Union) {
      return getUnion(typeDef, types)
    }

    if (typeDef.kind === Kind.Enum) {
      return getEnum(typeDef, options.enumConversionError)
    }

    if (typeDef.kind === Kind.Struct) {

      const fieldsMeta = meta[typeName]?.fields

      const [members, hasBigArray] = typeDef.fields
        ? getMembers(lookup, typeDef.fields, typeMap, meta, fieldsMeta)
        : [[], false]

      const membersString = members.join('\n')
      
      const derives = ['Serialize', 'Deserialize']
      const defaultDerive = hasBigArray ? [] : ['Default']
      const derivesString = createDerives([
        ...defaultDerive,
        ...derives,
        ...extraDerivesArray
      ])
      const serdeString = hasBigArray
        ? '#[serde(deny_unknown_fields)]'
        : '#[serde(deny_unknown_fields, default)]'
      const serdeCamelCase = options.camelCase
        ? '#[serde(rename_all = "camelCase")]'
        : ''

      return smoosh([
        doc(typeDef.description),
        `#[repr(C, packed)]`,
        derivesString,
        serdeString,
        serdeCamelCase,
        `pub struct ${typeName} {`,
        `  ${membersString}`,
        `}`
      ])
    }

    if (typeDef.kind === Kind.Array) {
      const { name, type, length } = typeDef
      const alias = `[${toRustNS(typeDef.type)}; ${typeDef.length}]`
      return getAlias(typeName, alias, meta, extraDerivesArray)
    }
  })

  const result = definitions.join('\n\n')
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
