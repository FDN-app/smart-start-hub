import type { Tarea } from "@/types";
import { readJSON, writeJSON, uid } from "./baseStorage";
const KEY = "tareas";
export const tareasStorage = {
  list(): Tarea[] {
    return readJSON<Tarea[]>(KEY, []);
  },
  saveAll(items: Tarea[]) {
    writeJSON(KEY, items);
  },
  add(text: string): Tarea {
    const items = this.list();
    const t: Tarea = { id: uid(), text, done: false, createdAt: Date.now() };
    items.unshift(t);
    this.saveAll(items);
    return t;
  },
  toggle(id: string) {
    this.saveAll(this.list().map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  },
  remove(id: string) {
    this.saveAll(this.list().filter((t) => t.id !== id));
  },
};