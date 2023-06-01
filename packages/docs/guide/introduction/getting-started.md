# Getting Started
> You’ll learn how Anima can automate your design system workflow. You’ll bridge your developer/designer workflow gap by making sure that your design systems stays in sync with your codebase and Figma designs.

## 5 Steps to start automating your design system workflow
1. [Set up Anima](#_1-set-up-anima)
2. [Import your Storybook](#_2-import-your-storybook-into-anima)
3. [Import your Design Tokens](#_3-Import-your-design-tokens-into-Anima)
4. [Push changes from Figma to GitHub](#_4-Push-changes-from-Figma-to-GitHub)
5. [Pull changes from GitHub to Figma](#_5-Push-changes-from-GitHub-to-Figma)

### 1. Set up Anima
- Run the [Anima plugin](https://www.figma.com/community/plugin/857346721138427857) in Figma
- Sign up/Log into the Anima platform
- Choose the Manage Design Systems workflow
<img width="400" alt="Manage design systems" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/65589ece-b124-49f5-bc2d-492f1cd53a95">

### 2. Import your Storybook into Anima
- Choose your [preferred import method](./cli-vs-url.md)
<br> ** Don't have a storybook yet? use our [sample Storybook](https://animaapp.github.io/anima-sample-storybook/?path=/story/getting-started--page).
  -   [Import from a URL](../manage-components/sync-components.md#sync-from-an-storybook-url-sync-from-url)
  -   [Sync with the CLI](../manage-components/sync-components.md#sync-storybook-using-the-anima-cli-preferred)
      -   [Install the CLI](../manage-components/sync-components.md#sync-storybook-using-the-anima-cli-preferred) in the codebase
      -   [Build a storybook](../manage-components/sync-components.md#_2-build-your-storybook)
      -   [Sync the storybook](../manage-components/sync-components.md#_3-run-the-cli) 
- Generate Figma components with Anima
- Build your next flows with your production components 🎉

### 3. Import your design tokens into Anima
- Sync with the CLI
    - [Install the CLI](../anima-cli/index.md#_1-installation) in the codebase
    - [Sync design tokens](../anima-cli/index.md#sync-design-tokens-to-anima)

### 4. Push changes to GitHub
- Create/edit a design token in the plugin
- Make sure your repo is pushed to GitHub
- [Create an access token for the repo](../manage-design-tokens/sync-design-tokens.md#_1-generate-your-personal-access-token)
- [Add the credentials to the Figma plugin](../manage-design-tokens/sync-design-tokens.md#_2-connect-your-github-account-to-anima)
- Push the changes to GitHub
- Review and merge the pull request

### 5. Pull changes into Figma
- Make a change to the design system in your code, and push to main
- Pull these changes the next time we open the Anima plugin
