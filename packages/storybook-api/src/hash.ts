import MD5 from "crypto-js/md5";

export const hashString = (string: string): string => {
  const hashSum = MD5(string);
  const hex = hashSum.toString(CryptoJS.enc.Hex);
  return hex;
};
