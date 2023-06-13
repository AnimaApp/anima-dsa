<div align="center">
    <img src="https://user-images.githubusercontent.com/824169/215443601-be3cf79f-e5ae-4583-ba75-7964774b2ab3.svg" width="250" alt="Anima CLI" />
</div>

# Anima CLI [![npm](https://img.shields.io/npm/v/@animaapp/anima-cli?logo=npm)](https://www.npmjs.com/package/@animaapp/anima-cli)

Anima CLI is a command line tool that works in conjunction with the [Anima Figma Plugin](https://www.figma.com/community/plugin/857346721138427857) to transform [Storybook](https://storybook.js.org) stories into Figma components and your design tokens into Figma styles.

You can learn more about the whole Design System workflow in our [Anima Design System Automation guide](https://dsa.animaapp.com/).

## Quick start

Run the following command in the folder you have Storybook installed:

```sh
npx @animaapp/anima-cli sync -t <anima-team-token> --storybook
```

> **Warning** Heads up!
> You'll need an Anima team token to use the CLI. You can get one from the [Anima Plugin ↗️](https://www.figma.com/community/plugin/857346721138427857) under the Manage Design System screen.

## Setup

### 1. Installation

Run the following command (with your preferred package manager) in the repo with your Storybook:

```sh [npm]
npm add -D @animaapp/anima-cli
```

```sh [yarn]
yarn add -D @animaapp/anima-cli
```

```sh [pnpm]
pnpm add -D @animaapp/anima-cli
```

### 2. Add your unique Anima team token

After installing the `anima-cli`, we recommend adding the _Anima team token_ as an environment variable. This way, you won't need to pass it as an argument when you run the CLI.

Create a `.env` file in the root of your Storybook project with the following contents:

```sh
#.env
ANIMA_TEAM_TOKEN="paste-your-token-here"
```

### 3. Specify the path to your design tokens

If you want to sync your design tokens, you can also specify the path to your tokens in the CLI command.

```sh
npx @animaapp/anima-cli sync --storybook --design-tokens <path-to-design-tokens-JSON-file>
```

> **Warning** Heads up!
> You can also specify the path to your design tokens in a `anima.config.js` file, you can learn more about other [configuration options](#configuration-file-api)

## Usage

### Sync Storybook to Anima

To sync your Storybook with Anima, run the following command:

```sh
anima sync --storybook
```

>If you are not using the default Storybook build folder `storybook-static`, you'll need to specify the path to your custom Storybook build folder. For example:
>
>```sh
>anima sync --storybook ./custom-bulid-folder
>```

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

## `anima init-sb` (experimental)

Initialize and generate storybook config for your project (only needed if you do not already have storybook).

```sh
anima-storybook init-sb [option]
```

#### Options

| Options | Description | Type |
| :---------------- | :---------------------------------------------------------------------------------------------- | :------: |
| `--token`, `-t` | Provide an Anima team token if it was not set as environment variable | `string` |
| `--components`, `-d` | To specify the components folder of your project | `string` |
| `--component`, `-c` | To specify a single component to generate config for | `string` |

## `anima sync`

Syncs your Storybook and/or design tokens to your Anima team so that it cant then be generated in Figma.

### Usage

```sh
anima sync [options]
```

### Options

| Option                                                                                                | Description                                                                                     |                                                                        Type                                                                        |
| :----------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------: |
| `--token`, `-t`                                                                                        | Provide an Anima team token if it was not set as environment variable                           |                                                                      `string`                                                                      |
| `--storybook`, `-s`                                                                                    | To specify the Storybook build folder, otherwise it uses Storybook's default `storybook-static` | &nbsp;`boolean \| string` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| `--design-tokens`, `-d` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Provide a path to your design tokens file, e.g., `./design-tokens.json`                         |                                                                      `string`                                                                      |
| `--basePath`, `-b`                                                                                     | If your project uses Vite, you can provide a base path                                          |                                                                      `string`                                                                      |

## `anima generate-tokens`

Generates design tokens from your framework config file. Learn more about these work in [Design token transformers](/guide/manage-design-tokens/token-transformers).

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

### Configuration file API

You can specify a number of variables in an `anima.config.js` file.

| Option        | Description                                      |   Type   |
| :------------ | :----------------------------------------------- | :------: |
| design_tokens | Provide the path to your design tokens file      | `string` |
| build_command | Provide the command used to build your storybook | `string` |

#### Example

```js
// anima.config.js
module.exports = {
  design_tokens: '<path to design tokens JSON file>', // e.g. "./design-tokens.json"
};
```
