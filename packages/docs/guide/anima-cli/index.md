# Anima CLI

Anima CLI is a command line tool that works in conjunction with the [Anima Figma Plugin](https://www.figma.com/community/plugin/857346721138427857) to transform [Storybook](https://storybook.js.org) stories into Figma components and your design tokens into Figma styles.

## Quick start

Run the following command in the folder you have Storybook installed:

```sh
    npx @animaapp/anima-cli sync -t <anima-team-token> --storybook
```

::: tip Heads up!
You'll need an Anima team token to use the CLI. You can get one from the [Anima Plugin :arrow_upper_right:](https://www.figma.com/community/plugin/857346721138427857) under the Manage Design System screen.
:::

## Setup

### 1. Installation

Run the following command (with your preferred package manager) in the repo with your Storybook:

::: code-group

```sh [npm]
    npm i -D @animaapp/anima-cli
```

```sh [yarn]
    yarn add -D @animaapp/anima-cli
```

```sh [pnpm]
    pnpm add -D @animaapp/anima-cli
```

:::

### 2. Add your unique Anima team token

After installing the `anima-cli`, we recommend adding the _Anima team token_ as an environment variable. This way, you won't need to pass it as an argument when you run the CLI.

Create a `.env` file in the root of your Storybook project with the following contents:

```sh
#.env
ANIMA_TEAM_TOKEN="paste-your-token-here"
```

### 3. Save your configuration as a file

For convenience, you can create a `anima.config.js` file in your root directory, and save the configuration values like design tokens.

```js
// anima.config.js
module.exports = {
  design_tokens: '<path to design tokens JSON file>', // e.g. "./design-tokens.json"
  storybook: '<path to your Storybook build folder', // e.g. "./storybook-static"
};
```

## Usage

### Sync Storybook to Anima

To sync your Storybook with Anima, run the following command:

```sh
    anima sync --storybook
```

::: info

If you are not using the default Storybook build folder `storybook-static`, you'll need to specify the path to your custom Storybook build folder. For example:

```sh
    anima sync --storybook ./custom-bulid-folder
```

:::

### Sync your Storybook and design tokens to Anima

To sync both your design tokens and Storybook, run the following command:

```sh
    anima sync --storybook --design-tokens ./design-tokens.json
```

### Sync your design tokens only

```sh
    anima sync --design-tokens ./design-tokens.json
```

## Command API

## `anima sync`

Syncs your Storybook and/or design tokens to your Anima team so that it can be then generated in Figma.

### Usage

```sh
    anima sync [options]
```

### Options

| Option                                                                                                 | Description                                                                                     |                                                                        Type                                                                        |
| :----------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------: |
| `--token`, `-t`                                                                                        | Provide an Anima team token if it was not set as environment variable                           |                                                                      `string`                                                                      |
| `--storybook`, `-s`                                                                                    | To specify the Storybook build folder, otherwise it uses Storybook's default `storybook-static` | &nbsp;`boolean \| string` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| `--design-tokens`, `-d` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Provide a path to your design tokens file, e.g., `./design-tokens.json`                         |                                                                      `string`                                                                      |
| `--basePath`, `-b`                                                                                     | If your project uses Vite, you can provide a base path                                          |                                                                      `string`                                                                      |

## `anima generate-tokens`

Generates design tokens from your framework config file. Learn more about these work with our built-in [design token transformers](/guide/manage-design-tokens/token-transformers).

### Usage

```sh
    anima generate-tokens [options]
```

#### Options

| Option                                                   | Description                                                                    |   Type   |
| :------------------------------------------------------- | :----------------------------------------------------------------------------- | :------: |
| `--framework`, `-f` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Provide your framework name i.e. `tailwind`                                    | `string` |
| `--config` , `-c`                                        | Provide your framework config file i.e. `./tailwind.config.cjs`                | `string` |
| `--output` , `-o`                                        | Provide an output path of your Design Tokens file, i.e. `./design-tokens.json` | `string` |
