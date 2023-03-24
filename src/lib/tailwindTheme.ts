import type { DesignTokenTheme } from '../constants/types';
import type { TailwindConfig } from '../converters/tailwind';
import { TailwindConverter } from '../converters/tailwind';

export const getTailwindTheme = (
  dsToken: DesignTokenTheme,
): TailwindConfig['theme'] => {
  return TailwindConverter.convertDesignTokenToTheme(dsToken);
};
