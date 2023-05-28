# A single source of truth for designers and developers

### TL;DR
1. Create a mutual language between designers and developers
2. Allow pushing PRs from Figma
3. Allow Pulling changes from code to Figma
4. Build new designs using your existing components


## The problem
Designers are using their Figma libraries, which are isolated from their developers’ code libraries. 
Developers are using their code libraries to reproduce designs as efficiently as possible, but the components don’t look the same in real life. Or worse yet, they’re building the same component from scratch, either because similar components don’t exist in the codebase or because there are too many components to sift through.
This wastes precious time for both designers and developers, and results in inferior products that take longer to produce.


## Anima DSA
### Managing components
Anima DSA allows design system teams to bring their live code components—along with all of the variants that exist into code—into their existing design tools via Storybook. They can import an individual component’s story (aka the component and all of its variants), or an entire Storybook library in a single click. This will enable them to see exactly what their users will see as they’re designing.

### Managing design tokens
Anima DSA allows design system teams to push and pull style changes directly from Figma to Github (and vice versa), eliminating the tedious ping-pong. pushing pixeles or fighting with colors
