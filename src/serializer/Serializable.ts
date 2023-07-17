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
