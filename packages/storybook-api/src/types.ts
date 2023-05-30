export interface StorybookApiOptions {
  storybookEndpoint: string;
  addionalHeaders: () => { [key: string]: string };
}

export interface CreateStorybookParams {
  storybook_hash: string;
  ds_tokens: string;
  base_path?: string;
  status?: 'ready';
  upload_status?: 'complete';
}

export interface StorybookEntity {
  upload_status: string;
  upload_signed_url: string;
  id: string;
  status: string;
  preload_stories: boolean;
  storybook_hash: string;
  ds_tokens: string;
}

export interface getOrCreateStorybookResponse {
  storybookId: string | null | undefined;
  uploadUrl: string | null | undefined;
  uploadStatus: string;
  designTokens?: string;
  hash: string;
}
