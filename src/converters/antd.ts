import kebabCase from 'kebab-case';

import { z } from 'zod';
import type { IConverter } from './types';
import type { DesignTokenTheme } from '../constants/types';
import { loadJSFileFromCWD } from '../helpers';
import { formatColorToTokenValue } from './utils';
import { TOKEN_COLOR_TYPE } from '../constants';

// TODO: Enhance Antd theme with all the values
const schemaAntd = z.object({
  token: z.record(z.string(), z.string()),
});

export type AntdConfig = z.infer<typeof schemaAntd>;

export class AntdConverter implements IConverter {
  framework = 'antd' as const;
  config: AntdConfig | null = null;
  static delimiter = '-';

  async loadConfig(configPath: string): Promise<AntdConfig> {
    this.config = schemaAntd.parse(await loadJSFileFromCWD(configPath));
    return this.config;
  }

  async convertColorToDesignTokens(): Promise<DesignTokenTheme> {
    if (!this.config) throw new Error('Config not loaded');
    const tokens = this.config.token;
    const colors: Record<string, string> = {};
    Object.entries(tokens).forEach(([key, value]) => {
      if (key.includes('color')) {
        colors[kebabCase(key)] = value;
      }
    });
    const designTokens: DesignTokenTheme = {};
    Object.entries(colors).forEach(([key, value]) => {
      designTokens[key] = formatColorToTokenValue(value);
    });
    return designTokens;
  }

  sampleConfigFile(): string {
    return `
import {
  getAntdTheme,
} from "anima-storybook-cli/dist/lib/antdTheme");
import dsToken from "./design-tokens.json";

import { Button, ConfigProvider } from 'antd';
import React from 'react';

const theme = getAntdTheme(dsToken);

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      token: {
        ...theme.token,
      },
    }}
  >
    <Button />
  </ConfigProvider>
);

export default App;
`;
  }

  static convertDesignTokenToTheme(
    designTokens: DesignTokenTheme,
  ): AntdConfig {
    const tokens = AntdConverter.convertDesignTokenColorsToTheme(designTokens);
    return { token: tokens };
  }

  static convertDesignTokenColorsToTheme(
    designTokens: DesignTokenTheme,
  ): AntdConfig['token'] {
    const antdTokens: Record<string, string> = {};
    for (const key in designTokens) {
      if (designTokens[key].$type === TOKEN_COLOR_TYPE) {
        antdTokens[key] = designTokens[key].$value;
      }
    }
    return antdTokens;
  }
}
