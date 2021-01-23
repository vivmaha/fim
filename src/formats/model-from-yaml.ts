import { safeLoad } from "js-yaml";
import { createFimModelFromJson } from "./model-from-json";
import { FimModelJson } from "./model-json";
import { FimModel } from "../model";

export const createFimModelFromYaml = (yaml: string): FimModel => {
  const json = safeLoad(yaml);
  if (typeof json !== "object") {
    throw new Error("yaml must be an object.");
  }
  return createFimModelFromJson(json as FimModelJson);
};
