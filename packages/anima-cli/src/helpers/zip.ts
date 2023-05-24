import archiver from 'archiver';
import { Writable } from 'stream';
import { hashBuffer } from './hash';
import { isDebug } from './debug';
import { getCurrentHub } from '@sentry/node';

export function zipDir(dir: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffs: Buffer[] = [];

    const converter = new Writable();

    converter._write = (chunk, _encoding, cb) => {
      buffs.push(chunk);
      process.nextTick(cb);
    };

    converter.on('finish', () => {
      resolve(Buffer.concat(buffs));
    });

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(converter);

    archive.directory(dir, false);

    archive.finalize();
  });
}

export const generateZipHash = async (buildDir: string) => {
  const transaction = getCurrentHub().getScope()?.getTransaction();
  const spanZipBuild = transaction?.startChild({ op: 'zip-build-and-hash' });
  // zip the build directory and create a hash

  const zipBuffer = await zipDir(buildDir);
  const zipHash = hashBuffer(zipBuffer);

  isDebug() && console.log('generated hash =>', zipHash);

  spanZipBuild?.finish();
  return { zipHash, zipBuffer };
};
