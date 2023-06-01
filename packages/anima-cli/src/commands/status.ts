import { Arguments, CommandBuilder } from 'yargs';
import ora from 'ora';
import { authenticate, getTeamProcessingStories } from '../api';
import * as Sentry from '@sentry/node';
import { loadAnimaConfig, log } from '../helpers';
import { exitProcess } from '../helpers/exit';

export const command = 'status';
export const desc = 'Status of components';

export const builder: CommandBuilder = (yargs) =>
  yargs
    .options({
      token: { type: 'string', alias: 't' },
      debug: { type: 'boolean' },
    })
    .example([['$0 status -t <storybook-token>']]);

export const handler = async (_argv: Arguments): Promise<void> => {
  const __DEBUG__ = !!_argv.debug;

  const stage = 'Checking local environment';
  const loader = ora(`${stage}...\n`).start();

  await loadAnimaConfig();

  // check if token is provided as an arg or in .env
  const token = (_argv.token ??
    process.env.ANIMA_TEAM_TOKEN ??
    '') as string;

  if (__DEBUG__) {
    log.yellow(`token => ${token} \n`);
  }
  if (!token) {
    loader.stop();
    log.yellow(
      `Storybook token not found. Please provide a token using the --token flag or the ANIMA_TEAM_TOKEN environment variable.`,
    );
    await exitProcess();
  }

  // validate token with the api
  try {
    const response = await authenticate(token);
    loader.stop();
    if (!response.success) {
      log.red(
        `The Storybook token you provided "${token}" is invalid. Please check your token and try again.`,
      );
      Sentry.captureException(
        new Error(
          "The Storybook token you provided 'HIDDEN' is invalid. Please check your token and try again.",
        ),
      );
      await exitProcess();
    }
  } catch (error) {
    log.red(
      `Something went wrong. We've been notified and will look into it as soon as possible`,
    );
    Sentry.captureException(error);
    await exitProcess();
  }

  log.green(`  - ${stage} ...OK`);

  const res = await getTeamProcessingStories(token);

  if (res.status !== 200) {
    throw new Error(
      `Impossible to retrieve story, status !== 200, current: ${res.status}`,
    );
  }

  loader.stop();
  log.green(`  - ${stage} ...OK`);

  const { results: stories } = await res.json() as { results: any[] };
  log.yellow(`  - Processing stories: ${stories.length} remaining`);

  loader.stop();

  log.green('  - Done');
};
