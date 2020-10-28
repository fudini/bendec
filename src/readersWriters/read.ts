import * as _ from 'lodash'
import { Errors, Kind, TypeDefinitionStrict, Lookup, Field } from '../types'
import { resolveType } from '../utils'

const genReadField = (readers, lookup: Lookup, sizes = false) => {

  return (typeName: string, length = 0, index = 0): [any, number] => {

    const key = typeName + (length ? '[]' : '')
    let reader = readers[key]
    if (reader) {
      return reader(index, length)
    }

    if (length > 0) {

      let fieldsMapped = _.range(0, length)
        .map(i => {
          let [func, newIndex] = genReadField(readers, lookup, sizes)(typeName, 0, index)
          index = newIndex
          return func
        })

      return [fieldsMapped, index]
    }

    const resolvedType = resolveType(lookup, typeName)
    const typeDef = lookup[resolvedType]
    reader = readers[resolvedType]

    // if it has its own reader use it
    if (reader) {
      return reader(index, length)
    }
    
    // resolve array
    if (typeDef.kind === Kind.Array) {
      return genReadField(readers, lookup, sizes)(typeDef.type, typeDef.length, index)
    }

    // probably another custom type
    if (lookup[typeName]) {
      return genReadFields(readers, lookup, sizes)(typeName, index)
    }

    throw `${Errors.TYPE_NOT_FOUND}:${typeName}`
  }
}

const genReadFields = (readers, lookup: Lookup, sizes = false) => {
  return (type, index = 0): [any, number] => {

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
        let [func, newIndex] = genReadField(readers, lookup, sizes)(field.type, field.length, index) 
        if (sizes) {
          obj[field.name] = [func, index, newIndex]
        } else {
          obj[field.name] = func
        }
        index = newIndex
      })

      return [obj, index]
    }

    throw new Error(`Type has not been resolved ${typeDef.name}. Are you missing a reader?`)
  }
}

const genReadFunction = (readers, lookup: Lookup, name: string, sizes = false) => {

  let [intermediate] = genReadFields(readers, lookup, sizes)(name)
  let stringified = JSON.stringify(intermediate, null, 2).replace(/\"/g, '')
  return new Function('buffer', `return ${stringified}`)
}

export { genReadFields, genReadFunction }
