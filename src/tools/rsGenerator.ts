/**
 * Rust code generator
 */
import * as fs from 'fs'
import { range, snakeCase, get, keyBy, flatten } from 'lodash'
import { normalizeTypes } from '../utils'
import { TypeDefinition, TypeDefinitionStrict, Field } from '../'
import { Lookup, Kind, StructStrict, AliasStrict, EnumStrict, UnionStrict } from '../types'
import { hexPad } from './utils'

type TypeMapping = { [k: string]: (size?: number) => string }

export enum NewtypeKind {
  Public = 'Public',
  Generated = 'Generated',
  InCrate = 'InCrate',
}

// Inner type is going to be public which is just a glorified alias
export type NewtypePublic = { kind: NewtypeKind.Public }

// Constructor for newtype will be generated
export type NewtypeGenerated = { kind: NewtypeKind.Generated }

// Constructor will have to be defined in the specified module
export type NewtypeInCrate = { kind: NewtypeKind.InCrate, module: string }

// Union of new type kinds
export type NewtypeDef = NewtypePublic | NewtypeGenerated | NewtypeInCrate

// Metadata for the type will contain extra derives / newtype annotations
export type TypeMeta = {
  newtype?: NewtypeDef,
  derives?: string[],
}

export type Options = {
  // These types are just here for lookup so we can resolve shared types
  lookupTypes?: TypeDefinition[][],
  typeMapping?: TypeMapping
  extras?: string[]
  extraDerives?: { [typeName: string]: string[] }
  meta?: { [typeName: string]: TypeMeta }
}

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

const indent = (i: number) => (str: string) => {
  return '                    '.substr(-i) + str
}

// convert dot syntax into double colon (::)
const toRustNS = (type: string): string => {
  return type.split('.').join('::')
}

// return comment block with description
const doc = (desc?: string): string => {
  if (desc !== undefined) {
    return `/// ${desc}\n`
  }

  return ''
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
#[derive(Debug, Copy, Clone, PartialEq, Serialize_repr, Deserialize_repr)]
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

const getUnion = (
  { name, discriminator, members, desc }: UnionStrict,
  discTypeDef: TypeDefinitionStrict
) => {
  
  const unionMembers = members.map(member => {
    return `  pub ${snakeCase(member)}: ${member},`
  }).join('\n')

  const union = `${doc(desc)}
#[repr(C, packed)]
pub union ${name} {
${unionMembers}
}`

  const serdeMembers = members.map(member => {
    return `${discTypeDef.name}::${member} => self.${snakeCase(member)}.serialize(serializer),`
  }).map(indent(8)).join('\n')

  const discPath = discriminator.map(snakeCase).join('.')
  // we need to generate serde for union as it can't be derived
  const unionSerdeSerialize = `impl Serialize for ${name} {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where S: Serializer,
  {
    unsafe {
      match &self.${snakeCase(members[0])}.${discPath} {
${serdeMembers} 
      }
    }
  }
}`

  const unionDeserializeMembers = members.map(member => {
    return `${discTypeDef.name}::${member} => from_str(data).map(|v| ${name} { ${snakeCase(member)}: v }),`
  }).map(indent(6)).join('\n')

  const unionDeserializeJson = `impl ${name} {
  pub fn deserialize_json(disc: ${discTypeDef.name}, data: &str) -> Result<Self, serde_json::Error> {
    use serde_json::from_str;
    match disc {
${unionDeserializeMembers}
    }
  }
}`

  const unionGetSizeMembers = members.map(member => {
    return `${discTypeDef.name}::${member} => std::mem::size_of::<${member}>(),`
  }).map(indent(6)).join('\n')

  const unionGetSize = `impl ${name} {
  pub fn size_of(disc: ${discTypeDef.name}) -> usize {
    match disc {
${unionGetSizeMembers}
    }
  }
}`

  return [union, unionSerdeSerialize, unionDeserializeJson, unionGetSize].join('\n\n')
}

// Generate code for alias
const getAlias = (
  { name, alias }: AliasStrict,
  meta: TypeMeta
): string => {
 
  let newtype = meta[name]?.newtype;
  let rustAlias = toRustNS(alias);

  if (newtype === undefined) {
    return `pub type ${name} = ${rustAlias};`
  }

  // If we have a newtype annotation we need to generate code for newtype instead
  switch (newtype.kind) {
    case NewtypeKind.Public:
      return `pub struct ${name}(pub ${rustAlias});\n`
    case NewtypeKind.Generated:
      return `pub struct ${name}(${rustAlias});

impl ${name} {
  pub fn new(v: ${rustAlias}) -> Self {
    Self(v)
  }
}\n`
    case NewtypeKind.InCrate:
      return `pub struct ${name}(pub(in ${newtype.module}) ${rustAlias});\n`
  }
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
      return getAlias(typeDef, meta)
    }

    if (typeDef.kind === Kind.Union) {
      // determine the type of the discriminator from one of union members
      // TODO: validate if all members have discriminator
      const memberName = typeDef.members[0]
      const memberType = <StructStrict>types.find(({ name }) => name === memberName)

      const discTypeDef = typeDef.discriminator.reduce((currentTypeDef, pathSection) => {
        
        if (currentTypeDef.kind !== Kind.Struct) {
          throw new Error(`The path to union discriminator can only contain Structs, ${currentTypeDef.name} is not a Struct`)
        }

        const discTypeField = (<StructStrict>currentTypeDef).fields.find(({ name }) => name === pathSection)
        if (discTypeField === undefined) {
          throw new Error(`no field '${pathSection}' in struct '${currentTypeDef.name}'`)
        }
        return <StructStrict>types.find(({ name }) => name === discTypeField.type)
      }, memberType as TypeDefinitionStrict)

      return getUnion(typeDef, discTypeDef)
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
      const extraDerives2 = get(extraDerives, typeName, [])
      const derivesString = [...defaultDerive, ...derives, ...extraDerives2].join(', ')
      const serde = hasBigArray
        ? '#[serde(deny_unknown_fields)]'
        : '#[serde(deny_unknown_fields, default)]'

      return `${doc(typeDef.desc)}
#[repr(C, packed)]
#[derive(${derivesString})]
${serde}
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
use serde_repr::{Deserialize_repr, Serialize_repr};
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
