# Features


## Generate Figma components automatically
Use Anima CLI or URL import to generate your entire code components library as a Figma library, in a single click. 
Anima will translate all of your components (as they are represented in Storybook), as native Figma components. 

<br>

### 1. Variants matching code props
Each component property will be translated to a Figma property ![image](https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/aa7d5e90-8519-4ffe-be00-4e944ffb6435)

<br>

### 2. Figma's Auto-layout matching CSS layout
Anima will convert the CSS flex properties into Figma Auto layout, automatically 
![css-to-auto-layout](https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/cafc3ad0-dd54-405f-a30b-778a6b727c68)

<br>

### 3. Figma Styles matching Design Tokens
Anima will create your design tokens as Figma styles and variables, ready to use and edit directly from Figma
<br>
<img width="475" alt="variants match" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/372e2e3b-207e-4299-a5af-c2f97b0efa96">

<br>

### 4. Media-queries as Figma variants
Got components that looks differently on different screens? We got you covered. When importing your component to Figma, you'd be able to define which viewports you'd like to see in Figma. Anima will add a "Viewport" size property to your component, with all selected sizes

<img width="821" alt="Screen Shot 2023-05-28 at 17 24 58" src="https://github.com/AnimaApp/anima-storybook-cli/assets/96059044/94e88059-c175-4eb5-8259-d4713db9f8d0">

<br>

### 5. Code snippets embedded in instances
Know for each component if it already exists in your source code, and which properties to used for the selected instance

<br><br>

## Manage Design Tokens
Whether it's rebranding, accessibility tests, or touch-ups, our design is constantly evolving. But translating those changes into words and tasks often leads to pixels and colors that get lost in translation.

Use Anima DSA to connect your Figma with GitHub, to import, edit and update your Design Tokens in all platforms.

<br>

### 1. Create, Update and Delete Design Tokens
Anima supports all of Figma's native styles and converts them to design tokens. You can use the Anima plugin to create tokens that are not (yet) supported by Figma, like typogtraphy. 

<br>

### 2. Create PRs for Design Tokens updates directly from Figma
Use Anima DSA to push your design changes as PRs to your dev team
<br>

### 3. Pull Design Tokens updates from GitHub to Figma
Use Anima DSA to pull updates from code, to
- Keep your tokens in sync with production
- Be aware of any changes in production that may affect what your users are seeing
