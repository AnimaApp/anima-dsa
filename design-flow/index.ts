import { GithubRepo } from './github';
import { type IRepo } from './types';

const token = '';

const main = async () => {
  const repo: IRepo = new GithubRepo({
    repo: 'anima-storybook-cli',
    owner: 'Animaapp',
    token,
  });

  // TODO: fetch DSTokens from figma transform them to JSON file

  await repo.writeRequest({
    filePath: 'test.txt',
    newfileContent: 'test oh yeah but yes en fait',
    title: 'Update design token version 2',
    description: '',
    baseBranch: 'master',
    newBranch: 'new-token',
  });
};

main()
  .then(() => {
    console.log('PR created');
  })
  .catch((err) => console.log(err));
