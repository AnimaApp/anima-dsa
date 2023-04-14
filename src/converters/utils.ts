import { TOKEN_COLOR_TYPE } from "../constants/design-tokens";
import type { TokenValue } from "../constants/types";

export const formatColorToTokenValue = (currentValue: string): TokenValue => ({
  $value: currentValue,
  $type: TOKEN_COLOR_TYPE,
});

