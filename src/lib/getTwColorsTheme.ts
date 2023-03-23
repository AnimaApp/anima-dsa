import type { DesignTokenTheme } from '../constants/types';
import type { TailwindConfig } from '../converters/tailwind';
import { TailwindConverter } from '../converters/tailwind';

export const getTwColorsTheme = (
  dsToken: DesignTokenTheme,
): TailwindConfig['theme']['colors'] => {
  return TailwindConverter.convertDesignTokenColorsToTheme(dsToken);
};
