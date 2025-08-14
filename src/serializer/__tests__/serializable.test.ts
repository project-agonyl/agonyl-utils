import { describe, it, expect } from 'vitest';
import Serializable from '../Serializable';
import meta from '../meta';
import type { SerializableDataType } from '../types';

class SubClass extends Serializable {
  @meta({
    order: 1,
    type: 'string',
    length: 4,
  })
  public subString: string = '';

  @meta({
    order: 2,
    type: 'int',
  })
  public subInt: number = 0;
}

class TestClass extends Serializable {
  @meta({
    order: 2,
    type: 'byte',
  })
  public testByte: number = 0;

  @meta({
    order: 1,
    type: 'string',
    length: 4,
  })
  public testString: string = '';

  @meta({
    order: 3,
    type: 'int',
  })
  public testInt: number = 0;

  @meta({
    order: 4,
    type: 'number',
    length: 2,
  })
  public testNumber: number = 0;

  @meta({
    order: 5,
    type: 'boolean',
  })
  public testFalse: boolean = false;

  @meta({
    order: 6,
    type: 'boolean',
  })
  public testTrue: boolean = false;

  @meta({
    order: 8,
    type: 'short',
  })
  public testShort: number = 0;

  @meta({
    order: 7,
    type: 'serializable',
  })
  public testClass: SubClass = new SubClass();

  @meta({
    order: 8,
    type: 'short',
    isArray: true,
    arraySize: 5,
  })
  public testArrayShort: number[] = [];
}

