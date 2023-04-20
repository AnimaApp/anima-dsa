import { DesignToken } from "@animaapp/token-core";
import { TOKEN_COLOR_TYPE } from "../constants/design-tokens";

export const formatColorToTokenValue = (currentValue: string): DesignToken => ({
  $value: currentValue,
  $type: TOKEN_COLOR_TYPE,
});

