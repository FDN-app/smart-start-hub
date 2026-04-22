import type { Workspace } from "@/types";
import { defaultWorkspaces } from "@/data/mockData";
import { readJSON, writeJSON, uid } from "./baseStorage";

const KEY = "workspaces";

export const workspacesStorage = {
  list(): Workspace[] {
    return readJSON<Workspace[]>(KEY, defaultWorkspaces);
  },
  saveAll(items: Workspace[]) {
    writeJSON(KEY, items);
  },
  add(name: string): Workspace {
    const items = this.list();
    const w: Workspace = { id: uid(), name };
    items.push(w);
    this.saveAll(items);
    return w;
  },
  update(id: string, name: string) {
    this.saveAll(this.list().map((w) => (w.id === id ? { ...w, name } : w)));
  },
  remove(id: string) {
    this.saveAll(this.list().filter((w) => w.id !== id));
  },
};