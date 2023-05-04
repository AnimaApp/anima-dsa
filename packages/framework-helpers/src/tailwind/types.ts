import {z} from 'zod';

export const schemaTailwind = z.object({
  theme: z.object({
    colors: z.record(z.string(), z.any()),
    extend: z.record(z.string(), z.any()).optional(),
  }),
});

export type TailwindConfig = z.infer<typeof schemaTailwind>;
