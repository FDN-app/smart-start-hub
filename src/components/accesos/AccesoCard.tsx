import { faviconFor } from "@/data/mockData";
import type { Acceso } from "@/types";
import { openAcceso } from "@/lib/openAcceso";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  acceso: Acceso;
  index?: number;
  onDelete?: (id: string) => void;
}

export function AccesoCard({ acceso, index, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: acceso.id,
  });
  const [hover, setHover] = useState(false);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        e.preventDefault();
        openAcceso(acceso);
      }}
      className="group relative flex cursor-pointer items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-2 text-left transition-colors hover:border-primary/40 hover:bg-accent"
      title={acceso.url}
    >
      <img
        src={faviconFor(acceso.domain)}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 rounded"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium leading-tight text-foreground">
          {acceso.name}
        </div>
        <div className="truncate text-[11px] leading-tight text-muted-foreground">
          {acceso.domain}
        </div>
      </div>
      {typeof index === "number" && index < 9 && (
        <kbd className="hidden rounded border border-border bg-muted px-1 text-[10px] text-muted-foreground group-hover:inline">
          {index + 1}
        </kbd>
      )}
      {hover && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(acceso.id);
          }}
          className="absolute right-1 top-1 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          aria-label="Eliminar"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}