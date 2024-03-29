import type { DesignTokenMap } from '@animaapp/token-core';
import { type AntdConfig, schemaAntd, ANTD_TOKEN_KEY } from '@animaapp/framework-helpers';
import type { IConverter } from './types';
import { loadJSFileFromCWD } from '../helpers';
import { formatColorToTokenValue } from './utils';

export class AntdConverter implements IConverter {
  framework = 'antd' as const;
  config: AntdConfig | null = null;

  async loadConfig(configPath: string): Promise<AntdConfig> {
    this.config = schemaAntd.parse(await loadJSFileFromCWD(configPath));
    return this.config;
  }

  async convertColorToDesignTokens(): Promise<DesignTokenMap> {
    if (!this.config) throw new Error('Config not loaded');
    const tokens = this.config.token;
    const colors: Record<string, string> = {};
    Object.entries(tokens).forEach(([key, value]) => {
      if (key.includes('color') && typeof value === 'string') {
        colors[key] = value;
      }
    });
    const designTokens: DesignTokenMap = {};
    Object.entries(colors).forEach(([key, value]) => {
      designTokens[key] = formatColorToTokenValue(value);
    });
    return {
      [ANTD_TOKEN_KEY]: {
        token: designTokens
      }
    };
  }

  sampleConfigFile(): string {
    return `
import {
  getAntdTheme,
} from "@animaapp/framework-helpers";
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
}
