import nf from 'node-fetch';
import { STORYBOOK_SERVICE_BASE_URL } from '../constants';
import { getCurrentHub } from '@sentry/node';

export class AuthError extends Error {
  token: string;
  constructor(message: string, token: string) {
    super('[AuthError]: ' + message);
    this.token = token;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const authenticate = async (storybookToken: string) => {
  const transaction = getCurrentHub().getScope()?.getTransaction();
  const authSpan = transaction?.startChild({ op: 'authenticate' });
  const errorRes = { success: false, data: {} };
  try {
    if (!storybookToken) return errorRes;
    const res = await nf(`${STORYBOOK_SERVICE_BASE_URL}/validate_token`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + storybookToken,
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      return { success: true, data };
    }
    if (res.status > 299) {
      const json = await res.json();
      const message = json?.message || 'Missing Storybook token';
      throw new AuthError(message, storybookToken);
    }
    return errorRes;
  } catch (error) {
    console.log(error);
    throw new AuthError('Impossible to authenticate', storybookToken);
  } finally {
    authSpan?.finish();
  }
};
