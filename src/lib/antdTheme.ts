import { TOKEN_COLOR_TYPE } from '../constants/design-tokens';
import type { DesignTokenMap } from '@animaapp/token-core';
import type { AntdConfig } from '../converters/antd';

export const getAntdTheme = <T extends DesignTokenMap>(
  dsToken: T,
): AntdConfig => {
  return convertDesignTokenToTheme(dsToken);
};

const convertDesignTokenToTheme = (
  designTokens: DesignTokenMap,
): AntdConfig => {
  const tokens = convertDesignTokenColorsToTheme(designTokens);
  return { token: tokens };
};

const convertDesignTokenColorsToTheme = (
  designTokens: DesignTokenMap,
): AntdConfig['token'] => {
  const antdTokens: Record<string, string> = {};
  for (const key in designTokens) {
    if (designTokens[key].$type === TOKEN_COLOR_TYPE) {
      antdTokens[key] = designTokens[key].$value;
    }
  }
  return antdTokens;
};
