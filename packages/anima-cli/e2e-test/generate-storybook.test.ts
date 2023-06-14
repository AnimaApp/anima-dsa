import { test, describe, expect, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { generateStories } from '../src/helpers/storybook';

const TOKEN = process.env.TEST_TOKEN;
const COMPONENTS_FOLDER = path.join(__dirname, 'example-components');
const TIMEOUT = 1000 * 60 * 3; // 3 minutes
const FILES = {
  'Example.stories.js': {
    name: 'Example',
    args: { text: 'string', isActive: 'boolean', variant: 'string' },
  },
  'Button.stories.js': {
    name: 'Button',
    args: {
      iconPosition: 'string',
      size: 'string',
      active: 'boolean',
      style: 'object',
    },
  },
};

if (!TOKEN) throw new Error('TOKEN not found');

describe('Generate storybook', () => {
  test(
    'Initialize storybook',
    async () => {
      let componentFiles = fs.readdirSync(COMPONENTS_FOLDER);
      for (const filename of Object.keys(FILES)) {
        expect(componentFiles).not.include(filename);
      }
      const componentFilesFullPath = componentFiles.map((f) =>
        path.join(COMPONENTS_FOLDER, f),
      );
      await generateStories(componentFilesFullPath, TOKEN);
      componentFiles = fs.readdirSync(COMPONENTS_FOLDER);
      for (const [filename, { name, args }] of Object.entries(FILES)) {
        expect(componentFiles).include(filename);
        const content = fs.readFileSync(
          path.join(COMPONENTS_FOLDER, filename),
          'utf-8',
        );
        const [importLine, componentProperties, example] =
          content.split('\n\n');
        expect(importLine).contains(`from './${name}'`);
        expect(componentProperties).contains('export default {');
        expect(componentProperties).contains(`title: "Components/${name}"`);
        expect(componentProperties).contains(`component: ${name}`);
        expect(example).contains('export const Default = {');
        for (const [name, type] of Object.entries(args)) {
          expect(componentProperties).contains(`${name}: { type: '${type}' }`);
          expect(example).contains(name);
        }
      }
    },
    TIMEOUT,
  );

  afterAll(() => {
    for (const filename of fs.readdirSync(COMPONENTS_FOLDER)) {
      if (filename.endsWith('.stories.js')) {
        // fs.unlink(path.join(COMPONENTS_FOLDER, filename), (err) =>
        //   console.error(err),
        // );
      }
    }
  });
});
