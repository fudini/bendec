import _ from 'lodash'
import { indent } from '../utils'
import { DefaultDerives, TypeMeta, TypeMetaStrict } from './types'

// Create rust comment block with description
export const doc = (description: string, ind: number = 0): string => {
  if (description !== undefined) {
    return indent(ind)(`/// ${description}`)
  }
  return ''
}

// Convert dot syntax into double colon (::)
export const toRustNS = (type: string): string => {
  return type.split('.').join('::')
}

// Create derive annotation from array of items
export const createDerives = (derives: string[]): string => {
  if (derives.length === 0) {
    return ''
  }
  const derivesString = derives.join(', ')
  return `#[derive(${derivesString})]`
}

export const defaultDerives: DefaultDerives = {
  struct: ['Serialize', 'Deserialize'],
  enum: ['Debug', 'Copy', 'Clone', 'Eq', 'PartialEq', 'Serialize', 'Deserialize'],
  bitflags: ['Serialize', 'Deserialize'],
  newtype: [],
}

export const typeMetaToStrict = (typeMeta?: TypeMeta): TypeMetaStrict => {

  if (typeMeta === undefined) {
    return {
      annotations: [],
      newtype: null,
      fields: {},
      bitflags: false,
      implConst: false,
      union: null,
      publicFields: null,
      privateFields: [],
    }
  }

  return {
    ...typeMeta,
    annotations: typeMeta.annotations || [],
    newtype: typeMeta.newtype || null,
    fields: typeMeta.fields || {},
    bitflags: !!typeMeta.bitflags,
    implConst: !!typeMeta.implConst,
    union: typeMeta.union || null,
    publicFields: typeMeta.publicFields || null,
    privateFields: typeMeta.privateFields || [],
  }
}

