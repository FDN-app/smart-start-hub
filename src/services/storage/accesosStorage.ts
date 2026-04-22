import type { Acceso } from "@/types";
import { defaultAccesos } from "@/data/mockData";
import { readJSON, writeJSON, uid } from "./baseStorage";

const KEY = "accesos";

export const accesosStorage = {
  list(): Acceso[] {
    return readJSON<Acceso[]>(KEY, defaultAccesos);
  },
  saveAll(items: Acceso[]) {
    writeJSON(KEY, items);
  },
  add(input: Omit<Acceso, "id" | "clicks" | "order"> & { order?: number }): Acceso {
    const items = this.list();
    const order =
      input.order ??
      (items.filter((a) => a.categoriaId === input.categoriaId).length || 0);
    const item: Acceso = { ...input, id: uid(), clicks: 0, order };
    items.push(item);
    this.saveAll(items);
    return item;
  },
  update(id: string, patch: Partial<Acceso>) {
    const items = this.list().map((a) => (a.id === id ? { ...a, ...patch } : a));
    this.saveAll(items);
  },
  remove(id: string) {
    this.saveAll(this.list().filter((a) => a.id !== id));
  },
  registerClick(id: string) {
    const items = this.list().map((a) =>
      a.id === id ? { ...a, clicks: a.clicks + 1, lastClickAt: Date.now() } : a,
    );
    this.saveAll(items);
  },
};