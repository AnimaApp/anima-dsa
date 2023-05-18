# Anima CLI

intro

## Setup

### Installation

Run the following command (of your preferred package manager) in the the folder you have Storybook installed:

::: code-group

```sh [npm]
    npm install --save-dev @animaapp/cli
```

```sh [yarn]
    yarn add -D @animaapp/cli
```

```sh [pnpm]
    pnpm add -D @animaapp/cli
```

:::

## Usage
    
```sh
    anima --help
```

## Commands

### `anima sync `

| Options           | Short | Description                                                                                     |   Type   |
| :---------------- | :---: | :---------------------------------------------------------------------------------------------- | :------: |
| `--token`         | `-t`  | Provide Anima's token if it was not set as environment variable                                 | `string` |
| `--storybook`     | `-s`  | To specify the Storybook build folder, otherwise it uses Storybook's default `storybook-static` | `string` |
| `--design-tokens` | `-dt` | Provide a path to your design tokens file, e.g., `./design-tokens.json`                          | `string` |
