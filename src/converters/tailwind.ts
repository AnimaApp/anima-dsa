import kebabCase from 'kebab-case';
import flatten, { unflatten } from 'flat';

import { z } from 'zod';
import type { IConverter } from './types';
import type { DSTokenTheme } from '../constants/types';
import { loadJSFileFromCWD } from '../helpers';
import { formatColorToTokenValue } from './utils';

const schemaTailwind = z.object({
  theme: z.object({
    colors: z.record(z.string(), z.any()),
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

  async convertColorToDS(): Promise<DSTokenTheme> {
    if (!this.config) throw new Error('Config not loaded');
    const tailwindTokenColor: Record<string, string> = flatten(
      this.config?.theme.colors,
      {
        delimiter: TailwindConverter.delimiter,
        transformKey: kebabCase,
      },
    );

    const dsTokens: DSTokenTheme = {};
    Object.keys(tailwindTokenColor).forEach((key) => {
      dsTokens[key] = formatColorToTokenValue(tailwindTokenColor[key]);
    });
    return dsTokens;
  }

  static convertDSColorToTheme(
    dsTokens: DSTokenTheme,
  ): TailwindConfig['theme']['colors'] {
    const twTokens: { [key: string]: unknown | string } = {};
    for (const key in dsTokens) {
      twTokens[key] = dsTokens[key].value;
    }
    console.log(unflatten({ 'color-primary-100': '#f3f4f6' }));
    const twTokensUnflatten: TailwindConfig['theme']['colors'] = unflatten(
      twTokens,
      { delimiter: TailwindConverter.delimiter, object: true },
    );
    return twTokensUnflatten;
  }
}
