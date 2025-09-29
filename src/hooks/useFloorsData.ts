import { useMemo, useState } from "react";

/** انواع داده */
export interface WindowInput {
  code: string;
  theoreticalDiameter: number;
  actualDiameter: number;
}

export interface WindowItem extends WindowInput {
  id: string;
  floorId: string;
}

export interface FloorItem {
  id: string;
  name: string;
  floorNumber: number; // برای سازگاری با نمودار
  windows: WindowItem[];
}

export interface FloorsStats {
  totalFloors: number;
  totalWindows: number;
  avgDelta: number;
  maxAbsDelta: number;
  perFloor: Array<{
    floorId: string;
    floorName: string;
    floorNumber: number;
    count: number;
    avgDelta: number;
    maxAbsDelta: number;
  }>;
}

function renumberFloors(list: FloorItem[]): FloorItem[] {
  return list.map((f, i) => ({
    ...f,
    floorNumber: i + 1,
    name: f.name || `طبقه ${i + 1}`,
  }));
}

/** هوک اصلی مدیریت طبقات و پنجره‌ها */
export function useFloorsData(initial?: FloorItem[]) {
  const [floors, setFloors] = useState<FloorItem[]>(
    renumberFloors(
      initial ?? [
        { id: crypto.randomUUID(), name: "طبقه 1", floorNumber: 1, windows: [] },
      ]
    )
  );
  const [currentFloorIndex, setCurrentFloorIndex] = useState<number>(0);

  /** افزودن/حذف طبقه */
  const addFloor = (name?: string) => {
    setFloors((prev) =>
      renumberFloors([
        ...prev,
        {
          id: crypto.randomUUID(),
          name: (name?.trim() || `طبقه ${prev.length + 1}`),
          floorNumber: prev.length + 1,
          windows: [],
        },
      ])
    );
    setCurrentFloorIndex((i) => i + 1);
  };

  const removeFloor = (floorId: string) => {
    setFloors((prev) => {
      const next = renumberFloors(prev.filter((f) => f.id !== floorId));
      setCurrentFloorIndex((idx) =>
        idx >= next.length ? Math.max(0, next.length - 1) : idx
      );
      return next.length
        ? next
        : [{ id: crypto.randomUUID(), name: "طبقه 1", floorNumber: 1, windows: [] }];
    });
  };

  /** افزودن/ویرایش/حذف پنجره */
  const addWindow = (floorId: string, data: WindowInput & { id?: string }) => {
    setFloors((prev) =>
      prev.map((f) =>
        f.id === floorId
          ? {
              ...f,
              windows: [
                ...f.windows,
                {
                  id: data.id ?? crypto.randomUUID(),
                  floorId,
                  code: data.code.trim(),
                  theoreticalDiameter: Number.isFinite(data.theoreticalDiameter)
                    ? data.theoreticalDiameter
                    : 0,
                  actualDiameter: Number.isFinite(data.actualDiameter)
                    ? data.actualDiameter
                    : 0,
                },
              ],
            }
          : f
      )
    );
  };

  const updateWindow = (
    floorId: string,
    windowId: string,
    patch: Partial<WindowInput>
  ) => {
    setFloors((prev) =>
      prev.map((f) =>
        f.id === floorId
          ? {
              ...f,
              windows: f.windows.map((w) =>
                w.id === windowId
                  ? {
                      ...w,
                      ...(patch.code !== undefined ? { code: patch.code } : {}),
                      ...(patch.theoreticalDiameter !== undefined
                        ? {
                            theoreticalDiameter: Number.isFinite(
                              patch.theoreticalDiameter
                            )
                              ? patch.theoreticalDiameter!
                              : 0,
                          }
                        : {}),
                      ...(patch.actualDiameter !== undefined
                        ? {
                            actualDiameter: Number.isFinite(patch.actualDiameter)
                              ? patch.actualDiameter!
                              : 0,
                          }
                        : {}),
                    }
                  : w
              ),
            }
          : f
      )
    );
  };

  const removeWindow = (floorId: string, windowId: string) => {
    setFloors((prev) =>
      prev.map((f) =>
        f.id === floorId
          ? { ...f, windows: f.windows.filter((w) => w.id !== windowId) }
          : f
      )
    );
  };

  /** پاک‌سازی کامل */
  const clearAllData = () => {
    const base = [
      { id: crypto.randomUUID(), name: "طبقه 1", floorNumber: 1, windows: [] },
    ];
    setFloors(base);
    setCurrentFloorIndex(0);
  };

  /** آمار */
  const stats: FloorsStats = useMemo(() => {
    const perFloor = floors.map((f) => {
      const count = f.windows.length;
      const deltas = f.windows.map(
        (w) => w.actualDiameter - w.theoreticalDiameter
      );
      const avgDelta = count ? deltas.reduce((s, d) => s + d, 0) / count : 0;
      const maxAbsDelta = count
        ? Math.max(...deltas.map((d) => Math.abs(d)))
        : 0;
      return {
        floorId: f.id,
        floorName: f.name,
        floorNumber: f.floorNumber,
        count,
        avgDelta,
        maxAbsDelta,
      };
    });

    const totalFloors = floors.length;
    const totalWindows = floors.reduce((s, f) => s + f.windows.length, 0);
    const allDeltas = floors.flatMap((f) =>
      f.windows.map((w) => w.actualDiameter - w.theoreticalDiameter)
    );
    const avgDelta = totalWindows
      ? allDeltas.reduce((s, d) => s + d, 0) / totalWindows
      : 0;
    const maxAbsDelta = totalWindows
      ? Math.max(...allDeltas.map((d) => Math.abs(d)))
      : 0;

    return { totalFloors, totalWindows, avgDelta, maxAbsDelta, perFloor };
  }, [floors]);

  return {
    floors,
    currentFloorIndex,
    setCurrentFloorIndex,
    addFloor,
    removeFloor,
    addWindow,
    updateWindow,
    removeWindow,
    clearAllData,
    stats,
  };
}
