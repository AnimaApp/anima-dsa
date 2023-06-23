import { getAntdTheme } from '../src/antd/antdTheme';

const tokens = {
  colors: {
    blue: {
      1: {
        $value: "#000000",
        $type: "color",
      },
    }
  },
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
    colorError: {
      $value: '{colors.blue.1}',
      $type: 'color',
    },
    primaryGap: {
      $value: 10,
      $type: 'number',
    },
  },
} as const;

describe('antd converters', () => {
  test('convert design tokens to antd theme', async () => {
    const theme = getAntdTheme(tokens);
    expect(theme.token).toMatchObject({
      colorPrimary: '#ffffff',
      colorBgBase: '#ffffff',
      colorSuccess: '#ffffff',
      colorError: '#000000',
      primaryGap: 10,
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
