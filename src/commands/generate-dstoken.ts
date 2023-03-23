import * as Sentry from '@sentry/node';
import { Arguments, CommandBuilder } from 'yargs';
import { frameworks, getConverter } from '../converters';
import { exitProcess } from '../helpers/exit';
import { z } from 'zod';
import { writeFileSync } from 'fs';

export const command = 'generate-dstoken';
export const desc = 'Generate design tokens for a framework';

const validateArgs = z.object({
  framework: z.enum(frameworks),
  config: z.string(),
  output: z.string(),
}).parse;

export const builder: CommandBuilder = (yargs) =>
  yargs
    .options({
      framework: {
        choices: [...frameworks],
        alias: 'f',
        describe: 'Framework to generate design tokens for ex: tailwind',
      },
      config: {
        type: 'string',
        alias: 'c',
        describe: 'Path to framework config file',
      },
      output: {
        type: 'string',
        alias: 'o',
        describe: 'Path to output file',
        default: './design-tokens.json',
      },
    })
    .demandOption(['framework', 'config'])
    .example([['$0 generate-dstoken -f tailwind -c ./tailwind.config.json']]);

interface ArgsHandler {
  framework: string;
  config: string;
}

export const handler = async (_argv: Arguments<ArgsHandler>): Promise<void> => {
  try {
    const validatedArgs = validateArgs(_argv);
    const { framework, config, output } = validatedArgs;

    console.log(`Checking ${framework} config at ${config}`);
    const converter = getConverter(framework);
    await converter.loadConfig(config);
    const dsTokens = await converter.convertColorToDS();
    console.log('Create design token file');
    writeFileSync(output, JSON.stringify(dsTokens, null, 2));
    console.log(`Design tokens created at path ${output}`);
    console.log(`You can now use your design tokens in your ${framework} config file like this:
${converter.sampleConfigFile()}
`);
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);
    exitProcess();
  }
};
