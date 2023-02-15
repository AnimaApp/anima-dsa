import { execSync } from 'child_process';

export const downloadFromUrl = async (
  s3Url: string,
  path: string,
): Promise<void> => {
  console.log('Download bundle');
  execSync(`aws s3 sync ${s3Url} ${path}`, {
    stdio: 'inherit',
  });
};
