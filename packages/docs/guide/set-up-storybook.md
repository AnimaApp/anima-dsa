# Setting up Storybook

::: tip Dont have Storybook yet?
If you still don't have/use Storybook yet, you can follow the [official Storybook guide](https://storybook.js.org/docs/) to get started.
:::

While Anima works out of the box with any Storybook, there are a few things you can do to make the most out of it.

#### Recommended Storybook setup
[[toc]]

## Add controls to your stories

Controls should be automatically created based on the props of your components. Please refer to Storybook's [Controls](https://storybook.js.org/docs/react/essentials/controls) documentation for more information.


::: details Known issue with Boolean Controls in Storybook v6.5 and below 

If you are using Storybook v6.5 or below, there is an issue with the boolean controls. 

instead of setting a `boolean`control like this:

```js
argTypes: {
  isDisabled: {
    control: 'boolean',
  },
}
```
please use the following syntax:

```js
argTypes: {
  isDisabled: {
    control: {
      type: 'boolean',
    },
  },
}
```


:::


## Make sure you have a "Default" story

We recommend having a primary story named `Default` for each component rather than a story for each "state". 
> For example, on a `Button` component, avoid having a "Primary" story, a "Secondary" story, a "Disabled" story, etc. Instead, have a single "Default" story with a `variant` prop that can be set to `primary`, `secondary`, `disabled`, etc.

This way, you have a overview of all the possible states of your component, as well as when generating it in Figma, Anima can create variants matching all the prop values.

## Avoid using styled decorators

If you are using Storybook's [decorators](https://storybook.js.org/docs/react/writing-stories/decorators) to style your components, Anima will try to omit them when generating the component in Figma, but we can't guarantee it will work in all cases, so we recommend avoiding them.

## Use (or upgrade to) Storybook v7

It is recommended to use Storybook v7 or above. If you are using an older version, please upgrade to the latest version. It will make the integration smoother as it fixes some previous issues.

You can use the command bellow to upgrade, but please refer to the [official Storybook guide](https://storybook.js.org/docs/react/workflows/upgrade-to-7) for more information.

```sh
npx sb@latest upgrade 
```