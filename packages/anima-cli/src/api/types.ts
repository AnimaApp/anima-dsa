export type Status = 'paused' | 'ready' | 'init' | 'failed';
export type Story = {
  id: string;
  name: string;
  status: Status;
  status_blueprint: Status;
  status_code_snippets: Status;
};
