import { describe, it, expect } from 'vitest';
import isValidJsonString from '../isValidJsonString';

describe('isValidJsonString', () => {
  it('should return true if a string is valid JSON or else false', () => {
    expect(isValidJsonString('{"test": "test"}')).toBe(true);
    expect(isValidJsonString('{"test": "test"')).toBe(false);
  });
});
