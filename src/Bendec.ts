import * as _ from 'lodash'
import {
  Primitive,
  Alias,
  Config,
  TypeDefinition,
  Reader,
  Writer,
  BufferWrapper,
} from './types'

import {
  genWrapFunction,
  genWrapFunction2, // function get/set
  genReadFunction,
  genWriteFunction,
} from './generators/index'

import {
  readers,
  writers,
  getTypeSize,
} from './utils'

interface Lookup {
  [typeName: string]: TypeDefinition
}

class Bendec<T> {

  private config: Config
  private lookup: Lookup = {}
  private writers: { [t: string]: Writer }
  private readers: { [t: string]: Reader }
  private decoders: Map<string, (buffer: Buffer) => T> = new Map()
  private encoders: Map<string, (o: T, b?: Buffer) => Buffer> = new Map()
  private wrapperFactories: Map<string, (b: Buffer) => BufferWrapper<T>> = new Map()

  private wrappers: Map<string, BufferWrapper<T>> = new Map()
  private wrappers2: Map<string, BufferWrapper<T>> = new Map()

  constructor(config: Config) {

    this.config = config
    this.writers = Object.assign({}, writers, config.writers)
    this.readers = Object.assign({}, readers, config.readers)

    const lookup = _.keyBy(config.types, i => i.name)

    // precalculate sizes
    this.lookup = _.mapValues(lookup, (def) => {
      return _.assign({}, def, {
        size: getTypeSize(lookup)(def.name)
      })
    })

    // compile all types from config
    config.types.forEach(type => {

      // Don't encode primitives and aliases
      if ((<Primitive>type).size || (<Alias>type).alias) {
        return
      }

      let decodeFunc = <any>genReadFunction(this.readers, lookup, type.name)
      let encodeFunc = <any>genWriteFunction(this.writers, this.lookup, type.name)
      this.decoders.set(type.name, decodeFunc)
      this.encoders.set(type.name, encodeFunc)

      let wrapFunc = <any>genWrapFunction(this.readers, this.writers, lookup, type.name)

      this.wrapperFactories.set(type.name, wrapFunc)

      // instantiate with empty buffer
      let wrapInstance = wrapFunc(Buffer.alloc((<any>this.lookup[type.name]).size))
      
      this.wrappers.set(type.name, wrapInstance)

      let wrapFunc2 = <any>genWrapFunction2(this.readers, this.writers, lookup, type.name)
      // instantiate with empty buffer
      let wrapInstance2 = wrapFunc2(Buffer.alloc((<any>this.lookup[type.name]).size))
      
      this.wrappers2.set(type.name, wrapInstance2)

    })
  }

  /**
   * Decode the Buffer into an object
   */
  decode(buffer: Buffer): T {
    const type = this.config.getVariant.decode(buffer)
    return this.decoders.get(type)(buffer)
  }

  /**
   * Encode object into Buffer
   */
  encode(obj: T, buffer?: Buffer): Buffer {
    const typeName = this.config.getVariant.encode(obj)
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

