# Anima Token Transformers

Anima DSA, also provides a two-way transformation of your design tokens.
So if you use a framework like TailwindCSS or Ant Design, you can transform your design tokens to the format that is compatible with those frameworks.

To generate design tokens from your framework config file, first install the Anima CLI,

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

Check [TailwindCSS](/guide/manage-design-tokens/design-tokens-tailwind), or [Ant Design v5](/guide/manage-design-tokens/design-tokens-ant-design) examples for more details.

### Commads

| Options                          | Short | Description                                                                    |   Type   |
| :------------------------------- | :---: | :----------------------------------------------------------------------------- | :------: |
| `--framework` &nbsp;&nbsp;&nbsp; | `-f`  | Provide your framework name i.e. `tailwind`                                    | `string` |
| `--config`                       | `-c`  | Provide your framework config file i.e. `./tailwind.config.cjs`                | `string` |
| `--output`                       | `-o`  | Provide an output path of your design tokens file, i.e. `./design-tokens.json` | `string` |

## To transform design tokens JSON into a framework's theme

We provide a package named `@animaapp/framework-helpers` that you can use to transform the design tokens JSON into a theme object.

Install the package in your project, using your package manager of choice:

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

Check our detailed guides for each framework:

### [TailwindCSS](/guide/manage-design-tokens/design-tokens-tailwind)

### [Ant Design v5](/guide/manage-design-tokens/design-tokens-ant-design)
