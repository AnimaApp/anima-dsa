import { loadAnimaConfig } from './../helpers/config';
import { Arguments, CommandBuilder } from 'yargs';
import ora from 'ora';
import { exitProcess } from '../helpers/exit';
import {
  authenticate,
  getOrCreateStorybookForDesignTokens,
  updateDSTokenIfNeeded,
} from '../api';
import { log } from '../helpers';
import * as Sentry from '@sentry/node';
import { getFileIfExists } from '../helpers/file-system';

export const command = 'sync-design-tokens';
export const desc = 'Sync your design tokens to Figma';

export const builder: CommandBuilder = (yargs) =>
  yargs
    .options({
      token: { type: 'string', alias: 't' },
      designTokens: { type: 'string' },
      debug: { type: 'boolean' },
    })
    .example([
      [
        '$0 sync-design-tokens --design-tokens <path-to-tokens-file> -t <storybook-token>',
      ],
    ]);

export const handler = async (_argv: Arguments): Promise<void> => {
  const transaction = Sentry.startTransaction({
    op: 'start-sync-design-tokens',
    name: 'start sync design tokens process',
  });
  Sentry.getCurrentHub().configureScope((scope) => scope.setSpan(transaction));

  const __DEBUG__ = !!_argv.debug;

  const animaConfig = await loadAnimaConfig();

  let stage = 'Checking local environment';
  let loader = ora(`${stage}...\n`).start();

  const designTokensPath = _argv.designTokens as string | undefined;

  loader.stop();
  if (!designTokensPath) {
    log.yellow(
      `Please provide a path to your design tokens using the --design-tokens flag.`,
    );
    await exitProcess();
  }

  const spanGetDSToken = transaction.startChild({ op: 'get-ds-token' });

  stage = 'Syncing files';
  loader = ora(`${stage}...`).start();

  let designTokens: Record<string, unknown> = animaConfig.design_tokens ?? {};

  try {
    designTokens =
      (await getFileIfExists<Record<string, unknown>>(designTokensPath)) ?? {};
  } catch (error) {
    const errorMessage = `Fail to read design tokens at path "${designTokensPath}"`;
    loader.stop();
    log.yellow(errorMessage);
    Sentry.captureException(
      new Error("Fail to read design tokens at path 'HIDDEN'"),
    );
    spanGetDSToken.status = 'error';
    spanGetDSToken.finish();
    transaction.finish();
    await exitProcess();
  }

  spanGetDSToken.finish();

  const token = (_argv.token ??
    process.env.STORYBOOK_ANIMA_TOKEN ??
    '') as string;

  if (__DEBUG__) {
    console.log('token =>', token);
  }

  if (!token) {
    loader.stop();
    log.yellow(
      `Storybook token not found. Please provide a token using the --token flag or the STORYBOOK_ANIMA_TOKEN environment variable.`,
    );
    await exitProcess();
  }

  const authSpan = transaction.startChild({ op: 'authenticate' });

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
    authSpan.status = 'error';
    authSpan.finish();
    transaction.finish();
    await exitProcess();
  }

  Sentry.configureScope((scope) => {
    scope.setUser({
      id: response.data.team_slug,
      team_id: response.data.team_id,
    });
    scope.setTag('teamId', response.data.team_id);
  });
  authSpan.finish();

  log.green(`  - ${stage} ...OK`);

  const storybook = await getOrCreateStorybookForDesignTokens(
    token,
    designTokens,
  );

  const spanUpload = transaction.startChild({
    op: 'upload-process',
  });
  Sentry.getCurrentHub().configureScope((scope) => scope.setSpan(spanUpload));

  const currentDesignTokens = storybook.designTokens;

  console.log(designTokens);

  if (storybook.storybookId) {
    await updateDSTokenIfNeeded({
      storybook: {
        id: storybook.storybookId,
        upload_status: storybook.uploadStatus,
        ds_tokens: currentDesignTokens,
      },
      token,
      currentDSToken: designTokens,
    }).catch((e) => {
      Sentry.captureException(e);
      log.yellow(`Fail to update designTokens, ${e.message}`);
    });
  }

  console.log('ooo');

  spanUpload.finish();

  loader.stop();
};
