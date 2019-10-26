import * as _ from 'lodash'
import { Errors, Kind, TypeDefinitionStrict, Lookup, Field } from '../types'
import { resolveType } from '../utils'

const genReadField = (readers, lookup: Lookup, sizes = false) => (field: Field, index = 0): [any, number] => {

  const key = field.type + (field.length ? '[]' : '')
  let reader = readers[key]
  if (reader) {
    return reader(index, field.length)
  }

  if (field.length) {

    let fieldsMapped = _.range(0, field.length)
      .map(i => {
        let [func, newIndex] = genReadField(readers, lookup, sizes)({name: field.name, type: field.type}, index)
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

const genReadFields = (readers, lookup: Lookup, sizes = false) => (type, index = 0) => {

  const typeDef = lookup[type]

  if (!typeDef) {
    throw `${Errors.TYPE_NOT_FOUND}:${type}`
  }

  // resolve alias
  if (typeDef.kind === Kind.Alias) {
    return genReadFields(readers, lookup)(typeDef.alias, index)
  }

  // resolve enum
  if (typeDef.kind === Kind.Enum) {
    return genReadFields(readers, lookup)(typeDef.underlying, index)
  }

  // unions as fields are not supported yet
  if (typeDef.kind === Kind.Union) {
    throw new Error(`Unions in struct field position are not supported: ${typeDef}`)
  }
  
  if (typeDef.kind === Kind.Struct) {
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
}

const genReadFunction = (readers, lookup: Lookup, name: string, sizes = false) => {

  let [intermediate] = genReadFields(readers, lookup, sizes)(name)
  let stringified = JSON.stringify(intermediate, null, 2).replace(/\"/g, '')
  return new Function('buffer', `return ${stringified}`)
}

export { genReadFields, genReadFunction }
