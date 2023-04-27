import { type DesignTokenMap } from '@animaapp/token-core';
import type { TailwindConfig } from '../converters/tailwind';
import { TailwindConverter } from '../converters/tailwind';

export const getTailwindTheme = (
  dsToken: DesignTokenMap,
): TailwindConfig['theme'] => {
  return TailwindConverter.convertDesignTokensToTheme(dsToken);
};
