import MD5 from "crypto-js/md5";
import HEX from "crypto-js/enc-hex";

export const hashString = (string: string): string => {
  const hashSum = MD5(string);
  const hex = hashSum.toString(HEX);
  return hex;
};
