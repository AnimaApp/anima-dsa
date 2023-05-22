# Compatibility

## Frameworks

Since we leverage Storybook's rendering engine, Anima works with any framework supported by Storybook.

| Framework | Supported |
| :-------- | :-------: |
| React     |    ✅     |
| Vue       |    ✅     |
| Angular   |    ✅     |
| Web-Components      |    ✅     |
| Svelte    |    ✅     |
| React Native (Web)    |    ✅ [With Addon](https://www.dannyhwilliams.co.uk/introducing-react-native-web-storybook)     | 

## Design Tokens

We support the W3C Design Tokens Community Group [format specification](https://tr.designtokens.org/format/).

In regards to double way sync between Figma and your codebase, we currently support the following frameworks/libraries transformers:

| Framework/Library | Supported | How |
| :-------- | :-------: | :------- |
| TailwindCSS     |    ✅     | [Guide](/guide/token-transformers#tailwindcss) |
|Ant Design v5|✅| [Guide](/guide/token-transformers#ant-design)|
| Material UI | coming soon | - |
| Mantine | coming soon | - |
| CSS-variables | coming soon | - |

## Generate Pull Requests from Figma

Currently we're only supporting Github, but we're working on adding support for other Git providers.

| Git Provider | Supported |
| :-------- | :-------: |
| Github     |    ✅     |
| Gitlab       |    coming soon     |
| Bitbucket   |    coming soon     |
| Azure DevOps   |    coming soon     |
