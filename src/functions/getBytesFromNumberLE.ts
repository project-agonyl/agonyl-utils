export default function getBytesFromNumberLE(num: number, bytes = 4) {
  const result: Array<number> = [];
  for (let i = 0; i < bytes; i += 1) {
    result.push(num & 0xff);
    // eslint-disable-next-line no-param-reassign
    num >>= 8;
  }

  return result;
}
