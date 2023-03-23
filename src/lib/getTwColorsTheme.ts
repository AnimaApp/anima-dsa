import type { DSTokenTheme } from '../constants/types';
import type { TailwindConfig } from '../converters/tailwind';
import { TailwindConverter } from '../converters/tailwind';

export const getTwColorsTheme = (
  dsToken: DSTokenTheme,
): TailwindConfig['theme']['colors'] => {
  return TailwindConverter.convertDSColorToTheme(dsToken);
};
