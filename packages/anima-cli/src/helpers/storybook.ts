import fs from 'fs';
import path from 'path';
import { isDebug } from './debug';
import { API_URL } from '../constants/api';
import { execSync } from 'child_process';
import fetch from "node-fetch";

const JS_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx', 'vue'];
const STORYBOOK_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx'];

export const initialiseStorybook = () => {
  const sampleStoriesPath = path.join('src', 'stories');
  const hadSampleStorybookFolderBefore = fs.existsSync(sampleStoriesPath);
  execSync('npx storybook@latest init -y', { stdio: 'inherit' });
  // Delete the examples added by this command
  if (!hadSampleStorybookFolderBefore && fs.existsSync(sampleStoriesPath)) {
    fs.rmSync(sampleStoriesPath, { recursive: true, force: true });
  }
};

export const getJSFiles = (folder: string) => {
  const JSFiles: string[] = [];

  for (const item of fs.readdirSync(folder)) {
    const fullPath = path.join(folder, item);
    if (fs.lstatSync(fullPath).isDirectory()) {
      JSFiles.push(...getJSFiles(fullPath));
    } else {
      const extension = item.split('.').pop();
      if (
        extension &&
        JS_EXTENSIONS.includes(extension) &&
        item.charAt(0) === item.charAt(0).toUpperCase()
      ) {
        JSFiles.push(fullPath);
      }
    }
  }

  return JSFiles;
};

export const hasStorybook = (files: string[], file: string) => {
  const componentName = file.split('.')[0];
  const potentialStoryFiles = STORYBOOK_EXTENSIONS.map(
    (ext) => `${componentName}.stories.${ext}`,
  );
  for (const storyFile of potentialStoryFiles) {
    if (files.includes(storyFile)) {
      return true;
    }
  }
  return false;
};

export const extractComponentInformation = async (
  file: string,
  token: string,
) => {
  const res = await fetch(`${API_URL}/rpc/extract_component_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ code: file }),
  });

  if (res.status === 200) {
    const data = await res.json();
    return data;
  } else if (isDebug()) {
    console.log('response status =>', res.status);
    console.log('response data =>', await res.text());
  }

  return null;
};

const generateStorybookConfig = (
  filename: string,
  resp: {
    default_export: string;
    component_name: string;
    props: { example: string; name: string; type: string }[];
  },
) => {
  const convertPropType = (type: string) => {
    switch (type) {
      case 'boolean':
        return "{ type: 'boolean' }";
      case 'string':
        return "{ type: 'string' }";
      case 'object':
        return "{ type: 'object' }";
      default:
        if (Array.isArray(type)) {
          return `{ control: 'select', options: [${type}]}`;
        }
    }
  };

  const componentFilename = path.parse(filename).base.split('.')[0];
  const componentImport = resp.default_export
    ? resp.component_name
    : `{ ${resp.component_name} }`;
  const importLine = `import ${componentImport} from './${componentFilename}';`;
  const propTypes = resp.props
    .map(
      ({ name, type }) =>
        convertPropType(type) && `    ${name}: ${convertPropType(type)}`,
    )
    .filter((item) => item);
  const propExamples = resp.props
    .map(({ name, example }) => example && `    ${name}: ${example}`)
    .filter((item) => item);

  return `${importLine}

export default {
  title: "Components/${resp.component_name}",
  component: ${resp.component_name},
  ${
    propTypes.length > 0
      ? `argTypes: {
${propTypes.join(',\n')}
  }`
      : ''
  }
};

export const Default = {
  ${
    propExamples.length > 0
      ? `args: {
${propExamples.join(',\n')}
  }`
      : ''
  }
};
`;
};

export const generateStories = async (files: string[], token: string) => {
  for (const componentFile of files) {
    console.log(`Creating ${componentFile}...`);
    const componentContent = fs.readFileSync(componentFile, 'utf8');
    const start = Date.now();
    const response = await extractComponentInformation(
      componentContent,
      token,
    ).catch((e) => {
      throw e;
    });
    const end = Date.now();
    if (isDebug()) {
      console.log(`Component information time: ${end - start} ms`);
    }
    if (response) {
      if (isDebug()) {
        fs.writeFileSync(
          `${componentFile.split('.')[0]}.stories.log.json`,
          JSON.stringify(response),
        );
      }
      const storybookConfig = generateStorybookConfig(componentFile, response);
      const storyFile = `${componentFile.split('.')[0]}.stories.js`;
      fs.writeFileSync(storyFile, storybookConfig);
      console.log(`Created ${storyFile}`);
    } else {
      console.log(`Skipped ${componentFile}. Couldn't generate story config`);
    }
  }
};
