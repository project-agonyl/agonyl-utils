# @project-agonyl/agonyl-utils

## 1.4.0

### Minor Changes

- a540b7f: - Added JSON serialization methods to Serializable class
  - `toJson()`: Converts serializable data to JSON array format with preserved ordering
  - `fromJson()`: Loads data from JSON array back into class instance
  - Supports nested serializable objects with recursive conversion
  - Maintains complete metadata structure for round-trip serialization

## 1.3.0

### Minor Changes

- a6b19d3: Added array support as serializable class property

## 1.2.0

### Minor Changes

- 4b124af: Added serializable type for serializing class properties in a class

## 1.1.1

### Patch Changes

- ec65ab4: Exported `isValidJsonString` function

## 1.1.0

### Minor Changes

- 3477a87: Added new utilities
  - `BinaryReader` class that provides methods to read binary data from a buffer/file.
  - `getStringFromBuffer` function that returns a string from a buffer.

## 1.0.1

### Patch Changes

- 49f744d: Initial release.
