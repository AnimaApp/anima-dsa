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

const getFiles = (folder: string, condition: Function) => {
  const files: string[] = [];

  for (const item of fs.readdirSync(folder)) {
    const fullPath = path.join(folder, item);
    if (fs.lstatSync(fullPath).isDirectory()) {
      files.push(...getFiles(fullPath, condition));
    } else {
      if(condition(item)){
        files.push(fullPath);
      }
    }
  }

  return files;
}

export const getJSFiles = (folder: string) => {
  const condition = (filename: string) => {
    const extension = filename.split('.').pop();
    return (
      extension &&
      JS_EXTENSIONS.includes(extension) &&
      !filename.endsWith(".d.ts") &&
      filename.charAt(0) === filename.charAt(0).toUpperCase()
    );
  }

  return getFiles(folder, condition);
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

export const extractTypes = (buildDir?: string) => {
  const typeFileCondition = (filename: string) => {
    return filename === "types.d.ts";
  }

  if(!buildDir && fs.existsSync("tsconfig.json")){
    const tsConfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf-8"));
    const tsConfigBuildDir = tsConfig.compilerOptions.outDir;
    if(tsConfigBuildDir && fs.existsSync(tsConfigBuildDir)){
      buildDir = tsConfigBuildDir;
    } else if (!fs.existsSync(tsConfigBuildDir)) {
      throw Error(`tsconfig.json found but build folder ${tsConfigBuildDir} is not. Please cancel & compile your project, or pass your build folder with the -b argument`);
    }
  }

  let types = "";
  if(buildDir && fs.existsSync(buildDir)){
    const typeFiles = getFiles(buildDir, typeFileCondition);
    for(const typeFile of typeFiles){
      const content = fs.readFileSync(typeFile, "utf-8");
      for(const line of content.split("\n")){
        if(line && !line.includes(" from ")){
          types += line + "\n";
        }
      }
    }
  } else if (buildDir && !fs.existsSync(buildDir)) {
    throw Error(`Build folder ${buildDir} not found`)
  }

  if(types.length < 10000){
    return types;
  }
  return "";
}

export const extractComponentInformation = async (
  file: string,
  types: string,
  token: string,
) => {
  const res = await fetch(`${API_URL}/rpc/extract_component_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ code: file, types }),
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
    default_export: boolean;
    component_name: string;
    prop_data_types: boolean;
    props: { name: string; type: string }[];
  },
) => {
  const convertPropType = (type: string) => {
    switch (type) {
      case 'boolean':
        return "{ control: 'boolean' }";
      case 'string':
        return "{ control: 'text' }";
      case 'object':
        return "{ control: 'object' }";
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
  const propTypes = !resp.prop_data_types ? resp.props
    .map(
      ({ name, type }) =>
        convertPropType(type) && `    ${name}: ${convertPropType(type)}`,
    )
    .filter((item) => item) : [];

  return `${importLine}

export default {
  title: "Components/${resp.component_name}",
  component: ${resp.component_name},${
    propTypes.length > 0
      ? `\n  argTypes: {
${propTypes.join(',\n')}
  }`
      : ''
  }
};

export const Default = {
  // Add default args here
};
`;
};

export const generateStories = async (files: string[], types: string, token: string) => {
  for (const componentFile of files) {
    console.log(`Creating ${componentFile}...`);
    const componentContent = fs.readFileSync(componentFile, 'utf8');
    const start = Date.now();
    const response = await extractComponentInformation(
      componentContent,
      types,
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
