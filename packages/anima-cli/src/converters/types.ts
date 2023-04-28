import { DesignTokenMap } from "@animaapp/token-core";
import type { FrameworkList } from ".";

export interface IConverter {
  framework: FrameworkList;
  loadConfig(configPath: string): Promise<unknown>;
  convertColorToDesignTokens(): Promise<DesignTokenMap>;
  sampleConfigFile(): string;
}
