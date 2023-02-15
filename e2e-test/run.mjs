import { execSync } from 'child_process';

const token = process.env.TEST_TOKEN; // personal team created for it
if (!token) throw new Error('Anima team token for test not found');
const storyHashReg = new RegExp(/hash => (.*)/);

// --- Setup ---
console.log('Setup, running sync');
const output = execSync(
  `node ./dist/cli.js sync -d "s3://anima-uploads/e2e-tests/storybook-sample" -t ${token} --debug`,
);

const result = storyHashReg.exec(output.toString());
if (!result) throw new Error('storybook hash not found');
const [, storybookHash] = result;

console.log('Run the tests');
// --- Tests ---
// Run tests Check if stories are well created and synced and finished processing
execSync(`TOKEN=${token} HASH=${storybookHash} yarn jest ./`, {
  stdio: 'inherit',
});

// --- Clean ---
// TODO
// Delete all storybook / teams
