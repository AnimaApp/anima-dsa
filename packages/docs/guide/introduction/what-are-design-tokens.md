# What are design tokens?

::: info TL;DR

Design tokens are standardized values that capture design decisions, ensuring consistency and collaboration between designers and developers.

They serve as a shared language, enabling a seamless translation of design styles from tools like Figma into code, ultimately streamlining the design-to-code process.
 :::

## What are design tokens for?

### Capturing design decisions

Design tokens document and organize design decisions, including colors, typography, spacing, and more, to create a cohesive user experience.

### Standardizing design attributes

Design tokens establish a set of standardized values for design attributes. For example, instead of manually specifying a color value each time, we can define a design token called `primary-color` and assign a specific color value to it. This token can then be used consistently throughout the design and development process.

### Streamlining design-to-code translation

Design tokens streamline the translation of design styles to code, allowing developers to reference them directly for accurate implementation and saving time by avoiding manual interpretation and potential errors.

## Example

Designers define a style called `primary-color` with a value of `#00FFA3`.

They use this token consistently in their designs.

**In Figma:**

<img width="673" alt="color-token-usage" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/5bb15bca-3198-4e12-ad6b-8d4be7108219">

**In code:**

``` css
/* Design Token */
--primary-color: #00FFA3;
```

Developers reference the "primary-color" token in their code, ensuring accurate implementation.

``` css
/* Example Usage */

.button {
  background-color: var(--primary-color);
}

h1 {
  color: var(--primary-color);
}

a {
  color: var(--primary-color);
}
```
