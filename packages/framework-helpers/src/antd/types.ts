import { z } from 'zod';

export const schemaAntd = z.object({
  token: z.record(z.string(), z.string()),
});

export type AntdConfig = z.infer<typeof schemaAntd>;
