import Serializable from './Serializable';

export default class SerializableWithAutoSetSize extends Serializable {
  public serialize() {
    const buffer = super.serialize();
    const size = buffer.length;
    buffer[0] = size & 0xff;
    buffer[1] = (size >> 8) & 0xff;
    buffer[2] = (size >> 16) & 0xff;
    buffer[3] = (size >> 24) & 0xff;
    return buffer;
  }
}
