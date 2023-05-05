import { getTailwindTheme } from '../src/tailwind/tailwindTheme';

const invalidTokens = {
  $value: "lol",
  test: "etc",
};

const tokens = {
  transparent: {
    $value: 'transparent',
    $type: 'color',
  },
  white: {
    $value: '#ffffff',
    $type: 'color',
  },
  tahiti: {
    100: {
      $value: '#cffafe',
      $type: 'color',
    },
    200: {
      $value: '#a5f3fc',
      $type: 'color',
    },
    300: {
      $value: '#67e8f9',
      $type: 'color',
    },
  },
} as const;

describe('tailwind converters', () => {
  test('convert design tokens to tailwind theme', async () => {
    const theme = getTailwindTheme(tokens);
    expect(theme.colors).toMatchObject({
      transparent: 'transparent',
      white: '#ffffff',
      tahiti: {
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
      },
    });
  });
  test('convert false design tokens to tailwind theme (fail)', async () => {
    // @ts-expect-error testing fail
    expect(() => getTailwindTheme(invalidTokens)).toThrowError(/Unexpected value.* value = lol .* key = \$value/);;
  });
});
