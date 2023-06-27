![Bendec](./src/assets/bendec-logo.svg)

# Code generator for Rust, TypeScript, C++ and Java
## Supports: Primitives, Structs, Enums, Unions, Arrays, Aliases
---

### Type Definitions:
```json
[{
  "kind": "Struct",
  "name": "User",
  "fields": [{
    "name": "firstName",
    "type": "char",
    "length": 16 // It's an Array
  }, {
    "name": "lastName",
    "type": "char",
    "length": 16
  }, {
    "name": "uri",
    "type": "Uri"
  }, {
    "name": "age",
    "type": "Age"
  }]
}]
```

### Generated Rust code:
```rust
#[repr(C, packed)]
#[derive(Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct User {
  pub first_name: [u8; 16],
  pub last_name: [u8; 16],
  pub uri: Uri, // type definition omitted
  pub age: Age,
}
```

### Generated C++ code:
```cpp
struct User {
    char firstName[16];
    char lastName[16];
    Uri uri;
    Age age;

    friend std::ostream &operator << (std::ostream &, const User &);
};
```

### Generated TypeScript code:
```typescript
export interface User {
  firstName: Buffer // Can be overriden to `string`
  lastName: Buffer
  uri: Uri
  age: Age
}
```

### Generated Java code:
```java
// look in /src/tests/generated/java/
```


# Binary encoder / decoder featuring fixed-size arrays for JavaScript

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
