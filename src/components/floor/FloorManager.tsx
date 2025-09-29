// src/components/floor/FloorManager.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, X } from "lucide-react";
import type { FloorItem, WindowInput } from "@/hooks/useFloorsData";
import type { ProjectInfo } from "@/hooks/useProjectInfo";

export interface FloorManagerProps {
  floors: FloorItem[];
  currentFloorIndex: number;
  projectInfo: ProjectInfo;
  onFloorSelect: (index: number) => void;
  onAddFloor: (name?: string) => void;
  onRemoveFloor: (floorId: string) => void;
  onAddWindow: (floorId: string, data: WindowInput & { id?: string }) => void;
  onUpdateWindow: (floorId: string, windowId: string, patch: Partial<WindowInput>) => void;
  onRemoveWindow: (floorId: string, windowId: string) => void;
}

export const FloorManager: React.FC<FloorManagerProps> = ({
  floors,
  currentFloorIndex,
  projectInfo,
  onFloorSelect,
  onAddFloor,
  onRemoveFloor,
  onAddWindow,
  onUpdateWindow,
  onRemoveWindow,
}) => {
  const activeFloor = floors[currentFloorIndex];

  // فرم موقت برای افزودن پنجره
  const [draft, setDraft] = React.useState<WindowInput>({
    code: "",

    nominalWidth: 0,
    nominalHeight: 0,
    limit: 3,

    widthTop: 0,
    widthMiddle: 0,
    widthBottom: 0,

    heightLeft: 0,
    heightMiddle: 0,
    heightRight: 0,
  });

  const addDraftWindow = () => {
    if (!activeFloor) return;

    // اعتبارسنجی ساده
    const requiredNumbers: Array<[number, string]> = [
      [draft.nominalWidth, "عرض اسمی"],
      [draft.nominalHeight, "ارتفاع اسمی"],
      [draft.limit, "حد تلورانس"],
      [draft.widthTop, "عرض بالا"],
      [draft.widthMiddle, "عرض وسط"],
      [draft.widthBottom, "عرض پایین"],
      [draft.heightLeft, "ارتفاع چپ"],
      [draft.heightMiddle, "ارتفاع وسط"],
      [draft.heightRight, "ارتفاع راست"],
    ];
    for (const [v, label] of requiredNumbers) {
      if (!Number.isFinite(v) || v <= 0) {
        alert(`${label} نامعتبر است`);
        return;
      }
    }
    if (!draft.code.trim()) {
      alert("کد پنجره الزامی است");
      return;
    }

    onAddWindow(activeFloor.id, draft);

    setDraft({
      code: "",
      nominalWidth: 0,
      nominalHeight: 0,
      limit: 3,
      widthTop: 0,
      widthMiddle: 0,
      widthBottom: 0,
      heightLeft: 0,
      heightMiddle: 0,
      heightRight: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* ردیف انتخاب طبقه و مدیریت */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {floors.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => onFloorSelect(idx)}
              className={`rounded-xl border px-4 py-2 text-sm transition-all ${idx === currentFloorIndex
                  ? "bg-accent text-accent-foreground shadow"
                  : "bg-card text-foreground hover:bg-accent/40"
                }`}
              title={`انتخاب ${f.name || `طبقه ${f.floorNumber}`}`}
            >
              {f.name || `طبقه ${f.floorNumber}`}
            </button>
          ))}
          <Button
            variant="default"
            size="sm"
            onClick={() => onAddFloor()}
            className="ml-2 rounded-xl"
            title="افزودن طبقه"
          >
            <Plus className="mr-2 h-4 w-4" />
            افزودن طبقه
          </Button>

          {activeFloor && floors.length > 1 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemoveFloor(activeFloor.id)}
              className="ml-2 rounded-xl"
              title="حذف طبقه فعال"
            >
              <X className="mr-2 h-4 w-4" />
              حذف طبقه
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {projectInfo?.buildingName && <>پروژه: <b>{projectInfo.buildingName}</b></>}
        </div>
      </div>

      {/* فرم افزودن پنجره */}
      <Card className="p-4 space-y-6">
        {/* اطلاعات اسمی + LIMIT + کد */}
        <div className="grid grid-cols-12 gap-4">
          {/* عرض اسمی */}
          <div className="col-span-12 sm:col-span-3">
            <label htmlFor="nominalWidth" className="block mb-1 text-sm text-muted-foreground">
              عرض اسمی (میلی‌متر)
            </label>
            <Input
              id="nominalWidth"
              placeholder="مثلاً 1200"
              inputMode="decimal"
              value={String(draft.nominalWidth)}
              onChange={(e) => setDraft({ ...draft, nominalWidth: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {/* ارتفاع اسمی */}
          <div className="col-span-12 sm:col-span-3">
            <label htmlFor="nominalHeight" className="block mb-1 text-sm text-muted-foreground">
              ارتفاع اسمی (میلی‌متر)
            </label>
            <Input
              id="nominalHeight"
              placeholder="مثلاً 1500"
              inputMode="decimal"
              value={String(draft.nominalHeight)}
              onChange={(e) => setDraft({ ...draft, nominalHeight: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {/* LIMIT تلورانس */}
          <div className="col-span-12 sm:col-span-3">
            <label htmlFor="limit" className="block mb-1 text-sm text-muted-foreground">
              حد مجاز تلورانس (LIMIT) — میلی‌متر
            </label>
            <Input
              id="limit"
              placeholder="مثلاً 3"
              inputMode="decimal"
              value={String(draft.limit)}
              onChange={(e) => setDraft({ ...draft, limit: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {/* کد پنجره */}
          <div className="col-span-12 sm:col-span-3">
            <label htmlFor="code" className="block mb-1 text-sm text-muted-foreground">
              کد پنجره
            </label>
            <Input
              id="code"
              placeholder="مثلاً W-103"
              value={draft.code}
              onChange={(e) => setDraft({ ...draft, code: e.target.value })}
            />
          </div>
        </div>

        {/* عرض سه‌نقطه‌ای: بالا/وسط/پایین */}
        <div>
          <div className="mb-2 text-sm font-medium text-foreground">اندازه‌های عرض (سه‌نقطه‌ای)</div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <label htmlFor="widthTop" className="block mb-1 text-sm text-muted-foreground">
                عرض بالا (میلی‌متر)
              </label>
              <Input
                id="widthTop"
                placeholder="مثلاً 1198"
                inputMode="decimal"
                value={String(draft.widthTop)}
                onChange={(e) => setDraft({ ...draft, widthTop: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="col-span-12 sm:col-span-4">
              <label htmlFor="widthMiddle" className="block mb-1 text-sm text-muted-foreground">
                عرض وسط (میلی‌متر)
              </label>
              <Input
                id="widthMiddle"
                placeholder="مثلاً 1201"
                inputMode="decimal"
                value={String(draft.widthMiddle)}
                onChange={(e) =>
                  setDraft({ ...draft, widthMiddle: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div className="col-span-12 sm:col-span-4">
              <label htmlFor="widthBottom" className="block mb-1 text-sm text-muted-foreground">
                عرض پایین (میلی‌متر)
              </label>
              <Input
                id="widthBottom"
                placeholder="مثلاً 1199"
                inputMode="decimal"
                value={String(draft.widthBottom)}
                onChange={(e) =>
                  setDraft({ ...draft, widthBottom: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        </div>

        {/* ارتفاع سه‌نقطه‌ای: چپ/وسط/راست */}
        <div>
          <div className="mb-2 text-sm font-medium text-foreground">اندازه‌های ارتفاع (سه‌نقطه‌ای)</div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <label htmlFor="heightLeft" className="block mb-1 text-sm text-muted-foreground">
                ارتفاع چپ (میلی‌متر)
              </label>
              <Input
                id="heightLeft"
                placeholder="مثلاً 1499"
                inputMode="decimal"
                value={String(draft.heightLeft)}
                onChange={(e) =>
                  setDraft({ ...draft, heightLeft: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div className="col-span-12 sm:col-span-4">
              <label htmlFor="heightMiddle" className="block mb-1 text-sm text-muted-foreground">
                ارتفاع وسط (میلی‌متر)
              </label>
              <Input
                id="heightMiddle"
                placeholder="مثلاً 1502"
                inputMode="decimal"
                value={String(draft.heightMiddle)}
                onChange={(e) =>
                  setDraft({ ...draft, heightMiddle: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <div className="col-span-12 sm:col-span-4">
              <label htmlFor="heightRight" className="block mb-1 text-sm text-muted-foreground">
                ارتفاع راست (میلی‌متر)
              </label>
              <Input
                id="heightRight"
                placeholder="مثلاً 1500"
                inputMode="decimal"
                value={String(draft.heightRight)}
                onChange={(e) =>
                  setDraft({ ...draft, heightRight: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <Button className="w-full" onClick={addDraftWindow}>
              افزودن پنجره
            </Button>
          </div>
        </div>
      </Card>

      {/* جدول پنجره‌های طبقه فعال */}
      {activeFloor && (
        <Card className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-right text-muted-foreground">
                  <th className="p-2">کد</th>
                  <th className="p-2">عرض اسمی</th>
                  <th className="p-2">ارتفاع اسمی</th>
                  <th className="p-2">LIMIT</th>
                  <th className="p-2">عرض بالا</th>
                  <th className="p-2">عرض وسط</th>
                  <th className="p-2">عرض پایین</th>
                  <th className="p-2">ارتفاع چپ</th>
                  <th className="p-2">ارتفاع وسط</th>
                  <th className="p-2">ارتفاع راست</th>
                  <th className="p-2">میانگین عرض</th>
                  <th className="p-2">میانگین ارتفاع</th>
                  <th className="p-2">رنج عرض</th>
                  <th className="p-2">رنج ارتفاع</th>
                  <th className="p-2">قطر نظری</th>
                  <th className="p-2">قطر واقعی</th>
                  <th className="p-2">اختلاف قطر</th>
                  <th className="p-2">تلورانس عرض</th>
                  <th className="p-2">تلورانس ارتفاع</th>
                  <th className="p-2">وضعیت</th>
                  <th className="p-2">حذف</th>
                </tr>
              </thead>
              <tbody>
                {activeFloor.windows.map((w) => (
                  <tr key={w.id} className="border-t">
                    <td className="p-2">{w.code}</td>
                    <td className="p-2">{w.nominalWidth}</td>
                    <td className="p-2">{w.nominalHeight}</td>
                    <td className="p-2">{w.limit}</td>
                    <td className="p-2">{w.widthTop}</td>
                    <td className="p-2">{w.widthMiddle}</td>
                    <td className="p-2">{w.widthBottom}</td>
                    <td className="p-2">{w.heightLeft}</td>
                    <td className="p-2">{w.heightMiddle}</td>
                    <td className="p-2">{w.heightRight}</td>

                    <td className="p-2">{w.widthMean.toFixed(1)}</td>
                    <td className="p-2">{w.heightMean.toFixed(1)}</td>
                    <td className="p-2">{w.widthRange.toFixed(1)}</td>
                    <td className="p-2">{w.heightRange.toFixed(1)}</td>
                    <td className="p-2">{w.theoreticalDiagonal.toFixed(1)}</td>
                    <td className="p-2">{w.actualDiagonal.toFixed(1)}</td>
                    <td className="p-2">{w.diagonalDiff.toFixed(1)}</td>
                    <td className="p-2">{w.widthTolerance.toFixed(1)}</td>
                    <td className="p-2">{w.heightTolerance.toFixed(1)}</td>

                    <td className="p-2">
                      {w.status === "pass" ? "قبول" : w.status === "warning" ? "هشدار" : "مردود"}
                    </td>
                    <td className="p-2">
                      <button
                        className="rounded p-2 hover:bg-destructive/10"
                        onClick={() => onRemoveWindow(activeFloor.id, w.id)}
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!activeFloor.windows.length && (
                  <tr>
                    <td className="p-4 text-muted-foreground" colSpan={21}>
                      هنوز پنجره‌ای ثبت نشده است.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FloorManager;
