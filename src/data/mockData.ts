import type { Acceso, AppConfig, Categoria, Workspace } from "@/types";

export const defaultWorkspaces: Workspace[] = [
  { id: "ws_trabajo", name: "Trabajo" },
  { id: "ws_personal", name: "Personal" },
];

export const defaultCategorias: Categoria[] = [
  { id: "cat_trabajo", name: "Trabajo", order: 0 },
  { id: "cat_redes", name: "Redes", order: 1 },
  { id: "cat_herramientas", name: "Herramientas", order: 2 },
  { id: "cat_otros", name: "Otros", order: 3 },
];

const mk = (
  id: string,
  name: string,
  url: string,
  categoriaId: string,
  order: number,
  workspaceId: string | "ambos" = "ambos",
): Acceso => ({
  id,
  name,
  url,
  domain: new URL(url).hostname.replace(/^www\./, ""),
  categoriaId,
  workspaceId,
  order,
  clicks: 0,
});

export const defaultAccesos: Acceso[] = [
  mk("a1", "Gmail", "https://mail.google.com", "cat_trabajo", 0, "ws_trabajo"),
  mk("a2", "Calendar", "https://calendar.google.com", "cat_trabajo", 1, "ws_trabajo"),
  mk("a3", "Drive", "https://drive.google.com", "cat_trabajo", 2, "ws_trabajo"),
  mk("a4", "Notion", "https://notion.so", "cat_trabajo", 3, "ambos"),
  mk("a5", "GitHub", "https://github.com", "cat_herramientas", 0, "ws_trabajo"),
  mk("a6", "Vercel", "https://vercel.com", "cat_herramientas", 1, "ws_trabajo"),
  mk("a7", "ChatGPT", "https://chat.openai.com", "cat_herramientas", 2, "ambos"),
  mk("a8", "Claude", "https://claude.ai", "cat_herramientas", 3, "ambos"),
  mk("a9", "Twitter", "https://twitter.com", "cat_redes", 0, "ws_personal"),
  mk("a10", "Reddit", "https://reddit.com", "cat_redes", 1, "ws_personal"),
  mk("a11", "YouTube", "https://youtube.com", "cat_redes", 2, "ambos"),
  mk("a12", "Mercado Libre", "https://mercadolibre.com.ar", "cat_otros", 0, "ws_personal"),
];

export const defaultConfig: AppConfig = {
  theme: "dark",
  accentColor: "#5B5BD6",
  ubicacionClima: "Ituzaingó, AR",
  fondo: { tipo: "solido", valor: "" },
  searchOnEnter: "google",
  activeWorkspaceId: "ws_trabajo",
};

export function faviconFor(domain: string, size = 64) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}