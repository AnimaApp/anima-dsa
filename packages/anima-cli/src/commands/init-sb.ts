import { Arguments, CommandBuilder } from 'yargs';
import { loader } from '../helpers/loader';
import * as Sentry from '@sentry/node';
import fs from 'fs';
import path from 'path';
import { log } from '../helpers';
import { extractComponentInformation, generateStorybookConfig, getJSFiles, hasStorybook } from '../helpers/storybook';
import { getToken } from '../helpers/token';
import { authenticate } from '../api';
import { execSync } from 'child_process';
import { isDebug, setDebug } from '../helpers/debug';

export const command = 'init-sb';
export const desc = 'Initialise storybook on your project';

export const builder: CommandBuilder = (yargs) =>
  yargs
    .options({
      token: { type: 'string', alias: 't' },
      components: { type: 'string', alias: 'd' },
      component: { type: 'string', alias: 'c' },
      debug: { type: 'boolean' },
    })
    .example([['$0 init-sb -d <components-dir>']]);

export const handler = async (_argv: Arguments): Promise<void> => {
  const transaction = Sentry.startTransaction({
    op: 'init-sb',
    name: 'initialise storybook',
  });
  if(_argv.components && _argv.component){
    throw Error("Cannot pass both components (-d) and component (-c) arguments");
  }
  if(_argv.components && !fs.lstatSync(_argv.components as string).isDirectory()){
    throw Error("Components (-d) must be a directory");
  }
  if(_argv.component && !fs.lstatSync(_argv.component as string).isFile()){
    throw Error("Component (-c) must be a file");
  }
  try {
    Sentry.getCurrentHub().configureScope((scope) =>
      scope.setSpan(transaction),
    );
    setDebug(!!_argv.debug);
    const token = getToken(_argv);
    await authenticate(token);
    if(!fs.existsSync(".storybook")){
      loader.newStage('Install storybook');
      const sampleStoriesPath = path.join('src', 'stories');
      const hadStorybookFolderBefore = fs.existsSync(sampleStoriesPath);
      execSync('npx storybook@latest init -y', {stdio: 'inherit'});
      if(!hadStorybookFolderBefore && fs.existsSync(sampleStoriesPath)){
        fs.rmSync(sampleStoriesPath, { recursive: true, force: true });
      }
    } else {
      console.log('Skipping storybook install');
    }
    loader.newStage('Fetching components');
    let componentsWithoutStorybook: string[] = [];
    if(_argv.component){
      componentsWithoutStorybook = [_argv.component as string];
    } else {
      const componentsDir = _argv.components as string || 'src';
      const files = getJSFiles(componentsDir);
      componentsWithoutStorybook = files.filter(f => !f.includes(".test.") && !f.includes(".stories.") && !hasStorybook(files, f));
    }
    loader.newStage(`Creating ${componentsWithoutStorybook.length} component configurations`);
    for(const componentFile of componentsWithoutStorybook){
      console.log(`Creating ${componentFile}...`);
      const componentContent = fs.readFileSync(componentFile, 'utf8');
      const response = await extractComponentInformation(componentContent, token).catch((e) => {throw e});
      if(response){
        if(isDebug()){
          fs.writeFileSync(`${componentFile.split(".")[0]}.stories.log.json`, JSON.stringify(response));
        }
        const storybookConfig = generateStorybookConfig(componentFile, response);
        fs.writeFileSync(`${componentFile.split(".")[0]}.stories.js`, storybookConfig);
        console.log(`Created ${componentFile}`);
      } else {
        console.log(`Skipped ${componentFile}. Couldn't generate story config`);
      }
    }
    console.log("");
    loader.stop();
    log.green('  - Done');
    log.yellow("Now run 'npm run storybook' to check your storybook");
    transaction.status = 'ok';
    transaction.finish();
  } catch (e) {
    transaction.status = 'error';
    transaction.finish();
    throw e;
  }
};
