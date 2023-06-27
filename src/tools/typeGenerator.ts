import * as fs from 'fs'
import { normalizeTypes } from '../utils'
import { TypeDefinition, TypeDefinitionStrict, Field } from '../'
import { Kind, EnumStrict, UnionStrict, StructStrict } from '../types'
import { hexPad } from './utils'

type TypeMapping = Record<string, string>

type Options = {
  extras?: string[]
  typeMapping?: TypeMapping
  header?: boolean
}

export const defaultOptions = {
  extras: [],
  header: true
}

export const defaultMapping: TypeMapping = {
  'char[]': 'Buffer',
}

const getMembers = (fields: Field[], typeMap: TypeMapping) => {
  return fields.map(field => {
    const key = field.type + (field.length ? '[]' : '')
    const finalTypeName = typeMap[key] || key
    return `  ${field.name}: ${finalTypeName}`
  })
}

const getEnum = ({ name, variants }: EnumStrict) => {
  const variantsFields = variants
    .map(([key, value]) => `  ${key} = ${hexPad(value)},`)
    .join('\n')
  return `export enum ${name} {
${variantsFields}
}`
}

const getStruct = (typeDef: StructStrict, typeMap: TypeMapping) => {
  const members = getMembers(typeDef.fields, typeMap)
  const membersString = members.join('\n')

  return `export interface ${typeDef.name} {
${membersString}
}`
}

const getUnion = ({ name, members }: UnionStrict) => {
  const unionMembers = members.join(' | ')
  return `export type ${name} = ${unionMembers}`
}

/**
 * Generate TypeScript interfaces from Bendec types definitions
 */
export const generateString = (
  typesDuck: TypeDefinition[],
  options: Options = defaultOptions
) => {
  const types: TypeDefinitionStrict[] = normalizeTypes(typesDuck)

  const {
    extras = [],
    typeMapping,
    header = true
  } = { ...defaultOptions, ...options }

  const typeMap: TypeMapping = { ...defaultMapping, ...typeMapping }

  const definitions = types.map(typeDef => {
    const typeName = typeDef.name

    if (typeMap[typeName]) {
      return `export type ${typeName} = ${typeMap[typeName]}`
    }

    if (typeDef.kind === Kind.Primitive) {
      return `export type ${typeName} = number`
    }

    if (typeDef.kind === Kind.Alias) {
      return `export type ${typeName} = ${typeDef.alias}`
    }

    if (typeDef.kind === Kind.Union) {
      return getUnion(typeDef)
    }

    if (typeDef.kind === Kind.Enum) {
      return getEnum(typeDef)
    }

    if (typeDef.kind === Kind.Struct) {
      return getStruct(typeDef, typeMap)
    }

    if (typeDef.kind === Kind.Array) {
      const key = typeDef.type + '[]'
      const finalTypeName = typeMap[key] || key
      return `export type ${typeDef.name} = ${finalTypeName}`
    }
  })

  const result = definitions.join('\n\n')
  const extrasString = extras.join('\n')
  const HEADER = header ? '/** GENERATED BY BENDEC TYPE GENERATOR */\n' : ''

  return `${HEADER}${extrasString}
${result}
`
}

/**
 * Generate TypeScript interfaces from Bender types definitions
 */
export const generate = (types: TypeDefinition[], fileName: string, options?: Options) => {
  const moduleWrapped = generateString(types, options)

  fs.writeFileSync(fileName, moduleWrapped)
  console.log(`WRITTEN: ${fileName}`)
}
