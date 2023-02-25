import getBytesFromString from './getBytesFromString';

export default function getFixedLengthBytesFromString(str: string, length: number) {
  const result = getBytesFromString(str);
  if (result.length > length) {
    result.splice(length, result.length - length);
    return result;
  }

  for (let i = result.length; i < length; i += 1) {
    result.push(0);
  }

  return result;
}
