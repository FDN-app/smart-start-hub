import { BuscadorUnificado, type BuscadorHandle } from "@/components/buscador/BuscadorUnificado";
import type { Acceso, Workspace } from "@/types";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Clock, Layers, Moon, Settings as SettingsIcon, Sun } from "lucide-react";
import { forwardRef, useState } from "react";

interface Props {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onChangeWorkspace: (id: string) => void;
  accesos: Acceso[];
  themeIsDark: boolean;
  onToggleTheme: () => void;
}

export const Header = forwardRef<BuscadorHandle, Props>(function Header(
  { workspaces, activeWorkspaceId, onChangeWorkspace, accesos, themeIsDark, onToggleTheme },
  ref,
) {
  const [wsOpen, setWsOpen] = useState(false);
  const active = workspaces.find((w) => w.id === activeWorkspaceId);

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-2 backdrop-blur">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-1.5 text-[14px] font-semibold">
          <Layers className="h-4 w-4 text-primary" />
          <span>Pestaña</span>
        </Link>
        <div className="relative">
          <button
            onClick={() => setWsOpen((v) => !v)}
            onBlur={() => setTimeout(() => setWsOpen(false), 150)}
            className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[12px] hover:bg-accent"
          >
            {active?.name ?? "Workspace"}
            <ChevronDown className="h-3 w-3" />
          </button>
          {wsOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-md border border-border bg-popover shadow-lg">
              {workspaces.map((w) => (
                <button
                  key={w.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChangeWorkspace(w.id);
                    setWsOpen(false);
                  }}
                  className={`flex w-full items-center px-3 py-1.5 text-left text-[13px] hover:bg-accent ${
                    w.id === activeWorkspaceId ? "font-medium text-primary" : ""
                  }`}
                >
                  {w.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 justify-center">
        <BuscadorUnificado ref={ref} accesos={accesos} />
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleTheme}
          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Toggle theme"
        >
          {themeIsDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <Link
          to="/historial"
          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Historial"
        >
          <Clock className="h-4 w-4" />
        </Link>
        <Link
          to="/settings"
          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Settings"
        >
          <SettingsIcon className="h-4 w-4" />
        </Link>
        <div className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
          ME
        </div>
      </div>
    </header>
  );
});