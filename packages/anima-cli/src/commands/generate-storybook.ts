import { Arguments, CommandBuilder } from 'yargs';
import { loader } from '../helpers/loader';
import * as Sentry from '@sentry/node';
import fs from 'fs';
import { log } from '../helpers';
import { getTypes, generateStories, getJSFiles, hasStorybook, initialiseStorybook } from '../helpers/storybook';
import { getToken } from '../helpers/token';
import { setDebug } from '../helpers/debug';
import { authenticate } from '../api';

export const command = 'generate-storybook';
export const desc = 'Initialise storybook on your project';

export const builder: CommandBuilder = (yargs) =>
  yargs
    .options({
      token: { type: 'string', alias: 't' },
      components: { type: 'string', alias: 'd' },
      component: { type: 'string', alias: 'c' },
      buildDir: { type: 'string', alias: 'b' },
      skipInstall: { type: 'boolean' },
      debug: { type: 'boolean' },
    })
    .example([['$0 generate-storybook -d <components-dir>']]);

export const handler = async (_argv: Arguments): Promise<void> => {
  const transaction = Sentry.startTransaction({
    op: 'generate-storybook',
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
  
    // Install storybook
    if(!fs.existsSync(".storybook") && !_argv.skipInstall){
      loader.newStage('Install storybook');
      initialiseStorybook();
    } else {
      console.log('Skipping storybook install');
    }

    // Create stories
    loader.newStage('Fetching components');
    let filesToGenerateStoryFor: string[] = [];
    if(_argv.component){
      filesToGenerateStoryFor = [_argv.component as string];
    } else {
      const componentsDir = _argv.components as string || 'src';
      const files = getJSFiles(componentsDir);
      filesToGenerateStoryFor = files.filter(f => f.split(".").length === 2 && !hasStorybook(files, f));
    }
    loader.newStage(`Creating ${filesToGenerateStoryFor.length} component stories`);
    const types = getTypes(_argv.buildDir as string || '');
    await generateStories(filesToGenerateStoryFor, types, token);
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
