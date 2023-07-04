import { AntdConverter } from '../converters/antd';
import { describe, expect, test } from 'vitest';

const configPath = './src/__tests__/test-antd.config.js';

const tokens = {
  antd: {
    colorPrimary: {
      $value: '#ffffff',
      $type: 'color',
    },
    colorBgBase: {
      $value: '#ffffff',
      $type: 'color',
    },
    colorSuccess: {
      $value: '#ffffff',
      $type: 'color',
    },
  },
} as const;

describe('antd converters', () => {
  test('convert antd theme to design tokens', async () => {
    const antdConv = new AntdConverter();
    await antdConv.loadConfig(configPath);
    const designTokens = await antdConv.convertColorToDesignTokens();
    expect(designTokens).toMatchObject(tokens);
  });
});
