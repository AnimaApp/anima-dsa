import { Arguments, CommandBuilder } from 'yargs';
import ora from 'ora';
import { authenticate, getTeamProcessingStories } from '../api';
import * as Sentry from '@sentry/node';
import { loadAnimaConfig, log } from '../helpers';

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
    process.env.STORYBOOK_ANIMA_TOKEN ??
    '') as string;

  if (__DEBUG__) {
    log.yellow(`token => ${token} \n`);
  }
  if (!token) {
    loader.stop();
    log.yellow(
      `Storybook token not found. Please provide a token using the --token flag or the STORYBOOK_ANIMA_TOKEN environment variable.`,
    );
    process.exit(1);
  }

  // validate token with the api
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
    process.exit(1);
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

  log.yellow(`  - ${stories.length} stories - are still processing`);

  loader.stop();

  log.green('  - Done');
};
