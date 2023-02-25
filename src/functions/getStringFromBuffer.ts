export default function getStringFromBuffer(buffer: Buffer, start: number, length: number) {
  const dataLength = buffer.length;
  if (start < 0 || start > dataLength || length < 0 || length > dataLength) {
    return '';
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    if (buffer[start + i] === 0) {
      break;
    }

    result += String.fromCharCode(buffer[start + i]);
  }

  return result;
}
