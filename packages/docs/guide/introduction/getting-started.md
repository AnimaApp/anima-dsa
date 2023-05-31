# Quickstart
> Learn how Anima can automate your design system workflow by keeping your components and design tokens in sync with Figma and your codebase.

> Learn how to automate your design system workflow using Anima. Your designers will be able to push Figma changes to code, and your developers will be able to push code changes to Figma.

> In this guide, you’ll set up Anima to keep your design system in sync. Changes in Figma will be pushed to code, and changes in code will be pushed to Figma.

> By the end of this guide, your Figma designs and codebase will be in sync.

> By the end of this guide, you’ll be able to keep your designs and codebase in sync, regardless of where you make your changes. 

> You’ll learn how Anima can automate your design system workflow. You’ll bridge your developer/designer workflow gap by making sure that your design systems stays in sync with your codebase and Figma designs.

## 5 Steps to start automating your design system workflow
1. [Set up Anima](#1-set-up-anima)
2. [Import your Storybook](#2-import-your-storybook-into-anima)
3. [Import your Design Tokens](#3-Import-your-design-tokens-into-Anima)
4. [Push changes from Figma to GitHub](#4-Push-changes-from-Figma-to-GitHub)
5. [Pull changes from GitHub to Figma](#5-Push-changes-from-GitHub-to-Figma)

### 1. Set up Anima
- Run the [Anima plugin](https://www.figma.com/community/plugin/857346721138427857) in Figma
- Sign up/Log into the Anima platform
- Choose the Manage Design Systems workflow
<img width="586" alt="Manage design systems" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/38b3e73b-13a4-4313-998d-642cfc420b96">

### 2. Import your Storybook into Anima
- Choose your [preferred import method](cli-vs-url.md)
<br> ** Don't have a storybook yet? use our [sample Storybook](https://animaapp.github.io/anima-sample-storybook/?path=/story/getting-started--page).
  -   [Import from a URL](sync-components.md#sync-from-an-storybook-url-sync-from-url)
  -   [Sync with the CLI](sync-components.md#sync-storybook-using-the-anima-cli-preferred)
      -   [Install the CLI](sync-components.md#sync-storybook-using-the-anima-cli-preferred) in the codebase
      -   Get your team token
      -   Build a storybook
      -   Sync the storybook 
- Generate Figma components with Anima
- Build your next flows with your production components

### 3. Import your design tokens into Anima
- Sync with the CLI
    - Install the CLI in the codebase
    - Get the team token
    - Sync design tokens

### 4. Push changes to GitHub
- Create/edit a design token in the plugin
- Push the repo to GitHub
- Create an access token for the repo
- Add the credentials to the Figma plugin
- Push the changes to GitHub
- Review and merge the pull request

### 5. Pulling changes in Figma
- Make a change to the design system and push to main
- Pull these changes the next time we open the Anima plugin
