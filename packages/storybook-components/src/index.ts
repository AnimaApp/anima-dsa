import { convert, themes } from '@storybook/theming';

export const themeDark = convert(themes.dark);
export const themeLight = convert(themes.light);
export { ArgsTable } from './components/ArgsTable';
export * from './types';
