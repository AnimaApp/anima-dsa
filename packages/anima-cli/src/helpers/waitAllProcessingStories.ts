import { getTeamProcessingStories } from '../api';

const INTERVAL_TIME = 5000;
const MINIMUM_INTERVAL_COUNT = 4;

interface Story extends Record<string, unknown> {
  id: string;
}

interface Callbacks {
  onCheckStories: (stories: Story[]) => Promise<void> | void;
}

export const waitProcessingStories = async (
  teamToken: string,
  cb: Callbacks,
): Promise<void> => {
  let intervalLoopCount = 0;
  // At first the number of story will be 0, we need to wait a bit
  // before starting to check
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
        if (stories.length <= 0 && intervalLoopCount >= MINIMUM_INTERVAL_COUNT) {
          clearInterval(interval);
          return res();
        }
        intervalLoopCount += 1;
      } catch (e) {
        clearInterval(interval);
        return rej(e);
      }
    }, INTERVAL_TIME);
  });
};
