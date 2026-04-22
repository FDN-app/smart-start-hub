import type { AppConfig } from "@/types";
import { defaultConfig } from "@/data/mockData";
import { readJSON, writeJSON } from "./baseStorage";
const KEY = "config";
export const configStorage = {
  get(): AppConfig {
    return { ...defaultConfig, ...readJSON<Partial<AppConfig>>(KEY, {}) };
  },
  set(patch: Partial<AppConfig>) {
    writeJSON(KEY, { ...this.get(), ...patch });
  },
};