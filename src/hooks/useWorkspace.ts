import { useEffect, useState } from "react";
import { configStorage } from "@/services/storage/configStorage";
import { workspacesStorage } from "@/services/storage/workspacesStorage";
import type { Workspace } from "@/types";

export function useWorkspace() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => workspacesStorage.list());
  const [activeId, setActiveIdState] = useState<string>(() => configStorage.get().activeWorkspaceId);

  useEffect(() => {
    configStorage.set({ activeWorkspaceId: activeId });
  }, [activeId]);

  return {
    workspaces,
    setWorkspaces,
    activeId,
    setActiveId: setActiveIdState,
    active: workspaces.find((w) => w.id === activeId) ?? workspaces[0],
  };
}