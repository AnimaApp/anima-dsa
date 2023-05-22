# How to sync Design tokens

[[toc]]

## Using the Anima CLI (preferred)

If you are using a CI/CD environment, you can use the Anima CLI to sync your design tokens to Anima, making them syncable with Figma.



### Get your Anima Team Token from the Plugin

>1. Open the Anima plugin in Figma -> Go to `...` button on the top left corner
>2. Copy the Anima team token


### Quick start

Run the following command in your terminal:

```sh
npx @animaapp/anima-cli sync -t <anima-team-token> --design-tokens ./design-tokens.json
```

>Where `<anima-team-token>` is your Anima Team Token and `./design-tokens.json` is the path to your design tokens JSON file.

### Installing the package in the project

#### Install the Anima CLI

Follow the detailed instructions in the [Anima CLI guide](/guide/anima-cli#setup) to install the Anima CLI.

#### Run the CLI

Run the following command in your terminal:

```sh
anima sync --design-tokens ./design-tokens.json
```
Where `./design-tokens.json` is the path to your design tokens JSON file.

## Uploading a JSON file

(coming soon)

## Importing from Figma Styles

(coming soon)