import { z } from 'zod';

if (process.env.ANIMA_DEBUG) {
  process.env.ANIMA_API_ENV = 'debug';
}
if (!process.env.ANIMA_API_ENV) {
  process.env.ANIMA_API_ENV = 'production';
}

const apiTypes = ['production', 'canary', 'debug'] as const;
const schema = z.enum(apiTypes);
const apiEnv = schema.parse(process.env.ANIMA_API_ENV);

let API_URL: string;
switch (apiEnv) {
  case 'production':
    API_URL = 'https://api.animaapp.com';
    break;
  case 'debug':
    API_URL = 'http://localhost:5007';
    break;
  case 'canary':
    API_URL = 'https://canary-api.animaapp.com';
    break;
}

export { API_URL };
