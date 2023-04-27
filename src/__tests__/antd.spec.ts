import { AntdConverter } from '../converters/antd';
import { getAntdTheme } from '../lib/antdTheme';

const configPath = './src/__tests__/test-antd.config.js';

const tokens = {
  seed: {
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
  test('convert design tokens to antd theme', async () => {
    const theme = getAntdTheme(tokens);
    expect(theme.token).toMatchObject({
      colorPrimary: '#ffffff',
      colorBgBase: '#ffffff',
      colorSuccess: '#ffffff',
    });
  });
  test('convert invalid design tokens to antd theme, seed $value root key (fail)', async () => {
    const invalidToken = {
      test: "etc",
      seed: {
        $value: "lol",
      },
    }
    // @ts-expect-error testing fail
    expect(() => getAntdTheme(invalidToken)).toThrow(/\$value as a root key/);
  });
  test('convert invalid design tokens to antd theme, no tokens (fail)', async () => {
    const invalidToken = {
      test: "etc",
      seed: {
        primaryColor: "lol",
      },
    }
    // @ts-expect-error testing fail
    expect(() => getAntdTheme(invalidToken)).toThrow(/Unexpected value in design/);
  });
});
