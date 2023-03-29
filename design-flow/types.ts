export interface WriteRequestParams {
  filePath: string;
  newfileContent: string;
  title: string;
  description?: string;
  baseBranch: string;
  newBranch: string;
}

export interface Request {
  id: string;
  title: string;
}

export interface IRepo {
  writeRequest(args: WriteRequestParams): Promise<void>;
  getRequests(): Promise<Request[]>;
}
