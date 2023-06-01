# Getting Started
>
> You’ll learn how Anima can automate your design system workflow. You’ll bridge your developer/designer workflow gap by making sure that your design systems stays in sync with your codebase and Figma designs.

# 5 Steps to start automating your design system workflow

[[toc]]

## 1. Set up Anima

- Run the [Anima plugin](https://www.figma.com/community/plugin/857346721138427857) in Figma
- Sign up/Log into the Anima platform
- Choose the Manage Design Systems workflow

<img width="400" alt="Manage design systems" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/65589ece-b124-49f5-bc2d-492f1cd53a95">

## 2. Import your Storybook into Anima

- Choose your [preferred import method](./cli-vs-url)
    >Don't have a Storybook yet? use our [sample Storybook](https://animaapp.github.io/anima-sample-storybook/).

- [Import from a URL](/guide/manage-components/sync-components#sync-from-an-storybook-url-sync-from-url)
- [Sync with the CLI](/guide/manage-components/sync-components#sync-storybook-using-the-anima-cli-preferred)
  - [Install the CLI](/guide/manage-components/sync-components#sync-storybook-using-the-anima-cli-preferred) in the codebase
  - [Build a storybook](/guide/manage-components/sync-components#_2-build-your-storybook)
  - [Sync the storybook](/guide/manage-components/sync-components#_3-run-the-cli)
- Generate Figma components with Anima
- Build your next flows with your production components 🎉

## 3. Import your design tokens into Anima

- Sync with the CLI
  - [Install the CLI](/guide/anima-cli/index#_1-installation) in the codebase
  - [Sync design tokens](/guide/anima-cli/index#sync-design-tokens-to-anima)

## 4. Push changes to GitHub

- Create/edit a design token in the plugin
- Make sure your repo is pushed to GitHub
- [Create an access token for the repo](/guide/manage-design-tokens/sync-design-tokens#_1-generate-your-personal-access-token)
- [Add the credentials to the Figma plugin](/guide/manage-design-tokens/sync-design-tokens#_2-connect-your-github-account-to-anima)
- Push the changes to GitHub
- Review and merge the pull request

## 5. Pull changes into Figma

- Make a change to the design system in your code, and push to main
- Pull these changes the next time we open the Anima plugin
