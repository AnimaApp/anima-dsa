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

