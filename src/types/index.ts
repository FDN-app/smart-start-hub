export interface Workspace {
  id: string;
  name: string;
}

export interface Categoria {
  id: string;
  name: string;
  order: number;
  collapsed?: boolean;
}

export interface Acceso {
  id: string;
  name: string;
  url: string;
  domain: string;
  categoriaId: string;
  workspaceId: string | "ambos";
  order: number;
  clicks: number;
  lastClickAt?: number;
  alias?: string;
}

export type HistorialTipo = "acceso" | "busqueda";

export interface HistorialItem {
  id: string;
  tipo: HistorialTipo;
  label: string;
  url?: string;
  categoriaId?: string;
  query?: string;
  at: number;
}

export interface Tarea {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

export interface AppConfig {
  theme: "dark" | "light";
  accentColor: string;
  ubicacionClima: string;
  fondo: { tipo: "solido" | "gradiente" | "imagen"; valor: string };
  searchOnEnter: "google" | "duckduckgo";
  activeWorkspaceId: string;
}