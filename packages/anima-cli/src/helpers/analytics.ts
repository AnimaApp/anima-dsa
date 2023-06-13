import * as Sentry from '@sentry/node';
import { version } from '../../package.json';
import nf from 'node-fetch';

export type EventParams = {
  [key: string]: string | number | boolean;
};

export type Event = {
  userID: string;
  action: string;
  time: number;
  eventParams: EventParams;
};

const CLIENT_ID = 'com.animaapp.cli';

let enableTracking = true;
export const setEnableTracking = (value: boolean) => {
  enableTracking = value;
};

export const trackEvent = async (events: Event[]) => {
  if (!enableTracking) {
    return;
  }
  try {
    const eventsMapped = events.map((event) => ({
      userID: event.userID,
      eventCategory: 'General',
      clientVersion: version,
      eventAction: event.action,
      time: event.time,
      params: event.eventParams,
    }));

    await nf('https://logs.animaapp.com/analytics/collect', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-Client-Id': CLIENT_ID,
      },
      body: JSON.stringify(eventsMapped),
    });
  } catch (e) {
    Sentry.captureException(e);
  }
};
