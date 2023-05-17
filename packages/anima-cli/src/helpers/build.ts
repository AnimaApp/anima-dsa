import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { downloadFromUrl, isS3Url, setUsingS3Url } from './s3';
import { TMP_DIR } from '../constants';


export const DEFAULT_BUILD_COMMAND = 'build-storybook';
export const DEFAULT_BUILD_DIR = 'storybook-static';

export const buildStorybook = (
  command?: string,
  silent = false,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const buildCommand = command ?? DEFAULT_BUILD_COMMAND;

    const result = spawn('npm', ['run', buildCommand], {
      cwd: process.cwd(),
      stdio: silent ? 'ignore' : 'inherit',
    });

    result.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

export const getBuildDir = (buildDir?: string): string => {
  const buildDirPath = buildDir ?? DEFAULT_BUILD_DIR;
  if (path.isAbsolute(buildDirPath)) return buildDirPath;
  return path.join(process.cwd(), buildDirPath);
};

export const setupTempDirectory = (
  dir: string,
  { __DEV__ = false } = {},
): string => {
  const TEMP_DIR = path.join(process.cwd(), dir);
  if (__DEV__) {
    fs.removeSync(TEMP_DIR);
    fs.mkdirSync(TEMP_DIR);
  }

  return TEMP_DIR;
};

export const parseBuildDirArg = async (
  storybookArg?: string,
): Promise<string> => {
  let buildDir: string;
  if (storybookArg && isS3Url(storybookArg)) {
    console.log('Using s3 url, creating tmp dir');
    setUsingS3Url(true);
    await downloadFromUrl(storybookArg, TMP_DIR);
    buildDir = TMP_DIR;
  } else {
    buildDir = getBuildDir(storybookArg || undefined);
  }
  return buildDir;
};

export const validateBuildDir = (buildDir: string): void => {
  if (!fs.existsSync(buildDir)) {
    throw new BuildDirError(
      `Cannot find build storybook: "${buildDir}". Please build storybook before running this command `,
      buildDir,
    );
  }
};

export class BuildDirError extends Error {
  buildDir: string;
  constructor(message: string, buildDir: string) {
    super('[BuildDirError]: ' + message);
    this.buildDir = buildDir;
  }
}

