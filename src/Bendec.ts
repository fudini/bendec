import * as _ from 'lodash'
import {
  Primitive,
  Custom,
  Alias,
  EncoderDecoder,
  Config,
  TypeDefinition
} from './types'
import { readers, writers } from './utils'

interface Lookup {
  [typeName: string]: TypeDefinition
}

const genReadField = (readers, lookup) => (field, index = 0): [any, number] => {

  const key = field.type + (field.length ? '[]' : '')
  var reader = readers[key]
  if (reader) {
    return reader(index, field.length)
  }

  if (field.length) {

    let fieldsMapped = []

    _.range(0, field.length).forEach(i => {
      let [func, newIndex] = genReadField(readers, lookup)({type: field.type}, index)
      index = newIndex
      fieldsMapped.push(func)
    })

    return [fieldsMapped, index]
  }

  const resolvedType = resolveType(lookup, field.type)
  reader = readers[resolvedType]

  // if it has its own reader use it
  if (reader) {
    return reader(index, field.length)
  }

  // probably another custom type
  if (lookup[field.type]) {
    return genReadFields(readers, lookup)(field.type, index)
  }

  throw `${Errors.TYPE_NOT_FOUND}:${field.type}`
}

const genReadFields = (readers, lookup) => (type, index = 0) => {

  const typeDef = lookup[type]

  if (!typeDef) {
    throw `${Errors.TYPE_NOT_FOUND}:${type}`
  }

  if (typeDef.alias) {
    return genReadFields(readers, lookup)(typeDef.alias, index)
  }

  var obj = {}

  typeDef.fields.forEach(field => {
    let [func, newIndex] = genReadField(readers, lookup)(field, index) 
    index = newIndex
    obj[field.name] = func
  })

  return [obj, index]
}

const genReadFunction = (readers, lookup, name) => {

  let intermediate = genReadFields(readers, lookup)(name)[0]
  let stringified = JSON.stringify(intermediate, null, 2).replace(/\"/g, '')
  return new Function('buffer', `return ${stringified}`)
}

const genWriteFunction = (writers, lookup, type) => {

  let [intermediate] = encodeFunction(writers, lookup)([], type)
  let stringified = intermediate.join('\n')
  let size = lookup[type].size
  return new Function('data', `buffer = Buffer.alloc(${size})`, `${stringified}
return buffer    
`)
}

const encodeFunction = (writers, lookup) => {
  
  const encode = (buffer, type, index = 0, length = 0, path = 'data', indent = '') => {

    // see if we have pre-resolved writer
    // eg for alias char -> u8 we want to know original type
    const key = type + (length ? '[]' : '')
    var writer = writers[key]

    if (writer) {
      let [w, i] = writer(path, index, length)
      buffer.push(indent + w)
      return [buffer, index + i]
    }

    // encode array
    if (length > 0) {
      let newIndex = index
      buffer.push(`${indent}if (${path} !== undefined) {`)
      _.range(0, length).map(arrayIndex => {
        let [w, i] = encode(buffer, type, newIndex, 0, path + '[' + arrayIndex.toString() + ']', indent + '  ')
        newIndex = i
      })
      buffer.push(`${indent}}`) 
      return [buffer, newIndex]
    }

    const resolvedType = resolveType(lookup, type)
    const typeDef = lookup[resolvedType]
    writer = writers[resolvedType]

    if(writer) {
      let [w, l] = writer(path, index, length) 
      buffer.push(indent + w)
      return [buffer, index + l]
    }

    let newIndex = index
    buffer.push(`${indent}if (${path} !== undefined) {`)
    typeDef.fields.forEach(field => {
      let [b, i] = encode(buffer, field.type, newIndex, field.length, path + '.' + field.name, indent + '  ')
      newIndex = i
    })

    buffer.push(`${indent}}`)
    return [buffer, newIndex]
  }

  return encode
}

class Bendec implements EncoderDecoder {

  private config: Config
  private lookup: Lookup = {}
  private writers: any
  private readers: any
  public decoders: Map<string, (o: any) => Buffer> = new Map()
  public encoders: Map<string, (buffer: Buffer) => any> = new Map()

  constructor(config: Config) {

    this.config = config
    this.writers = Object.assign({}, writers, config.writers)
    this.readers = Object.assign({}, readers, config.readers)

    const lookup = _.keyBy(config.types, i => i.name)

    // precalculate sizes
    this.lookup = _.mapValues(lookup, (def) => {
      return _.assign({}, def, {
        size: getTypeSize(lookup)(def.name)
      })
    })

    // compile all types from config
    config.types.forEach(type => {

      // Don't encode primitives and aliases
      if ((<Primitive>type).size || (<Alias>type).alias) {
        return
      }

      let decodeFunc = <any>genReadFunction(this.readers, lookup, type.name)
      let encodeFunc = <any>genWriteFunction(this.writers, this.lookup, type.name)
      this.decoders.set(type.name, decodeFunc)
      this.encoders.set(type.name, encodeFunc)
    })
  }

  decode(buffer) {
    const type = this.config.getVariant.decode(buffer)
    return this.decoders.get(type)(buffer)
  }

  encode(obj) {
    const type = this.config.getVariant.encode(obj)
    return this.encoders.get(type)(obj)
  }
}

const Errors = {
  TYPE_NOT_FOUND: 'TYPE_NOT_FOUND',
  UNKNOWN_SIZE: 'UNKNOWN_SIZE'
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

export { Bendec, Errors }

