# Connect your components with Figma

To connect your component library in code with Figma, you will need to have a Storybook for your components. Anima will then translate your Storybook into Figma components, creating a library in Figma that matches your library in code.

## Two methods to connect

There are two ways to connect your Storybook with Anima and Figma:

1. (Basic) **By providing a URL to your Storybook** - great for seeing the results instantly

2. (Advanced) **By using CLI command on your local or CI machine** - great for a continuous automated workflow

## When to Use Each Method?

1. The `URL method` is the quickest and easiest way to get started. It allows you to see your components in Figma and generate a library immediately, making it a great choice if you want to quickly prove the concept.

2. The `CLI method` allows more advanced capabilities. This method offers two main benefits:

    - **Continuous updates**: Anima's continuous update feature monitors code changes and display them on Figma. Designers are notified of the updates and can easily communicate with developers to approve and pull changes, or disapprove and talk to their developers. [How to configure continuous updates](/guide/manage-components/continuous-integration)

    - **Design tokens usage**: With the CLI integration, the generated components will have the design tokens that exist in the code, and designers will be able to edit and push changes to GitHub.
