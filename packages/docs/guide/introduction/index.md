# What is Anima DSA?

DSA stands for **Design System Automation**; a platform that connects your component library in code with Figma, enabling you to create and manage a single source of truth for your design system.

::: info TL;DR

1. Create a mutual language between designers and developers
2. Allow pushing PRs from Figma
3. Allow Pulling changes from code to Figma
4. Build new designs using your existing components

:::

## The problem

Designers use their Figma libraries, which are isolated from the developers' code libraries.

Developers rely on their code libraries to efficiently reproduce designs, but the resulting components do not look the same in real life. In some cases, they end up building the same component from scratch due to the absence of similar components in the codebase or the overwhelming number of components to sift through. This process wastes valuable time for both designers and developers and leads to the creation of inferior products, which take longer to produce.

## Anima DSA

### Managing components

Anima DSA enables design system teams to integrate their live code components, including all existing variants, into their current design tools through Storybook. They have the option to import either an individual component's story, which encompasses the component and its variants, or an entire Storybook library with just a single click. This functionality allows them to visualize precisely what their users will see during the design process.

### Managing design tokens

Anima DSA allows design system teams to push and pull style changes directly from Figma to Github (and vice versa), eliminating the tedious ping-pong. pushing pixels or fighting with colors.
