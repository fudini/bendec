# Bendec

### Binary encoder / decoder featuring fixed-size arrays

TODO:

* TypeScript definitions generator
* Enum type
* Better syntax than JSON to define structs (Rust?)
* Add validate function that will check the correctness  
  of the object you're trying to encode

* Wrapper for types with getters and setters

```js
const user = bender.wrap('User', buffer)
// or (ideally)
const user = bender.wrap<User>(buffer)

// custom functions
user.setFirstName('Lorem')
// nested { address: { postcode: 'E1 123' }}
user.setAddress_postcode('E1 123')

// get / set
user.firstName = 'Lorem'
user.address_postcode = 'E1 123'


// with object
function wrap(buffer) {

  return {
    getName() {
      return buffer.read() // pseudo
    }
    setName(name) {
      buffer.write(name) // pseudo
    }
  }
}


// with class
class User {

  constructor(buffer) {
    this.buffer = buffer
  }

  get name() {
    return this.buffer.read() // pseudo
  }

  set name(name) {
    this.buffer.write(name) // pseudo
  }
}
```
