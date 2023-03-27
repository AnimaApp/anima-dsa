import { TOKEN_COLOR_TYPE } from '.';

interface TokenColorValue {
  $value: string;
  $type: typeof TOKEN_COLOR_TYPE;
}

export type TokenValue = TokenColorValue;

export type DesignTokenTheme = Record<string, TokenValue>;
