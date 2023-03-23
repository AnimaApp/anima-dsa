interface TokenColorValue {
  value: string;
  type: 'color';
}

export type TokenValue = TokenColorValue;

export type DSTokenTheme = Record<string, TokenValue>;
