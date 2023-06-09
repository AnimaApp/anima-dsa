import axios from 'axios';
import { hashString } from './hash';

import type {
  CreateStorybookParams,
  StorybookApiOptions,
  StorybookEntity,
  getOrCreateStorybookResponse,
} from './types';

export class StorybookApi {
  #endpoint: string;
  #addionalHeaders;
  constructor(opts: StorybookApiOptions) {
    const { storybookEndpoint, addionalHeaders } = opts;
    this.#endpoint = storybookEndpoint;
    this.#addionalHeaders = addionalHeaders;
  }

  getStorybookByHash = async (
    token: string,
    hash: string,
  ): Promise<StorybookEntity | null> => {
    const res = await axios<StorybookEntity | null>(
      `${this.#endpoint}/storybook`,
      {
        params: {
          hash,
        },
        method: 'get',
        headers: this.#getHeaders(token),
        validateStatus: function (status) {
          return status < 500;
        },
      },
    );
    if (res.status === 404) return null;
    if (res.status !== 200) throw new Error('Failed to get Storybook');
    const storybook = res.data;
    return storybook;
  };

  updateDSTokenIfNeeded = async ({
    currentDSToken,
    storybook,
    token,
  }: {
    currentDSToken: Record<string, unknown>;
    storybook: { ds_tokens?: string; id: string; upload_status: string };
    token: string;
  }): Promise<void> => {
    const { ds_tokens, id, upload_status } = storybook;
    const ds_tokensAsString = JSON.stringify(currentDSToken);

    if (ds_tokens !== ds_tokensAsString) {
      try {
        await this.updateStorybook(token, id, {
          ds_tokens: ds_tokensAsString,
          upload_status,
        });
      } catch (e) {
        throw new Error('Network request failed, response status !== 200');
      }
    }
  };

  createStorybook = async (
    token: string,
    params: CreateStorybookParams,
  ): Promise<StorybookEntity | null> => {
    const res = await axios<StorybookEntity | null>(
      `${this.#endpoint}/storybook`,
      {
        method: 'post',
        headers: this.#getHeaders(token),
        data: params,
      },
    );
    if (res.status === 200) {
      return res.data;
    }
    return null;
  };

  getMostRecentStorybook = async (
    token: string,
  ): Promise<StorybookEntity | null> => {
    const query = new URLSearchParams({
      order_by: '-updated_at',
      limit: '1',
    });

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
    const res = await axios<{ results: StorybookEntity[] }>(
      `${this.#endpoint}/storybooks`,
      {
        params: query,
        method: 'get',
        headers,
      },
    );
    if (!res.data.results.length) return null;
    return res.data.results[0];
  };

  updateStorybook = async (
    token: string,
    id: string,
    fields: Partial<StorybookEntity>,
  ): Promise<StorybookEntity> => {
    const res = await axios(`${this.#endpoint}/storybook/${id}`, {
      method: 'put',
      headers: this.#getHeaders(token),
      data: fields,
    });
    return res.data;
  };

  getOrCreateStorybook = async (
    token: string,
    hash: string,
    raw_ds_tokens: Record<string, unknown> = {},
    basePath: string | undefined,
  ): Promise<getOrCreateStorybookResponse> => {
    let storybook = await this.getStorybookByHash(token, hash);
    if (storybook == null) {
      storybook = await this.createStorybook(token, {
        storybook_hash: hash,
        ds_tokens: JSON.stringify(raw_ds_tokens),
        base_path: basePath,
      });
    }

    const {
      id,
      upload_signed_url,
      upload_status = 'init',
      ds_tokens: dsTokens,
    } = storybook ?? {};

    return {
      storybookId: id,
      uploadUrl: upload_signed_url,
      uploadStatus: upload_status,
      hash,
      designTokens: dsTokens,
    };
  };

  getOrCreateStorybookForDesignTokens = async (
    token: string,
    raw_ds_tokens: Record<string, unknown> = {},
  ): Promise<getOrCreateStorybookResponse> => {
    try {
      const storybook = await this.getMostRecentStorybook(token);

      let data: StorybookEntity | null = null;

      if (storybook) {
        data = storybook;
      } else {
        // Not a good solution for hashing, we probably need to separate DS from storybook
        const hash = hashString(token);

        data = await this.createStorybook(token, {
          ds_tokens: JSON.stringify(raw_ds_tokens),
          storybook_hash: hash,
          status: 'ready',
          upload_status: 'complete',
        });
      }

      const {
        id,
        upload_signed_url,
        upload_status = 'complete',
        ds_tokens: dsTokens,
        storybook_hash = '',
      } = data ?? {};

      return {
        storybookId: id,
        uploadUrl: upload_signed_url,
        uploadStatus: upload_status,
        hash: storybook_hash,
        designTokens: dsTokens,
      };
    } catch (e) {
      throw new Error(
        'We had an issue making a request to our server. Please try again, or reach out to the Anima team if the problem persists',
      );
    }
  };

  #getHeaders = (token: string) => {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      ...this.#addionalHeaders(),
    };
    return headers;
  };

  syncOnlyDesignTokens = async (
    token: string,
    designTokens: Record<string, unknown>,
  ) => {
    const storybook = await this.getOrCreateStorybookForDesignTokens(
      token,
      designTokens,
    );
    const storybookId = storybook.storybookId;
    const uploadStatus = storybook.uploadStatus;
    if (storybookId) {
      await this.updateDSTokenIfNeeded({
        storybook: {
          id: storybookId,
          ds_tokens: storybook.designTokens,
          upload_status: uploadStatus,
        },
        token,
        currentDSToken: designTokens,
      });
    }
    return storybook;
  };
}
