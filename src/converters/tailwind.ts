import kebabCase from 'kebab-case';
import flatten from 'flat';

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

type TailwindConfig = z.infer<typeof schemaTailwind>;

export class TailwindConverter implements IConverter {
  framework = 'tailwind' as const;
  delimiter = '-';
  config: TailwindConfig | null = null;

  async loadConfig(configPath: string): Promise<TailwindConfig> {
    this.config = schemaTailwind.parse(await loadJSFileFromCWD(configPath));
    return this.config;
  }

  async convertColorToDS(): Promise<DSTokenTheme> {
    if (!this.config) throw new Error('Config not loaded');
    const tailwindTokenColor: Record<string, string> = flatten(
      this.config?.theme.colors,
      {
        delimiter: this.delimiter,
        transformKey: kebabCase,
      },
    );

    const dsTokens: DSTokenTheme = {};
    Object.keys(tailwindTokenColor).forEach((key) => {
      dsTokens[key] = formatColorToTokenValue(tailwindTokenColor[key]);
    });
    return dsTokens;
  }
}
