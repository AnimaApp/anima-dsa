import { getCurrentHub } from '@sentry/node';
import { StorybookApi } from '@animaapp/storybook-api';

import { STORYBOOK_SERVICE_BASE_URL } from '../constants';

const storybookApi = new StorybookApi({
  storybookEndpoint: STORYBOOK_SERVICE_BASE_URL,
  addionalHeaders: () => {
    const headers: { [key: string]: string } = {};
    const traceHeader = getCurrentHub().getScope()?.getSpan()?.toTraceparent();
    if (traceHeader) {
      headers['sentry-trace'] = traceHeader;
    }
    return headers;
  },
});

export { storybookApi };
