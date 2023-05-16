import { execSync } from 'child_process';

const token = process.env.TEST_TOKEN; // personal team created for it
if (!token) throw new Error('Anima team token for test not found');
const storyHashReg = new RegExp(/hash => (.*)/);

const tokenVersionMap = {
  init: './e2e-test/test-ds-tokens.json',
  update: './e2e-test/test-ds-tokens-update.json',
};

const getCommand = (isUsingBasePath: boolean, tokenPath: string) =>
  isUsingBasePath
    ? `node ./dist/cli.js sync -d "s3://anima-uploads/e2e-tests/storybook-sample-base-path" -t ${token} --debug -b /styleguide --design-tokens ${tokenPath}`
    : `node ./dist/cli.js sync -d "s3://anima-uploads/e2e-tests/storybook-sample" -t ${token} --debug --design-tokens ${tokenPath}`;

interface SyncWithDesignTokensParams {
  isUsingBasePath: boolean;
  designTokenVersion: 'init' | 'update';
}

export const syncWithDesignTokens = ({
  isUsingBasePath,
  designTokenVersion,
}: SyncWithDesignTokensParams): { storybookHash: string } => {
  const output = execSync(getCommand(isUsingBasePath, tokenVersionMap[designTokenVersion]));
  const result = storyHashReg.exec(output.toString());
  if (!result) throw new Error('storybook hash not found');
  const [, storybookHash] = result;
  return { storybookHash };
};
