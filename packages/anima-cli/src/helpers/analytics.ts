import * as Sentry from '@sentry/node';

export type EventParams = {
  [key: string]: string | number | boolean;
};

export type Event = {
  action: string;
  time: number;
  eventParams: EventParams;
};

const CLIENT_ID = 'anima-cli';

let enableTracking = true;
export const setEnableTracking = (value: boolean) => {
  enableTracking = value;
};

export const trackEvent = async (events: Event[]) => {
  if (!enableTracking) {
    return;
  };
  try {
    const eventsMapped = events.map((event) => ({
      eventCategory: 'General',
      eventAction: event.action,
      time: event.time,
      params: event.eventParams,
    }));

    await fetch('https://logs.animaapp.com/analytics/collect', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-Client-Id': CLIENT_ID,
      },
      body: JSON.stringify(eventsMapped),
    });
  } catch (e) {
    // an exception on the trackers collection endpoint should not blow-up and crash the app
    const error = new Error('Failed to send track events');
    Sentry.captureException(error);
  }
};
