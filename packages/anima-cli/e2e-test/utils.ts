import { execSync } from 'child_process';

const token = process.env.TEST_TOKEN; // personal team created for it
if (!token) throw new Error('Anima team token for test not found');
const storyHashReg = new RegExp(/hash => (.*)/);

const getCommand = (isUsingBasePath: boolean) =>
  isUsingBasePath
    ? `node ./dist/cli.js sync -d "s3://anima-uploads/e2e-tests/storybook-sample-base-path" -t ${token} --debug -b /styleguide --design-tokens ./e2e-test/test-ds-tokens.json`
    : `node ./dist/cli.js sync -d "s3://anima-uploads/e2e-tests/storybook-sample" -t ${token} --debug --design-tokens ./e2e-test/test-ds-tokens.json`;

export const syncWithDesignTokens = (
  isUsingBasePath: boolean,
): { storybookHash: string } => {
  const output = execSync(getCommand(isUsingBasePath));
  const result = storyHashReg.exec(output.toString());
  if (!result) throw new Error('storybook hash not found');
  const [, storybookHash] = result;
  return { storybookHash };
};
