export const isAlphaNumeric = (str) => {
  const regex = /^[a-z0-9]+$/i;
  return regex.test(str);
};
