import type { TokenValue } from "../constants/types";

export const formatColorToTokenValue = (currentValue: string): TokenValue => ({
  value: currentValue,
  type: 'color',
});

