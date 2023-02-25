import { describe, it, expect } from 'vitest';
import getStringFromBuffer from '../getStringFromBuffer';

describe('getStringFromBuffer', () => {
  it('should return string from a buffer if given offset and length', () => {
    const buffer = Buffer.from([116, 101, 115, 116, 0, 0, 116, 0]);
    expect(getStringFromBuffer(buffer, 0, 4)).toMatch('test');
    expect(getStringFromBuffer(buffer, 1, 3)).toMatch('est');
    expect(getStringFromBuffer(buffer, 1, 4)).toMatch('est');
    expect(getStringFromBuffer(buffer, -1, 4)).toMatch('');
    expect(getStringFromBuffer(buffer, 8, 4)).toMatch('');
  });
});
