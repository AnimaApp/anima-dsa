import { loadAnimaConfig } from './../helpers/config';
import fs from 'fs-extra';
import { Arguments, CommandBuilder } from 'yargs';
import { parseBuildDirArg, validateBuildDir } from '../helpers/build';
import { exitProcess } from '../helpers/exit';
import {
  authenticate,
  getOrCreateStorybook,
  updateDSTokenIfNeeded,
} from '../api';
import { log, generateZipHash, uploadStorybook } from '../helpers';
import * as Sentry from '@sentry/node';
import { waitProcessingStories } from '../helpers/waitAllProcessingStories';
import { TMP_DIR } from '../constants';
import { isUsingS3Url } from '../helpers/s3';
import { getToken } from '../helpers/token';
import { isDebug, setDebug } from '../helpers/debug';
import { loader } from '../helpers/loader';
import { getDesignTokens } from '../helpers/file-system';
import { handleError } from '../handleError';

export const command = 'sync';
export const desc = 'Sync Storybook to Figma using Anima';

export const builder: CommandBuilder = (yargs) =>
  yargs
    .options({
      token: { type: 'string', alias: 't' },
      storybook: { type: 'string', alias: 's' },
      basePath: { type: 'string', alias: 'b' },
      designTokens: { type: 'string' },
      debug: { type: 'boolean' },
    })
    .example([['$0 sync -t <storybook-token> -s <storybook-build-dir>']]);

export const handler = async (_argv: Arguments): Promise<void> => {
  const transaction = Sentry.startTransaction({
    op: 'start-sync',
    name: 'start sync process',
  });
  try {
    Sentry.getCurrentHub().configureScope((scope) =>
      scope.setSpan(transaction),
    );
    setDebug(!!_argv.debug);
    const animaConfig = await loadAnimaConfig();

    loader.newStage('Checking local environment');
    const token = getToken(_argv);

    const buildDir = await parseBuildDirArg(
      _argv.storybook as string | undefined,
    );
    validateBuildDir(buildDir);

    // validate token with the api
    const response = await authenticate(token);
    Sentry.configureScope((scope) => {
      scope.setUser({
        id: response.data.team_slug,
        team_id: response.data.team_id,
      });
      scope.setTag('teamId', response.data.team_id);
    });

    // zip the build directory and create a hash
    loader.newStage('Preparing files');
    const { zipHash, zipBuffer } = await generateZipHash(buildDir);

    // create storybook object if no record with the same hash is found and upload it
    loader.newStage('Syncing files');

    const designTokens: Record<string, unknown> = await getDesignTokens(
      _argv.designTokens as string | undefined,
      animaConfig,
    );

    const basePath = _argv.basePath as string | undefined;
    const { storybookId, uploadUrl, ...data } = await getOrCreateStorybook(
      token,
      zipHash,
      designTokens,
      basePath,
    );

    const { skipUpload, uploadStatus } = await uploadStorybook({
      zipBuffer: zipBuffer,
      storybookId,
      token,
      uploadUrl,
      uploadStatus: data.uploadStatus,
    });

    const currentDesignTokenStr = data.designTokens;
    if (storybookId && uploadStatus === 'complete') {
      await updateDSTokenIfNeeded({
        storybook: {
          id: storybookId,
          ds_tokens: currentDesignTokenStr,
          upload_status: uploadStatus,
        },
        token,
        currentDSToken: designTokens,
      }).catch((e) => {
        Sentry.captureException(e);
        log.yellow(`Failed to update designTokens, ${e.message}`);
      });
    }

    loader.newStage('Processing stories');

    const waitProcessSpan = transaction.startChild({
      op: 'waitProcessingStories',
    });

    // --- Start wait sync
    await waitProcessingStories(token, {
      onCheckStories: (stories) => {
        const stage =
          stories.length > 0
            ? `Processing stories: ${stories.length} remaining`
            : 'Processing stories';
        loader.newStage(stage, false);
      },
    });

    loader.stop();
    waitProcessSpan.finish();

    // --- Cleaning and goodbye ---
    transaction.status = 'ok';
    transaction.finish();
    log.green(
      `  - Processing stories ...  ${
        skipUpload ? (isDebug() ? 'SKIP' : 'OK') : 'OK'
      } `,
    );
    log.green('  - Done');

    if (isUsingS3Url()) {
      console.log('Cleaning tmp dir');
      fs.rmSync(TMP_DIR, { recursive: true, force: true });
    }
    if (isDebug()) {
      console.log('_id =>', storybookId);
      console.log('hash =>', zipHash);
    }
  } catch (e) {
    if (e instanceof Error) {
      handleError(e);
    }
    transaction.status = 'error';
    transaction.finish();
    await exitProcess();
  }
};
