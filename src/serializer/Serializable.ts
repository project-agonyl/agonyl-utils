import type { MetaData, SerializableDataType } from './types';
import { getBytesFromNumberLE, getFixedLengthBytesFromString, getStringFromBuffer } from '../functions';
import getPropertiesWithMetaData from './getPropertiesWithMetaData';

export default class Serializable {
  public serialize() {
    const properties = getPropertiesWithMetaData(this);
    const buffers = properties.map((property: { name: string, meta: MetaData }) => {
      let { length } = property.meta;
      if (!length) {
        length = 1;
      }

      const { type } = property.meta;

      // @ts-ignore
      const value = this[property.name];
      if (!Array.isArray(value)) {
        return this.serializeValue(value, type, length);
      }

      return Buffer.concat(value.map((item) => this.serializeValue(item, type, length)));
    });

    return Buffer.concat(buffers);
  }

  public toJson() {
    const properties = getPropertiesWithMetaData(this);
    const jsonArray = properties.map((property: { name: string, meta: MetaData }) => {
      // @ts-ignore
      const value = this[property.name];

      let processedValue = value;
      if (property.meta.type === 'serializable' && value && typeof value.toJson === 'function') {
        processedValue = value.toJson();
      }

      return {
        name: property.name,
        type: property.meta.type,
        value: processedValue,
        order: property.meta.order,
        isArray: property.meta.isArray || false,
        arraySize: property.meta.arraySize || 1,
        length: property.meta.length || 1,
      };
    });

    return jsonArray;
  }

  public fromJson(jsonArray: Array<{
    name: string;
    type: SerializableDataType;
    value: any;
    order: number;
    isArray: boolean;
    arraySize: number;
    length: number;
  }>) {
    jsonArray.forEach((item) => {
      // @ts-ignore
      if (Object.prototype.hasOwnProperty.call(this, item.name)) {
        const processedValue = item.value;

        if (item.type === 'serializable' && item.value && Array.isArray(item.value)) {
          // Reconstruct nested serializable object
          const propertyMeta = Reflect.getMetadata('meta', this, item.name);
          if (propertyMeta && typeof (this as any)[item.name]?.fromJson === 'function') {
            // @ts-ignore
            (this as any)[item.name].fromJson(item.value);
            return;
          }
        }

        // @ts-ignore
        this[item.name] = processedValue;
      }
    });
  }

  public deserialize(buffer: Buffer) {
    const properties = getPropertiesWithMetaData(this);
    let offset = 0;
    properties.forEach((property: { name: string, meta: MetaData }) => {
      let { length, arraySize } = property.meta;
      if (!length) {
        length = 1;
      }

      const { type, isArray } = property.meta;
      if (!arraySize || !isArray || type === 'serializable') {
        arraySize = 1;
      }

      if (isArray) {
        // @ts-ignore
        this[property.name] = [];
      }

      for (let i = 0; i < arraySize; i += 1) {
        switch (type) {
          case 'string':
            if (isArray) {
              // @ts-ignore
              this[property.name].push(getStringFromBuffer(buffer, offset, length));
            } else {
              // @ts-ignore
              this[property.name] = getStringFromBuffer(buffer, offset, length);
            }

            offset += length;
            break;
          case 'number':
            if (isArray) {
              // @ts-ignore
              this[property.name].push(buffer.readIntLE(offset, length));
            } else {
              // @ts-ignore
              this[property.name] = buffer.readIntLE(offset, length);
            }

            offset += length;
            break;
          case 'boolean':
            if (isArray) {
              // @ts-ignore
              this[property.name].push(buffer[offset] === 1);
            } else {
              // @ts-ignore
              this[property.name] = buffer[offset] === 1;
            }

            offset += 1;
            break;
          case 'byte':
          case 'int8':
            if (isArray) {
              // @ts-ignore
              this[property.name].push(buffer[offset]);
            } else {
              // @ts-ignore
              this[property.name] = buffer[offset];
            }

            offset += 1;
            break;
          case 'short':
          case 'int16':
            if (isArray) {
              // @ts-ignore
              this[property.name].push(buffer.readUInt16LE(offset));
            } else {
              // @ts-ignore
              this[property.name] = buffer.readUInt16LE(offset);
            }

            offset += 2;
            break;
          case 'int':
          case 'int32':
            if (isArray) {
              // @ts-ignore
              this[property.name].push(buffer.readUInt32LE(offset));
            } else {
              // @ts-ignore
              this[property.name] = buffer.readUInt32LE(offset);
            }

            offset += 4;
            break;
          case 'serializable':
            // @ts-ignore
            if (typeof this[property.name].deserialize === 'function' && typeof this[property.name].serialize === 'function') {
              // @ts-ignore
              this[property.name].deserialize(buffer.subarray(offset));
              // @ts-ignore
              offset += this[property.name].serialize().length;
            }

            break;
          default:
            break;
        }
      }
    });
  }

  private serializeValue(value: any, type: SerializableDataType, length = 1) {
    switch (type) {
      case 'string':
        return Buffer.from(getFixedLengthBytesFromString(value, length));
      case 'number':
        return Buffer.from(getBytesFromNumberLE(value, length));
      case 'boolean':
        return Buffer.from(getBytesFromNumberLE(value ? 1 : 0, 1));
      case 'byte':
      case 'int8':
        return Buffer.from(getBytesFromNumberLE(value, 1));
      case 'short':
      case 'int16':
        return Buffer.from(getBytesFromNumberLE(value, 2));
      case 'int':
      case 'int32':
        return Buffer.from(getBytesFromNumberLE(value));
      case 'serializable':
        return typeof value.serialize === 'function' ? value.serialize() : Buffer.alloc(0);
      default:
        return Buffer.alloc(0);
    }
  }
}
