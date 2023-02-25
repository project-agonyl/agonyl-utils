import { describe, it, expect } from 'vitest';
import getBytesFromNumberLE from '../getBytesFromNumberLE';

describe('getBytesFromNumberLE', () => {
  it('should return an array of bytes based on number and byte length', () => {
    expect(getBytesFromNumberLE(123456789)).toEqual([0x15, 0xcd, 0x5b, 0x07]);
    expect(getBytesFromNumberLE(123456789, 4)).toEqual([0x15, 0xcd, 0x5b, 0x07]);
    expect(getBytesFromNumberLE(123456789, 8)).toEqual([0x15, 0xcd, 0x5b, 0x07, 0x00, 0x00, 0x00, 0x00]);
    expect(getBytesFromNumberLE(123456789, 2)).toEqual([0x15, 0xcd]);
  });
});
