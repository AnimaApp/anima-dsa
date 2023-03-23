export interface TokenValue {
  value: string;
  type: 'color';
}

export type DSTokenTheme = Record<string, TokenValue>;
