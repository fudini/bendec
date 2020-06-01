import { keyBy, mapValues, mapKeys } from 'lodash'
import {
  Kind,
  Struct,
  Config,
  Lookup,
  Reader,
  Writer,
  BufferWrapper,
  TypeDefinition,
  TypeDefinitionStrict,
  VariantGetter
} from './types'

import {
  genWrapFunction,
  genWrapFunction2, // function get/set
  genReadFunction,
  genWriteFunction,
} from './readersWriters/index'

import {
  readers as defaultReaders,
  writers as defaultWriters,
  getTypeSize,
  normalizeTypes,
  appendNamespace,
} from './utils'

const error = new Error('You used encode/decode without specifying getVariant methods in config')

// getVariant is to be deprecated but we want to keep it for backwards compatibility
const emptyVariantGetter = {
  encode() { throw error },
  decode(buf: Buffer) { throw error }
}

const defaultConfig: Config = {
  types: [],
  readers: {},
  writers: {},
}

class Bendec<T> {
  private getVariant: VariantGetter = emptyVariantGetter
  private lookup: Lookup = {}
  private writers: { [t: string]: Writer } = {}
  private readers: { [t: string]: Reader } = {}
  private decoders: Map<string, (buffer: Buffer) => T> = new Map()
  private encoders: Map<string, (o: T, b?: Buffer) => Buffer> = new Map()
  private wrapperFactories: Map<string, (b: Buffer) => BufferWrapper<T>> = new Map()

  private wrappers: Map<string, BufferWrapper<T>> = new Map()
  private wrappers2: Map<string, BufferWrapper<T>> = new Map()

  constructor(config: Config = defaultConfig) {

    const {
      types = [],
      readers = {},
      writers = {},
      namespace,
      getVariant,
    } = config

    this.writers = { ...defaultWriters, ...writers }
    this.readers = { ...defaultReaders, ...readers }

    this.writers = mapKeys(this.writers, (_, name) => appendNamespace(name, namespace))
    this.readers = mapKeys(this.readers, (_, name) => appendNamespace(name, namespace))

    this.addTypes(types, namespace)

    if (getVariant != undefined) {
      this.getVariant = getVariant
    }
  }

  /**
   * Register types under given namespace or root if namespace is not given
   */
  addTypes(types: TypeDefinition[], namespace?: string) {

    types = normalizeTypes(types, this.lookup, namespace)

    const lookup = { ...this.lookup, ...keyBy(types, i => i.name) }

    types.forEach(def => {
      this.lookup[def.name] = {
        ...def,
        size: getTypeSize(lookup)(def.name)
      } as TypeDefinitionStrict
    })

    // compile all types from config
    // We're only interested in custom structs
    // So Our TypeDefinition type Union has 'kind' parameter specified
    types
      .filter(type => type.kind == Kind.Struct)
      .forEach(type => {

        let decodeFunc = <any>genReadFunction(this.readers, this.lookup, type.name)
        let encodeFunc = <any>genWriteFunction(this.writers, this.lookup, type.name)
        this.decoders.set(type.name, decodeFunc)
        this.encoders.set(type.name, encodeFunc)

        let wrapFunc = <any>genWrapFunction(this.readers, this.writers, this.lookup, type.name)

        this.wrapperFactories.set(type.name, wrapFunc)

        // instantiate with empty buffer
        let wrapInstance = wrapFunc(Buffer.alloc((<any>this.lookup[type.name]).size))
        
        this.wrappers.set(type.name, wrapInstance)

        let wrapFunc2 = <any>genWrapFunction2(this.readers, this.writers, this.lookup, type.name)
        // instantiate with empty buffer
        let wrapInstance2 = wrapFunc2(Buffer.alloc((<any>this.lookup[type.name]).size))
        
        this.wrappers2.set(type.name, wrapInstance2)
      })
  }

  /**
   * Decode the Buffer into an object - DEPRECATED - use decodeAs
   */
  decode(buffer: Buffer): T {
    const type = this.getVariant.decode(buffer)
    return this.decoders.get(type)(buffer)
  }

  /**
   * Encode object into Buffer - DEPRECATED - use encodeAs
   */
  encode(obj: T, buffer?: Buffer): Buffer {
    const typeName = this.getVariant.encode(obj)
    return this.encoders.get(typeName)(obj, buffer)
  }

  /**
   * Encode object into Buffer as specified type
   * This method won't use a 'getVariant' function to determine
   * what type to encode as
   */
  encodeAs(obj: T, typeName: string, buffer?: Buffer): Buffer {
    return this.encoders.get(typeName)(obj, buffer)
  }

  /**
   * Decode object from Buffer as specified type
   * This method won't use a 'getVariant' function to determine
   * what type to decode from 
   */
  decodeAs(buffer: Buffer, typeName: string): T {
    return this.decoders.get(typeName)(buffer)
  }

  /**
   * Wrap a buffer in a Type getter / setter
   *
   * WARNING: It will reuse a cached wrapper in the bendec instance
   * therefore you can't have 2 or more of these at the same time
   *
   * To create a new instance use method getWrapper
   *
   * TODO: typeName is stringly typed
   */
  wrap(typeName: string, buffer: Buffer): BufferWrapper<T> {
    return this.wrappers.get(typeName).setBuffer(buffer)
  }

  /**
   * Wrap a buffer in a Type getter / setter based on functions
   *
   * WARNING: works similar to wrap (wrapper is reused)
   */
  wrap2(typeName: string, buffer: Buffer): BufferWrapper<T> {
    return this.wrappers2.get(typeName).setBuffer(buffer)
  }

  /**
   * Returns a function that will create a new instance of BufferWrapper
   *
   * TODO: typeName is stringly typed
   */
  getWrapper(typeName: string): BufferWrapper<T> {
    let buffer = Buffer.alloc(this.getSize(typeName))
    return this.wrapperFactories.get(typeName)(buffer)
  }

  /**
   * Get size in bytes of a type by name
   * TODO: stringly typed
   */
  getSize(typeName: string): number {
    return (<any>this.lookup[typeName]).size
  }
}

export { Bendec }

