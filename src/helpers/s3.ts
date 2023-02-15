import { execSync } from 'child_process';

export const isS3Url = (str: string): boolean => str.startsWith('s3://');

export const downloadFromUrl = async (
  s3Url: string,
  path: string,
): Promise<void> => {
  console.log('Download bundle');
  execSync(`aws s3 sync ${s3Url} ${path}`, {
    stdio: 'inherit',
  });
};

let _usingS3Url = false;
export const setUsingS3Url = (status: boolean): boolean =>
  (_usingS3Url = status);
export const isUsingS3Url = (): boolean => _usingS3Url;
