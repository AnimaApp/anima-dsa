import { Arguments, CommandBuilder } from 'yargs';
import ora from 'ora';
import { frameworks, getConverter } from '../converters';
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
  const validatedArgs = validateArgs(_argv);
  const { framework, config, output } = validatedArgs;

  const stage = `Checking ${framework} config at ${config}`;
  const loader = ora(`${stage}...\n`).start();

  const converter = getConverter(framework);
  await converter.loadConfig(config);
  const dsTokens = await converter.convertColorToDS();

  loader.text = 'Create design token file';
  writeFileSync(output, JSON.stringify(dsTokens, null, 2));
  loader.stop();
};
