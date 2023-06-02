import fs from 'fs';
import path from 'path';

import { execSync } from 'child_process';
import { expect, afterAll, describe, test } from 'vitest';

const basePath = path.dirname(__filename);

describe.only('common', () => {
  test('convert to css variables', () => {
    const command = `style-dictionary build -c ${basePath}/styleguide-require.config.js`;
    execSync(command);
    const value = fs.readFileSync('./src/__tests__/tmp/scss/_variablesCJS.scss').toString();
    expect(value).toContain("--black");
    expect(value).toContain("--blue-100");
  });

  afterAll(() => {
    fs.rmdirSync('./src/__tests__/tmp', { recursive: true });
  });
});
