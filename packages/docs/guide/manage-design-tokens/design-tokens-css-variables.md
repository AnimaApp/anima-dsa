# CSS Variables

We are using [Style Dictionary](https://amzn.github.io/style-dictionary/) to convert design tokens into css variables that you can use in your code.

## Installation

```
npm i -D style-dictionary @animaapp/style-dictionary
```

## Configuration

1. Create a `styleguide.config.(js|cjs)` with our custom register.
```js 4,2
const StyleDictionary = require('style-dictionary');
const { registerAnima } = require('@animaapp/style-dictionary');

registerAnima(StyleDictionary);

module.exports = {
  source: ['./src/design-tokens/anima-ds-tokens.json'],
  platforms: {
    scss: {
      transformGroup: 'css',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'css/_variables.css',
          format: 'css/variables',
        },
      ],
    },
  },
};
```

2. Change the source to match your token file.
```js
const StyleDictionary = require('style-dictionary');
const { registerAnima } = require('@animaapp/style-dictionary');

registerAnima(StyleDictionary);

module.exports = {
  source: ['./ds-tokens-example.json'], // [!code --]
  source: ['*tokens.json'], // [!code ++]
  platforms: {
    scss: {
      transformGroup: 'css',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'css/_variables.css',
          format: 'css/variables',
        },
      ],
    },
  },
};
```

3. Run the command
```sh
npx style-dictionary build -c ./styleguide.config.js
```

With this configuration it will take as input any design token files ending with `tokens.json` and generate the css variables in `src/generated/css/_variables.css`

## What is `@animaapp/style-dictionary` ?
A package we provide with some transformer and parser around Style Dictionary

## Customization of StyleDictionary

[StyleDictionary](https://amzn.github.io/style-dictionary/#/README)
