const allowedDataTypes = [
  'string',
  'number',
  'boolean',
  'byte',
  'short',
  'int',
  'int16',
  'int32',
  'int64',
] as const;

export type SerializableDataType = typeof allowedDataTypes[number];

export type MetaData = {
  order: number;
  type: SerializableDataType;
  length?: number;
};