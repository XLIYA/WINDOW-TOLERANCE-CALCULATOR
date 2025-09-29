// src/hooks/useFloorsData.ts
import { useMemo, useState } from "react";
import { computeWindowTolerance } from "@/utils/computeWindowTolerance";

/** انواع داده (ورود/ذخیره پنجره) */
export interface WindowInput {
  code: string;

  nominalWidth: number;  // عرض اسمی (mm)
  nominalHeight: number; // ارتفاع اسمی (mm)
  limit: number;         // حد مجاز تلورانس (mm)

  // عرض در سه نقطه: بالا/وسط/پایین
  widthTop: number;
  widthMiddle: number;
  widthBottom: number;

  // ارتفاع در سه نقطه: چپ/وسط/راست
  heightLeft: number;
  heightMiddle: number;
  heightRight: number;
}

export interface WindowItem extends WindowInput {
  id: string;
  floorId: string;

  // مقادیر مشتق‌شده برای نمایش/اکسل/وضعیت
  widthMean: number;
  heightMean: number;
  widthRange: number;   // max-min
  heightRange: number;  // max-min

  theoreticalDiagonal: number; // از nominal‌ها
  actualDiagonal: number;      // از میانگین‌های واقعی

  widthTolerance: number;   // |widthMean - nominalWidth|
  heightTolerance: number;  // |heightMean - nominalHeight|
  diagonalDiff: number;     // |actualDiagonal - theoreticalDiagonal|

  status: "pass" | "warning" | "fail";
}

export interface FloorItem {
  id: string;
  name?: string;
  floorNumber: number;
  windows: WindowItem[];
}

/** مشتق‌گیری مقادیر با استفاده از فرمول جدید */
function buildWindowDerived(w: WindowInput) {
  const r = computeWindowTolerance({
    Wtop: w.widthTop,
    Wmid: w.widthMiddle,
    Wbot: w.widthBottom,
    Hleft: w.heightLeft,
    Hmid: w.heightMiddle,
    Hright: w.heightRight,
    W0: w.nominalWidth,
    H0: w.nominalHeight,
    T: w.limit,
    // k: 1.5, // اگر ضریب هشدار متفاوتی خواستی، اینجا ست کن
  });

  return {
    widthMean: r.Wbar,
    heightMean: r.Hbar,
    widthRange: r.RangeW,
    heightRange: r.RangeH,

    theoreticalDiagonal: r.Dth,
    actualDiagonal: r.Dact,
    diagonalDiff: r.DeltaD,

    widthTolerance: r.TolW,
    heightTolerance: r.TolH,

    status: r.status,
  };
}

/** ابزار شماره‌گذاری طبقات */
function renumberFloors(floors: FloorItem[]): FloorItem[] {
  return floors.map((f, i) => ({
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
        { id: crypto.randomUUID(), name, floorNumber: 0, windows: [] },
      ])
    );
    setCurrentFloorIndex((idx) => floors.length); // انتخاب طبقه آخر
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
                (() => {
                  const d = buildWindowDerived(data);
                  return {
                    id: data.id ?? crypto.randomUUID(),
                    floorId,
                    ...data,
                    ...d,
                  } as WindowItem;
                })(),
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
              windows: f.windows.map((w) => {
                if (w.id !== windowId) return w;
                const next: WindowInput = {
                  code: w.code,
                  nominalWidth: w.nominalWidth,
                  nominalHeight: w.nominalHeight,
                  limit: w.limit,
                  widthTop: w.widthTop,
                  widthMiddle: w.widthMiddle,
                  widthBottom: w.widthBottom,
                  heightLeft: w.heightLeft,
                  heightMiddle: w.heightMiddle,
                  heightRight: w.heightRight,
                  ...patch,
                };
                const d = buildWindowDerived(next);
                return { ...w, ...patch, ...d } as WindowItem;
              }),
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

  const clearAllData = () => {
    setFloors([
      { id: crypto.randomUUID(), name: "طبقه 1", floorNumber: 1, windows: [] },
    ]);
    setCurrentFloorIndex(0);
  };

  /** آمار ساده */
  const stats = useMemo(() => {
    const totalFloors = floors.length;
    const totalWindows = floors.reduce((s, f) => s + f.windows.length, 0);

    const pass = floors
      .flatMap((f) => f.windows)
      .filter((w) => w.status === "pass").length;
    const warning = floors
      .flatMap((f) => f.windows)
      .filter((w) => w.status === "warning").length;
    const fail = floors
      .flatMap((f) => f.windows)
      .filter((w) => w.status === "fail").length;

    // میانگین تلورانس (میانگینِ میانگین عرض/ارتفاع)
    const allTol = floors.flatMap((f) =>
      f.windows.map((w) => (w.widthTolerance + w.heightTolerance) / 2)
    );
    const avgTol = totalWindows
      ? allTol.reduce((s, x) => s + x, 0) / totalWindows
      : 0;

    return { totalFloors, totalWindows, pass, warning, fail, avgTol };
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
