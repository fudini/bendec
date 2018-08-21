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
  bool: (path, index, length) => [`!!buffer.writeUInt8(${path}, ${index})`, 1],
  u8: (path, index, length) => [`buffer.writeUInt8(${path}, ${index})`, 1],
  u16: (path, index, length) => [`buffer.writeUInt16LE(${path}, ${index})`, 2],
  u32: (path, index, length) => [`buffer.writeUInt32LE(${path}, ${index})`, 4],
  'char[]': (path, index, length) => [`${path}.copy(buffer, ${index})`, length]
}

export { invertLookup, readers, writers }
