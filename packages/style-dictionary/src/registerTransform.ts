import { Core } from "style-dictionary";
import { animaJSONParser } from "./parsers";

export const registerAnima = (styleDictionary: Core) => {
  styleDictionary.registerParser(animaJSONParser);
};
