import { describe, it, expect } from 'vitest';
import BinaryReader from '../BinaryReader';

const testBuffer = Buffer.from([
  19, 0, 0, 0,
  116, 101, 115, 116,
  1,
  1, 0, 0, 0,
  1, 0,
  0,
  1,
  1, 0,
]);

describe('BinaryReader class', () => {
  it('should read int32', () => {
    const reader = new BinaryReader(testBuffer);
    expect(reader.readInt32()).toBe(19);
  });

  it('should read int32 big endian', () => {
    const reader = new BinaryReader(testBuffer, 0, 'BE');
    expect(reader.readInt32()).toBe(318767104);
  });

  it('should read uint32', () => {
    const reader = new BinaryReader(testBuffer);
    expect(reader.readUInt32()).toBe(19);
  });

  it('should read uint32 big endian', () => {
    const reader = new BinaryReader(testBuffer, 0, 'BE');
    expect(reader.readUInt32()).toBe(318767104);
  });

  it('should read a string', () => {
    const reader = new BinaryReader(testBuffer, 4);
    const result = reader.readString(4);
    expect(result).toMatch('test');
  });

  it('should read a byte', () => {
    const reader = new BinaryReader(testBuffer);
    const result = reader.readByte();
    expect(result).toBe(19);
  });

  it('should read int16', () => {
    const reader = new BinaryReader(testBuffer, 5);
    expect(reader.readInt16()).toBe(29541);
  });

  it('should read int16 big endian', () => {
    const reader = new BinaryReader(testBuffer, 5, 'BE');
    expect(reader.readInt16()).toBe(25971);
  });

  it('should read uint16', () => {
    const reader = new BinaryReader(testBuffer, 5);
    expect(reader.readUInt16()).toBe(29541);
  });

  it('should read uint16 big endian', () => {
    const reader = new BinaryReader(testBuffer, 5, 'BE');
    expect(reader.readUInt16()).toBe(25971);
  });

  it('should get offset correctly', () => {
    const reader = new BinaryReader(testBuffer);
    reader.readInt16();
    expect(reader.getCurrentOffset()).toBe(2);
  });

  it('should set offset correctly', () => {
    const reader = new BinaryReader(testBuffer);
    reader.setCurrentOffset(5);
    expect(reader.getCurrentOffset()).toBe(5);
    reader.setCurrentOffset(19);
    expect(reader.getCurrentOffset()).toBe(19);
    expect(() => reader.setCurrentOffset(20)).toThrow('Offset 20 is out of range');
    expect(() => reader.setCurrentOffset(-1)).toThrow('Offset -1 is out of range');
  });

  it('should reset offset correctly', () => {
    const reader = new BinaryReader(testBuffer);
    reader.readInt32();
    reader.resetOffset();
    expect(reader.getCurrentOffset()).toBe(0);
  });

  it('should throw error on incorrect path', () => {
    expect(() => new BinaryReader('invalid-path')).toThrow('File invalid-path does not exist');
  });

  it('should read bytes', () => {
    const reader = new BinaryReader(testBuffer);
    expect(reader.readBytes(4)).toStrictEqual(Buffer.from([19, 0, 0, 0]));
  });

  it('should say end of buffer correctly', () => {
    const reader = new BinaryReader(testBuffer);
    expect(reader.isEndOfBuffer()).toBe(false);
    reader.readBytes(19);
    expect(reader.isEndOfBuffer()).toBe(true);
  });
});
