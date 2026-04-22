import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/useTheme";
import { accesosStorage } from "@/services/storage/accesosStorage";
import { categoriasStorage } from "@/services/storage/categoriasStorage";
import { configStorage } from "@/services/storage/configStorage";
import { workspacesStorage } from "@/services/storage/workspacesStorage";
import { clearAll } from "@/services/storage/baseStorage";
import type { Acceso, Categoria, Workspace } from "@/types";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configuración — Pestaña" },
      { name: "description", content: "Configurá tu dashboard personal." },
    ],
  }),
  component: SettingsPage,
});

const tabs = ["General", "Accesos", "Workspaces", "Apariencia", "Datos"] as const;
type Tab = (typeof tabs)[number];

function SettingsPage() {
  const [tab, setTab] = useState<Tab>("General");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-2 backdrop-blur">
        <Link to="/" className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
        <h1 className="text-[14px] font-semibold">Configuración</h1>
      </header>
      <div className="mx-auto flex max-w-5xl gap-6 p-6">
        <nav className="w-44 shrink-0 space-y-0.5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`block w-full rounded px-2 py-1.5 text-left text-[13px] ${
                tab === t ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
        <div className="flex-1">
          {tab === "General" && <GeneralTab />}
          {tab === "Accesos" && <AccesosTab />}
          {tab === "Workspaces" && <WorkspacesTab />}
          {tab === "Apariencia" && <AparienciaTab />}
          {tab === "Datos" && <DatosTab />}
        </div>
      </div>
    </div>
  );
}

function GeneralTab() {
  const [config, setConfig] = useState(configStorage.get());
  const update = (patch: Partial<typeof config>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    configStorage.set(patch);
  };
  return (
    <div className="space-y-4">
      <h2 className="text-[15px] font-semibold">General</h2>
      <div>
        <label className="mb-1 block text-[12px] font-medium text-muted-foreground">Ubicación clima</label>
        <Input value={config.ubicacionClima} onChange={(e) => update({ ubicacionClima: e.target.value })} />
      </div>
      <div>
        <label className="mb-1 block text-[12px] font-medium text-muted-foreground">Buscador por defecto</label>
        <select
          className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
          value={config.searchOnEnter}
          onChange={(e) => update({ searchOnEnter: e.target.value as "google" | "duckduckgo" })}
        >
          <option value="google">Google</option>
          <option value="duckduckgo">DuckDuckGo</option>
        </select>
      </div>
    </div>
  );
}

function AccesosTab() {
  const [items, setItems] = useState<Acceso[]>(accesosStorage.list());
  const refresh = () => setItems(accesosStorage.list());
  return (
    <div>
      <h2 className="mb-3 text-[15px] font-semibold">Accesos ({items.length})</h2>
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-[13px]">
          <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5">Nombre</th>
              <th className="px-2 py-1.5">URL</th>
              <th className="px-2 py-1.5">Clicks</th>
              <th className="px-2 py-1.5"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-2 py-1.5">{a.name}</td>
                <td className="px-2 py-1.5 text-muted-foreground">{a.domain}</td>
                <td className="px-2 py-1.5 tabular-nums">{a.clicks}</td>
                <td className="px-2 py-1.5 text-right">
                  <button
                    onClick={() => {
                      accesosStorage.remove(a.id);
                      refresh();
                    }}
                    className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorkspacesTab() {
  const [items, setItems] = useState<Workspace[]>(workspacesStorage.list());
  const [name, setName] = useState("");
  const refresh = () => setItems(workspacesStorage.list());
  const [cats, setCats] = useState<Categoria[]>(categoriasStorage.list());
  const [catName, setCatName] = useState("");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-[15px] font-semibold">Workspaces</h2>
        <div className="mb-2 flex gap-2">
          <Input placeholder="Nombre nuevo workspace" value={name} onChange={(e) => setName(e.target.value)} />
          <Button
            size="sm"
            onClick={() => {
              if (!name.trim()) return;
              workspacesStorage.add(name.trim());
              setName("");
              refresh();
            }}
          >
            Agregar
          </Button>
        </div>
        <ul className="divide-y divide-border rounded-md border border-border">
          {items.map((w) => (
            <li key={w.id} className="flex items-center justify-between px-3 py-1.5 text-[13px]">
              {w.name}
              <button
                onClick={() => {
                  workspacesStorage.remove(w.id);
                  refresh();
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="mb-3 text-[15px] font-semibold">Categorías</h2>
        <div className="mb-2 flex gap-2">
          <Input placeholder="Nueva categoría" value={catName} onChange={(e) => setCatName(e.target.value)} />
          <Button
            size="sm"
            onClick={() => {
              if (!catName.trim()) return;
              categoriasStorage.add(catName.trim());
              setCatName("");
              setCats(categoriasStorage.list());
            }}
          >
            Agregar
          </Button>
        </div>
        <ul className="divide-y divide-border rounded-md border border-border">
          {cats.map((c) => (
            <li key={c.id} className="flex items-center justify-between px-3 py-1.5 text-[13px]">
              {c.name}
              <button
                onClick={() => {
                  categoriasStorage.remove(c.id);
                  setCats(categoriasStorage.list());
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AparienciaTab() {
  const { theme, toggle } = useTheme();
  return (
    <div className="space-y-4">
      <h2 className="text-[15px] font-semibold">Apariencia</h2>
      <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
        <div>
          <div className="text-[13px] font-medium">Tema</div>
          <div className="text-[11px] text-muted-foreground">Actualmente: {theme}</div>
        </div>
        <Button size="sm" variant="outline" onClick={toggle}>
          Cambiar
        </Button>
      </div>
      <p className="text-[12px] text-muted-foreground">
        Color de acento y fondos personalizados próximamente.
      </p>
    </div>
  );
}

function DatosTab() {
  const exportData = () => {
    const data = {
      accesos: accesosStorage.list(),
      categorias: categoriasStorage.list(),
      workspaces: workspacesStorage.list(),
      config: configStorage.get(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pestana-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      if (data.accesos) accesosStorage.saveAll(data.accesos);
      if (data.categorias) categoriasStorage.saveAll(data.categorias);
      if (data.workspaces) workspacesStorage.saveAll(data.workspaces);
      if (data.config) configStorage.set(data.config);
      alert("Importado.");
    } catch {
      alert("Archivo inválido.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-[15px] font-semibold">Datos</h2>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={exportData}>
          Exportar JSON
        </Button>
        <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs hover:bg-accent">
          Importar JSON
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importData(f);
            }}
          />
        </label>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            if (confirm("¿Borrar todo? Esta acción no se puede deshacer.")) {
              clearAll();
              location.reload();
            }
          }}
        >
          Limpiar todo
        </Button>
      </div>
    </div>
  );
}