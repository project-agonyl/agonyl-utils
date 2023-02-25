import * as fs from 'fs';
import { ByteOrder, LittleEndianByteOrder } from './types';
import { getStringFromBuffer } from '../functions';

export default class BinaryReader {
  private offset: number = 0;

  private readonly data: Buffer;

  private filePath: string = '';

  private readonly byteOrder: ByteOrder;

  constructor(input: Buffer | string, startingOffset = 0, byteOrder:ByteOrder = 'LE') {
    this.byteOrder = byteOrder;
    this.offset = startingOffset;
    if (typeof input === 'string') {
      if (!fs.existsSync(input)) {
        throw new Error(`File ${input} does not exist`);
      }

      this.filePath = input;
      this.data = fs.readFileSync(input);
    } else {
      this.data = input;
    }
  }

  public resetOffset() {
    this.offset = 0;
    return this;
  }

  public setCurrentOffset(offset: number) {
    if (offset < 0 || offset > this.data.length) {
      throw new Error(`Offset ${offset} is out of range`);
    }

    this.offset = offset;
    return this;
  }

  public getCurrentOffset() {
    return this.offset;
  }

  public readByte() {
    const result = this.data.readInt8(this.offset);
    this.offset += 1;
    return result;
  }

  public readBytes(length: number) {
    const result = this.data.subarray(this.offset, this.offset + length);
    this.offset += length;
    return result;
  }

  public readUInt16() {
    const result = this.byteOrder === LittleEndianByteOrder
      ? this.data.readUInt16LE(this.offset)
      : this.data.readUInt16BE(this.offset);
    this.offset += 2;
    return result;
  }

  public readInt16() {
    const result = this.byteOrder === LittleEndianByteOrder
      ? this.data.readInt16LE(this.offset)
      : this.data.readInt16BE(this.offset);
    this.offset += 2;
    return result;
  }

  public readUInt32() {
    const result = this.byteOrder === LittleEndianByteOrder
      ? this.data.readUInt32LE(this.offset)
      : this.data.readUInt32BE(this.offset);
    this.offset += 4;
    return result;
  }

  public readInt32() {
    const result = this.byteOrder === LittleEndianByteOrder
      ? this.data.readInt32LE(this.offset)
      : this.data.readInt32BE(this.offset);
    this.offset += 4;
    return result;
  }

  public readString(length: number) {
    const result = getStringFromBuffer(this.data, this.offset, this.offset + length);
    this.offset += length;
    return result;
  }

  public isEndOfBuffer() {
    return this.offset >= this.data.length;
  }
}
