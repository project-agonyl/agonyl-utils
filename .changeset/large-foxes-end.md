---
"@project-agonyl/agonyl-utils": minor
---

- Added JSON serialization methods to Serializable class
  - `toJson()`: Converts serializable data to JSON array format with preserved ordering
  - `fromJson()`: Loads data from JSON array back into class instance
  - Supports nested serializable objects with recursive conversion
  - Maintains complete metadata structure for round-trip serialization
