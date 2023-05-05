import { captureException } from '@sentry/node';
import chalk from 'chalk';
import { EOL } from 'os';
import { exitProcess } from './helpers/exit';

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