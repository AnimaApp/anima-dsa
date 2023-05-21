# How to sync components to Figma

[[toc]]

## Sync from an Storybook URL {#sync-from-url}

If you have your Storybook deployed and have a public URL, you can sync it to Anima from that URL.

::: warning Use the URL method just for testing purposes.

Using this method, you won't be able to autmoaticaly sync your Design Tokens to Anima as well as you'll not receive updates when the components change.

:::

1. Open the Anima plugin in Figma -> Go to `Components` section, and add your Storybook URL int the input on the `Sync from URL` section.
2. Click on `Connect` button.
3. Wait for the sync to finish.
3. Check the Tab `Not imported` and import the components you want to use in Figma.
4. They'll show up in the `Imported` tab. Click `Generate` to generate the component in Figma.

<video src="/sync-url.mp4" controls loop autoplay title="Link Title"></video>


## Sync Storybook using the Anima CLI (preferred)


If you are using a CI/CD environment, you can use the Anima CLI to sync your components to Anima.
::: tip 
This is the preferred method to sync your components to Anima. 

It allows your team to integrate with **CI/CD environments**, but is also the only way if you are using Storybook behind a firewall or if you don't have a public URL setup yet.
:::

### Use CI/CD to sync your components to Anima

<video src="/sync-ci-cd.mp4" controls loop autoplay title="Link Title"></video>

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



### Sync from a local Storybook
If you are using Storybook behind a firewall or if you don't have a public URL setup yet, you can use the Anima CLI to sync your components to Anima.


#### Get your Anima Team Token from the Plugin

>1. Open the Anima plugin in Figma -> Go to `Components` section
>2. Click on `Start with Anima CLI` button
>3. Copy your Anima Team Token

####  1. Install the Anima CLI 

Follow the instructions in the [Anima CLI guide](/guide/anima-cli#setup) to install the Anima CLI.


#### 2. Build your Storybook
It is important to build your Storybook before running the CLI. This way, the CLI will be able to find the components in your Storybook build folder.

::: details How to build Storybook
The default command is usually `build-storybook`:

::: code-group
```sh [npm]
npm run build-storybook
```
    
```sh [yarn]
yarn build-storybook
```

```sh [pnpm]
pnpm build-storybook
```

:::

#### 3. Run the CLI

Run the following command in your terminal:

```sh
anima sync --storybook

```

#### Back to Figma

:tada: Sync complete! Now you can go back to Figma and import the components you want to use.