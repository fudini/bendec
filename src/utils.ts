import * as _ from 'lodash'

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
  bool: (index, length) => [`!!buffer.readUInt8(${index})`, index + 1],
  u8: (index, length) => [`buffer.readUInt8(${index})`, index + 1],
  u16: (index, length) => [`buffer.readUInt16LE(${index})`, index + 2],
  u32: (index, length) => [`buffer.readUInt32LE(${index})`, index + 4],
  'char[]': (index, length) => [`buffer.slice(${index}, ${index + length})`, index + length]
}

/**
 * Default writers
 */
const writers = {
  bool: (index, length, path = 'v') => [`!!buffer.writeUInt8(${path}, ${index})`, 1],
  u8: (index, length, path = 'v') => [`buffer.writeUInt8(${path}, ${index})`, 1],
  u16: (index, length, path = 'v') => [`buffer.writeUInt16LE(${path}, ${index})`, 2],
  u32: (index, length, path = 'v') => [`buffer.writeUInt32LE(${path}, ${index})`, 4],
  'char[]': (index, length, path = 'v') => [`${path}.copy(buffer, ${index})`, length]
}

const asciiReader = (index, length) => [`buffer.toString('ascii', ${index}, ${index + length}).replace(/\u0000+$/, '')`, index + length]
const asciiWriter = (index, length, path = 'v') => [`buffer.write(${path}, ${index}, ${index + length}, 'ascii')`, length]

const toAscii = (buffer: Buffer) => buffer.toString('ascii').replace(/\u0000+$/, '')
const fromAscii = (ascii: string) => Buffer.from(ascii)

export { invertLookup, readers, writers, asciiReader, asciiWriter, fromAscii, toAscii }
