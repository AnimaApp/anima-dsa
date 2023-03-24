import kebabCase from 'kebab-case';
import flatten, { unflatten } from 'flat';

import { z } from 'zod';
import type { IConverter } from './types';
import type { DesignTokenTheme } from '../constants/types';
import { loadJSFileFromCWD, log } from '../helpers';
import { formatColorToTokenValue } from './utils';
import { TOKEN_COLOR_TYPE } from '../constants';

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
  static delimiter = '-';

  async loadConfig(configPath: string): Promise<TailwindConfig> {
    this.config = schemaTailwind.parse(await loadJSFileFromCWD(configPath));
    return this.config;
  }

  async convertColorToDesignTokens(): Promise<DesignTokenTheme> {
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

    const designTokens: DesignTokenTheme = {};
    Object.keys(tailwindTokenColor).forEach((key) => {
      designTokens[key] = formatColorToTokenValue(tailwindTokenColor[key]);
    });
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

  static convertDesignTokenToTheme(
    designTokens: DesignTokenTheme,
  ): TailwindConfig['theme'] {
    const colors =
      TailwindConverter.convertDesignTokenColorsToTheme(designTokens);
    return { colors };
  }

  static convertDesignTokenColorsToTheme(
    designTokens: DesignTokenTheme,
  ): TailwindConfig['theme']['colors'] {
    const twTokens: { [key: string]: unknown | string } = {};
    for (const key in designTokens) {
      if (designTokens[key].$type === TOKEN_COLOR_TYPE) {
        twTokens[key] = designTokens[key].$value;
      }
    }
    const twTokensUnflatten: TailwindConfig['theme']['colors'] = unflatten(
      twTokens,
      { delimiter: TailwindConverter.delimiter, object: true },
    );
    return twTokensUnflatten;
  }
}
