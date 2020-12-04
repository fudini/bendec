import { negate, isEmpty } from 'lodash'

// Create rust comment block with description
export const doc = (desc?: string): string => {
  if (desc !== undefined) {
    return `/// ${desc}`
  }
  return ''
}

// Poor man's left pad
export const indent = (i: number) => (str: string) => {
  return '                    '.substr(-i) + str
}

// Convert dot syntax into double colon (::)
export const toRustNS = (type: string): string => {
  return type.split('.').join('::')
}

// Create derive annotation from array of items
export const createDerives = (derives: string[]): string => {
  if (derives.length === 0) {
    return ``
  }
  const derivesString = derives.join(', ')
  return `#[derive(${derivesString})]`
}

// To remove gaps from annotations
export const smoosh = (strings: string[]): string  => {
  return strings.filter(negate(isEmpty)).join('\n')
}
