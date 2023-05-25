import { captureException } from '@sentry/node';
import chalk from 'chalk';
import { EOL } from 'os';
import { exitProcess } from './helpers/exit';
import { TokenError } from './helpers/token';
import { BuildDirError, DEFAULT_BUILD_DIR, log } from './helpers';
import { AuthError } from './api';
import { loader } from './helpers/loader';
import { DesignTokenError } from './helpers/file-system';

const printMessage = (message: string) => {
  process.stderr.write(chalk.red(`Error: ${message}`) + EOL);
  process.stderr.write(
    `Hint: Use the ${chalk.green(
      '--help',
    )} option to get help about the usage` + EOL,
  );
};

export default async (message: string, error: Error): Promise<never> => {
  captureException(error);
  if (message) {
    printMessage(message);
    return await exitProcess();
  }

  let errorMessage = 'Unknown error occurred';

  errorMessage = error.message;

  printMessage(errorMessage);
  return await exitProcess();
};

export const handleError = async (e: Error) => {
  if (e instanceof TokenError) {
    loader.stop();
    log.yellow(
      `Storybook token not found. Please provide a token using the --token flag or the ANIMA_TEAM_TOKEN environment variable.`,
    );
  } else if (e instanceof BuildDirError) {
    loader.stop();
    log.yellow(
      `Cannot find build storybook: "${
        e.buildDir ?? DEFAULT_BUILD_DIR
      }". Please build storybook before running this command `,
    );
    captureException(new Error('Cannot find build directory'));
  } else if (e instanceof AuthError) {
    log.red(
      `The Storybook token you provided "${e.token}" is invalid. Please check your token and try again.`,
    );
    captureException(
      new Error(
        "The Storybook token you provided 'HIDDEN' is invalid. Please check your token and try again.",
      ),
    );
  } else if (e instanceof DesignTokenError) {
    const errorMessage = `Failed to read design tokens at path "${e.designTokenFilePath}"`;
    loader.stop();
    log.yellow(errorMessage);
    captureException(
      new Error("Fail to read design tokens at path 'HIDDEN'"),
    );
  } else {
    throw e;
  }
};
