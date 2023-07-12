import { type DesignTokenMap } from '@animaapp/token-core';
import { type AntdConfig } from './types';
import { ANTD_TOKEN_KEY } from './constants';
import { isDesignToken, isTokenValueAlias, resolveAlias } from '../utils';

export const getAntdTheme = <T extends DesignTokenMap>(
  dsToken: T,
): AntdConfig => {
  console.log(dsToken);
  const cleanObj = addDollarSign(dsToken);
  console.log(cleanObj);
  return convertDesignTokensToTheme(cleanObj);
};

const convertDesignTokensToTheme = (
  designTokens: DesignTokenMap,
): AntdConfig => {
  const antdTokens: AntdConfig = {
    token: {},
    components: {},
  };
  const fullTheme = designTokens[ANTD_TOKEN_KEY];
  if (!fullTheme) {
    console.warn(
      `Couldn't find any antd tokens (${ANTD_TOKEN_KEY})`,
    );
    return antdTokens;
  }
  if ("$value" in fullTheme) {
    throw new Error(
      `$value as a root key in the antd keys (${ANTD_TOKEN_KEY})`,
    );
  }
  tokensToAntdValue(fullTheme, { antdTokens, fullDesignTokens: designTokens });
  return antdTokens;
};

const tokensToAntdValue = (tokens: DesignTokenMap, ctx: {
  antdTokens: Record<string, object | number | string | boolean>
  fullDesignTokens: DesignTokenMap
}) => {
  const { antdTokens, fullDesignTokens } = ctx;
  for (const key in tokens) {
    const token = tokens[key];
    if (token == null) continue;
    if (typeof token !== 'object')
      throw new Error(
        `Unexpected value in design tokens json file for key = ${key} expecting object`,
      );
    if (isDesignToken(token)) {
      let newValue = token.$value;
      if (isTokenValueAlias(newValue)) {
        newValue = resolveAlias(fullDesignTokens, newValue).$value;
      }
      if (newValue == null) {
        throw new Error(
          `Unexpected value in design tokens json file for key = ${key} expecting value`,
        );
      };
      if (typeof newValue === 'number' || typeof newValue === 'boolean') {
        antdTokens[key] = newValue;
      } else if (typeof newValue === 'object') {
        console.log(newValue);
        const newString = flattenToString(newValue);
        antdTokens[key] = newString;
      } else {
        const value = parseFloat(newValue);
        if (isNaN(value)) {
          antdTokens[key] = newValue;
        } else {
          antdTokens[key] = value;
        }
      }
    } else {
      const group = {};
      antdTokens[key] = group;
      tokensToAntdValue(token, {
        antdTokens: group,
        fullDesignTokens,
      });
    }
  }
};

interface AnyObject {
  [key: string]: any;
}

function flattenToString(input: AnyObject | AnyObject[]): string {
  function flatten(obj: AnyObject): string {
    return Object.values(obj)
      .map((value) => {
        if (Array.isArray(value)) {
          return flattenToString(value);
        } else {
          return value.toString();
        }
      })
      .join(' ');
  }

  if (Array.isArray(input)) {
    return input.map((item) => flatten(item)).join(', ');
  } else {
    return flatten(input);
  }
}

function addDollarSign(obj: { [key: string]: any }) {
  const cleanedObj: { [key: string]: any } = {};

  for (const prop in obj) {
    if (obj[prop]) {
      const cleanedProp = prop.replace(/^type$/, '$type').replace(/^value$/, '$value');

      if (typeof obj[prop] === 'object' && obj[prop] !== null && !Array.isArray(obj[prop])) {
        cleanedObj[cleanedProp] = addDollarSign(obj[prop]);
      } else {
        cleanedObj[cleanedProp] = obj[prop];
      }
    }
  }

  return cleanedObj;
}
