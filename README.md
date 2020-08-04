# binland
[![npm version](https://badge.fury.io/js/binland.svg)](https://badge.fury.io/js/binland)

Binary serialization and deserialization language.

## Installation
NPM:
```shell script
npm install binland
```

Yarn:
```shell script
yarn add binland
```

## Syntax

Inspired by TypeLanguage, so they are pretty similar, but with little difference;

### Comments:
```
// this is a comment

type Apple; // this is a declaration of a Type
```

### Types
Every type excluding native have a unique identifier generated using CRC32 of its declaration without the word "type" and with removed whitespaces.

```
crc32("Vector<!T>{length:uint;items:!T[];};")
```

#### Native types:
There are few native types declared.

```
native T; // generic type
native !T; // same as T but (todo: describe but) upd: but identifier is not saved during serialization, exists to reduce serialization size
native int;
native uint;
native float;
native string;
native byte;
native T[]; // sequence of T
native !T[]; // sequence of !T

native bool = byte;
```

#### Type aliases:
You can easily alias you type using this syntax:
```
type TYPE_NAME = [...TYPE_NAME| ];
```
Example:
```
type Array = Vector | Sequence; // `Array` can be either `Vector` or `Sequense`
```

#### Boxed types:
Every (excluding `native T[];`) native type has a "boxed" equivalent. It is recommended to never use them.

```
type Int = int;
type Uint = uint;
type Float = float;
type String = string;
type Byte = byte;
type Bool = bool;
```

#### Custom types:

You can define your own type by using this syntax:
```
type TYPE_NAME?<[...T, ]> ?{
    [...PARAM_NAME: T;]
};
```

For example:
```
type Attribute {
    name: string;
    description: string;
};

type Good {
    name: string;
    price: float;
    attributes: Vector<Attribute>;
}
```

#### STD types:
There are few predefined types:
```
type Vector<T> {
    length: uint;
    items: !T[];
};

type Sequence {
    length: uint;
    items: T[];
};

type Array = Vector | Sequence;
```

### Functions
Syntax of functions are almost the same as types.

```
type RETURN_TYPE = T;
type PARAM_TYPE = T;

function FUNCTION_NAME(
    [...PARAM_NAME:PARAM_TYPE,]
): RETURN_TYPE;
```

Example:
```
function getUser(id: uint): User;

function updateUserInfo(
    user_id: uint;
    name: string;
    address: string;
): User;
```

Generating identifiers is the same as for types.
```
crc32("getUser(id:uint):User;")
```

## Serialization

**Serialization is straightforward.**

Numeric types are serialized in little endian format.

### Serializing types
```
type User {
    id: uint;
    name: string;
};

// User(777, "David")
// -> 2850815204 777 5 0 0 0 68 97 118 105 100
// -> (2850815204 (777) ((5) (0 0 0 68 97 118 105 100)))

// 2850815204 = type identifier
// 777 = value of param "id"
// 5 = length of string value of param "name"
// after 5 = string value of param "name" (David)
```

### Serializing types with generics:
```
type Vector<T> {
    length: uint;
    items: !T[];
};

// Vector<User>(2, [User(666, "David"), User(999, "Diana")])
// -> 856845756 2850815204 2 666 5 0 0 0 68 97 118 105 100 999 5 0 0 0 68 105 97 110 97
// -> (
        856845756 - Vector identifier
            (2850815204) - generic type identifier
            (2) - vector length
                ((666) ((5) (0 0 0 68 97 118 105 100))) - !User
                ((999) ((5) (0 0 0 68 105 97 110 97)))) - !User
       )



type Sequence {
    length: uint;
    items: T[];
};

// Sequence(2, [User(666, "David"), User(999, "Diana")])
// -> 856845756 2 2850815204 666 5 0 0 0 68 97 118 105 100 2850815204 999 5 0 0 0 68 105 97 110 97
// -> (
        2001895159 - Sequence identifier
            (2) - sequence length
                (2850815204 ((666) ((5) (0 0 0 68 97 118 105 100)))) - User
                (2850815204 ((999) ((5) (0 0 0 68 105 97 110 97))))) - User
       )
```