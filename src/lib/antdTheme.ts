import { DesignTokenMap, isDesignToken } from '@animaapp/token-core';
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
  if (isDesignToken(tokens)) return {};
  for (const key in tokens) {
    const token = tokens[key];
    if (token == null) continue;
    if (isDesignToken(token) && typeof token.$value === 'string') {
      antdTokens[key] = token.$value;
    }
  }
  return antdTokens;
};
