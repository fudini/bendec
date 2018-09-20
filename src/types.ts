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

type Reader = (index: number, length: number) => [string, number]
type Writer = (index: number, length: number, path?: string) => [string, number]

interface VariantGetter {
  encode(msg: any): string
  decode(buf: Buffer): string
}

export interface Config {
  types: TypeDefinition[]
  readers?: { [t: string]: Reader }
  writers?: { [t: string]: Writer }
  getVariant: VariantGetter
}

export interface EncoderDecoder {
  encode(o: any): Buffer
  decode(b: Buffer): any
  wrap(name: string, b: Buffer): any
}

export const Errors = {
  TYPE_NOT_FOUND: 'TYPE_NOT_FOUND',
  UNKNOWN_SIZE: 'UNKNOWN_SIZE'
}

export {
  Reader,
  Writer
}
