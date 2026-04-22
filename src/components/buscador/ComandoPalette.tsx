import { Dialog, DialogContent } from "@/components/ui/dialog";
import { faviconFor } from "@/data/mockData";
import type { Acceso } from "@/types";
import { openAcceso } from "@/lib/openAcceso";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Moon, Settings as SettingsIcon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  run: () => void;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  accesos: Acceso[];
  onToggleTheme: () => void;
  themeIsDark: boolean;
}

export function ComandoPalette({ open, onOpenChange, accesos, onToggleTheme, themeIsDark }: Props) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQ("");
      setIdx(0);
    }
  }, [open]);

  const items = useMemo<CommandItem[]>(() => {
    const base: CommandItem[] = [
      {
        id: "cmd_settings",
        label: "Ir a Configuración",
        icon: <SettingsIcon className="h-4 w-4" />,
        run: () => navigate({ to: "/settings" }),
      },
      {
        id: "cmd_historial",
        label: "Ir a Historial",
        icon: <Clock className="h-4 w-4" />,
        run: () => navigate({ to: "/historial" }),
      },
      {
        id: "cmd_theme",
        label: themeIsDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro",
        icon: themeIsDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
        run: onToggleTheme,
      },
      ...accesos.map((a) => ({
        id: a.id,
        label: `Abrir ${a.name}`,
        hint: a.domain,
        icon: <img src={faviconFor(a.domain)} alt="" className="h-4 w-4 rounded" />,
        run: () => openAcceso(a),
      })),
    ];
    if (!q.trim()) return base.slice(0, 30);
    const term = q.toLowerCase();
    return base.filter((c) => c.label.toLowerCase().includes(term)).slice(0, 30);
  }, [q, accesos, navigate, onToggleTheme, themeIsDark]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setIdx(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIdx((i) => Math.min(i + 1, items.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setIdx((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              items[idx]?.run();
              onOpenChange(false);
            }
          }}
          placeholder="Escribí un comando o acceso…"
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <ul className="max-h-80 overflow-y-auto py-1">
          {items.map((it, i) => (
            <li key={it.id}>
              <button
                onMouseEnter={() => setIdx(i)}
                onClick={() => {
                  it.run();
                  onOpenChange(false);
                }}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] ${
                  i === idx ? "bg-accent" : ""
                }`}
              >
                {it.icon}
                <span className="flex-1 truncate">{it.label}</span>
                {it.hint && <span className="text-[11px] text-muted-foreground">{it.hint}</span>}
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-4 py-6 text-center text-[13px] text-muted-foreground">
              Sin resultados.
            </li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}