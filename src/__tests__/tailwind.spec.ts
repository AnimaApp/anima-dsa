import { TailwindConverter } from '../converters/tailwind';
import { getAntdTheme } from '../lib/antdTheme';
import { getTailwindTheme } from '../lib/tailwindTheme';

const configPath = './src/__tests__/test-tailwind.config.js';

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
  test('convert tailwind theme to design tokens', async () => {
    const tailwConv = new TailwindConverter();
    await tailwConv.loadConfig(configPath);
    const designTokens = await tailwConv.convertColorToDesignTokens();
    expect(designTokens).toMatchObject({});
  });
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
});
