import { useMemo, useState } from "react";

/** ابزارهای کمکی محاسبات */
const avg = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
const rng = (a: number[]) => (a.length ? Math.max(...a) - Math.min(...a) : 0);
const diag = (w: number, h: number) => Math.sqrt(w * w + h * h);

const determineStatusWithLimit = (
  widthTol: number,
  heightTol: number,
  diagonalDiff: number,
  limit: number,
  warningMultiplier = 1.5
): "pass" | "warning" | "fail" => {
  if (widthTol <= limit && heightTol <= limit && diagonalDiff <= limit) return "pass";
  if (
    widthTol <= limit * warningMultiplier &&
    heightTol <= limit * warningMultiplier &&
    diagonalDiff <= limit * warningMultiplier
  )
    return "warning";
  return "fail";
};

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

function buildWindowDerived(w: WindowInput) {
  const widthMean = avg([w.widthTop, w.widthMiddle, w.widthBottom]);
  const heightMean = avg([w.heightLeft, w.heightMiddle, w.heightRight]);

  const widthRange = rng([w.widthTop, w.widthMiddle, w.widthBottom]);
  const heightRange = rng([w.heightLeft, w.heightMiddle, w.heightRight]);

  const theoreticalDiagonal = diag(w.nominalWidth, w.nominalHeight);
  const actualDiagonal = diag(widthMean, heightMean);

  const widthTolerance = Math.abs(widthMean - w.nominalWidth);
  const heightTolerance = Math.abs(heightMean - w.nominalHeight);
  const diagonalDiff = Math.abs(actualDiagonal - theoreticalDiagonal);

  const status = determineStatusWithLimit(
    widthTolerance,
    heightTolerance,
    diagonalDiff,
    w.limit
  );

  return {
    widthMean,
    heightMean,
    widthRange,
    heightRange,
    theoreticalDiagonal,
    actualDiagonal,
    widthTolerance,
    heightTolerance,
    diagonalDiff,
    status,
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
    setFloors((prev) => renumberFloors([...prev, { id: crypto.randomUUID(), name, floorNumber: 0, windows: [] }]));
    setCurrentFloorIndex((idx) => floors.length); // انتخاب طبقه آخر
  };

  const removeFloor = (floorId: string) => {
    setFloors((prev) => {
      const next = renumberFloors(prev.filter((f) => f.id !== floorId));
      setCurrentFloorIndex((idx) => (idx >= next.length ? Math.max(0, next.length - 1) : idx));
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

  const updateWindow = (floorId: string, windowId: string, patch: Partial<WindowInput>) => {
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
        f.id === floorId ? { ...f, windows: f.windows.filter((w) => w.id !== windowId) } : f
      )
    );
  };

  const clearAllData = () => {
    setFloors([{ id: crypto.randomUUID(), name: "طبقه 1", floorNumber: 1, windows: [] }]);
    setCurrentFloorIndex(0);
  };

  /** آمار ساده */
  const stats = useMemo(() => {
    const totalFloors = floors.length;
    const totalWindows = floors.reduce((s, f) => s + f.windows.length, 0);

    const pass = floors.flatMap((f) => f.windows).filter((w) => w.status === "pass").length;
    const warning = floors.flatMap((f) => f.windows).filter((w) => w.status === "warning").length;
    const fail = floors.flatMap((f) => f.windows).filter((w) => w.status === "fail").length;

    // میانگین تلورانس (میانگینِ میانگین عرض/ارتفاع)
    const allTol = floors.flatMap((f) =>
      f.windows.map((w) => (w.widthTolerance + w.heightTolerance) / 2)
    );
    const avgTol = totalWindows ? allTol.reduce((s, x) => s + x, 0) / totalWindows : 0;

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
