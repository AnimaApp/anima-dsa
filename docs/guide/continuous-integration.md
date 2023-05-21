# Continuous Integration

Using our Anima CLI, you can keep your design system components, as well as design tokens,in sync with Figma, making sure that your design system is always up to date on both sides.

[[toc]]

## How it works
![Continuous Integration](/ci-flow.png)

#### Steps
>1. You make changes to your components in your codebase
>2. You push your changes to your repository
>3. Your CI/CD environment builds your Storybook and runs the Anima CLI
>4. The Anima CLI syncs your components and design tokens with Figma
>5. Designers update Design Tokens in Figma
>6. With Anima plugin, create a Pull Request to update your codebase with the latest Design Tokens
>7. Step 3 — 4 are repeated

## How to setup CI/CD

#### First get your Anima Team Token from the Plugin

>1. Open the Anima plugin in Figma -> Go to `Components` section
>2. Click on `Start with Anima CLI` button
>3. Copy your Anima Team Token

#### Then add the Anima CLI to your CI/CD environment
>Here is an example of configuration you can add to the components repository:

::: code-group
```yml [Github Actions]
#.github/workflows/sync-with-anima.yml

name: Sync with Anima
on:
  # Triggers the workflow on push or pull request events but only for the "main" branch
  push:
    branches: ["main"]

  workflow_dispatch:

jobs:

  sync-with-anima:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci

      - name: Build the storybook
        run: npm run build-storybook
      # Sync with Anima
      - name: Sync with Anima
        # Add the Anima token as a secret in your repository Settings > Secrets and variables > New repository secret
        # you can get the token from the Anima plugin in Figma
        env:
          ANIMA_TEAM_TOKEN: ${{ secrets.ANIMA_TEAM_TOKEN }}
        run: npm run anima sync --storybook --design-tokens design-tokens.json


```
```yml [CircleCI Pipelines]
#.circleci/config.yml

version: 2.1
orbs:
  anima:
    # Add the Anima token as an environment variable in your CircleCI project Settings > Environment variables
    # you can get the token from the Anima plugin in Figma
    ANIMA_TEAM_TOKEN: $ANIMA_TEAM_TOKEN

jobs:
    sync-with-anima:
        docker:
        - image: node:18
        
        steps:
        - run: npm ci
        - run: npm run build-storybook
        - run: npm run anima sync --storybook --design-tokens design-tokens.json
```

:::

> **Note**: you can review the documentation of [Github Actions](https://docs.github.com/en/actions/learn-github-actions) and [CircleCI](https://circleci.com/developer) to learn more about how to setup your CI/CD environment.
