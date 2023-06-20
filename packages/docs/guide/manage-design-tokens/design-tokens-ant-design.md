# Ant Design (v5) guide

Ant Design v5 uses a new theme format, so we provide a function to convert your design tokens JSON into a theme object.

## Ant Design theme -> Design tokens JSON

1. Make sure you have a `theme.js` file in your project root directory. If you don't have one, you can create a new file and add AntD theme values you might be using in your project.
  
    ```js
    // theme.js
    module.exports = {
      colorPrimary: '#1890ff',
      colorSuccess: "#52c41a",
      // ...
    }
    ```

1. Run our [Anima CLI](../anima-cli/index#usage-2) with the `generate-tokens` command:

    ```sh
        anima generate-tokens -f antd -c ./theme.js -o ./design-tokens.json
    ```

1. We'll look at the existing Ant Design theme in your `theme.js` file and generate a new JSON file provided with the `--output`.

    ```sh 4
        root-folder
        ├── ...
        ├── theme.js
        └── design-tokens.json # a new JSON file with your design tokens
    ```

## Design tokens JSON -> Ant Design theme

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

1. On the file that provides context to your app (i.e. App.jsx) import our converter function `getAntdTheme`

    ```jsx
    // App.jsx
    import { getAntdTheme } from '@animaapp/framework-helpers'
    ```

1. Import your design tokens JSON file

    ```jsx
    import dsToken from './design-tokens.json' // path to your design tokens JSON file
    ```

1. Create a new Object with the converted theme

    ```jsx
    const tokensTheme = getAntdTheme(dsToken)
    ```

1. Add the converted theme to your Ant Design ConfigProvider

    ```jsx
    <ConfigProvider
      theme={{
        token: { ...tokensTheme.token },
      }}
    >
      {/*  Your app */}
    </ConfigProvider>
    ```

Your final `App.jsx` file should look like this:

::: tip Final result

```jsx
// App.jsx
import { ConfigProvider } from "antd";
import { getAntdTheme } from "@animaapp/framework-helpers";
import dsToken from "./design-tokens.json";

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

:::

## Use it as a Context Provider

If you use Ant Design v5 as base framework to your Design System components, and don't have control/access to the consumer's `App.jsx` you can create a Context Provider with this configuration:

### Source component

```jsx
// ThemeContext.jsx

import { ConfigProvider } from "antd";
import { getAntdTheme } from "@animaapp/framework-helpers";
import dsToken from "./design-tokens.json";

const tokensTheme = getAntdTheme(dsToken);

export const ThemeContext = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: { ...tokensTheme.token },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

```

And then consume it in your components:

```jsx
// Component.jsx

import { ThemeContext } from "./ThemeContext";

const Component = () => {
  return (
    <ThemeContext>
      {/*  Your component */}
    </ThemeContext>
  );
};

```
