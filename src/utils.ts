import { has, sum, map, mapValues, max, invert, flow, camelCase, upperFirst } from 'lodash'
import { Errors, TypeDefinition, TypeDefinitionStrict } from './types'
import {
  Kind,
  Primitive, PrimitiveStrict,
  Alias, AliasStrict,
  Struct, StructStrict,
  Enum, EnumStrict,
  Union, UnionStrict,
  Lookup
} from './types'

interface Variants {
  [key: string]: number
}

interface VariantsLookup {
  [key: number]: string
}

const invertLookup = (variants: Variants): VariantsLookup => {
  return mapValues(invert(variants), flow(camelCase, upperFirst))
}

const hasNamespace = (name: string): boolean => {
  return name.indexOf('.') != -1
}

const maybeAppendNamespace = (lookup: Lookup) => (name: string, ns?: string): string => {
  // our name already has some namespace appended so we probably want to keep it
  if (hasNamespace(name)) {
    return name
  }
  // this type has already been defined so we want to keep it as-is
  if (has(lookup, name)) {
    return name
  }

  return ns == undefined ? name : [ns, name].join('.')
}

// convert external type definition to the internal one
const toStrict = (lookup: Lookup, ns?: string) => (typeDef: TypeDefinition): TypeDefinitionStrict => {

  // append namespace if defined
  const appendNamespace = maybeAppendNamespace(lookup)

  typeDef.name = appendNamespace(typeDef.name, ns)

  if ((<Primitive>typeDef).size !== undefined) {
    return { ...typeDef, kind: Kind.Primitive } as PrimitiveStrict
  }

  if ((<Alias>typeDef).alias !== undefined) {
    (<Alias>typeDef).alias = appendNamespace((<Alias>typeDef).alias, ns)
    return { ...typeDef, kind: Kind.Alias } as AliasStrict
  }

  if ((<Struct>typeDef).fields !== undefined) {
    (<Struct>typeDef).fields.forEach(field => {
      field.type = appendNamespace(field.type, ns)
    })
    return { ...typeDef, kind: Kind.Struct } as StructStrict
  }

  if ((<Enum>typeDef).variants !== undefined) {
    const def = <Enum>typeDef
    const offset = def.offset == undefined ? 0 : parseInt(def.offset as string)
    def.underlying = appendNamespace(def.underlying, ns)
    // Adjust the offset for this enum
    const variants = def.variants.map(([name, value]) => {
      return [name, value + offset]
    })

    return { ...typeDef, variants, kind: Kind.Enum } as EnumStrict
  }

  if ((<Union>typeDef).members !== undefined) {
    (<Union>typeDef).members = (<Union>typeDef).members.map(member => {
      return appendNamespace(member, ns)
    })
    return { ...typeDef, kind: Kind.Union } as UnionStrict
  }
}

// Returns the typeName of the discriminator (based on one of the variants)
// TODO: This function could be used to check if every variant has 
// valid discriminator defined in union
const findDiscType = (typeName: string, disc: string[], lookup: Lookup): string => {

  const typeDef = lookup[typeName]

  // we're last and enum so all good - return
  if (typeDef.kind === Kind.Enum && disc.length == 0) {
    return typeDef.name
  }

  // we're struct with fields so find a field with the next name
  if (typeDef.kind === Kind.Struct) {
    const [fieldName, ...discRest] = disc
    const field = typeDef.fields.find(({ name }) => name === fieldName)
    if (field === undefined) {
      throw new Error(`The discriminant error. Field ${fieldName} does not exist on ${typeDef.name}`)
    }
    // we found the field so keep recursing with the remaining path
    return findDiscType(field.type, discRest, lookup)
  }

  throw new Error(`Path to discriminator is not OK, field ${typeDef.name}`)
}

// Return an object with enum value as a key and enum variant name as a value
const getEnumLookup = (enumDef: EnumStrict): { [n: number]: string } => {
  return enumDef.variants.reduce((r, [v, k]) => ({ ...r, [k]: v }), {})
}

// Convert from loose API TypeDefinition to string internal representation
// and append the namespace if defined
const normalizeTypes = (
  types: TypeDefinition[],
  lookup: Lookup = {},
  ns?: string
): TypeDefinitionStrict[] => {
  return types.map(toStrict(lookup, ns))
}

/**
 * Default readers
 */
const readers = {
  bool: (index, length): [string, number] => [`!!buffer.readUInt8(${index})`, index + 1],
  u8: (index, length): [string, number] => [`buffer.readUInt8(${index})`, index + 1],
  u16: (index, length): [string, number] => [`buffer.readUInt16LE(${index})`, index + 2],
  u32: (index, length): [string, number] => [`buffer.readUInt32LE(${index})`, index + 4],
  'char[]': (index, length): [string, number] => [`buffer.slice(${index}, ${index + length})`, index + length]
}

