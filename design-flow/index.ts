import designTokens from './design-tokens.json';
import { GithubRepo } from './github';
import { type IRepo } from './types';

const token = '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';

const main = async () => {
  const path = 'design-tokens.json';
  const baseBranch = 'master';
  const newBranch = 'new-token';

  const repo: IRepo = new GithubRepo({
    repo: 'anima-storybook-cli',
    owner: 'Animaapp',
    token,
    baseBranch
  });

  // remote = repo github
  // TODO: create a local JSON DesignToken Manager.
  // props:
  // - tokens
  // - IRepo
  //
  // actions:
  // - add token
  // - edit token
  // - saveRequest to remote
  // - fetch from remote
  // - diff from remote

  const currentContent = await repo.getFileContent({ filePath: path });
  await repo.writeRequest({
    filePath: path,
    newfileContent: 'test oh yeah but yes en fait',
    title: 'Update design token version 2',
    description: 'Just updated some tokens',
    newBranch,
  });
};

main()
  .then(() => {
    console.log('PR created');
  })
  .catch((err) => console.log(err));
