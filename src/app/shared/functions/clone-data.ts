export const cloneData = (data: any[]) =>
  data.map((item) => Object.assign({}, item));
