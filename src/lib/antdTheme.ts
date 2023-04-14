import type { DesignTokenTheme } from '../constants/types';
import type { AntdConfig } from '../converters/antd';
import { AntdConverter } from '../converters/antd';

export const getAntdTheme = <T extends DesignTokenTheme>(
  dsToken: T,
): AntdConfig => {
  return AntdConverter.convertDesignTokenToTheme(dsToken);
};