describe('Serializable Class', () => {
  it('Should serialize a class correctly', () => {
    const testClass = new TestClass();
    testClass.testString = 'test';
    testClass.testByte = 1;
    testClass.testInt = 1;
    testClass.testNumber = 1;
    testClass.testFalse = false;
    testClass.testTrue = true;
    testClass.testShort = 1;
    testClass.testClass.subInt = 5;
    testClass.testClass.subString = 'test';
    testClass.testArrayShort = [1, 2, 3, 4, 5];
    const serialized = testClass.serialize();
    expect(serialized).toEqual(Buffer.from([
      116, 101, 115, 116,
      1,
      1, 0, 0, 0,
      1, 0,
      0,
      1,
      116, 101, 115, 116,
      5, 0, 0, 0,
      1, 0,
      1, 0, 2, 0, 3, 0, 4, 0, 5, 0,
    ]));
  });

  it('Should deserialize a class correctly', () => {
    const buffer = Buffer.from([
      116, 101, 115, 116,
      1,
      1, 0, 0, 0,
      1, 0,
      0,
      1,
      116, 101, 115, 116,
      5, 0, 0, 0,
      1, 0,
      1, 0, 2, 0, 3, 0, 4, 0, 5, 0,
    ]);
    const testClass = new TestClass();
    testClass.deserialize(buffer);
    expect(testClass.testString).toMatch('test');
    expect(testClass.testByte).toBe(1);
    expect(testClass.testInt).toBe(1);
    expect(testClass.testNumber).toBe(1);
    expect(testClass.testFalse).toBe(false);
    expect(testClass.testTrue).toBe(true);
    expect(testClass.testShort).toBe(1);
    expect(testClass.testClass.subInt).toBe(5);
    expect(testClass.testClass.subString).toMatch('test');
    expect(testClass.testArrayShort).toEqual([1, 2, 3, 4, 5]);
  });

  it('Should convert to JSON array with preserved ordering', () => {
    const testClass = new TestClass();
    testClass.testString = 'test';
    testClass.testByte = 1;
    testClass.testInt = 1;
    testClass.testNumber = 1;
    testClass.testFalse = false;
    testClass.testTrue = true;
    testClass.testShort = 1;
    testClass.testClass.subInt = 5;
    testClass.testClass.subString = 'test';
    testClass.testArrayShort = [1, 2, 3, 4, 5];

    const jsonArray = testClass.toJson();

    // Verify the array preserves order based on metadata order
    expect(jsonArray).toHaveLength(9);

    // Check first property (order: 1)
    expect(jsonArray[0]).toEqual({
      name: 'testString',
      type: 'string',
      value: 'test',
      order: 1,
      isArray: false,
      arraySize: 1,
      length: 4,
    });

    // Check second property (order: 2)
    expect(jsonArray[1]).toEqual({
      name: 'testByte',
      type: 'byte',
      value: 1,
      order: 2,
      isArray: false,
      arraySize: 1,
      length: 1,
    });

    // Check serializable property (testClass)
    expect(jsonArray[6]).toEqual({
      name: 'testClass',
      type: 'serializable',
      value: [
        {
          name: 'subString',
          type: 'string',
          value: 'test',
          order: 1,
          isArray: false,
          arraySize: 1,
          length: 4,
        },
        {
          name: 'subInt',
          type: 'int',
          value: 5,
          order: 2,
          isArray: false,
          arraySize: 1,
          length: 1,
        },
      ],
      order: 7,
      isArray: false,
      arraySize: 1,
      length: 1,
    });

    // Check array property
    expect(jsonArray[8]).toEqual({
      name: 'testArrayShort',
      type: 'short',
      value: [1, 2, 3, 4, 5],
      order: 8,
      isArray: true,
      arraySize: 5,
      length: 1,
    });

    // Verify all properties are included with correct metadata
    const propertyNames = jsonArray.map((item) => item.name);
    expect(propertyNames).toEqual([
      'testString',
      'testByte',
      'testInt',
      'testNumber',
      'testFalse',
      'testTrue',
      'testClass',
      'testShort',
      'testArrayShort',
    ]);
  });

  it('Should handle serializable types correctly', () => {
    const testClass = new TestClass();
    testClass.testClass.subString = 'nested';
    testClass.testClass.subInt = 42;

    const jsonArray = testClass.toJson();
    const testClassProperty = jsonArray.find((item) => item.name === 'testClass');

    expect(testClassProperty).toBeDefined();
    expect(testClassProperty?.type).toBe('serializable');
    expect(testClassProperty?.value).toEqual([
      {
        name: 'subString',
        type: 'string',
        value: 'nested',
        order: 1,
        isArray: false,
        arraySize: 1,
        length: 4,
      },
      {
        name: 'subInt',
        type: 'int',
        value: 42,
        order: 2,
        isArray: false,
        arraySize: 1,
        length: 1,
      },
    ]);
  });

  it('Should handle null/undefined serializable objects gracefully', () => {
    const testClass = new TestClass();
    // @ts-ignore - Setting to null to test edge case
    testClass.testClass = null;

    const jsonArray = testClass.toJson();
    const testClassProperty = jsonArray.find((item) => item.name === 'testClass');

    expect(testClassProperty).toBeDefined();
    expect(testClassProperty?.type).toBe('serializable');
    expect(testClassProperty?.value).toBeNull();
  });

  it('Should load data from JSON array', () => {
    const testClass = new TestClass();
    const jsonArray: Array<{
      name: string;
      type: SerializableDataType;
      value: any;
      order: number;
      isArray: boolean;
      arraySize: number;
      length: number;
    }> = [
      {
        name: 'testString',
        type: 'string',
        value: 'loaded',
        order: 1,
        isArray: false,
        arraySize: 1,
        length: 4,
      },
      {
        name: 'testByte',
        type: 'byte',
        value: 42,
        order: 2,
        isArray: false,
        arraySize: 1,
        length: 1,
      },
      {
        name: 'testInt',
        type: 'int',
        value: 12345,
        order: 3,
        isArray: false,
        arraySize: 1,
        length: 1,
      },
      {
        name: 'testClass',
        type: 'serializable',
        value: [
          {
            name: 'subString',
            type: 'string',
            value: 'nested',
            order: 1,
            isArray: false,
            arraySize: 1,
            length: 4,
          },
          {
            name: 'subInt',
            type: 'int',
            value: 999,
            order: 2,
            isArray: false,
            arraySize: 1,
            length: 1,
          },
        ],
        order: 7,
        isArray: false,
        arraySize: 1,
        length: 1,
      },
    ];

    testClass.fromJson(jsonArray);

    expect(testClass.testString).toBe('loaded');
    expect(testClass.testByte).toBe(42);
    expect(testClass.testInt).toBe(12345);
    expect(testClass.testClass.subString).toBe('nested');
    expect(testClass.testClass.subInt).toBe(999);
  });

  it('Should handle round-trip conversion (toJson -> fromJson)', () => {
    const originalClass = new TestClass();
    originalClass.testString = 'original';
    originalClass.testByte = 100;
    originalClass.testInt = 200;
    originalClass.testClass.subString = 'sub-original';
    originalClass.testClass.subInt = 300;
    originalClass.testArrayShort = [10, 20, 30];

    const jsonArray = originalClass.toJson();
    const loadedClass = new TestClass();
    loadedClass.fromJson(jsonArray);

    expect(loadedClass.testString).toBe(originalClass.testString);
    expect(loadedClass.testByte).toBe(originalClass.testByte);
    expect(loadedClass.testInt).toBe(originalClass.testInt);
    expect(loadedClass.testClass.subString).toBe(originalClass.testClass.subString);
    expect(loadedClass.testClass.subInt).toBe(originalClass.testClass.subInt);
    expect(loadedClass.testArrayShort).toEqual(originalClass.testArrayShort);
  });
});
