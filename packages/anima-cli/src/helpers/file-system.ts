import fs from 'fs-extra';
import { AnimaConfig } from './config';
import { getCurrentHub } from '@sentry/node';

export const getFileOrThrow = async <T>(
  path?: string,
): Promise<T | undefined> => {
  if (path) {
    if (fs.existsSync(path)) {
      return await fs.readJSON(path);
    } else {
      throw new Error('Path not found');
    }
  }
};

export class DesignTokenError extends Error {
  designTokenFilePath: string;
  constructor(message: string, designTokenFilePath: string) {
    super('[DesignTokenError]: ' + message);
    this.designTokenFilePath = designTokenFilePath;
  }
}

export const getDesignTokens = async (
  designTokenFilePath: string | undefined,
  animaConfig: AnimaConfig,
): Promise<Record<string, unknown>> => {
  const transaction = getCurrentHub().getScope()?.getTransaction();
  const spanGetDSToken = transaction?.startChild({ op: 'get-ds-token' });
  let designTokens = animaConfig.design_tokens ?? {};
  if (designTokenFilePath) {
    if (fs.existsSync(designTokenFilePath)) {
      designTokens = await fs.readJSON(designTokenFilePath);
    } else {
      spanGetDSToken?.finish();
      throw new DesignTokenError('Path not found', designTokenFilePath);
    }
  }
  spanGetDSToken?.finish();
  return designTokens;
};
