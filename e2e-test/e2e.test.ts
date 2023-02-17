import { getStorybookByHash, StorybookEntity } from '../src/api';

const TOKEN = process.env.TOKEN;
const HASH = process.env.HASH;

console.log(`Args:\n- token: ${TOKEN}\n- hash: ${HASH}`);

if (!TOKEN || !HASH) throw new Error("TOKEN or HASH not found");

let storybook: StorybookEntity;
beforeAll(async () => {
  const res = await getStorybookByHash(TOKEN, HASH);
  if (!res.ok) throw new Error('Failed to get Storybook');
  storybook = await res.json();
});

test('Check if storybook is ready', async () => {
  expect(storybook.upload_status).toBe("complete");
  expect(storybook.status).toBe("ready");
});
