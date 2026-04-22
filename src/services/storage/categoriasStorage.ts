import type { Categoria } from "@/types";
import { defaultCategorias } from "@/data/mockData";
import { readJSON, writeJSON, uid } from "./baseStorage";

const KEY = "categorias";

export const categoriasStorage = {
  list(): Categoria[] {
    return readJSON<Categoria[]>(KEY, defaultCategorias);
  },
  saveAll(items: Categoria[]) {
    writeJSON(KEY, items);
  },
  add(name: string): Categoria {
    const items = this.list();
    const c: Categoria = { id: uid(), name, order: items.length };
    items.push(c);
    this.saveAll(items);
    return c;
  },
  update(id: string, patch: Partial<Categoria>) {
    this.saveAll(this.list().map((c) => (c.id === id ? { ...c, ...patch } : c)));
  },
  remove(id: string) {
    this.saveAll(this.list().filter((c) => c.id !== id));
  },
};