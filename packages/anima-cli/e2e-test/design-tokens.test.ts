import { getStorybookByHash, getTeamStories, type Story, type StorybookEntity } from '../src/api';
import { expect, beforeAll, test } from "vitest";
import ds_tokens from './test-ds-tokens.json';
import { syncWithDesignTokens } from './utils';

const TOKEN = process.env.TEST_TOKEN;
const TIMEOUT = 1000 * 60 * 3; // 5 minutes

if (!TOKEN) throw new Error('TOKEN or HASH not found');

let storybook: StorybookEntity;
let hash: string;
let stories: Story[];

beforeAll(async () => {
  const syncResult = syncWithDesignTokens(false);
  hash = syncResult.storybookHash;
  console.log(`Args:\n- token: ${TOKEN}\n- hash: ${hash}`);
  const res = await getStorybookByHash(TOKEN, hash);
  if (!res.ok) throw new Error('Failed to get Storybook');
  storybook = await res.json();
  stories = await getTeamStories(TOKEN);
}, TIMEOUT);

test('Check if storybook is ready', async () => {
  expect(storybook.upload_status).toBe('complete');
  expect(storybook.status).toBe('ready');
});

test('Check if stories are well created', async () => {
  expect(stories).toHaveLength(21);
  expect(stories[0].status).toBe("paused");
  expect(stories[0].status_blueprint).toBe("init");
  expect(stories[0].status_code_snippets).toBe("init");
});

test('Check if design tokens are well created', async () => {
  expect(JSON.parse(storybook.ds_tokens)).toMatchObject(ds_tokens);
});
