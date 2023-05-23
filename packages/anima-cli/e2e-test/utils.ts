import { execSync } from 'child_process';

const token = process.env.TEST_TOKEN; // personal team created for it
if (!token) throw new Error('Anima team token for test not found');
const storyHashReg = new RegExp(/hash => (.*)/);

const DESIGN_TOKENS_TEST_FILES = {
  INIT: './e2e-test/test-ds-tokens.json',
  UPDATE: './e2e-test/test-ds-tokens-update.json',
};

const getCommand = (isUsingBasePath: boolean, tokenPath: string) =>
  isUsingBasePath
    ? `node ./dist/cli.js sync -s "s3://anima-uploads/e2e-tests/storybook-sample-base-path" -t ${token} --debug -b /styleguide --design-tokens ${tokenPath}`
    : `node ./dist/cli.js sync -s "s3://anima-uploads/e2e-tests/storybook-sample" -t ${token} --debug --design-tokens ${tokenPath}`;

type TokenVersion = keyof typeof DESIGN_TOKENS_TEST_FILES;

interface SyncWithDesignTokensParams {
  isUsingBasePath: boolean;
  designTokenVersion: TokenVersion;
}

const syncWithDesignTokens = ({
  isUsingBasePath,
  designTokenVersion,
}: SyncWithDesignTokensParams): { storybookHash: string } => {
  const output = execSync(
    getCommand(isUsingBasePath, DESIGN_TOKENS_TEST_FILES[designTokenVersion]),
  );
  const result = storyHashReg.exec(output.toString());
  if (!result) throw new Error('storybook hash not found');
  const [, storybookHash] = result;
  return { storybookHash };
};

const syncOnlyTokens = ({
  designTokenVersion,
}: {
  designTokenVersion: TokenVersion;
}) => {
  const output = execSync(
    `node ./dist/cli.js sync -t ${token} --debug --design-tokens ${DESIGN_TOKENS_TEST_FILES[designTokenVersion]}`,
  );
  const result = storyHashReg.exec(output.toString());
  if (!result) throw new Error('storybook hash not found');
  const [, storybookHash] = result;
  return { storybookHash };
};

export default {
  syncOnlyTokens,
  syncWithDesignTokens,
};
