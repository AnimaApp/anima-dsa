import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Anima DSA',
  description: 'Anima Design system Automation solution',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/overview', activeMatch: '/guide/' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          {
            text: 'Overview',
            link: '/guide/overview',
            collapsed: true,
            items: [
              {
                text: 'What is Anima DSA?',
                link: '/guide/overview#what-is-anima-dsa',
              },
              { text: 'Who is it for?', link: '/guide/overview#who-is-it-for' },
            ],
          },
          { text: 'Getting started', link: '/guide/getting-started' },
          {
            text: 'Basic oncepts',
            collapsed: false,
            items: [
              { text: 'What is storybook?', link: '/guide/what-is-storybook' },
              {
                text: 'What are Design Tokens?',
                link: '/guide/what-are-design-tokens',
              },
            ],
          },
          { text: 'Compatibility', link: '/guide/compatibility' },
        ],
      },
      {
        text: 'Anima CLI',
        items: [
          { text: 'Overview', link: '/guide/anima-cli' },
          { text: 'Setup', link: '/guide/anima-cli#setup' },
          { text: 'Usage', link: '/guide/anima-cli#usage' },
          { text: 'Command API', link: '/guide/anima-cli#commands' },
        ],
      },
      {
        text: 'Manage components',
        items: [
          { text: 'Overview', link: '/guide/components-overview' },
          { text: 'How to sync components', link: '/guide/sync-components' },
          {
            text: 'Continuous integration',
            link: '/guide/continuous-integration',
          },
          {
            text: 'Set up Storybook',
            link: '/guide/set-up-storybook',
          },
        ],
      },
      {
        text: 'Manage Design Tokens',
        items: [
          { text: 'Overview', link: '/guide/design-tokens-overview' },
          {
            text: 'How to sync Design Tokens',
            link: '/guide/sync-design-tokens',
          },
          {
            text: 'Anima Token transformers',
            link: '/guide/token-transformers',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/guide/token-transformers' },
              { text: 'Tailwind', link: '/guide/token-transformers#tailwind' },
              {
                text: 'AntDesign',
                link: '/guide/token-transformers#antdesign',
              },
              {
                text: 'CSS-variables',
                link: '/guide/token-transformers#css-variables',
              },
              { text: 'MaterialUI (Soon)' },
              { text: 'Bootstrap (Soon)' },
              { text: 'ChakraUI (Soon)' },
              { text: 'Sass (Soon)' },
              { text: 'Less (Soon)' },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/animaapp/anima-storybook-cli',
      },
      {
        icon: 'discord',
        link: 'https://discord.gg/TvW7aqAaq9',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/animaapp',
      },
    ],
  },
});
