import { TOKEN_COLOR_TYPE } from '../constants/design-tokens';
import type { DesignTokenTheme } from '../constants/types';
import type { AntdConfig } from '../converters/antd';

export const getAntdTheme = <T extends DesignTokenTheme>(
  dsToken: T,
): AntdConfig => {
  return convertDesignTokenToTheme(dsToken);
};

const convertDesignTokenToTheme = (
  designTokens: DesignTokenTheme,
): AntdConfig => {
  const tokens = convertDesignTokenColorsToTheme(designTokens);
  return { token: tokens };
};

const convertDesignTokenColorsToTheme = (
  designTokens: DesignTokenTheme,
): AntdConfig['token'] => {
  const antdTokens: Record<string, string> = {};
  for (const key in designTokens) {
    if (designTokens[key].$type === TOKEN_COLOR_TYPE) {
      antdTokens[key] = designTokens[key].$value;
    }
  }
  return antdTokens;
};
