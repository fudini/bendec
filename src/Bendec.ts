import * as _ from 'lodash'
import {
  Primitive,
  Alias,
  Config,
  TypeDefinition,
  Reader,
  Writer,
} from './types'
import {
  genWrapFunction,
  genReadFunction,
  genWriteFunction,
} from './generators/index'

import {
  readers,
  writers,
  getTypeSize
} from './utils'

interface Lookup {
  [typeName: string]: TypeDefinition
}

interface BufferWrapper {
  setBuffer(buffer: Buffer): any
}

class Bendec {

  private config: Config
  private lookup: Lookup = {}
  private writers: { [t: string]: Writer }
  private readers: { [t: string]: Reader }
  public decoders: Map<string, (o: any) => Buffer> = new Map()
  public encoders: Map<string, (buffer: Buffer) => any> = new Map()
  public wrappers: Map<string, BufferWrapper> = new Map()

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
      // instantiate with empty buffer
      let wrapInstance = wrapFunc(Buffer.alloc((<any>this.lookup[type.name]).size))
      
      this.wrappers.set(type.name, wrapInstance)
    })
  }

  decode(buffer) {
    const type = this.config.getVariant.decode(buffer)
    return this.decoders.get(type)(buffer)
  }

  encode(obj) {
    const type = this.config.getVariant.encode(obj)
    return this.encoders.get(type)(obj)
  }

  wrap(typeName: string, buffer: Buffer): any {
    return this.wrappers.get(typeName).setBuffer(buffer)
  }

  getSize(typeName: string): number {
    return (<any>this.lookup[typeName]).size
  }
}

export { Bendec }

