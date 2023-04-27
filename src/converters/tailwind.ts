import kebabCase from 'kebab-case';
import flatten, { unflatten } from 'flat';

import { z } from 'zod';
import type { IConverter } from './types';
import { loadJSFileFromCWD, log } from '../helpers';
import { formatColorToTokenValue } from './utils';
import {
  isDesignToken,
  type DesignTokenMap,
} from '@animaapp/token-core';

// TODO: Enhance Tailwind theme with all the values
const schemaTailwind = z.object({
  theme: z.object({
    colors: z.record(z.string(), z.any()),
    extend: z.record(z.string(), z.any()).optional(),
  }),
});

export type TailwindConfig = z.infer<typeof schemaTailwind>;

export class TailwindConverter implements IConverter {
  framework = 'tailwind' as const;
  config: TailwindConfig | null = null;
  static delimiter = '.';

  async loadConfig(configPath: string): Promise<TailwindConfig> {
    this.config = schemaTailwind.parse(await loadJSFileFromCWD(configPath));
    return this.config;
  }

  async convertColorToDesignTokens(): Promise<DesignTokenMap> {
    if (!this.config) throw new Error('Config not loaded');
    const extendColors = this.config.theme.extend?.colors;
    const colors = this.config.theme.colors;
    if (!extendColors)
      log.yellow(
        'No theme.extend.colors found in tailwind config but found theme.colors',
      );
    const tailwindTokenColor: Record<string, string> = flatten(
      { ...colors, ...extendColors },
      {
        delimiter: TailwindConverter.delimiter,
        transformKey: kebabCase,
      },
    );

    let designTokens: DesignTokenMap = {};
    Object.keys(tailwindTokenColor).forEach((key) => {
      designTokens[key] = formatColorToTokenValue(tailwindTokenColor[key]);
    });
    designTokens = unflatten(designTokens, { delimiter: TailwindConverter.delimiter, object: true });
    return designTokens;
  }

  sampleConfigFile(): string {
    return `
const {
  getTailwindTheme,
} = require("anima-storybook-cli/dist/lib/tailwindTheme");
const dsToken = require("./design-tokens.json");

const theme = getTailwindTheme(dsToken);

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: theme.colors,
  },
};
`;
  }

  static convertDesignTokensToTheme(
    designTokens: DesignTokenMap,
  ): TailwindConfig['theme'] {
    const colors =
      TailwindConverter.convertDesignTokenColorsToTheme(designTokens);
    return { colors };
  }

  static convertDesignTokenColorsToTheme(
    designTokens: DesignTokenMap,
  ): TailwindConfig['theme']['colors'] {
    const twThemeTokens: { [key: string]: unknown | string } = {};
    populateTree(designTokens, twThemeTokens);
    return twThemeTokens;
  }
}

function populateTree(designTokens: DesignTokenMap, toPopulate: { [key: string]: unknown | string }) {
  for (const key in designTokens) {
    const value = designTokens[key];
    if (isDesignToken(value)) {
      toPopulate[key] = value.$value;
    } else if (value != null && typeof value === 'object') {
      const newGroup = {};
      toPopulate[key] = newGroup;
      populateTree(value, newGroup);
    } else {
      throw new Error(`Unexpected value in design tokens json file for value = ${value} and key = ${key}`);
    }
  }
};
