interface Uri {
  address: number
  port: number
}

interface User {
  age: number
  uri: Uri
}

class UriWrapper {

  private buffer: Buffer

  constructor(buffer) {
    this.buffer = buffer
  }

  set address(v) {
    this.buffer.writeUInt32LE(v, 0)
  }

  get address() {
    return this.buffer.readUInt32LE(0)
  }

  set port(v) {
    this.buffer.writeUInt16LE(v, 4)
  }

  get port() {
    return this.buffer.readUInt16LE(4)
  }
}

// if we generate typescript
class UserWrapper {

  private buffer: Buffer
  private _uri: Uri

  constructor(buffer) {
    this.buffer = buffer
    this._uri = new UriWrapper(buffer.slice(1, 7))
  }
  
  get uri() {
    return this._uri
  }

  // if this is a custom struct
  set uri(v) {
    for (let key in v) {
      this.uri[key] = v[key]
    }
  }

  set age(v) {
    this.buffer.writeUInt8(v, 0)
  }

  get age() {
    return this.buffer.readUInt8(0)
  }
}

// object wrapper
const userWrap = (b) => {

  var buffer = b

  return {
    get uri() {
      return {
        set address(v) { buffer.writeUInt32LE(v, 0) },
        get address() { return buffer.readUInt32LE(0) },
        set port(v) { buffer.writeUInt16LE(v, 4) }, 
        get port() { return buffer.readUInt16LE(4) }
      }
    },
    // if this is a custom struct
    set uri(v) { for (let key in v) { this.uri[key] = v[key] } },
    set age(v) { buffer.writeUInt8(v, 0) },
    get age() { return buffer.readUInt8(0) }
  }
}

const buffer = Buffer.alloc(16)
const user = userWrap(buffer)

user.age = 123
user.uri.address = 255
user.uri.port = 111
// overwrite
user.uri = {
  address: 1,
  port: 2,
}

console.log(buffer)
console.log(JSON.stringify(user))
