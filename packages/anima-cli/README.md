<div align="center">
  <h1>
    <img src="https://user-images.githubusercontent.com/824169/215443601-be3cf79f-e5ae-4583-ba75-7964774b2ab3.svg" width="250" alt="Anima CLI" />
  </h1>
</div>

**Anima Storybook CLI** is a command line tool that works in conjunction with the [Anima Figma Plugin](https://www.figma.com/community/plugin/857346721138427857) to transform [Storybook](https://storybook.js.org) stories into Figma components for a better design-development workflow.

Learn more about the motivations and benefits on [our blog](https://blog.animaapp.com/design-with-your-live-code-components-7f61e99b9bf0).

## Table of Contents

- [Quick start](#quick-start)
- [Setup](#setup)
  - [1. Installing the CLI](#1-installing-the-cli)
  - [2. Add your unique Anima Token](#2-add-your-unique-anima-token)
    - [Adding an environment variable to your local environment](#adding-an-environment-variable-to-your-local-environment)
- [Usage](#usage)
  - [We recommend adding the following script to your package.json](#we-recommend-adding-the-following-script-to-your-packagejson)
- [Commands and Options](#commands--options)
  - [sync](#sync)
    - [Options](#options)
  - [Usage examples](#usage-examples)
- [Alternative configuration](#alternative-configuration)
- [Writing _better_ Storybook Stories](#writing-better-storybook-stories)
  - [1.  Specify ArgTypes to define the props of your component](#1--specify-argtypes-to-define-the-props-of-your-component)
  - [2. Use single story per component](#2-use-single-story-per-component)
    - [2.1. Name your single story Default](#21-name-your-single-story-default)
    - [2.2. Use the single story hoisting feature from Storybook](#22-use-the-single-story-hoisting-feature-from-storybook-more-info-here)


## Quick Start

You will be switching between Figma and your local Terminal!

1. **Figma:** Install the [Anima Plugin](https://www.figma.com/community/plugin/857346721138427857).
2. **Figma:** Create a new Figma project. This is where all your sync'ed Storybook components will live.
3. **Figma:** Run the Anima Plugin, go to the *Storybook* section and copy your unique **Anima token**.
4. **Terminal:** Build your storybook instance, it's usually `npm run build-storybook`.
5. **Terminal:** Run `npx anima-storybook-cli sync -t <ANIMA_TOKEN_HERE>`.
6. **Figma:** Follow the remaining instructions in Figma and you can importing your Storybook components to Figma. 🎉


## Setup

### 1. Installing the CLI

Run one of the following commands (of your preferred package manager) in the Storybook root folder:

```sh
npm install --save-dev anima-storybook-cli
```
```sh
yarn add -D anima-storybook-cli
```
```sh
pnpm add -D anima-storybook-cli
```

### 2. Add your unique Anima Token

Every Anima team has a unique **Anima Token**. You can retrieved your teams token through the [Anima Figma Plugin](https://www.figma.com/community/plugin/857346721138427857) under the *Storybook* section. If it's your first time using the plugin, you will find it on the first onboarding screen, however, you can also retrieve the token at any time from the dropdown menu.

The Anima Storybook CLI accepts the Anima Token using the `-t` flag:

```sh
anima-storybook sync -t <ANIMA_TOKEN_HERE>
```

For convenience we recommend you add your Anima token as an environment variable!

#### Adding an environment variable to your local environment

Create a `.env` file in the root of your Storybook project with the following contents:

```sh
#.env
STORYBOOK_ANIMA_TOKEN="PASTE_ANIMA_TOKEN_HERE"
```

<details>
<summary>If you're running on a CI, add the token as an environment variable … </summary>

#### in a CircleCI step ([how to add environment variables in a circleCI](https://circleci.com/docs/set-environment-variable/#set-an-environment-variable-in-a-project))

#### in a GitHub Action step ([how to add environment variables in GitHub Actions](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository))

```yml
# .github/workflows/main.yml
env:
  STORYBOOK_ANIMA_TOKEN: ${{ secrets.STORYBOOK_ANIMA_TOKEN }}
```
</details>

<details>
<summary>If you're behind a firewall</summary>

#### Whitelist Anima's servers

* api.animaapp.com (52.37.43.28, 52.32.9.31, 52.25.31.123, 52.32.62.176)
* s3.animaapp.com (35.160.8.22)
</details>


## Usage

```sh
[pkg manager] anima-storybook sync [options]
```

The Anima Storybook CLI syncronises a built instance of Storybook with the Anima Figma Plugin, generating Figma components from Storybook stories.

So it can be easily integrated with your Continuous Integration solution, and for your own personal convenience, building your Storybook before syncing it with Animas ensure that your always up to date.

####  We recommend adding the following script to your `package.json`

```js
"scripts": {
  //...
  "sync": "npm run build-storybook && anima-storybook sync"
}
```

You then have a convenient command for syncronising:

```sh
npm run sync
```

## Commands & Options

### `sync`

Command to sync the storybook project to Anima team so that it can be then generated in Figma.

```sh
anima-storybook sync [option]
```

#### Options

| Options           | Short | Description                                                                                     |   Type   |
| :---------------- | :---: | :---------------------------------------------------------------------------------------------- | :------: |
| `--token`         | `-t`  | Provide Anima's token if it was not set as Environment variable                                 | `string` |
| `--directory`     | `-d`  | To specify the storybook build folder, otherwise it uses Storybook's default `storybook-static` | `string` |
| `--design-tokens` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |       | Provide a path of your Design Tokens file, i.e. `./design-tokens.json`                          | `string` |

### Usage examples:

```sh
npx anima-storybook sync --token <anima_token> 
npx anima-storybook sync --directory <storybook_static_dir> #default is storybook-static
npx anima-storybook sync --design-tokens <path_to_design_tokens_file>
```

### `generate_tokens`

Command to generate a design-tokens file from your framework theme file.

```
anima-storybook generate-tokens -f tailwind -c ./tailwind.config.cjs -o ./design-tokens.json
```

This command will generate design tokens colors based on your tailwind config by using `theme.colors` and `theme.extend.colors`

#### Options

| Options               | Short | Description                                                                                     |   Type   |
| :----------------     | :---: | :---------------------------------------------------------------------------------------------- | :------: |
| `--framework`         | `-f`  | Provide your framework name i.e. `tailwind`                                                     | `string` |
| `--config`            | `-c`  | Provide your framework config file i.e. `./tailwind.config.cjs`                                 | `string` |
| `--output`            | `-o`  | Provide an output path of your Design Tokens file, i.e. `./design-tokens.json`                  | `string` |

## Alternative configuration

You can also create an `anima.config.js` file in your root directory, and save the configuration values like design tokens.

```js
// anima.config.js
module.exports = {
  design_tokens: '<path to design tokens JSON file>', // "./design-tokens.json"
};
```

--- 

# Writing _better_ Storybook Stories

Anima uses Storybooks story [controls](https://storybook.js.org/docs/react/essentials/controls) to generate Figma component [variants](https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants), so it's important to properly configure your stories.

We recommend writing your stories in the following way:

## 1.  Specify ArgTypes to define the props of your component

Define a control type of `select` for props that have a number of values for example:
  
  > ```js
  > // Button.stories.js|jsx|ts|tsx
  >
  > //...
  >
  > export default {
  >   // ...
  >   argTypes: {
  >     // ...
  >     variant: {
  >       control: {
  >         type: 'select',
  >         options: ['primary', 'secondary', 'tertiary'],
  >       },
  >     },
  >   },
  > };
  > ```


**🚨 STORYBOOK BUG ALERT 🚨**

The documented way to define a control type of `boolean` for a prop is:

```jsx
// Button.stories.js|jsx|ts|tsx

//...

export default {
  // ...
  argTypes: {
    // ...
    disabled: {
      control: 'boolean',
    },
  },
};
```

We've discovered that this causes problems not only in our plugin but also in Storybook and we've [logged an issue](https://github.com/storybookjs/storybook/issues/18796). To get the correct behaviour we recommend changing the definition to:

```jsx
// Button.stories.js|jsx|ts|tsx

//...

export default {
  // ...
  argTypes: {
    // ...
    disabled: {
      type: 'boolean',
    },
  },
};
```

## 2. Use single story per component

Instead of creating a story for each variant of a component, it is preferable to create just one story and use the `args` property to define the default values of your props.

This will make it easier to find components to generate in Figma with the Anima plugin.

There are two ways to achieve this and both will have the same result:

### 2.1. Name your single story `Default`

```jsx
// Button.stories.js|jsx|ts|tsx

import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  variant: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary'],
      },
    },
};

export const Default = () => <Button {...args} />;

Default.args = {
  variant: 'primary',
  label: 'Button',
};
```

### 2.2. Use the single story hoisting feature from Storybook ([more info here](https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting))

```jsx
// Button.stories.js|jsx|ts|tsx

import { Button as Component } from './Button'; // import the Button component as a different name

export default {
  title: 'Components/Button',
  component: Component, // use the Button component as the component
  variant: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary'],
      },
    },
};

// This is the only named export in the file, and it matches the component name
export const Button = () => <Component {...args} />;
Button.args = {
  variant: 'primary',
  label: 'Button',
};
```

