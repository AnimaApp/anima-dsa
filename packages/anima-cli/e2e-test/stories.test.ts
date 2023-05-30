import { getTeamStories } from '../src/api';
import { storybookApi } from '../src/api/storybook';
import { expect, beforeAll, test, describe } from "vitest";
import ds_tokens from './test-ds-tokens.json';
import ds_tokens_update from './test-ds-tokens-update.json';
import testUtils from './utils';
import { type Story } from '../src/api/types';
import { type StorybookEntity } from '@animaapp/storybook-api';

const TOKEN = process.env.TEST_TOKEN;
const TIMEOUT = 1000 * 60 * 3; // 5 minutes

if (!TOKEN) throw new Error('TOKEN not found');

describe('Test storybook with base path', () => {
  let storybook: StorybookEntity;
  let hash: string;
  let stories: Story[];

  beforeAll(async () => {
    const syncResult = testUtils.syncWithDesignTokens({
      isUsingBasePath: true,
      designTokenVersion: 'INIT',
    });
    hash = syncResult.storybookHash;
    console.log(`Args:\n- token: ${TOKEN}\n- hash: ${hash}`);
    const tmpStorybook = await storybookApi.getStorybookByHash(TOKEN, hash);
    if (!tmpStorybook) throw new Error('no storybook');
    storybook = tmpStorybook;
    stories = await getTeamStories(TOKEN);
  }, TIMEOUT);

  test('Check if storybook is well created', async () => {
    expect(storybook.upload_status).toBe("complete");
    expect(storybook.status).toBe("ready");
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
});

describe('Test storybook without base path', () => {
  let storybook: StorybookEntity;
  let hash: string;
  let stories: Story[];

  beforeAll(async () => {
    const syncResult = testUtils.syncWithDesignTokens({
      isUsingBasePath: false,
      designTokenVersion: 'INIT',
    });
    hash = syncResult.storybookHash;
    console.log(`Args:\n- token: ${TOKEN}\n- hash: ${hash}`);
    const storybook = await storybookApi.getStorybookByHash(TOKEN, hash);
    expect(storybook).toBeTruthy();
    stories = await getTeamStories(TOKEN);
  }, TIMEOUT);

  test('Check if storybook is well created', async () => {
    expect(storybook.upload_status).toBe("complete");
    expect(storybook.status).toBe("ready");
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

  test('Update ds tokens and resync', async () => {
    const { storybookHash } = testUtils.syncWithDesignTokens({
      isUsingBasePath: false,
      designTokenVersion: 'UPDATE',
    })
    const storybook = await storybookApi.getStorybookByHash(TOKEN, storybookHash);
    if (!storybook) throw new Error('no storybook');
    expect(JSON.parse(storybook.ds_tokens)).toMatchObject(ds_tokens_update);
  });
});

describe('Sync only tokens', () => {
  test('Sync only tokens init', async () => {
    const { storybookHash } = testUtils.syncOnlyTokens({
      designTokenVersion: 'INIT',
    });
    const storybook = await storybookApi.getStorybookByHash(TOKEN, storybookHash);
    if (!storybook) throw new Error('no storybook');
    expect(JSON.parse(storybook.ds_tokens)).toMatchObject(ds_tokens);
  }, 10000);

  test('Sync only tokens update', async () => {
    const { storybookHash } = testUtils.syncOnlyTokens({
      designTokenVersion: 'UPDATE',
    });
    const storybook = await storybookApi.getStorybookByHash(TOKEN, storybookHash);
    if (!storybook) throw new Error('no storybook');
    expect(JSON.parse(storybook.ds_tokens)).toMatchObject(ds_tokens_update);
  });
})
