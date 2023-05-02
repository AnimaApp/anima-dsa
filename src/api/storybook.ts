import { getCurrentHub } from '@sentry/node';
import nf, { Response } from 'node-fetch';
import { STORYBOOK_SERVICE_BASE_URL } from '../constants';
import { transformDStoJSON, log, hashString } from './../helpers/';

export interface StorybookEntity {
  upload_status: string;
  upload_signed_url: string;
  id: string;
  status: string;
  preload_stories: boolean;
  ds_tokens: string;
}

export const getStorybookByHash = async (
  token: string,
  hash: string,
): Promise<Response> => {
  const traceHeader = getCurrentHub().getScope()?.getSpan()?.toTraceparent();
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  if (traceHeader) {
    headers['sentry-trace'] = traceHeader;
  }
  return nf(`${STORYBOOK_SERVICE_BASE_URL}/storybook?hash=${hash}`, {
    method: 'GET',
    headers,
  });
};

interface CreateStorybookParams {
  storybook_hash: string;
  ds_tokens: string;
  base_path?: string;
  status?: 'ready';
  upload_status?: 'complete';
}

export const createStorybook = async (
  token: string,
  params: CreateStorybookParams,
): Promise<StorybookEntity | null> => {
  const traceHeader = getCurrentHub().getScope()?.getSpan()?.toTraceparent();
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  if (traceHeader) {
    headers['sentry-trace'] = traceHeader;
  }
  const res = await nf(`${STORYBOOK_SERVICE_BASE_URL}/storybook`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(params),
  });

  if (res.status === 200) {
    const data = await res.json();
    return data;
  }

  return null;
};

interface getOrCreateStorybookResponse {
  storybookId: string | null | undefined;
  uploadUrl: string | null | undefined;
  uploadStatus: string;
  designTokens?: string;
  hash: string;
}

export const updateDSTokenIfNeeded = async ({
  currentDSToken,
  storybook,
  token,
}: {
  currentDSToken: Record<string, unknown>;
  storybook: { ds_tokens?: string; id: string; upload_status: string };
  token: string;
}): Promise<void> => {
  const { ds_tokens, id, upload_status } = storybook;
  const uploadSpan = getCurrentHub().getScope()?.getSpan();
  const span = uploadSpan?.startChild({ op: 'update-ds-token-if-needed' });
  let transformedToken = {};
  try {
    transformedToken = transformDStoJSON(currentDSToken);
  } catch (e) {
    log.red('[Update design tokens] Invalid tokens file');
  }

  const ds_tokensAsString = JSON.stringify(transformedToken);

  if (ds_tokens !== ds_tokensAsString) {
    const spanUpdateStorybook = span?.startChild({ op: 'update-storybook' });
    const response = await updateStorybook(token, id, {
      ds_tokens: ds_tokensAsString,
      upload_status,
    });
    if (response.status !== 200) {
      if (spanUpdateStorybook) {
        spanUpdateStorybook.status = 'error';
        spanUpdateStorybook.finish();
      }
      throw new Error('Network request failed, response status !== 200');
    } else {
      spanUpdateStorybook?.finish();
    }
  }
};

export const getOrCreateStorybook = async (
  token: string,
  hash: string,
  raw_ds_tokens: Record<string, unknown> = {},
  basePath: string | undefined,
): Promise<getOrCreateStorybookResponse> => {
  const transaction = getCurrentHub().getScope()?.getTransaction();
  const spanGetOrCreate = transaction?.startChild({
    op: 'get-or-create-storybook',
  });

  const res = await getStorybookByHash(token, hash);
  let data: StorybookEntity | null = null;

  let ds_tokens = {};

  try {
    ds_tokens = transformDStoJSON(raw_ds_tokens);
  } catch (e) {
    log.red('[Create design tokens] Invalid tokens file');
  }

  if (res.status === 200) {
    data = await res.json();
  } else if (res.status === 404) {
    const spanCreateStorybook = spanGetOrCreate?.startChild({
      op: 'create-storybook',
    });
    data = await createStorybook(token, {
      storybook_hash: hash,
      ds_tokens: JSON.stringify(ds_tokens),
      base_path: basePath,
    });
    spanCreateStorybook?.finish();
  }

  const {
    id,
    upload_signed_url,
    upload_status = 'init',
    ds_tokens: dsTokens,
  } = data ?? {};

  transaction?.setData('storybookID', id);
  spanGetOrCreate?.finish();

  return {
    storybookId: id,
    uploadUrl: upload_signed_url,
    uploadStatus: upload_status,
    hash,
    designTokens: dsTokens,
  };
};

export const getOrCreateStorybookForDesignTokens = async (
  token: string,
  raw_ds_tokens: Record<string, unknown> = {},
): Promise<getOrCreateStorybookResponse> => {
  const transaction = getCurrentHub().getScope()?.getTransaction();
  const spanGetOrCreate = transaction?.startChild({
    op: 'get-or-create-storybook',
  });

  const res = await getMostRecentStorybook(token);

  let data: StorybookEntity | null = null;

  const hash = hashString(token);

  if (res.status !== 200) {
    throw new Error(
      'We had an issue making a request to our server. Please try again, or reach out to the Anima team if the problem persists',
    );
  }

  const { results } = await res.json();

  if (results.length) {
    data = results[0];
  } else {
    const spanCreateStorybook = spanGetOrCreate?.startChild({
      op: 'create-storybook',
    });

    data = await createStorybook(token, {
      ds_tokens: JSON.stringify(raw_ds_tokens),
      storybook_hash: hash,
      status: 'ready',
      upload_status: 'complete',
    });
    spanCreateStorybook?.finish();
  }

  const {
    id,
    upload_signed_url,
    upload_status = 'complete',
    ds_tokens: dsTokens,
  } = data ?? {};

  transaction?.setData('storybookID', id);
  spanGetOrCreate?.finish();

  return {
    storybookId: id,
    uploadUrl: upload_signed_url,
    uploadStatus: upload_status,
    hash,
    designTokens: dsTokens,
  };
};

export const getTeamProcessingStories = async (
  token: string,
): Promise<Response> => {
  const traceHeader = getCurrentHub().getScope()?.getSpan()?.toTraceparent();
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  if (traceHeader) {
    headers['sentry-trace'] = traceHeader;
  }
  return nf(`${STORYBOOK_SERVICE_BASE_URL}/stories_processing`, {
    method: 'GET',
    headers,
  });
};

const getMostRecentStorybook = async (token: string): Promise<Response> => {
  const query = new URLSearchParams({
    order_by: '-updated_at',
    limit: '1',
  }).toString();

  const traceHeader = getCurrentHub().getScope()?.getSpan()?.toTraceparent();
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  if (traceHeader) {
    headers['sentry-trace'] = traceHeader;
  }
  return nf(`${STORYBOOK_SERVICE_BASE_URL}/storybooks?${query}`, {
    method: 'GET',
    headers,
  });
};

export const updateStorybook = async (
  token: string,
  id: string,
  fields: Partial<StorybookEntity>,
): Promise<Response> => {
  const traceHeader = getCurrentHub().getScope()?.getSpan()?.toTraceparent();
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  if (traceHeader) {
    headers['sentry-trace'] = traceHeader;
  }
  return nf(`${STORYBOOK_SERVICE_BASE_URL}/storybook/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(fields),
  });
};
