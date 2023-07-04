import { z } from 'zod';

export const schemaAntd = z.object({
  token: z.record(z.string(), z.string().or(z.number())),
  components: z.record(z.string(), z.any()),
});

export type AntdConfig = z.infer<typeof schemaAntd>;
