import * as _ from 'lodash'
import { Errors } from './types'

interface Variants {
  [key: string]: number
}

interface VariantsLookup {
  [key: number]: string
}

const invertLookup = (variants: Variants): VariantsLookup => {
  return _.mapValues(_.invert(variants), _.flow(_.camelCase, _.upperFirst))
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

const getTypeSize = lookup => type => {

  const t = resolveType(lookup, type)
  const typeDef = lookup[t]

  if(typeDef.size) {
    return typeDef.size
  }

  if(typeDef.fields) {
    return _.sum(_.map(typeDef.fields, field => {
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
const resolveType = (lookup, type) => {

  const lookedUp = lookup[type]

  if(!lookedUp) {
    throw `${Errors.TYPE_NOT_FOUND}:${type}`
  }

  if(lookedUp.fields) {
    return type
  }

  if(lookedUp.alias) {
    return resolveType(lookup, lookedUp.alias)
  }

  return type
}

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
  toAscii
}
