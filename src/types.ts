export interface Primitive {
  //kind: 'primitive'
  name: string
  size: number
}

export interface Alias {
  //kind: 'alias'
  name: string
  alias: string
}

export interface CustomField {
  name: string
  type: string
  // if length is specified it's an array
  length?: number
}

export interface Custom {
  //kind: 'custom'
  name: string
  fields: CustomField[]
}

export type TypeDefinition = Primitive | Alias | Custom

interface VariantGetter {
  encode(msg: any): string
  decode(buf: Buffer): string
}

export interface Config {
  types: TypeDefinition[]
  readers?: any
  writers?: any
  getVariant: VariantGetter
}

export interface EncoderDecoder {
  encode(o: any): Buffer
  decode(b: Buffer): any
  wrap(name: string, b: Buffer): any
}
