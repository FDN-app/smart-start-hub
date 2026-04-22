import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Categoria } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categorias: Categoria[];
  defaultCategoriaId?: string;
  workspaceId: string;
  onCreate: (data: { name: string; url: string; categoriaId: string; workspaceId: string }) => void;
}

export function AddAccesoModal({
  open,
  onOpenChange,
  categorias,
  defaultCategoriaId,
  workspaceId,
  onCreate,
}: Props) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [categoriaId, setCategoriaId] = useState(defaultCategoriaId ?? categorias[0]?.id ?? "");
  const [scope, setScope] = useState<string>(workspaceId);

  const submit = () => {
    if (!name.trim() || !url.trim()) return;
    let normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) normalized = "https://" + normalized;
    onCreate({ name: name.trim(), url: normalized, categoriaId, workspaceId: scope });
    setName("");
    setUrl("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo acceso</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="https://ejemplo.com" value={url} onChange={(e) => setUrl(e.target.value)} />
          <select
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option value={workspaceId}>Solo este workspace</option>
            <option value="ambos">Ambos workspaces</option>
          </select>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={submit}>
              Crear
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}