import { type DesignTokenMap } from '@animaapp/token-core';
import type { TailwindConfig } from './types';
import { isDesignToken, isTokenValueAlias, resolveAlias } from '../utils';

export const getTailwindTheme = (
  dsToken: DesignTokenMap,
): TailwindConfig['theme'] => {
  return convertDesignTokensToTheme(dsToken);
};

const convertDesignTokensToTheme = (
  designTokens: DesignTokenMap,
): TailwindConfig['theme'] => {
  const colors =
    convertDesignTokenColorsToTheme(designTokens);
  return { colors };
}

const convertDesignTokenColorsToTheme = (
  designTokens: DesignTokenMap,
): TailwindConfig['theme']['colors'] => {
  const twThemeTokens: { [key: string]: unknown | string } = {};
  populateTree(designTokens, twThemeTokens);
  return twThemeTokens;
}

function populateTree(designTokens: DesignTokenMap, toPopulate: { [key: string]: unknown | string }) {
  for (const key in designTokens) {
    const value = designTokens[key];
    if (isDesignToken(value)) {
      if (isTokenValueAlias(value.$value)) {
        toPopulate[key] = resolveAlias(designTokens, value.$value).$value;
      } else {
        toPopulate[key] = value.$value;
      }
    } else if (value != null && typeof value === 'object') {
      const newGroup = {};
      toPopulate[key] = newGroup;
      populateTree(value, newGroup);
    } else {
      throw new Error(`Unexpected value in design tokens json file for value = ${value} and key = ${key}`);
    }
  }
};

