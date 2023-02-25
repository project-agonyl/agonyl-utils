import { describe, it, expect } from 'vitest';
import getPrettySizeFromBytes from '../getPrettySizeFromBytes';

describe('getPrettySizeFromBytes', () => {
  it('should return a pretty size from bytes', () => {
    expect(getPrettySizeFromBytes(0)).toBe('0 Byte');
    expect(getPrettySizeFromBytes(1)).toBe('1 Bytes');
    expect(getPrettySizeFromBytes(1024)).toBe('1.0 KB');
    expect(getPrettySizeFromBytes(1024 * 1024)).toBe('1.0 MB');
    expect(getPrettySizeFromBytes(1024 * 1024 * 1024)).toBe('1.0 GB');
    expect(getPrettySizeFromBytes(1024 * 1024 * 1545)).toBe('1.5 GB');
    expect(getPrettySizeFromBytes(1024 * 1024 * 1024 * 1024)).toBe('1.0 TB');
  });
});
