export type CreateBranchReturn = {
  ref: string;
  node_id: string;
  url: string;
  object: { type: string; sha: string; url: string };
};

export type GetBranchRefReturn = {
  ref: string;
  node_id: string;
  url: string;
  object: { type: string; sha: string; url: string };
};

export type GetFileReturn =
  | {
      type: 'file';
      encoding: string;
      size: number;
      name: string;
      path: string;
      content: string;
      sha: string;
      url: string;
      git_url: string | null;
      html_url: string | null;
      download_url: string | null;
      _links: { git: string | null; html: string | null; self: string };
      target?: string | undefined;
      submodule_git_url?: string | undefined;
    }
  | {
      type: 'symlink';
      target: string;
      size: number;
      name: string;
      path: string;
      sha: string;
      url: string;
      git_url: string | null;
      html_url: string | null;
      download_url: string | null;
      _links: { git: string | null; html: string | null; self: string };
    }
  | {
      type: 'submodule';
      submodule_git_url: string;
      size: number;
      name: string;
      path: string;
      sha: string;
      url: string;
      git_url: string | null;
      html_url: string | null;
      download_url: string | null;
      _links: { git: string | null; html: string | null; self: string };
    };
