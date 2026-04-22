import { Cloud, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export function ClimaWidget({ ubicacion }: { ubicacion: string }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(i);
  }, []);
  const time = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short" });
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-semibold tabular-nums">{time}</div>
        <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
          <Cloud className="h-3.5 w-3.5" /> 18°
        </div>
      </div>
      <div className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="capitalize">{date}</span>
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ubicacion}</span>
      </div>
    </div>
  );
}