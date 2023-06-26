import { test, describe, expect, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  extractComponentInformation,
  generateStories,
  getTypeImports
} from '../src/helpers/storybook';

const TOKEN = process.env.TEST_TOKEN;
const COMPONENTS_FOLDER = path.join(__dirname, 'example-components');
const PROJECT_FOLDER = path.join(__dirname, 'example-project');
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
    'Extract component information',
    async () => {
      const componentFile = path.join(COMPONENTS_FOLDER, 'Example.jsx');
      const componentContent = fs.readFileSync(componentFile, 'utf8');
      const response = await extractComponentInformation(
        componentContent,
        "",
        TOKEN,
      ).catch((e) => {
        throw e;
      });
      expect(response).not.toBe(null);
      expect(response.default_export).toBe(true);
      expect(response.prop_data_types).toBe(false);
      expect(response.component_name).toBe('Example');
      const propNames = response.props.map((p) => p.name);
      const propTypes = response.props.map((p) => p.type);
      expect(propNames.sort()).toStrictEqual(
        ['text', 'isActive', 'variant'].sort(),
      );
      expect(propTypes.sort()).toStrictEqual(
        ['string', 'string', 'boolean'].sort(),
      );
    },
    TIMEOUT,
  );

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
      await generateStories(componentFilesFullPath, new Set<string>(), TOKEN);
      componentFiles = fs.readdirSync(COMPONENTS_FOLDER);
      for (const [filename, { name, args }] of Object.entries(FILES)) {
        expect(componentFiles).include(filename);
        const content = fs.readFileSync(
          path.join(COMPONENTS_FOLDER, filename),
          'utf-8',
        );
        const [importLine, componentProperties] =
          content.split('\n\n');
        expect(importLine).contains(`from './${name}'`);
        expect(componentProperties).contains('export default {');
        expect(componentProperties).contains(`title: "Components/${name}"`);
        expect(componentProperties).contains(`component: ${name}`);
        for (const [name, type] of Object.entries(args)) {
          expect(componentProperties).contains(`${name}: { type: '${type}' }`);
        }
      }
    },
    TIMEOUT,
  );

  test(
    'Extract types',
    () => {
      const componentFile = path.join(PROJECT_FOLDER, "Example.jsx");
      const componentContent = fs.readFileSync(componentFile, 'utf-8');
      const typeImports = getTypeImports(componentContent, componentFile);
      const expected = `type ExampleProps = {
    text: string,
    isActive: boolean,
    variant: 'primary' | 'secondary'
}`;
      expect(typeImports.size).toBe(1);
      const actual = Array.from(typeImports)[0];
      expect(actual).toBe(expected);
    },
    TIMEOUT,
  );

  afterAll(() => {
    for (const filename of fs.readdirSync(COMPONENTS_FOLDER)) {
      if (filename.endsWith('.stories.js')) {
        fs.unlink(path.join(COMPONENTS_FOLDER, filename), (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    }
  });
});
