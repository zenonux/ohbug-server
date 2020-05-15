import { clone } from 'ramda';

export function formatter<T extends {}>(data: object, fields: string[]): T {
  const cloneData = clone(data);
  fields.forEach((field) => {
    if (cloneData.hasOwnProperty(field)) {
      cloneData[field] = JSON.stringify(data[field]);
    }
  });
  return cloneData as T;
}
