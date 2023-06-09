# @animaapp/style-dictionary [![npm](https://img.shields.io/npm/v/@animaapp/style-dictionary?logo=npm)](https://www.npmjs.com/package/@animaapp/style-dictionary)

This package is part of a set of tools that enable you to create and manage a single source of truth for your design system.

Learn more about the whole Design System workflow in our [Anima Design System Automation guide](https://dsa.animaapp.com/guide/manage-design-tokens/design-tokens-css-variables.html).

# Style Dictionary helper to convert design tokens

This package contains transformers and parsers for design token workflows that use Style Dictionary

## Install

```bash
npm i -D @animaapp/style-dictionary
```

## Usage

### convert design tokens to css variables

`styleguide.config.js`

```js
const { registerAnima } = require('@animaapp/style-dictionary');
const StyleDictionary = require('style-dictionary');

registerAnima(StyleDictionary);

module.exports = {
  source: ['./src/anima-ds-tokens.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'scss/_variables.scss',
          format: 'css/variables',
        },
      ],
    },
  },
};
```

### Learn more with our [tokens to css-variables example](https://dsa.animaapp.com/guide/manage-design-tokens/design-tokens-css-variables.html)
