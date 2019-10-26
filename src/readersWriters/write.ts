import * as _ from 'lodash'
import { resolveType } from '../utils'

const genWriteFields = (writers, lookup) => {
  
  const genWriteField = (buffer, type, index = 0, length = 0, path = 'data', indent = '') => {

    // see if we have pre-resolved writer
    // eg for alias char -> u8 we want to know original type
    const key = type + (length ? '[]' : '')
    var writer = writers[key]

    if (writer) {
      let [w, newIndex] = writer(index, length, path)
      buffer.push(indent + w)
      return [buffer, newIndex]
    }

    // generate array writing
    if (length > 0) {
      let newIndex = index
      buffer.push(`${indent}if (${path} !== undefined) {`)
      _.range(0, length).map(arrayIndex => {
        let [w, i] = genWriteField(buffer, type, newIndex, 0, path + '[' + arrayIndex.toString() + ']', indent + '  ')
        newIndex = i
      })
      buffer.push(`${indent}}`) 
      return [buffer, newIndex]
    }

    const resolvedType = resolveType(lookup, type)
    const typeDef = lookup[resolvedType]
    writer = writers[resolvedType]

    if(writer) {
      let [w, newIndex] = writer(index, length, path) 
      buffer.push(indent + w)
      return [buffer, newIndex]
    }

    let newIndex = index
    buffer.push(`${indent}if (${path} !== undefined) {`)
    typeDef.fields.forEach(field => {
      let [b, i] = genWriteField(buffer, field.type, newIndex, field.length, path + '.' + field.name, indent + '  ')
      newIndex = i
    })

    buffer.push(`${indent}}`)
    return [buffer, newIndex]
  }

  return genWriteField
}

const genWriteFunction = (writers, lookup, type) => {

  let [intermediate] = genWriteFields(writers, lookup)([], type)
  let stringified = intermediate.join('\n')
  let size = lookup[type].size
  return new Function('data', `buffer = Buffer.alloc(${size})`, `${stringified}
return buffer    
`)
}

export { genWriteFunction }
