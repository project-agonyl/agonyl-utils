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
  'serializable',
  'int8',
] as const;

export type SerializableDataType = typeof allowedDataTypes[number];

export type MetaData = {
  order: number;
  type: SerializableDataType;
  length?: number;
  isArray?: never;
  arraySize?: never;
} | {
  order: number;
  type: SerializableDataType;
  length?: number;
  isArray: boolean;
  arraySize: number;
};
