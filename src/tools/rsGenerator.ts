/**
 * Rust code generator
 */
import * as fs from 'fs'
import { range, snakeCase, get, keyBy, flatten } from 'lodash'
import { normalizeTypes } from '../utils'
import { TypeDefinition, TypeDefinitionStrict, Field } from '../'
import { Lookup, Kind, StructStrict, AliasStrict, EnumStrict, UnionStrict } from '../types'
export * from './rust/types'

import {
  TypeName, TypeMapping, NewtypeKind, NewtypePublic, NewtypeGenerated,
  NewtypeInCrate, NewtypeDef, TypeMeta, Options
} from './rust/types'
import { getUnion } from './rust/gen/union'
import { hexPad } from './utils'
import { doc, indent, createDerives, toRustNS } from './rust/utils'

let globalBigArraySizes = []

export const defaultOptions = {
  lookupTypes: [[]],
  extras: [],
  extraDerives: {},
  meta: {}
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

const getMembers = (lookup: Lookup, fields: Field[], typeMap: TypeMapping): [string[], boolean] => {
  let hasBigArray = false

  let fieldsArr = fields.map(field => {
    // expand the namespace . in to ::
    const fieldTypeName = toRustNS(field.type)
    const key = fieldTypeName + (field.length ? '[]' : '')
    const rustType = field.length ? `[${fieldTypeName}; ${field.length}]` : fieldTypeName
    const finalRustType = (typeMap[key] !== undefined)
      ? typeMap[key](field.length)
      : rustType

    const generatedField =  `  pub ${snakeCase(field.name)}: ${finalRustType},`

    if (field.length > 32) {
      hasBigArray = true
      return pushBigArray(field.length) + generatedField
    }

    const type = lookup[field.type]

    if (type === undefined) {
      console.log(`Field type not found ${field.type}`)
    } else if (type.kind === Kind.Array && type.length > 32) {
      hasBigArray = true
      return pushBigArray(type.length) + generatedField
    }

    return doc(field.desc) + generatedField
  })

  return [fieldsArr, hasBigArray]
}

const getEnum = (
  { name, underlying, variants, desc }: EnumStrict
) => {
  const variantsFields = variants
    .map(([key, value]) => `  ${key} = ${hexPad(value)},`)
    .join('\n')

  const enumBody =  `${doc(desc)}
#[repr(${underlying})]
#[derive(Debug, Copy, Clone, PartialEq, Serialize, Deserialize)]
pub enum ${name} {
${variantsFields}
}`

  const [firstVariantName] = variants[0]
  const implDefault = `impl Default for ${name} {
  fn default() -> Self {
    Self::${firstVariantName}
  }
}`
  return [enumBody, implDefault].join('\n')
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
}
` 
}

// Return the body of new type
const getNewtypeBody = (aliasStrict: AliasStrict, newtype: NewtypeDef): string => {

  let { name, alias } = aliasStrict
  let rustAlias = toRustNS(alias);

  switch (newtype.kind) {
    case NewtypeKind.Public:
      return `pub struct ${name}(pub ${rustAlias});\n`
    case NewtypeKind.Generated:
      return `pub struct ${name}(${rustAlias});

impl ${name} {
  pub fn new(v: ${rustAlias}) -> Self {
    Self(v)
  }
}
`
    case NewtypeKind.InCrate:
      return `pub struct ${name}(pub(in ${newtype.module}) ${rustAlias});\n`
  }

}

// Generate code for alias
const getAlias = (
  aliasStrict: AliasStrict,
  meta: TypeMeta,
  extraDerivesArray: string[]
): string => {
 
  let { name, alias } = aliasStrict
  let newtype = meta[name]?.newtype;
  let rustAlias = toRustNS(alias);

  if (newtype === undefined) {
    return `pub type ${name} = ${rustAlias};`
  }

  let derivesString = createDerives(extraDerivesArray)
  let newtypeCode = getNewtypeBody(aliasStrict, newtype)
  let newtypeDerefCode = getNewtypeDeref(name, rustAlias)

  return `${derivesString}
${newtypeCode}
${newtypeDerefCode}`
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
      return getAlias(typeDef, meta, extraDerivesArray)
    }

    if (typeDef.kind === Kind.Union) {
      return getUnion(typeDef, types)
    }

    if (typeDef.kind === Kind.Enum) {
      return getEnum(typeDef)
    }

    if (typeDef.kind === Kind.Struct) {
      const [members, hasBigArray] = typeDef.fields
        ? getMembers(lookup, typeDef.fields, typeMap)
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

      return `${doc(typeDef.desc)}
#[repr(C, packed)]
${derivesString}
${serdeString}
pub struct ${typeName} {
${membersString}
}`
    }

    if (typeDef.kind === Kind.Array) {
      return `pub type ${typeName} = [${toRustNS(typeDef.type)}; ${typeDef.length}];`
    }
  })

  const result = definitions.join('\n\n')
  const extrasString = options.extras.join('\n')
  const bigArraySizesString = globalBigArraySizes.length > 0
    ? `big_array! { BigArray; ${globalBigArraySizes.join(',')}, }`
    : ''

  return `/** GENERATED BY BENDEC TYPE GENERATOR */
#[allow(unused_imports)]
use serde::{Deserialize, Serialize, Serializer};
${bigArraySizesString}
${extrasString}
  ${result}
`
}

/**
 * Generate Rust types from Bendec types definitions
 */
export const generate = (types: TypeDefinition[], fileName: string, options?: Options) => {
  const moduleWrapped = generateString(types, options)

  fs.writeFileSync(fileName, moduleWrapped)
  console.log(`WRITTEN: ${fileName}`)
}
