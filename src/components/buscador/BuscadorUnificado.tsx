import { faviconFor } from "@/data/mockData";
import { historialStorage } from "@/services/storage/historialStorage";
import type { Acceso } from "@/types";
import { openAcceso, openSearch } from "@/lib/openAcceso";
import { Search } from "lucide-react";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";

export interface BuscadorHandle {
  focus: () => void;
}

interface Props {
  accesos: Acceso[];
}

export const BuscadorUnificado = forwardRef<BuscadorHandle, Props>(({ accesos }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  const command = useMemo(() => {
    if (!q.startsWith("/")) return null;
    const [first, ...rest] = q.slice(1).split(" ");
    if (!first) return null;
    const target = accesos.find(
      (a) =>
        a.name.toLowerCase().startsWith(first.toLowerCase()) ||
        a.domain.toLowerCase().startsWith(first.toLowerCase()),
    );
    return target ? { acceso: target, query: rest.join(" ") } : null;
  }, [q, accesos]);

  const matches = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return { acc: [] as Acceso[], hist: [] as { label: string; url?: string }[] };
    const acc = accesos
      .filter((a) => a.name.toLowerCase().includes(term) || a.domain.toLowerCase().includes(term))
      .slice(0, 6);
    const hist = historialStorage
      .list()
      .filter((h) => h.label.toLowerCase().includes(term))
      .slice(0, 4)
      .map((h) => ({ label: h.label, url: h.url }));
    return { acc, hist };
  }, [q, accesos]);

  const totalItems = matches.acc.length + matches.hist.length;

  const submit = () => {
    if (command) {
      openAcceso(command.acceso, { query: command.query });
    } else if (matches.acc.length > 0 && activeIdx < matches.acc.length) {
      openAcceso(matches.acc[activeIdx]);
    } else if (q.trim()) {
      openSearch(q.trim());
    }
    setQ("");
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActiveIdx(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIdx((i) => Math.min(i + 1, totalItems - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIdx((i) => Math.max(i - 1, 0));
            }
          }}
          placeholder="Buscar accesos, historial o presioná Enter para Google"
          className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-16 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
        />
        <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
          /
        </kbd>
      </div>

      {open && (q.trim() || command) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
          {command && (
            <div className="border-b border-border bg-muted/40 px-3 py-2 text-[12px]">
              <span className="text-muted-foreground">Comando:</span> abrir{" "}
              <span className="font-medium">{command.acceso.name}</span>
              {command.query && (
                <>
                  {" "}buscando <span className="font-medium">"{command.query}"</span>
                </>
              )}
            </div>
          )}
          {matches.acc.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                Accesos
              </div>
              {matches.acc.map((a, i) => (
                <button
                  key={a.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    openAcceso(a);
                    setQ("");
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] ${
                    i === activeIdx ? "bg-accent" : "hover:bg-accent"
                  }`}
                >
                  <img src={faviconFor(a.domain)} alt="" className="h-4 w-4 rounded" />
                  <span className="flex-1 truncate">{a.name}</span>
                  <span className="truncate text-[11px] text-muted-foreground">{a.domain}</span>
                </button>
              ))}
            </div>
          )}
          {matches.hist.length > 0 && (
            <div className="border-t border-border py-1">
              <div className="px-3 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                Historial
              </div>
              {matches.hist.map((h, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (h.url) window.open(h.url, "_blank", "noopener,noreferrer");
                    setQ("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-accent"
                >
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="flex-1 truncate">{h.label}</span>
                </button>
              ))}
            </div>
          )}
          <div className="border-t border-border bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground">
            ↵ buscar en Google · ↑↓ navegar · Esc cerrar
          </div>
        </div>
      )}
    </div>
  );
});
BuscadorUnificado.displayName = "BuscadorUnificado";