import { useMemo, useState } from "react";

export interface WindowInput {
  code: string;
  theoreticalDiameter: number;
  actualDiameter: number;
}

export interface WindowItem extends WindowInput {
  id: string;
  floorId: string;
}

export function useWindowData(initial: WindowItem[] = []) {
  const [windows, setWindows] = useState<WindowItem[]>(initial);

  const addWindow = (w: Omit<WindowItem, "id"> & { id?: string }) => {
    const id = w.id ?? crypto.randomUUID();
    setWindows((prev) => [...prev, { ...w, id }]);
  };

  const updateWindow = (id: string, patch: Partial<WindowInput>) => {
    setWindows((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const removeWindow = (id: string) => {
    setWindows((prev) => prev.filter((x) => x.id !== id));
  };

  const stats = useMemo(() => {
    const count = windows.length;
    const avgDelta =
      count === 0
        ? 0
        : windows.reduce((s, w) => s + (w.actualDiameter - w.theoreticalDiameter), 0) / count;
    const maxDelta =
      count === 0
        ? 0
        : Math.max(
            ...windows.map((w) => Math.abs(w.actualDiameter - w.theoreticalDiameter))
          );

    return { count, avgDelta, maxDelta };
  }, [windows]);

  return { windows, addWindow, updateWindow, removeWindow, stats };
}
