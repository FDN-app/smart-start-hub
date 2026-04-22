import { notasStorage } from "@/services/storage/notasStorage";
import { useEffect, useRef, useState } from "react";

export function NotasWidget() {
  const [value, setValue] = useState("");
  const t = useRef<number | null>(null);

  useEffect(() => {
    setValue(notasStorage.get());
  }, []);

  useEffect(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => notasStorage.set(value), 400);
    return () => {
      if (t.current) window.clearTimeout(t.current);
    };
  }, [value]);

  return (
    <div className="rounded-md border border-border bg-card p-2">
      <div className="mb-1 px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Notas
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Escribí algo… se guarda solo."
        className="h-32 w-full resize-none rounded bg-transparent px-1 text-[13px] outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}