# Features

## Generate Figma components automatically

Use Anima DSA to generate your entire code components library as a Figma library, with a single click.
Anima will translate all of your components (as they are represented in Storybook), as native Figma components.

### 1. Figma variants sync to a component's props

A component's property will be translated to a Figma variant

![Matching-props](https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/aa7d5e90-8519-4ffe-be00-4e944ffb6435)

### 2. Figma's Auto-layout sync to a component's CSS flex layout

Anima will automatically convert the CSS flex styles into Figma Auto-layout

![css-to-auto-layout](https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/cafc3ad0-dd54-405f-a30b-778a6b727c68)

### 3. Figma styles sync to design tokens

Anima will create your design tokens as Figma styles, ready to use and edit directly from Figma

<img width="475" alt="variants match" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/372e2e3b-207e-4299-a5af-c2f97b0efa96">

### 4. Media-queries to Figma variants

Have components that look different on different screens? We’ve got you covered. When importing your component to Figma, you’re able to define which viewports you’d like to see in Figma. Anima will add a “Viewport” size property to your component, with all selected sizes

<img width="821" alt="Media-queries as Variants" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/94e88059-c175-4eb5-8259-d4713db9f8d0">

### 5. Code snippets embedded in instances

Know for each component if it already exists in your source code, and which properties to use for the selected instance

<img width="1164" alt="snippet_in_variants" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/7c5db3fa-2693-4a83-8b87-1e9a9419fa97">

## Manage design tokens

Whether it's rebranding, accessibility tests, or touch-ups, your design system is constantly evolving. Translating those changes into words and tasks often leads to pixels and colors that get lost in translation.

Here's how Anima keeps your design tokens in sync across your designs and codebase

### 1. Create, update, and delete design tokens

Anima supports all of Figma's native styles and converts them into design tokens. You can use the Anima plugin to create tokens that are not (yet) supported by Figma, like typography.

<img width="436" alt="typography token creation" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/e6762ab8-f41d-4755-a99c-a32c065ff1f7">

### 2. Create pull requests for design tokens updates directly from Figma

Anima lets you connect your Figma with GitHub, so you can make changes to your design tokens in Figma and push those changes back to GitHub.

<img width="469" alt="Manage Design Tokens - create a PR" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/ccc8cba9-7ec2-47d7-ad0f-5dce72e40f81">

### 3. Pull design tokens updates from GitHub to Figma

By connecting to GitHub, you can pull any changes made to the code and have those changes reflected in Figma.

  <img width="441" alt="Pull-updates-from-github" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/06803d5a-f11c-4670-909e-aa58cd8e6818">
