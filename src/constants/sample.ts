export const TAILWIND_CONFIG_FILE=`
const {
  getTwColorsTheme,
} = require("anima-storybook-cli/dist/lib/getTwColorsTheme");
const dsToken = require("./design-tokens.json");

const theme = getTwColorsTheme(dsToken);

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: theme,
  },
};
`
