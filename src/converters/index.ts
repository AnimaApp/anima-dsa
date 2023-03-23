import { TailwindConverter } from './tailwind';

const converterMap = {
  tailwind: new TailwindConverter(),
} as const;

export const frameworks = ['tailwind'] as const; // TODO better binding with the converterMap
export type FrameworkList = typeof frameworks[number];

export const getConverter = <T extends FrameworkList>(framework: T): typeof converterMap[T] => {
  return converterMap[framework];
};
