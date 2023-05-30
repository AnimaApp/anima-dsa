# What is Storybook

Storybook is a great tool used to build UI components in isolation. To learn more about Storybook, please visit
[Storybook docs](https://storybook.js.org/docs/react/get-started/why-storybook).

## TL;DR
We love to refer to Storybook as the closest representation of our production components. It is an **interactive directory of your UI components and their variants.**

## What is a story
A story is an additional file we add to a component, that defines the different render states it can have. (it’s a function that returns a component’s state given a set of arguments).
<br>
*Note: The Story file lives alongside the component file and doesn't affect your component itself.

### Example:
1. We can have in our library components for Avatar, Badge, Button, Card. 
2. Each component will have a story, that represent it
<img width="211" alt="storybook-components" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/7c6a4922-f9ab-44ef-91e9-ffdb8b08a077">
<br>

## What are controls (Args)
For each component, we can add a set of arguments that define how the component should render.<br> *Note: You do not need to modify your underlying component code to use args.

### Example
A Button component can have different controls:
1. **Variant**: Primary, secondary, tertiary
2. **Size**: sm, md
3. **Squared**:   True/False
4. **Border**: True/False

These conrols will define all the possible combinations of the Button component, which in this case would be 24 (3*2*2*2). (Primary-sm-squared-withBorder, Primary-md-squared-withBorder..)
<img width="779" alt="storybook-controls" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/48c10f2b-7e0b-4b09-b493-0d1f2c365c82">

<br>

## What is a Storybook?
The collection of all of your components' stories - is your Storybook.

https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/55aeacf8-a922-4a77-8709-fe4a3ac5b753

<br>
*This video was taken from Storybook docs. Visit the Storybook website for more information


