import formData from 'form-data';
import nf, { Response } from 'node-fetch';
import { isDebug } from './debug';
import { updateStorybook } from '../api';
import { getCurrentHub } from '@sentry/node';

export const uploadBuffer = async (
  url: string,
  buff: Buffer,
): Promise<Response> => {
  const fromData = new formData();

  fromData.append('name', 'storybook_preview');
  fromData.append('file', buff, { knownLength: buff.byteLength });

  return nf(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: fromData,
  });
};

type UploadStatus = string;

interface UploadStorybookParams {
  token: string;
  storybookId?: string | null;
  uploadUrl?: string | null;
  uploadStatus?: UploadStatus;
  zipBuffer: Buffer;
}

interface UploadStorybookResult {
  uploadStatus?: UploadStatus;
  skipUpload: boolean;
}

export const uploadStorybook = async ({
  token,
  storybookId,
  uploadUrl,
  uploadStatus,
  zipBuffer,
}: UploadStorybookParams): Promise<UploadStorybookResult> => {
  const transaction = getCurrentHub().getScope()?.getTransaction();
  const spanUploadStorybook = transaction?.startChild({
    op: 'upload-storybook-process',
  });
  getCurrentHub().configureScope((scope) => scope.setSpan(spanUploadStorybook));
  isDebug() && console.log('storybookId =>', storybookId);

  let finalUploadStatus = uploadStatus;
  let skipUpload = true;

  if (uploadStatus !== 'complete' && uploadUrl && storybookId) {
    skipUpload = false;
    const uploadResponse = await uploadBuffer(uploadUrl, zipBuffer);
    const upload_status = uploadResponse.status === 200 ? 'complete' : 'failed';
    await updateStorybook(token, storybookId, {
      upload_status,
      preload_stories: true,
    });
    finalUploadStatus = upload_status;
  }
  spanUploadStorybook?.finish();
  return {
    skipUpload,
    uploadStatus: finalUploadStatus,
  };
};
