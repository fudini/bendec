# Bendec

### Binary encoder / decoder featuring fixed-size arrays

Supports: Primitives, Structs, Enums, Unions

Generators: Rust, TypeScript, C++

TODO:

* ~~TypeScript definitions generator~~
* ~~Enum type~~
* Add validate function that will check the correctness  
  of the object you're trying to encode
* ~~Wrapper for types with getters and setters~~
* read-only wrappers

```js
const bendec = new Bendec({
    definitions, // todo
    getVariant   // todo
})

// get your Buffer from somewhere
const buffer = Buffer.alloc(bendec.getSize('User'))

// wrap the buffer 
const user = bendec.wrap('User', buffer)

// just get / set properties
user.firstName = 'Lorem'
// nested object
user.address.postcode = 'E1 123'

// your Buffer is now updated
console.log(buffer)

```
