import { describe, it, expect } from 'vitest';
import getFixedLengthBytesFromString from '../getFixedLengthBytesFromString';

describe('getFixedLengthBytesFromString', () => {
  it('should return an array of bytes of given length', () => {
    expect(getFixedLengthBytesFromString('test', 2)).toEqual([116, 101]);
    expect(getFixedLengthBytesFromString('test', 4)).toEqual([116, 101, 115, 116]);
    expect(getFixedLengthBytesFromString('test', 6)).toEqual([116, 101, 115, 116, 0, 0]);
  });
});
