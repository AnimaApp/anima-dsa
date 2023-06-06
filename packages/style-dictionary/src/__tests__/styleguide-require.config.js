/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { registerAnima } = require('../../dist/index.js');
const StyleDictionary = require('style-dictionary');

registerAnima(StyleDictionary);

module.exports = {
  source: ['./src/__tests__/tokens-test.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: './src/__tests__/tmp/',
      files: [
        {
          destination: 'scss/_variablesCJS.scss',
          format: 'css/variables',
        },
      ],
    },
  },
};
