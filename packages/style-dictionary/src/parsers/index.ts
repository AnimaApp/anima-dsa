/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parser } from 'style-dictionary';

function removeDollarSign(obj: { [key: string]: any }) {
  const cleanedObj: { [key: string]: any } = {};

  for (const prop in obj) {
    if (obj[prop]) {
      const cleanedProp = prop.replace(/^\$/, '');

      if (typeof obj[prop] === 'object' && obj[prop] !== null) {
        cleanedObj[cleanedProp] = removeDollarSign(obj[prop]);
      } else {
        cleanedObj[cleanedProp] = obj[prop];
      }
    }
  }

  return cleanedObj;
}

export const animaJSONParser: Parser = {
  pattern: /\.json$/,
  parse: ({ contents }) => {
    const notCleanedObject = JSON.parse(contents);
    const cleanedObject = removeDollarSign(notCleanedObject);
    return cleanedObject;
  },
};
