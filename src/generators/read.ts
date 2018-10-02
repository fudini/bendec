import * as _ from 'lodash'
import { Errors } from '../types'
import { resolveType } from '../utils'

const genReadField = (readers, lookup, sizes = false) => (field, index = 0): [any, number] => {

  const key = field.type + (field.length ? '[]' : '')
  var reader = readers[key]
  if (reader) {
    return reader(index, field.length)
  }

  if (field.length) {

    let fieldsMapped = _.range(0, field.length)
      .map(i => {
        let [func, newIndex] = genReadField(readers, lookup, sizes)({type: field.type}, index)
        index = newIndex
        return func
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
    return genReadFields(readers, lookup, sizes)(field.type, index)
  }

  throw `${Errors.TYPE_NOT_FOUND}:${field.type}`
}

const genReadFields = (readers, lookup, sizes = false) => (type, index = 0) => {

  const typeDef = lookup[type]

  if (!typeDef) {
    throw `${Errors.TYPE_NOT_FOUND}:${type}`
  }

  if (typeDef.alias) {
    return genReadFields(readers, lookup)(typeDef.alias, index)
  }

  var obj = {}

  typeDef.fields.forEach(field => {
    let [func, newIndex] = genReadField(readers, lookup, sizes)(field, index) 
    if (sizes) {
      obj[field.name] = [func, index, newIndex]
    } else {
      obj[field.name] = func
    }
    index = newIndex
  })

  return [obj, index]
}

const genReadFunction = (readers, lookup, name, sizes = false) => {

  let [intermediate] = genReadFields(readers, lookup, sizes)(name)
  let stringified = JSON.stringify(intermediate, null, 2).replace(/\"/g, '')
  return new Function('buffer', `return ${stringified}`)
}

export { genReadFields, genReadFunction }
