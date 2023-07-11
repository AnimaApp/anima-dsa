import { getAntdTheme } from '../src/antd/antdTheme';

const tokens = {
  colors: {
    blue: {
      1: {
        $value: '#000000',
        $type: 'color',
      },
    },
  },
  antd: {
    token: {
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
      borderRadius: {
        $value: '6px',
        $type: 'dimension',
      },
      controlHeight: {
        $value: '32px',
        $type: 'dimension',
      },
      fontSize: {
        $value: '14px',
        $type: 'dimension',
      },
      opacityImage: {
        $value: 1,
        $type: 'number',
      },
      lineHeight: {
        $value: '1.571428571',
        $type: 'lineHeight',
      },
      boxShadow: {
        $type: 'shadow',
        $value: {
          offsetX: '0px',
          offsetY: '6px',
          blur: '16px',
          spread: '0px',
          color: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
    components: {
      Button: {
        colorPrimary: {
          $value: '#ffffff',
          $type: 'color',
        },
      },
    },
  },
} as const;
describe('antd converters', () => {
  test('convert design tokens to antd theme', async () => {
    const theme = getAntdTheme(tokens);
    expect(theme).toMatchObject({
      token: {
        colorPrimary: '#ffffff',
        colorBgBase: '#ffffff',
        colorSuccess: '#ffffff',
        colorError: '#000000',
        primaryGap: 10,
        borderRadius: 6,
        controlHeight: 32,
        fontSize: 14,
        opacityImage: 1,
        lineHeight: 1.571428571,
        boxShadow: '0px 6px 16px 0px rgba(0, 0, 0, 0.08)',
      },
      components: {
        Button: {
          colorPrimary: '#ffffff',
        },
      },
    });
  });
  test('convert invalid design tokens to antd theme, seed $value root key (fail)', async () => {
    const invalidToken = {
      test: 'etc',
      antd: {
        $value: 'lol',
      },
    };
    // @ts-expect-error testing fail
    expect(() => getAntdTheme(invalidToken)).toThrow(/\$value as a root key/);
  });
  test('convert invalid design tokens to antd theme, no tokens (fail)', async () => {
    const invalidToken = {
      test: 'etc',
      antd: {
        primaryColor: 'lol',
      },
    };
    // @ts-expect-error testing fail
    expect(() => getAntdTheme(invalidToken)).toThrow(
      /Unexpected value in design/,
    );
  });
});
