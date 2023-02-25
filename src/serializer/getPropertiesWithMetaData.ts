import 'reflect-metadata';

export default function getPropertiesWithMetaData(target: any) {
  const propertyNames = Object.keys(target);
  return propertyNames
    .map((propertyName) => ({
      name: propertyName,
      meta: Reflect.getMetadata('meta', target, propertyName),
    }))
    .filter((property) => property.meta)
    .sort((a, b) => a.meta.order - b.meta.order);
}
