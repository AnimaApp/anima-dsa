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

export const getTypes = (buildDir?: string) => {
  const typeFileCondition = (filename: string) => {
    return filename === "types.d.ts";
  }

  if(!buildDir && fs.existsSync("tsconfig.json")){
    const tsConfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf-8"));
    const tsConfigBuildDir = tsConfig.compilerOptions.outDir;
    if(tsConfigBuildDir && fs.existsSync(tsConfigBuildDir)){
      buildDir = tsConfigBuildDir;
    } else if (tsConfigBuildDir &&!fs.existsSync(tsConfigBuildDir)) {
      throw Error(`tsconfig.json found but build folder ${tsConfigBuildDir} is not. Please cancel & compile your project, or pass your build folder with the -b argument`);
    }
  }

  if(!buildDir){
    console.error("No build folder passed (-b). Pass this property for the best performance!");
  }

  const types = new Set<string>();
  if(buildDir && fs.existsSync(buildDir)){
    const typeFiles = getFiles(buildDir, typeFileCondition);
    for(const typeFile of typeFiles){
      const content = fs.readFileSync(typeFile, "utf-8");
      const typeFileTypes = extractTypes(content);
      typeFileTypes.forEach(t => types.add(t));
    }
  } else if (buildDir && !fs.existsSync(buildDir)) {
    throw Error(`Build folder ${buildDir} not found`)
  }

  if(types.size < 100){
    return types;
  }
  return new Set<string>();
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
      case 'number':
        return "{ control: 'number' }";
      default:
        if (Array.isArray(type)) {
          const isNumberArray = type.every(i => !isNaN(i));
          return `{ control: 'select', options: [${type.map(i => isNumberArray ? i : `'${i}'`)}]}`;
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

const extractImports = (source: string) => {
  const importRegex = /import\s+([\w{},\s]+)\s+from\s+['"]([^'"]+)['"]/g;
  const imports = [];

  let match;
  while ((match = importRegex.exec(source)) !== null) {
    const importSpecifier = match[1].replace(/[{}\s]/g, '').split(',').filter(i => i);
    const importPath = match[2];
    imports.push({ specifiers: importSpecifier, path: importPath });
  }

  return imports;
}

const findJSFile = (importPath: string) => {
  for(const extension of JS_EXTENSIONS){
    const fullPath = `${importPath}.${extension}`;
    if(fs.existsSync(fullPath)){
      return fullPath;
    }
  }
  const indexPath = `${importPath}/index.ts`;
  if(fs.existsSync(indexPath)){
    return indexPath;
  }
}

const getImportAliases = () => {
  if(fs.existsSync("tsconfig.json")){
    const tsConfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf-8"));
    const tsConfigPaths: {[key: string]: string[]} = tsConfig.compilerOptions.paths || [];
    return Object.entries(tsConfigPaths).map(([k,v]) => ({[k]: v[0]})).reduce((r, c) => ({ ...r, ...c }), {});
  }
  return {};
}

const extractTypes = (source: string) => {
  const interfaceRegex = /interface\s+(\w+[\w\s<>?=]*)\s*{([^}]*)}/g;
  const interfaceMatches = source.match(interfaceRegex) || [];
  const interfaces = interfaceMatches.map(match => match.trim());
  const typeRegex = /type\s+([\w]+)\s*=\s*([^;{}]+(?:{[^}]+})?)/g;
  const typeMatches = source.match(typeRegex)|| [];
  const types = typeMatches.map(match => match.trim());
  return types.concat(interfaces);
}

export const getTypeImports = (content: string, filePath: string) => {
  const typeImports = new Set<string>();
  const importAliases = getImportAliases();
  const currentDirectory = path.dirname(filePath);
  const imports = extractImports(content);
  const relativeImports = imports.filter(i => i.path.startsWith("./") || i.path.startsWith("../") || i.path.startsWith("@") && Object.keys(importAliases).includes(i.path));
  for(const {specifiers, path: relativePath} of relativeImports){
    let importPath;
    if(relativePath.startsWith("@")){
      importPath = path.resolve(importAliases[relativePath]);
    } else {
      importPath = path.resolve(currentDirectory, relativePath);
    }
    const jsFile = findJSFile(importPath);
    if(jsFile) {
      console.log(jsFile);
      const importContent = fs.readFileSync(jsFile, 'utf8');
      const importTypes = extractTypes(importContent);
      let importFound = false;
      for(const specifier of specifiers){
        for(const line of importTypes){
          if(line.includes(`type ${specifier}`) || line.includes(`interface ${specifier}`)){
            typeImports.add(line);
            importFound = true;
          }
        }
      }
      if(importFound){
        const childTypes = getTypeImports(importContent, jsFile);
        childTypes.forEach(childType => typeImports.add(childType));
      }
    }
  }
  return typeImports;
};

export const generateStories = async (files: string[], buildTypes: Set<string>, token: string) => {
  for (const componentFile of files) {
    console.log(`Creating ${componentFile}...`);
    const componentContent = fs.readFileSync(componentFile, 'utf8');
    const importTypes = getTypeImports(componentContent, componentFile);
    const allTypes = Array.from(new Set([...buildTypes, ...importTypes])).join("\n");
    if (isDebug()) {
      fs.writeFileSync(
        `${componentFile.split('.')[0]}.types.txt`,
        allTypes,
      );
    }
    const start = Date.now();
    const response = await extractComponentInformation(
      componentContent,
      allTypes,
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
