import { ClimaWidget } from "@/components/productividad/ClimaWidget";
import { NotasWidget } from "@/components/productividad/NotasWidget";
import { TareasWidget } from "@/components/productividad/TareasWidget";

export function Sidebar({ ubicacion }: { ubicacion: string }) {
  return (
    <aside className="hidden w-[280px] shrink-0 space-y-2 border-l border-border bg-muted/20 p-3 lg:block">
      <ClimaWidget ubicacion={ubicacion} />
      <NotasWidget />
      <TareasWidget />
    </aside>
  );
}