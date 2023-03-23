import type { FrameworkList } from ".";
import { DesignTokenTheme } from "../constants/types";

export interface IConverter {
  framework: FrameworkList;
  loadConfig(configPath: string): Promise<unknown>;
  convertColorToDesignTokens(): Promise<DesignTokenTheme>;
  sampleConfigFile(): string;
}
