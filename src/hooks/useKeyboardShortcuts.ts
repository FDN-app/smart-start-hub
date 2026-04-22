import { useEffect } from "react";

interface Opts {
  onSlash?: () => void;
  onCmdK?: () => void;
  onEsc?: () => void;
  onDigit?: (n: number) => void;
}

export function useKeyboardShortcuts({ onSlash, onCmdK, onEsc, onDigit }: Opts) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onCmdK?.();
        return;
      }
      if (e.key === "Escape") {
        onEsc?.();
        return;
      }
      if (inField) return;
      if (e.key === "/") {
        e.preventDefault();
        onSlash?.();
        return;
      }
      if (/^[1-9]$/.test(e.key)) {
        onDigit?.(Number(e.key));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSlash, onCmdK, onEsc, onDigit]);
}