/**
 * Default writers
 */
const writers = {
  bool: (index, length, path = 'v'): [string, number] => [`buffer.writeUInt8(${path}, ${index})`, index + 1],
  u8: (index, length, path = 'v'): [string, number] => [`buffer.writeUInt8(${path}, ${index})`, index + 1],
  u16: (index, length, path = 'v'): [string, number] => [`buffer.writeUInt16LE(${path}, ${index})`, index + 2],
  u32: (index, length, path = 'v'): [string, number] => [`buffer.writeUInt32LE(${path}, ${index})`, index + 4],
  'char[]': (index, length, path = 'v'): [string, number] => [`${path}.copy(buffer, ${index})`, index + length]
}

/**
 * Fast readers
 */
const fastReaders = {
  bool: (index, length): [string, number] => [`!!buffer[${index}]`, index + 1],
  u8: (index, length): [string, number] => [`buffer[${index}]`, index + 1],
  u16: (index, length): [string, number] => [`buffer[${index}] + buffer[${index + 1}] * 2 ** 8`, index + 2],
  u32: (index, length): [string, number] => [`buffer[${index}] + buffer[${index + 1}] * 2 ** 8 + buffer[${index + 2}] * 2 ** 16 + buffer[${index + 3}] * 2 ** 24`, index + 4],
  'char[]': (index, length): [string, number] => [`buffer.slice(${index}, ${index + length})`, index + length]
}

/**
 * Fast writers
 */
const fastWriters = {
  bool: (index, length, path = 'v'): [string, number] => [`buffer[${index}] = ~~${path}`, index + 1],
  u8: (index, length, path = 'v'): [string, number] => [`buffer[${index}] = ${path}`, index + 1],
  u16: (index, length, path = 'v'): [string, number] => [`
    buffer[${index}] = ${path}
    buffer[${index + 1}] = (${path} >>> 8)
  `, index + 2],
  u32: (index, length, path = 'v'): [string, number] => [`
    buffer[${index}] = ${path}
    buffer[${index + 1}] = (${path} >>> 8)
    buffer[${index + 2}] = (${path} >>> 16)
    buffer[${index + 3}] = (${path} >>> 24)
  `, index + 4],
  'char[]': (index, length, path = 'v'): [string, number] => [`${path}.copy(buffer, ${index})`, index + length]
}

const asciiReader = (index, length): [string, number] => {
  return [`buffer.toString('ascii', ${index}, ${index + length}).replace(/\u0000+$/, '')`, index + length]
}
const asciiWriter = (index, length, path = 'v'): [string, number] => {
  return [`buffer.write(${path}, ${index}, ${index + length}, 'ascii')`, index + length]
}

const toAscii = (buffer: Buffer) => buffer.toString('ascii').replace(/\u0000+$/, '')
const fromAscii = (ascii: string) => Buffer.from(ascii)

/// return the size of a given type
const getTypeSize = lookup => (type: string) => {

  const t = resolveType(lookup, type)
  const typeDef = lookup[t]

  // this is union so get the biggest of its variants
  if(typeDef.kind === Kind.Union) {
    return max(typeDef.members.map(getTypeSize(lookup)))
  }

  // primitive
  if(typeDef.kind === Kind.Primitive) {
    return typeDef.size
  }

  if(typeDef.kind === Kind.Struct) {
    return sum(map(typeDef.fields, field => {
      let size = getTypeSize(lookup)(field.type)
      if(field.length) {
        return size * field.length
      }
      return size
    }))
  }

  throw `${Errors.UNKNOWN_SIZE}:${type}`
}

// recursively resolve the name type
const resolveType = (lookup: Lookup, type: string) => {

  const lookedUp = lookup[type]

  if(!lookedUp) {
    throw `${Errors.TYPE_NOT_FOUND}:${type}`
  }

  if(lookedUp.kind === Kind.Enum) {
    return resolveType(lookup, lookedUp.underlying)
  }

  if(lookedUp.kind === Kind.Alias) {
    return resolveType(lookup, lookedUp.alias)
  }

  return type
}

const appendNamespace = maybeAppendNamespace({})
export {
  getTypeSize,
  resolveType,
  invertLookup,
  readers,
  writers,
  fastReaders,
  fastWriters,
  asciiReader,
  asciiWriter,
  fromAscii,
  toAscii,
  normalizeTypes,
  appendNamespace,
  findDiscType,
  getEnumLookup,
}
