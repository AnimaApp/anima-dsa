import { type DesignTokenMap } from '@animaapp/token-core';
import { type AntdConfig } from './types';
import { ANTD_TOKEN_KEY } from './constants';
import { isDesignToken, isTokenValueAlias, resolveAlias } from '../utils';

export const getAntdTheme = <T extends DesignTokenMap>(
  dsToken: T,
): AntdConfig => {
  return convertDesignTokensToTheme(dsToken);
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
      `Couldn't find any antd seed tokens (${ANTD_TOKEN_KEY})`,
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
  antdTokens: Record<string, object | number | string>
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
      if (typeof newValue !== 'string' && typeof newValue !== 'number') {
        throw new Error(
          `Unexpected value in design tokens json file for key = ${key} expecting string got: ${JSON.stringify(newValue)}, new formats will come soon`,
        );
      }
      antdTokens[key] = newValue;
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

