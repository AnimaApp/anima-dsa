import fs from 'fs-extra';

export const getFileIfExists = async <T>(path?: string): Promise<T | undefined> => {
  if (path) {
    if (fs.existsSync(path)) {
      return await fs.readJSON(path);
    } else {
      throw new Error('Path not found');
    }
  }
};
