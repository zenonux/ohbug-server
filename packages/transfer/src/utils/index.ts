export function formatter<T extends {}>(data: object, fields: string[]): T {
  fields.forEach((field) => {
    if (data.hasOwnProperty(field)) {
      data[field] = JSON.stringify(data[field]);
    }
  });
  return data as T;
}
