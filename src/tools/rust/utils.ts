// Create rust comment block with description
export const doc = (description?: string): string => {
  if (description !== undefined) {
    return `/// ${description}`
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
    return ``
  }
  const derivesString = derives.join(', ')
  return `#[derive(${derivesString})]`
}

