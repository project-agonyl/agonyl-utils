import 'reflect-metadata';
import { MetaData } from './types';

export default function meta(metaData: MetaData) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('meta', metaData, target, propertyKey);
  };
}
