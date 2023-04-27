import { execSync } from 'child_process';

const token = process.env.TEST_TOKEN; // personal team created for it
if (!token) throw new Error('Anima team token for test not found');
const storyHashReg = new RegExp(/hash => (.*)/);

// ----------------- Test Simple Sync -----------------

console.log('Setup, running sync');
let output = execSync(
  `node ./dist/cli.js sync -d "s3://anima-uploads/e2e-tests/storybook-sample" -t ${token} --debug`,
);

let result = storyHashReg.exec(output.toString());
if (!result) throw new Error('storybook hash not found');
let [, storybookHash] = result;

console.log('Run the tests');
// --- Tests ---
// Run tests Check if stories are well created and synced and finished processing
execSync(`TOKEN=${token} HASH=${storybookHash} yarn jest ./ --testPathIgnorePatterns="__tests__"`, {
  stdio: 'inherit',
});

// ----------------- Test Sync with base path -----------------
console.log('Setup, running sync with base path');
output = execSync(
  `node ./dist/cli.js sync -d "s3://anima-uploads/e2e-tests/storybook-sample-base-path" -t ${token} --debug -b /styleguide`,
);

result = storyHashReg.exec(output.toString());
if (!result) throw new Error('storybook hash not found');
[, storybookHash] = result;

console.log('Run the tests');
// --- Tests ---
// Run tests Check if stories are well created and synced and finished processing
execSync(`TOKEN=${token} HASH=${storybookHash} yarn jest --testPathIgnorePatterns="__tests__" ./`, {
  stdio: 'inherit',
});

// --- Clean ---
// TODO
// Delete all storybook / teams
