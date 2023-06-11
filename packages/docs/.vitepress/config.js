import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Anima DSA',
  description: 'Anima design system automation solution',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Guide',
        link: '/guide/introduction/',
        activeMatch: '/guide/',
      },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          {
            text: 'Overview',
            collapsed: false,
            items: [
              {
                text: 'What is Anima DSA?',
                link: '/guide/introduction/',
              },
              {
                text: 'Who should use Anima DSA?',
                link: '/guide/introduction/who-should-use-anima-dsa',
              },
              { text: 'Features', link: '/guide/introduction/features' },
            ],
          },
          {
            text: 'Getting started',
            link: '/guide/introduction/getting-started',
          },
          {
            text: 'Basic concepts',
            collapsed: false,
            items: [
              {
                text: 'What is Storybook?',
                link: '/guide/introduction/what-is-storybook',
              },
              {
                text: 'What are design tokens?',
                link: '/guide/introduction/what-are-design-tokens',
              },
            ],
          },
          { text: 'Compatibility', link: '/guide/introduction/compatibility' },
        ],
      },
      {
        text: 'Anima CLI',
        items: [
          { text: 'Guide', link: '/guide/anima-cli/' },
          // { text: 'Setup', link: '/guide/anima-cli#setup' },
          // { text: 'Usage', link: '/guide/anima-cli#usage' },
          // { text: 'Command API', link: '/guide/anima-cli#commands' },
        ],
      },
      {
        text: 'Manage components',
        items: [
          {
            text: 'Overview',
            link: '/guide/manage-components/',
          },
          {
            text: 'How to sync components',
            link: '/guide/manage-components/sync-components',
          },
          {
            text: 'Syncing with a URL vs CLI',
            link: '/guide/manage-components/cli-vs-url',
          },
          {
            text: 'Continuous integration',
            link: '/guide/manage-components/continuous-integration',
          },
          {
            text: 'Set up Storybook',
            link: '/guide/manage-components/set-up-storybook',
          },
        ],
      },
      {
        text: 'Manage design tokens',
        items: [
          {
            text: 'Overview',
            link: '/guide/manage-design-tokens/',
          },
          {
            text: 'How to sync design tokens',
            link: '/guide/manage-design-tokens/sync-design-tokens',
          },
          {
            text: 'Anima token transformers',
            collapsed: false,
            items: [
              {
                text: 'Overview',
                link: '/guide/manage-design-tokens/token-transformers',
              },
              {
                text: 'Tailwind',
                link: '/guide/manage-design-tokens/design-tokens-tailwind',
              },
              {
                text: 'AntDesign',
                link: '/guide/manage-design-tokens/design-tokens-ant-design',
              },
              {
                text: 'CSS variables',
                link: '/guide/manage-design-tokens/design-tokens-css-variables',
              },
              {
                text: 'Coming soon',
                collapsed: true,
                items: [
                  { text: 'MaterialUI' },
                  { text: 'Bootstrap' },
                  { text: 'ChakraUI' },
                  { text: 'Sass' },
                  { text: 'Less' },
                ],
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/AnimaApp/anima-dsa',
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
  markdown: {
    // https://vitepress.dev/guide/markdown.html#custom-components
    config: (md) => {
      // use more markdown-it plugins!
      md.use(require('markdown-it-imsize'));
    },
  },
});
