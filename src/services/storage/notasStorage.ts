import { readJSON, writeJSON } from "./baseStorage";
const KEY = "notas";
export const notasStorage = {
  get(): string {
    return readJSON<string>(KEY, "");
  },
  set(value: string) {
    writeJSON(KEY, value);
  },
};