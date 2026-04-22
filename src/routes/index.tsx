import { CategoriaSection } from "@/components/accesos/CategoriaSection";
import { AddAccesoModal } from "@/components/accesos/AddAccesoModal";
import { ComandoPalette } from "@/components/buscador/ComandoPalette";
import type { BuscadorHandle } from "@/components/buscador/BuscadorUnificado";
import { InteligenciaBand } from "@/components/inteligencia/InteligenciaBand";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTheme } from "@/hooks/useTheme";
import { useWorkspace } from "@/hooks/useWorkspace";
import { openAcceso } from "@/lib/openAcceso";
import { accesosStorage } from "@/services/storage/accesosStorage";
import { categoriasStorage } from "@/services/storage/categoriasStorage";
import { configStorage } from "@/services/storage/configStorage";
import type { Acceso, Categoria } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { workspaces, activeId, setActiveId } = useWorkspace();
  const [accesos, setAccesos] = useState<Acceso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addCatId, setAddCatId] = useState<string | undefined>();
  const buscadorRef = useRef<BuscadorHandle>(null);
  const config = configStorage.get();

  useEffect(() => {
    setAccesos(accesosStorage.list());
    setCategorias(categoriasStorage.list());
  }, []);

  const refreshAccesos = () => setAccesos(accesosStorage.list());

  const visibleAccesos = useMemo(
    () => accesos.filter((a) => a.workspaceId === activeId || a.workspaceId === "ambos"),
    [accesos, activeId],
  );

  const recientes = useMemo(
    () =>
      [...visibleAccesos]
        .filter((a) => a.lastClickAt)
        .sort((a, b) => (b.lastClickAt ?? 0) - (a.lastClickAt ?? 0))
        .slice(0, 8),
    [visibleAccesos],
  );
  const masUsados = useMemo(
    () => [...visibleAccesos].filter((a) => a.clicks > 0).sort((a, b) => b.clicks - a.clicks).slice(0, 5),
    [visibleAccesos],
  );

  // focus search on mount
  useEffect(() => {
    buscadorRef.current?.focus();
  }, []);

  useKeyboardShortcuts({
    onSlash: () => buscadorRef.current?.focus(),
    onCmdK: () => setPaletteOpen(true),
    onEsc: () => setPaletteOpen(false),
    onDigit: (n) => {
      const target = visibleAccesos[n - 1];
      if (target) openAcceso(target);
    },
  });

  // group by category preserving order
  const sortedCategorias = [...categorias].sort((a, b) => a.order - b.order);

  const handleReorder = (categoriaId: string, ordered: Acceso[]) => {
    const updated = ordered.map((a, i) => ({ ...a, order: i }));
    const others = accesos.filter((a) => a.categoriaId !== categoriaId);
    const next = [...others, ...updated];
    accesosStorage.saveAll(next);
    setAccesos(next);
  };

  const handleDelete = (id: string) => {
    accesosStorage.remove(id);
    refreshAccesos();
  };

  let runningIndex = 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header
        ref={buscadorRef}
        workspaces={workspaces}
        activeWorkspaceId={activeId}
        onChangeWorkspace={setActiveId}
        accesos={visibleAccesos}
        themeIsDark={theme === "dark"}
        onToggleTheme={toggleTheme}
      />
      <InteligenciaBand recientes={recientes} masUsados={masUsados} />
      <div className="flex flex-1">
        <main className="flex-1 px-4 py-4">
          {sortedCategorias.map((cat) => {
            const items = visibleAccesos
              .filter((a) => a.categoriaId === cat.id)
              .sort((a, b) => a.order - b.order);
            const startIdx = runningIndex;
            runningIndex += items.length;
            return (
              <CategoriaSection
                key={cat.id}
                categoria={cat}
                accesos={items}
                startIndex={startIdx}
                onAdd={(id) => {
                  setAddCatId(id);
                  setAddOpen(true);
                }}
                onReorder={handleReorder}
                onDelete={handleDelete}
              />
            );
          })}
        </main>
        <Sidebar ubicacion={config.ubicacionClima} />
      </div>

      <ComandoPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        accesos={visibleAccesos}
        onToggleTheme={toggleTheme}
        themeIsDark={theme === "dark"}
      />
      <AddAccesoModal
        open={addOpen}
        onOpenChange={setAddOpen}
        categorias={categorias}
        defaultCategoriaId={addCatId}
        workspaceId={activeId}
        onCreate={(data) => {
          accesosStorage.add({ ...data, domain: extractDomain(data.url) });
          refreshAccesos();
        }}
      />
    </div>
  );
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
