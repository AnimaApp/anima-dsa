# Who should use Anima DSA?

Anima DSA is for everyone involved in building or utilizing a design system.

## Design system creators

### Designers {#ds-designers}

Designers use their Figma libraries, which are isolated from the developers' code libraries.

- Get a 100% parity between your code components and your design components:
  - Same prop names
  - Same design tokens
  - Same responsive behavior
- Push design changes directly to code, to make sure your designs won’t get lost in translation.

### Developers {#ds-developers}

Developers rely on their code libraries to efficiently reproduce designs, but the resulting components do not look the same in real life. In some cases, they end up building the same component from scratch due to the absence of similar components in the codebase or the overwhelming number of components to sift through. This process wastes valuable time for both designers and developers and leads to the creation of inferior products, which take longer to produce.

- Receive PRs to approve design updates, instead of creating the desired changes manually.
- Connect your code snippets with Figma components, automatically.

## Design system consumers

### Designers {#ds-consumers-designers}

- Designing a new flow? do it knowing:
  - Which components can be reused from production
  - What requires tweaks from production
  - When you are requesting for a new component to be built
- See your design like your users would see it in production

### Developers {#ds-consumers-developers}

- Got a design to implement?
  - See your code snippets within Figma, to know which component is used in each design
  - Encourage your designers to reuse existing components, instead of rebuilding what already exists in your codebase
