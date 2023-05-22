# Anima Token Transformers

Anima DSA, also provides a two-way transformation of your design tokens.
So if you use a framework like TailwindCSS or Ant Design, you can transform your design tokens to the format that is compatible with those frameworks.

To generate Design Tokens from your framework config file, first install the Anima CLI,

::: code-group

```sh [npm]
    npm add -D @animaapp/anima-cli
```

```sh [yarn]
    yarn add -D @animaapp/anima-cli
```

```sh [pnpm]
    pnpm add -D @animaapp/anima-cli
```

:::

Then run the following command:

```sh
    anima generate-tokens --framework <framework-name> --config <path-to-config-file>
```

Where `<framework-name>` is the name of the framework you are using and `<path-to-config-file>` is the path to your framework config file.

::: details Examples,
### TailwindCSS
For example, to generate TailwindCSS design tokens JSON, from your existing theme, run the following command:

```sh
    anima generate-tokens --framework tailwindcss --config tailwind.config.js
```
:::

# To transform Design Tokens JSON into a framework's theme

We provide a package named `@animaapp/framework-helpers` that you can use to transform the design tokens JSON into a theme object.

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

## How to use

### TailwindCSS

```js
// tailwind.config.cjs
import { getTailwindTheme } from '@animaapp/framework-helpers'
import dsToken from './src/assets/design-tokens.json'

const themeColors = getTailwindTheme(dsToken)

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: themeColors.colors,
    extend: {}
  },
  plugins: []
}

```
### Ant Design (v5)

```jsx
// App.jsx
import { ConfigProvider } from "antd";
import { getAntdTheme } from "@animaapp/framework-helpers";
import dsToken from "./assets/design-tokens.json";

import "./App.css";

const tokensTheme = getAntdTheme(dsToken);

function App() {
  return (
    <ConfigProvider
      theme={{
        token: { ...tokensTheme.token },
      }}
    >
      {/*  Your app */}
    </ConfigProvider>
  );
}

export default App;


```