import type { FrameworkList } from ".";
import { DSTokenTheme } from "../constants/types";

export interface IConverter {
  framework: FrameworkList;
  loadConfig(configPath: string): Promise<unknown>;
  convertColorToDS(): Promise<DSTokenTheme>;
  sampleConfigFile(): string;
}
