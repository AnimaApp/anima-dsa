import { AntdConverter } from './antd';
import { TailwindConverter } from './tailwind';

const converterMap = {
  tailwind: new TailwindConverter(),
  antd: new AntdConverter(),
} as const;

export const frameworks = ['tailwind', 'antd'] as const; // TODO better binding with the converterMap
export type FrameworkList = typeof frameworks[number];

export const getConverter = <T extends FrameworkList>(framework: T): typeof converterMap[T] => {
  return converterMap[framework];
};
