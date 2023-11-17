import { CSSObject, Theme } from '@storybook/theming';
import { transparentize } from 'polished';

export const codeCommon = ({ theme }: { theme: Theme }): CSSObject => ({
  lineHeight: 1,
  margin: '0 2px',
  padding: '3px 5px',
  whiteSpace: 'nowrap',

  borderRadius: 3,
  fontSize: theme.typography.size.s2 - 1,

  border:
    theme.base === 'light'
      ? `1px solid ${theme.color.mediumlight}`
      : `1px solid ${theme.color.darker}`,
  color:
    theme.base === 'light'
      ? transparentize(0.1, theme.color.defaultText)
      : transparentize(0.3, theme.color.defaultText),
  backgroundColor:
    theme.base === 'light' ? theme.color.lighter : theme.color.border,
});
