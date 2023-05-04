import * as Sentry from '@sentry/node';
import { rmSync } from 'fs';
import { TMP_DIR } from '../constants';
import { isUsingS3Url } from './s3';

export const exitProcess = async (): Promise<never> => {
  await Sentry.close();
  if (isUsingS3Url()) {
    rmSync(TMP_DIR, { recursive: true, force: true });
  }
  process.exit(1);
};

export const overrideKillSignals = (): void => {
  const processToCatch = ['SIGINT', 'SIGQUIT', 'SIGTERM'];
  processToCatch.map((name) => {
    process.on(name, async () => {
      console.log(`Terminating, ${name} received\n`);
      await exitProcess();
    });
  });
};
