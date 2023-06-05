import kebabCase from 'kebab-case';
import flatten, { unflatten } from 'flat';

import type { IConverter } from './types';
import { loadJSFileFromCWD, log } from '../helpers';
import { formatColorToTokenValue } from './utils';
import {
  type DesignTokenMap,
} from '@animaapp/token-core';
import { schemaTailwind, type TailwindConfig } from '@animaapp/framework-helpers';

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
} = require("@animaapp/framework-helpers");
const dsToken = require("./design-tokens.json");

const theme = getTailwindTheme(dsToken);

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extends: {
      colors: theme.colors,
    },
  },
};
`;
  }
}
