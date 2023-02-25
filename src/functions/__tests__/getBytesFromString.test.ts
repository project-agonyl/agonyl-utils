import { describe, it, expect } from 'vitest';
import getBytesFromString from '../getBytesFromString';

describe('getBytesFromString', () => {
  it('should return an array of bytes', () => {
    const result = getBytesFromString('test');
    expect(result).toEqual([116, 101, 115, 116]);
  });
});
