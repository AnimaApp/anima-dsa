# TailwindCSS guide

We provide a function to convert your design tokens JSON into a TailwindCSS theme object and vice versa.

## TailwindCSS theme -> Design tokens JSON

1. Run our Anima CLI with the `generate-tokens` command:

    ```sh
        anima generate-tokens -f tailwindcss -c tailwind.config.cjs -o ./design-tokens.json
    ```

1. We'll look at the existing tailwindCSS theme in your `tailwind.config.js` file and generate a new JSON file provided with the `--output`.

    ```sh 4
        root-folder
        ├── ...
        ├── tailwind.config.cjs
        └── design-tokens.json # a new JSON file with your design tokens
    ```

## Design tokens JSON -> TailwindCSS theme

1. Install our `@animaapp/framework-helpers` package

    ::: code-group

    ```sh [npm]
        npm add -D @animaapp/framework-helpers
    ```

    ```sh [yarn]
        yarn add -D @animaapp/framework-helpers
    ```

    ```sh [pnpm]
        pnpm add -D @animaapp/framework-helpers
    ```

    :::

1. On your `tailwind.config.js` file in your project root directory, import our converter function `getTailwindTheme`

    ```js
    // tailwind.config.cjs
    import { getTailwindTheme } from '@animaapp/framework-helpers'
    ```

1. Import your design tokens JSON file

    ```js
    import dsToken from './design-tokens.json' // path to your design tokens JSON file
    ```

1. Create a new Object with the converted theme

    ```js
    const themeColors = getTailwindTheme(dsToken)
    ```

1. Remove your previous color config and add the converted theme to your Tailwind config

    ```js
    module.exports = {
      content: ['./src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        extend: {
          colors: { // [!code --]
            your existing colors, // [!code --]
          } // [!code --]
          colors: themeColors.colors, // [!code ++]
        }
      },
      plugins: []
    }

    ```

Your final `tailwind.config.js` file should look like this:

::: tip Final result

```js
// tailwind.config.cjs
import { getTailwindTheme } from '@animaapp/framework-helpers'
import dsToken from './design-tokens.json'

const themeColors = getTailwindTheme(dsToken)

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: themeColors.colors,
    }
  },
  plugins: []
}

```

:::
