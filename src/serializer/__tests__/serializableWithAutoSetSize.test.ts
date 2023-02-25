import { describe, it, expect } from 'vitest';
import meta from '../meta';
import SerializableWithAutoSetSize from '../SerializableWithAutoSetSize';

class TestClass extends SerializableWithAutoSetSize {
  @meta({
    order: 1,
    type: 'int',
  })
  public size: number = 0;

  @meta({
    order: 3,
    type: 'byte',
  })
  public testByte: number = 0;

  @meta({
    order: 2,
    type: 'string',
    length: 4,
  })
  public testString: string = '';

  @meta({
    order: 4,
    type: 'int',
  })
  public testInt: number = 0;

  @meta({
    order: 5,
    type: 'number',
    length: 2,
  })
  public testNumber: number = 0;

  @meta({
    order: 6,
    type: 'boolean',
  })
  public testFalse: boolean = false;

  @meta({
    order: 7,
    type: 'boolean',
  })
  public testTrue: boolean = false;

  @meta({
    order: 8,
    type: 'short',
  })
  public testShort: number = 0;
}

describe('SerializableWithAutoSetSize Class', () => {
  it('Should serialize a class correctly by setting size', () => {
    const testClass = new TestClass();
    testClass.testString = 'test';
    testClass.testByte = 1;
    testClass.testInt = 1;
    testClass.testNumber = 1;
    testClass.testFalse = false;
    testClass.testTrue = true;
    testClass.testShort = 1;
    const serialized = testClass.serialize();
    expect(serialized).toEqual(Buffer.from([
      19, 0, 0, 0,
      116, 101, 115, 116,
      1,
      1, 0, 0, 0,
      1, 0,
      0,
      1,
      1, 0,
    ]));
  });

  it('Should deserialize a class correctly', () => {
    const buffer = Buffer.from([
      19, 0, 0, 0,
      116, 101, 115, 116,
      1,
      1, 0, 0, 0,
      1, 0,
      0,
      1,
      1, 0,
    ]);
    const testClass = new TestClass();
    testClass.deserialize(buffer);
    expect(testClass.size).toBe(19);
    expect(testClass.testString).toMatch('test');
    expect(testClass.testByte).toBe(1);
    expect(testClass.testInt).toBe(1);
    expect(testClass.testNumber).toBe(1);
    expect(testClass.testFalse).toBe(false);
    expect(testClass.testTrue).toBe(true);
    expect(testClass.testShort).toBe(1);
  });
});
