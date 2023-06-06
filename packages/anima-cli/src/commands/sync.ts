import { loadAnimaConfig } from './../helpers/config';
import fs from 'fs-extra';
import { Arguments, CommandBuilder } from 'yargs';
import { parseBuildDirArg, validateBuildDir } from '../helpers/build';
import { exitProcess } from '../helpers/exit';
import { authenticate } from '../api';
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
import { setEnableTracking, trackEvent } from '../helpers/analytics';
import { storybookApi } from '../api/storybook';

export const command = 'sync';
export const desc = 'Sync Storybook to Figma using Anima';

export const builder: CommandBuilder = (yargs) =>
  yargs
    .options({
      token: { type: 'string', alias: 't' },
      storybook: {
        alias: 's',
        coerce: (arg) => {
          if (arg === true) {
            return 'storybook-static'; // Set a default value if it's a boolean
          } else {
            return arg; // Return the string argument value
          }
        },
      },
      basePath: { type: 'string', alias: 'b' },
      designTokens: { type: 'string', alias: 'd' },
      debug: { type: 'boolean' },
    })
    .check((argv) => {
      if (!argv.storybook && !argv['design-tokens']) {
        throw new Error('At least one design-tokens or storybook must be set.');
      }
      return true;
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
    if (isDebug()) {
      setEnableTracking(false);
    }
    const animaConfig = await loadAnimaConfig();

    loader.newStage('Checking local environment');

    // validate token with the api
    const token = getToken(_argv);
    const response = await authenticate(token);
    const teamId = response.data.team_id;
    const ownerId = response.data.owner_id;
    Sentry.configureScope((scope) => {
      scope.setUser({
        id: ownerId,
        team_id: teamId,
      });
      scope.setTag('teamId', response.data.team_id);
    });

    if (_argv.storybook) {
      const buildDir = await parseBuildDirArg(
        _argv.storybook as string | undefined,
      );
      validateBuildDir(buildDir);
      // zip the build directory and create a hash
      loader.newStage('Preparing files');
      const { zipHash, zipBuffer } = await generateZipHash(buildDir);
      loader.newStage('Syncing files');

      const designTokens: Record<string, unknown> = await getDesignTokens(
        _argv.designTokens as string | undefined,
        animaConfig,
      );

      const basePath = _argv.basePath as string | undefined;
      const { storybookId, uploadUrl, ...data } =
        await storybookApi.getOrCreateStorybook(
          token,
          zipHash,
          designTokens,
          basePath,
        );
      trackEvent([
        {
          userID: ownerId,
          action: 'anima-cli.sync.started',
          time: Date.now(),
          eventParams: {
            platform: 'anima-cli',
            utm_source: 'anima-cli',
            team_id: teamId,
          },
        },
      ]);
      const { skipUpload, uploadStatus } = await uploadStorybook({
        zipBuffer: zipBuffer,
        storybookId,
        token,
        uploadUrl,
        uploadStatus: data.uploadStatus,
      });
      // create storybook object if no record with the same hash is found and upload it
      const currentDesignTokenStr = data.designTokens;
      if (storybookId && uploadStatus === 'complete') {
        await storybookApi
          .updateDSTokenIfNeeded({
            storybook: {
              id: storybookId,
              ds_tokens: currentDesignTokenStr,
              upload_status: uploadStatus,
            },
            token,
            currentDSToken: designTokens,
          })
          .catch((e) => {
            Sentry.captureException(e);
            log.yellow(`Failed to update designTokens, ${e.message}`);
          });
      }
      if (isDebug()) {
        console.log('_id =>', storybookId);
        console.log('hash =>', zipHash);
        console.log('SkipUpload => ', skipUpload);
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
      log.green(`  - Processing stories ... OK`);
    } else {
      loader.newStage('Syncing design tokens');

      const designTokens: Record<string, unknown> = await getDesignTokens(
        _argv.designTokens as string | undefined,
        animaConfig,
      );
      const storybook = await storybookApi
        .syncOnlyDesignTokens(token, designTokens)
        .catch((e) => {
          Sentry.captureException(e);
          log.yellow(`Failed to update designTokens, ${e.message}`);
        });
      trackEvent([
        {
          userID: ownerId,
          action: 'anima-cli.sync.only-tokens.started',
          time: Date.now(),
          eventParams: {
            platform: 'anima-cli',
            utm_source: 'anima-cli',
            team_id: teamId,
          },
        },
      ]);
      if (isDebug()) {
        console.log('_id =>', storybook?.storybookId);
        console.log('hash =>', storybook?.hash);
      }

      loader.stop();
    }

    log.green('  - Done');

    if (isUsingS3Url()) {
      console.log('Cleaning tmp dir');
      fs.rmSync(TMP_DIR, { recursive: true, force: true });
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
