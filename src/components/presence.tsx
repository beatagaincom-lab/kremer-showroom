"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hält Kinder nach dem Schliessen noch `exitMs` im Baum, damit ihre
 * Ausblend-Animation sichtbar bleibt. Ersatz für AnimatePresence-Unmounts:
 * Deren Exit-Callbacks feuern mit React 19.2 nicht mehr, wodurch Overlays
 * unsichtbar im DOM liegen bleiben und die Seite blockieren.
 */
export function Presence({
  open,
  exitMs = 420,
  children,
}: {
  open: boolean;
  exitMs?: number;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const timeout = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(timeout);
  }, [open, exitMs]);

  return open || mounted ? <>{children}</> : null;
}

/**
 * Liefert während des Ausblendens den letzten Nicht-null-Wert weiter,
 * damit Overlay-Inhalte beim Schliessen nicht schlagartig leer werden.
 */
export function useLastPresent<T>(value: T | null): T | null {
  const lastRef = useRef<T | null>(value);
  if (value !== null) lastRef.current = value;
  return value ?? lastRef.current;
}
