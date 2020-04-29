export function formatter(data: object, fields: string[]) {
  fields.forEach((field) => {
    if (data.hasOwnProperty(field)) {
      data[field] = JSON.stringify(data[field]);
    }
  });
  return data;
}
