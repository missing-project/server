export const parseDate = (str: string) => {
  const y: string = str.substring(0, 4);
  const m: string = str.substring(4, 6);
  const d: string = str.substring(6, 8);
  return new Date(+y, +m - 1, +d);
};
