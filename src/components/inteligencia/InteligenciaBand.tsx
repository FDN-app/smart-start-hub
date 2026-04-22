import { faviconFor } from "@/data/mockData";
import type { Acceso } from "@/types";
import { openAcceso } from "@/lib/openAcceso";
import { Clock, TrendingUp } from "lucide-react";

interface Props {
  recientes: Acceso[];
  masUsados: Acceso[];
}

function MiniCard({ a }: { a: Acceso }) {
  return (
    <button
      onClick={() => openAcceso(a)}
      className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1.5 text-[12px] hover:border-primary/40 hover:bg-accent"
      title={a.url}
    >
      <img src={faviconFor(a.domain)} alt="" className="h-4 w-4 rounded" loading="lazy" />
      <span className="max-w-[110px] truncate">{a.name}</span>
    </button>
  );
}

export function InteligenciaBand({ recientes, masUsados }: Props) {
  if (recientes.length === 0 && masUsados.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-border bg-muted/30 px-4 py-3 lg:grid-cols-2">
      <div>
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <Clock className="h-3 w-3" /> Recientes
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {recientes.length === 0 ? (
            <span className="text-[12px] text-muted-foreground">Sin actividad aún.</span>
          ) : (
            recientes.map((a) => <MiniCard key={a.id} a={a} />)
          )}
        </div>
      </div>
      <div>
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <TrendingUp className="h-3 w-3" /> Más usados
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {masUsados.length === 0 ? (
            <span className="text-[12px] text-muted-foreground">Empezá a usar la app.</span>
          ) : (
            masUsados.map((a) => <MiniCard key={a.id} a={a} />)
          )}
        </div>
      </div>
    </div>
  );
}