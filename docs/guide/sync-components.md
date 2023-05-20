# How to sync components to Figma

## Try it out from an URL

If you have your Storybook deployed and have a public URL, you can sync it to Anima from that URL.


1. Open the Anima plugin in Figma -> Go to `Components` section, and add your Storybook URL int the input on the `Sync from URL` section.
2. Click on `Connect` button.
3. Wait for the sync to finish.
3. Check the Tab `Not imported` and import the components you want to use in Figma.
4. They'll show up in the `Imported` tab. Click `Generate` to generate the component in Figma.

<video src="/test-video.mp4" controls loop autoplay title="Link Title"></video>

::: warning Use the URL method just for testing purposes.

Using this method, you won't be able to autmoaticaly sync your Design Tokens to Anima as well as you'll not receive updates when the components change.

:::

## Sync using the Anima CLI

This is the preferred method to sync your components to Anima. 

Its the best method to integrate with CI/CD environments, but also the only way if you are using Storybook behind a firewall or if you don't have a public URL setup yet.

::: info
You will be switching between Figma and your local Terminal!
:::


### In Figma 

#### Create a new Figma project. 
This is where all your sync'ed Storybook components will live.

#### Get your Anima Team Token from the Plugin

1. Open the Anima plugin in Figma -> Go to `Components` section
2. Click on `Start with Anima CLI` button
3. Copy your Anima Team Token

### In your Terminal
####  1, Install the Anima CLI 

Follow the instructions in the [Anima CLI docs](/guide/anima-cli#setup) to install the Anima CLI.


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

### Back to Figma

Follow the remaining instructions in Figma :tada: