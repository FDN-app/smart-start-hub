import type { Acceso, Categoria } from "@/types";
import { AccesoCard } from "./AccesoCard";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";

interface Props {
  categoria: Categoria;
  accesos: Acceso[];
  startIndex: number;
  onAdd: (categoriaId: string) => void;
  onReorder: (categoriaId: string, ordered: Acceso[]) => void;
  onDelete: (id: string) => void;
}

export function CategoriaSection({
  categoria,
  accesos,
  startIndex,
  onAdd,
  onReorder,
  onDelete,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = accesos.findIndex((a) => a.id === active.id);
    const newIdx = accesos.findIndex((a) => a.id === over.id);
    onReorder(categoria.id, arrayMove(accesos, oldIdx, newIdx));
  };

  return (
    <section className="mb-5">
      <header className="mb-2 flex items-center gap-1.5">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-1 rounded px-1 py-0.5 text-[13px] font-semibold text-foreground hover:bg-accent"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {categoria.name}
          <span className="ml-1 text-[11px] font-normal text-muted-foreground">{accesos.length}</span>
        </button>
        <button
          onClick={() => onAdd(categoria.id)}
          className="ml-1 rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Agregar acceso"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </header>
      {!collapsed && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={accesos.map((a) => a.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {accesos.map((a, i) => (
                <AccesoCard key={a.id} acceso={a} index={startIndex + i} onDelete={onDelete} />
              ))}
              {accesos.length === 0 && (
                <button
                  onClick={() => onAdd(categoria.id)}
                  className="col-span-full rounded-md border border-dashed border-border px-3 py-4 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
                >
                  + Agregar acceso a {categoria.name}
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}