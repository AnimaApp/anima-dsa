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
