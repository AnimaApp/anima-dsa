# How to sync Design tokens

[[toc]]

## Uploading a JSON file

(coming soon)

## Importing from Figma Styles

(coming soon)

## Using the Anima CLI

If you are using a CI/CD environment, you can use the Anima CLI to sync your design tokens to Anima, making them syncable with Figma.

### Get your Anima team token from the Plugin

>1. Open the Anima plugin in Figma -> Go to `...` button on the top left corner
>2. Copy the Anima team token

### Quick start

Run the following command in your terminal:

```sh
npx @animaapp/anima-cli sync -t <anima-team-token> --design-tokens ./design-tokens.json
```

>Where `<anima-team-token>` is your Anima team token and `./design-tokens.json` is the path to your design tokens JSON file.

### Installing the package in the project

#### Install the Anima CLI

Follow the detailed instructions in the [Anima CLI guide](/guide/anima-cli/#setup) to install the Anima CLI.

#### Run the CLI

Run the following command in your terminal:

```sh
anima sync --design-tokens ./design-tokens.json
```

Where `./design-tokens.json` is the path to your design tokens JSON file.

#### Go to Anima plugin in Figma

>1. Open the Anima plugin in Figma
>2. Go to `Design Tokens` section
>3. You'll see your tokens there

## Connect with GitHub

::: tip Heads up!
You'll need a GitHub account. If you dont have one, you can [create one for free :arrow_upper_right:](https://github.com/signup).
:::

### 1. Generate your Personal Access Token

Go to the [Personal Access Tokens section](https://github.com/settings/tokens), by clicking on your Avatar in the top right, then `Settings` -> scroll down to `Developer Settings` -> `Personal Access Tokens`.
You can either create a personal access token with the older `Classic` scopes, or with `Fine-grained tokens` scope:

- `Classic`: Generate a new token and select scope repo, decide expiration date for that token. Scroll down and click Generate token.
- `Fine-grained tokens`: Generate a new token, decide expiration date for that token. Select the repos you want to allow access for, and under `Repository permissions` make sure the option **Contents** has `Read and write` selected. Scroll down and click Generate token.

Once you've created your token, copy so you can use it in the plugin.

::: warning Treat the Personal Access Token like a password

Never share this token with anyone who shouldn't have access to your repository. Treat it like your personal password.

:::

### 2. Connect your GitHub account to Anima

<video src="/setup-github.mp4" controls loop autoplay title="Link Title"></video>

>1. Open the Anima plugin in Figma
>2. Go to `Design Tokens` section
>3. Click on :gear: button on the top-right corner
>4. Click on `Edit GitHub credentials` button
>5. Paste your Personal Access Token
>6. Provide your Repository URL
>7. Provide your design tokens file path
