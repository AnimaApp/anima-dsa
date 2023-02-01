import { getTeamProcessingStories } from '../api';

const INTERVAL_TIME = 5000;
const SLEEP_TIME = 8000;

interface Story extends Record<string, unknown> {
  id: string;
}

interface Callbacks {
  onCheckStories: (stories: Story[]) => Promise<void> | void;
}

const sleep = (time: number) => new Promise((res) => setTimeout(res, time));

export const waitProcessingStories = async (
  teamToken: string,
  cb: Callbacks,
): Promise<void> => {
  // At first the number of story will be 0, we need to wait a bit
  // before starting to check
  await sleep(SLEEP_TIME);
  return new Promise<void>((res, rej) => {
    const interval = setInterval(async () => {
      try {
        const response = await getTeamProcessingStories(teamToken);
        if (!response.ok) {
          throw new Error('Impossible to retrieve the stories of the team');
        }
        const { results: stories } = (await response.json()) as {
          results: Story[];
        };
        cb.onCheckStories(stories);
        if (stories.length <= 0) {
          clearInterval(interval);
          return res();
        }
      } catch (e) {
        clearInterval(interval);
        return rej(e);
      }
    }, INTERVAL_TIME);
  });
};
