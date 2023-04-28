import { type DesignTokenMap } from '@animaapp/token-core';
import { ANTD_TOKEN_KEY, AntdConfig } from '../converters/antd';

export const getAntdTheme = <T extends DesignTokenMap>(
  dsToken: T,
): AntdConfig => {
  return convertDesignTokensToTheme(dsToken);
};

const convertDesignTokensToTheme = (
  designTokens: DesignTokenMap,
): AntdConfig => {
  const tokens = convertDesignTokenColorsToTheme(designTokens);
  return { token: tokens };
};

const convertDesignTokenColorsToTheme = (
  designTokens: DesignTokenMap,
): AntdConfig['token'] => {
  const antdTokens: Record<string, string> = {};
  const tokens = designTokens[ANTD_TOKEN_KEY];
  if (!tokens) {
    console.warn(
      `Couldn't find any antd seed tokens (${ANTD_TOKEN_KEY})`,
    );
    return {};
  }
  if ("$value" in tokens) {
    throw new Error(
      `$value as a root key in the antd keys (${ANTD_TOKEN_KEY})`,
    );
  }
  for (const key in tokens) {
    const token = tokens[key];
    if (token == null) continue;
    if (typeof token !== 'object')
      throw new Error(
        `Unexpected value in design tokens json file for key = ${key} expecting object`,
      );
    if ("$value" in token && typeof token.$value === 'string') {
      antdTokens[key] = token.$value;
    }
  }
  return antdTokens;
};
