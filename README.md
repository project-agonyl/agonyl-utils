# Agonyl Utils
Assorted set of NodeJS utilities that can used for developing tools and services for A3 Online.

## Usage

Install the package using NPM:

    npm i @project-agonyl/agonyl-utils


## Documentation

### Utility Classes

#### Serializable

A serializable class utility. It provides a `serialize()` method that returns a binary 
representation of the class and a `deserialize()` method that takes a binary representation and populates the class.

Usage:

```typescript
    import { Serializable, meta } from '@project-agonyl/agonyl-utils';

    class MySerializable extends Serializable {

        @meta({
           type: 'string', 
           order: 1,
           length: 20
        })
        public myProperty: string = '';
    }

    // Serialize
    const mySerializable = new MySerializable();
    mySerializable.myProperty = 'Hello World!';
    const serialized = mySerializable.serialize();
    
    // Deserialize
    const deserializable = new MySerializable();
    deserializable.deserialize(serialized);
    console.log(deserializable.myProperty); // 'Hello World!'
```

Here the meta decorator is used to define the serialization order, type and length of the property.
If meta is not defined, the property will be ignored during serialization.

The following types are supported:
- string
- number
- boolean
- byte
- short
- int
- int16
- int32
- int64

#### SerializableWithAutoSetSize

A serializable class utility that automatically sets the size of the serialized data during serialization.

Usage:

```typescript
    import { SerializableWithAutoSetSize, meta } from '@project-agonyl/agonyl-utils';

    class MySerializable extends SerializableWithAutoSetSize {
        
        @meta({
            type: 'int',
            order: 1
        })
        public size: number = 0;
        
        @meta({
           type: 'string', 
           order: 2,
           length: 20
        })
        public myProperty: string = '';
    }

    // Serialize
    const mySerializable = new MySerializable();
    mySerializable.myProperty = 'Hello World!';
    const serialized = mySerializable.serialize();
    
    // Deserialize
    const deserializable = new MySerializable();
    deserializable.deserialize(serialized);
    console.log(deserializable.myProperty); // 'Hello World!'
```

It is important to note that the size property must be defined in the class and must be the first property 
in the serialization order. The size property will be overwritten during serialization even if it is defined.


### Utility functions

| Function                                                               | Description                                                                  |
|------------------------------------------------------------------------|------------------------------------------------------------------------------|
| `getBytesFromNumberLE(num: number, bytes = 4): number[]`               | Returns a buffer with the specified number of bytes in little endian format. |
| `getBytesFromString(str: string): number[]`                            | Returns a buffer with the string in UTF-8 format.                            |
| `getFixedLengthBytesFromString(str: string, length: number): number[]` | Returns a buffer with the string in UTF-8 format with the specified length.  |
| `getPrettySizeFromBytes(bytes: number): string`                        | Returns a human readable string from the specified number of bytes.          |
| `isValidJsonString(str: string): boolean`                              | Returns true if the string is a valid JSON string.                           | 
