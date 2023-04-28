import { TailwindConverter } from '../converters/tailwind';

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
    expect(designTokens).toMatchObject(tokens);
  });
});
