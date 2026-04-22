import type { HistorialItem } from "@/types";
import { readJSON, writeJSON, uid } from "./baseStorage";

const KEY = "historial";
const MAX = 500;

export const historialStorage = {
  list(): HistorialItem[] {
    return readJSON<HistorialItem[]>(KEY, []);
  },
  add(item: Omit<HistorialItem, "id" | "at">) {
    const items = this.list();
    items.unshift({ ...item, id: uid(), at: Date.now() });
    writeJSON(KEY, items.slice(0, MAX));
  },
  clear() {
    writeJSON(KEY, []);
  },
};