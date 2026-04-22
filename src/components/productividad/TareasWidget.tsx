import { tareasStorage } from "@/services/storage/tareasStorage";
import type { Tarea } from "@/types";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function TareasWidget() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    setTareas(tareasStorage.list());
  }, []);

  const refresh = () => setTareas(tareasStorage.list());

  const add = () => {
    const t = text.trim();
    if (!t) return;
    tareasStorage.add(t);
    setText("");
    refresh();
  };

  return (
    <div className="rounded-md border border-border bg-card p-2">
      <div className="mb-1 px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Tareas
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        placeholder="Nueva tarea + Enter"
        className="mb-1 w-full rounded border border-border bg-background px-2 py-1 text-[13px] outline-none focus:border-primary/40"
      />
      <ul className="max-h-64 space-y-0.5 overflow-y-auto">
        {tareas.map((t) => (
          <li
            key={t.id}
            className="group flex items-center gap-2 rounded px-1 py-1 text-[13px] hover:bg-accent"
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => {
                tareasStorage.toggle(t.id);
                refresh();
              }}
              className="h-3.5 w-3.5 accent-[var(--primary)]"
            />
            <span className={t.done ? "flex-1 text-muted-foreground line-through" : "flex-1"}>
              {t.text}
            </span>
            <button
              onClick={() => {
                tareasStorage.remove(t.id);
                refresh();
              }}
              className="opacity-0 group-hover:opacity-100"
              aria-label="Eliminar tarea"
            >
              <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
            </button>
          </li>
        ))}
        {tareas.length === 0 && (
          <li className="px-1 py-2 text-[12px] text-muted-foreground">Sin tareas.</li>
        )}
      </ul>
    </div>
  );
}