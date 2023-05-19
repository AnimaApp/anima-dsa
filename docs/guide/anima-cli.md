# Anima CLI

Anima CLI is a command line tool that works in conjunction with the [Anima Figma Plugin](https://www.figma.com/community/plugin/857346721138427857) to transform [Storybook](https://storybook.js.org) stories into Figma components and Design Tokens as Figma Styles.


## Quick start

Run the following command in the the folder you have Storybook installed:

```sh
    npx @animaapp/anima-cli sync -t <your-anima-team-token>
```

::: tip Heads up!
You'll need a Anima Team Token to use the CLI. You can get one from the [Anima Plugin :arrow_upper_right:](https://www.figma.com/community/plugin/857346721138427857) under the Manage Design System Screen.
:::

## Setup

### 1. Installation

Run the following command (of your preferred package manager) in the the folder you have Storybook installed:

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

### 2. Add your unique Anima Team Token

After installing the `anima-cli`, we recommend adding the _Anima Team Token_ as an environment variable. This way, you won't have to pass it as an argument every time you run the CLI.

Create a `.env` file in the root of your Storybook project with the following contents:
```sh
#.env
ANIMA_TEAM_TOKEN="paste-your-token-here"
```

### 3. Configure your Design Tokens location

For convenience, you can create a `anima.config.js` file in your root directory, and save the configuration values like design tokens.

```js
// anima.config.js
module.exports = {
  design_tokens: '<path to design tokens JSON file>', // i.e. "./design-tokens.json"
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

### Sync Design Tokens to Anima

To attach your design tokens to your components, run the following command:

```sh
    anima sync --storybook --design-tokens ./design-tokens.json
```

### Sync only the Design Tokens

```sh
    anima sync --design-tokens ./design-tokens.json
```

## Commands API

## `anima sync `

Command to sync the Storybook and/or Design Tokens to Anima team so that it can be then generated in Figma.

### Usage
```sh
    anima sync [options]
```

### Options
| Option                       | Description                                                                                     |   Type   |
| :----------------------- | :---------------------------------------------------------------------------------------------- | :------: |
| `--token`, `-t`          | Provide an Anima team token if it was not set as environment variable                                 | `string` |
| `--storybook`, `-sb`      | To specify the Storybook build folder, otherwise it uses Storybook's default `storybook-static` | &nbsp;`boolean \| string` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| `--design-tokens`, `-dt` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Provide a path to your design tokens file, e.g., `./design-tokens.json`                          | `string` |


## `anima generate-tokens`

Command to generate Design Tokens from your framework config file.
    
### Usage
```sh
    anima generate-tokens [options]
```

#### Options

| Option        | Description                                                                    |   Type   |
| :------------ | :----------------------------------------------------------------------------- | :------: |
| `--framework`, `-f`  | Provide your framework name i.e. `tailwind`                                    | `string` |
| `--config` , `-c`  | Provide your framework config file i.e. `./tailwind.config.cjs`                | `string` |
| `--output` , `-o`   | Provide an output path of your Design Tokens file, i.e. `./design-tokens.json` | `string` |
