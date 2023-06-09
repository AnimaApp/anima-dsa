import { Arguments, CommandBuilder } from 'yargs';
import { loader } from '../helpers/loader';
import * as Sentry from '@sentry/node';
import fs from 'fs';
import path from 'path';
import { log } from '../helpers';
import { generateStorybookConfig, getJSFiles } from '../helpers/storybook';
import { getToken } from '../helpers/token';
import { authenticate } from '../api';
import { execSync } from 'child_process';

export const command = 'init-sb';
export const desc = 'Initialise storybook on your project';

export const builder: CommandBuilder = (yargs) =>
  yargs
    .options({
      token: { type: 'string', alias: 't' },
      componentsDir: { type: 'string', alias: 'c' },
      debug: { type: 'boolean' },
    })
    .example([['$0 init-sb -c <components-dir>']]);

export const handler = async (_argv: Arguments): Promise<void> => {
  const transaction = Sentry.startTransaction({
    op: 'init-sb',
    name: 'initialise storybook',
  });
  try {
    Sentry.getCurrentHub().configureScope((scope) =>
      scope.setSpan(transaction),
    );
    const token = getToken(_argv);
    await authenticate(token);
    loader.newStage('Install storybook');
    const sampleStoriesPath = path.join('src', 'stories');
    const hadStorybookFolderBefore = fs.existsSync(sampleStoriesPath);
    execSync('npx storybook@latest init -y', {stdio: 'inherit'});
    if(!hadStorybookFolderBefore && fs.existsSync(sampleStoriesPath)){
      fs.rmSync(sampleStoriesPath, { recursive: true, force: true });
    }
    loader.newStage('Fetching components');
    const files = getJSFiles(_argv.componentsDir as string);
    const componentsWithoutStorybook = files.filter(f => !f.includes(".test.") && !files.includes(`${f.split(".")[0]}.stories.js`));
    loader.newStage(`Creating ${componentsWithoutStorybook.length} component configurations`);
    for(const componentFile of componentsWithoutStorybook){
      console.log(`Creating ${componentFile}...`);
      const componentContent = fs.readFileSync(componentFile, 'utf8');
      const response = await generateStorybookConfig(componentContent, token).catch((e) => {throw e});
      if(response){
        fs.writeFileSync(componentFile, response.code);
        fs.writeFileSync(`${componentFile.split(".")[0]}.stories.js`, response.story);
      } else {
        console.log(`Skipped ${componentFile}. Couldn't generate story config`);
      }
    }
    console.log("");
    loader.stop();
    log.green('  - Done');
    transaction.status = 'ok';
    transaction.finish();
  } catch (e) {
    transaction.status = 'error';
    transaction.finish();
    throw e;
  }
};
