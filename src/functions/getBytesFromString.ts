export default function getBytesFromString(str: string) {
  const bytes = [];
  for (let i = 0; i < str.length; i += 1) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}
