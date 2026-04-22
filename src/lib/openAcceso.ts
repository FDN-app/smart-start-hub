import { accesosStorage } from "@/services/storage/accesosStorage";
import { historialStorage } from "@/services/storage/historialStorage";
import type { Acceso } from "@/types";

export function openAcceso(a: Acceso, opts?: { query?: string }) {
  let url = a.url;
  if (opts?.query) {
    // naive: append as ?q= for known engines, otherwise just append
    try {
      const u = new URL(a.url);
      u.searchParams.set("q", opts.query);
      url = u.toString();
    } catch {
      url = a.url + "?q=" + encodeURIComponent(opts.query);
    }
  }
  accesosStorage.registerClick(a.id);
  historialStorage.add({
    tipo: "acceso",
    label: a.name + (opts?.query ? ` · ${opts.query}` : ""),
    url,
    categoriaId: a.categoriaId,
  });
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openSearch(query: string) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  historialStorage.add({ tipo: "busqueda", label: query, url, query });
  window.open(url, "_blank", "noopener,noreferrer");
}