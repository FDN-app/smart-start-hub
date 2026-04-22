import { Input } from "@/components/ui/input";
import { historialStorage } from "@/services/storage/historialStorage";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/historial")({
  head: () => ({
    meta: [
      { title: "Historial — Pestaña" },
      { name: "description", content: "Historial de accesos y búsquedas." },
    ],
  }),
  component: HistorialPage,
});

function HistorialPage() {
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<"all" | "acceso" | "busqueda">("all");
  const items = historialStorage.list();

  const filtered = useMemo(() => {
    return items.filter((h) => {
      if (tipo !== "all" && h.tipo !== tipo) return false;
      if (q.trim() && !h.label.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [items, q, tipo]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-2 backdrop-blur">
        <Link to="/" className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
        <h1 className="text-[14px] font-semibold">Historial</h1>
      </header>
      <div className="mx-auto max-w-3xl p-4">
        <div className="mb-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-8" placeholder="Buscar en historial" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select
            className="rounded-md border border-border bg-background px-2 text-sm"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "all" | "acceso" | "busqueda")}
          >
            <option value="all">Todos</option>
            <option value="acceso">Accesos</option>
            <option value="busqueda">Búsquedas</option>
          </select>
        </div>
        <ul className="divide-y divide-border rounded-md border border-border">
          {filtered.map((h) => (
            <li key={h.id} className="flex items-center justify-between px-3 py-2 text-[13px]">
              <div className="min-w-0 flex-1">
                <div className="truncate">{h.label}</div>
                <div className="text-[11px] text-muted-foreground">
                  {new Date(h.at).toLocaleString("es-AR")} · {h.tipo}
                </div>
              </div>
              {h.url && (
                <a
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-[13px] text-muted-foreground">
              Sin actividad.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}