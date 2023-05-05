import { type DesignToken, type DesignTokenAlias, type DesignTokenMap } from "@animaapp/token-core";
import { type DesignTokenValue } from "@animaapp/token-core/dist/types/value";

// we are not using the one from token-core because we want to keep token-core as dev dep for now
export const isDesignToken = (value: unknown): value is DesignToken => {
  if (typeof value === 'object' && value !== null && '$value' in value) {
    return true;
  }
  return false;
};

export const isTokenValueAlias = (value: DesignTokenValue): value is DesignTokenAlias => typeof value === 'string' && value.startsWith('{');

export const resolveAlias = (designTokens: DesignTokenMap, aliasValue: DesignTokenAlias): DesignToken => {
  const newValue = get(designTokens, aliasValue.slice(1, -1));
  if (!isDesignToken(newValue)) {
    throw new Error(`Unexpected value in design tokens json file for alias value = ${aliasValue}, alias not found`);
  }
  return newValue;
}

export const get = (obj: object, path: string) => {
  const travel = () =>
    path
      .split('.')
      .reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (res: { [key: string]: any }, key) => {
          if (res != null) {
            return res[key]
          } else {
            throw new Error("Key not found");
          }
        },
        obj,
      );
  try {
    const result = travel();
    return result;
  } catch (e) {
    console.error(e);
    return undefined;
  };
};
