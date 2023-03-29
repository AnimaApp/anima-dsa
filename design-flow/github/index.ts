import { Octokit } from 'octokit';
import type { IRepo, Request, WriteRequestParams } from '../types';
import type { CreateBranchReturn, GetBranchRefReturn } from './types';

interface GithubArgs {
  repo: string;
  owner: string;
  token: string;
}

export class GithubRepo implements IRepo {
  titleKey = '[Anima]';
  octokit: Octokit;
  owner: string;
  repo: string;

  constructor({ repo, owner, token }: GithubArgs) {
    this.octokit = new Octokit({
      auth: token,
    });
    this.owner = owner;
    this.repo = repo;
  }

  async getRequests(): Promise<Request[]> {
    const { data: pullRequests } = await this.octokit.rest.pulls.list({
      owner: this.owner,
      repo: this.repo,
      state: 'open',
    });
    return pullRequests.map((pr) => ({
      id: pr.number.toString(),
      title: pr.title,
    }));
  }

  async writeRequest(args: WriteRequestParams): Promise<void> {
    const { filePath, newfileContent, title, description, baseBranch, newBranch } = args;
    const {
      object: { sha: baseBranchSha },
    } = await this.#getBranchRef(baseBranch);
    const branchExist = await this.#branchExist(newBranch);
    if (!branchExist) {
      console.log('Branch does not exist, creating a new one');
      await this.#createBranch({
        newBranchName: newBranch,
        baseBranchSha,
      });
    }
    await this.#createFileOrUpdateInBranch({
      filePath,
      fileContent: newfileContent,
      message: description || title,
      branch: newBranch,
    });
    const pullRequestExist = await this.#pullRequestExistForBranch(newBranch);
    if (!pullRequestExist) {
      console.log('Pull request does not exist, create it');
      await this.#createPullRequestFromBranch({
        title: `${title} ${this.titleKey} `,
        body: description,
        head: newBranch,
        base: baseBranch,
      });
    } else {
      console.log('Pull request already exist, keep the existing one');
    }
  }

  async #createBranch({
    newBranchName,
    baseBranchSha,
  }: {
    newBranchName: string;
    baseBranchSha: string;
  }): Promise<CreateBranchReturn> {
    // Create a new branch
    const createRefRes = await this.octokit.rest.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${newBranchName}`,
      sha: baseBranchSha,
    });

    const { data: refData } = createRefRes;
    return refData;
  }

  async #getBranchRef(branch: string): Promise<GetBranchRefReturn> {
    const baseRef = `heads/${branch}`;
    const baseRefRes = await this.octokit.rest.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: baseRef,
    });
    const { data: baseRefData } = baseRefRes;
    return baseRefData;
  }

  async #getShaFile({
    filePath,
    branch,
  }: {
    filePath: string;
    branch: string;
  }): Promise<string | undefined> {
    let shaFile: string | undefined;
    try {
      const { data: contentRes } = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: filePath,
        ref: branch,
      });
      if (Array.isArray(contentRes)) {
        shaFile = contentRes[1].sha;
      } else {
        shaFile = contentRes.sha;
      }
    } catch (e) {
      console.log('File does not exist');
    }
    if (shaFile) {
      console.log('File exist, update it');
    }
    return shaFile;
  }

  async #createFileOrUpdateInBranch({
    filePath,
    fileContent,
    branch,
    message,
  }: {
    filePath: string;
    fileContent: string;
    branch: string;
    message: string;
  }): Promise<void> {
    const shaFile = await this.#getShaFile({ filePath, branch });
    // GET SHA if file exist
    await this.octokit.rest.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path: filePath,
      content: Buffer.from(fileContent).toString('base64'),
      message: message,
      sha: shaFile,
      branch,
    });
  }

  async #createPullRequestFromBranch({
    title,
    body,
    head,
    base,
  }: {
    title: string;
    body?: string;
    head: string;
    base: string;
  }): Promise<void> {
    await this.octokit.rest.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      head,
      base,
    });
  }

  async #branchExist(branch: string): Promise<boolean> {
    try {
      await this.#getBranchRef(branch);
      return true;
    } catch (e) {
      return false;
    }
  }

  async #pullRequestExistForBranch(branch: string): Promise<boolean> {
    const { data: prList } = await this.octokit.rest.pulls.list({
      owner: this.owner,
      repo: this.repo,
      state: 'open',
      head: `${this.owner}:${branch}`,
    });
    return prList.length > 0;
  }
}
