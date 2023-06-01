import nf, { type Response } from 'node-fetch';
import { getCurrentHub } from '@sentry/node';
import { STORYBOOK_SERVICE_BASE_URL } from '../constants';
import { type Story } from './types';

export const getTeamStories = async (token: string): Promise<Story[]> => {
  const traceHeader = getCurrentHub().getScope()?.getSpan()?.toTraceparent();
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  if (traceHeader) {
    headers['sentry-trace'] = traceHeader;
  }
  const res = await nf(`${STORYBOOK_SERVICE_BASE_URL}/stories`, {
    method: 'GET',
    headers,
  });
  const { results: stories }: { results: Story[] } = await res.json();
  return stories;
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
