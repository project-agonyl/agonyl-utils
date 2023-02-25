import { MetaData } from './types';
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
        default:
          return Buffer.alloc(0);
      }
    });

    return Buffer.concat(buffers);
  }

  public deserialize(buffer: Buffer) {
    const properties = getPropertiesWithMetaData(this);
    let offset = 0;
    properties.forEach((property: { name: string, meta: MetaData }) => {
      let { length } = property.meta;
      if (!length) {
        length = 1;
      }

      const { type } = property.meta;
      switch (type) {
        case 'string':
          // @ts-ignore
          this[property.name] = getStringFromBuffer(buffer, offset, length);
          offset += length;
          break;
        case 'number':
          // @ts-ignore
          this[property.name] = buffer.readIntLE(offset, length);
          offset += length;
          break;
        case 'boolean':
          // @ts-ignore
          this[property.name] = buffer[offset] === 1;
          offset += 1;
          break;
        case 'byte':
          // @ts-ignore
          this[property.name] = buffer[offset];
          offset += 1;
          break;
        case 'short':
        case 'int16':
          // @ts-ignore
          this[property.name] = buffer.readUInt16LE(offset);
          offset += 2;
          break;
        case 'int':
        case 'int32':
          // @ts-ignore
          this[property.name] = buffer.readUInt32LE(offset);
          offset += 4;
          break;
        default:
          break;
      }
    });
  }
}
