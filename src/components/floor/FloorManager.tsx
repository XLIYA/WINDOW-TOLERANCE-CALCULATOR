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
  onAddWindow: (floorId: string, data: WindowInput) => void;
  onUpdateWindow: (
    floorId: string,
    windowId: string,
    patch: Partial<WindowInput>
  ) => void;
  onRemoveWindow: (floorId: string, windowId: string) => void;
}

/** استخراج ایمن نام پروژه بدون استفاده از any */
type ProjectNameKeys = "projectName" | "name" | "title";
function getProjectName(info: ProjectInfo): string {
  const rec = info as Partial<Record<ProjectNameKeys, unknown>>;
  const keys: readonly ProjectNameKeys[] = ["projectName", "name", "title"] as const;
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

const FloorManager: React.FC<FloorManagerProps> = ({
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
  const [draft, setDraft] = React.useState<WindowInput>({
    code: "",
    theoreticalDiameter: 0,
    actualDiameter: 0,
  });

  const addDraftWindow = () => {
    if (!activeFloor) return;
    if (!draft.code.trim()) return;
    onAddWindow(activeFloor.id, {
      code: draft.code.trim(),
      theoreticalDiameter: draft.theoreticalDiameter,
      actualDiameter: draft.actualDiameter,
    });
    setDraft({ code: "", theoreticalDiameter: 0, actualDiameter: 0 });
  };

  const projectName = getProjectName(projectInfo);

  return (
    <div className="space-y-6">
      {/* تب‌های طبقات */}
      <div className="flex flex-wrap items-center gap-2">
        {floors.map((f, idx) => (
          <button
            key={f.id}
            onClick={() => onFloorSelect(idx)}
            className={`rounded-xl border px-4 py-2 text-sm transition-all ${
              idx === currentFloorIndex
                ? "bg-accent text-accent-foreground shadow"
                : "bg-card text-foreground hover:bg-accent/40"
            }`}
            title={`انتخاب ${f.name}`}
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

      {/* محتوای طبقه فعال */}
      {activeFloor && (
        <Card className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">
              {activeFloor.name} (شماره: {activeFloor.floorNumber})
            </h3>
            <span className="text-sm text-muted-foreground">
              پروژه: {projectName || "—"}
            </span>
          </div>

          {/* لیست پنجره‌ها */}
          <div className="space-y-3">
            {activeFloor.windows.map((w) => (
              <div key={w.id} className="grid grid-cols-12 items-center gap-2">
                <Input
                  className="col-span-3"
                  placeholder="کد"
                  value={w.code}
                  onChange={(e) =>
                    onUpdateWindow(activeFloor.id, w.id, { code: e.target.value })
                  }
                />
                <Input
                  className="col-span-3"
                  placeholder="قطر نظری"
                  inputMode="decimal"
                  value={String(w.theoreticalDiameter)}
                  onChange={(e) =>
                    onUpdateWindow(activeFloor.id, w.id, {
                      theoreticalDiameter: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <Input
                  className="col-span-3"
                  placeholder="قطر واقعی"
                  inputMode="decimal"
                  value={String(w.actualDiameter)}
                  onChange={(e) =>
                    onUpdateWindow(activeFloor.id, w.id, {
                      actualDiameter: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <div className="col-span-3 flex justify-end">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onRemoveWindow(activeFloor.id, w.id)}
                    title="حذف پنجره"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* افزودن پنجره جدید */}
          <div className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-3"
              placeholder="کد"
              value={draft.code}
              onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))}
            />
            <Input
              className="col-span-3"
              placeholder="قطر نظری"
              inputMode="decimal"
              value={String(draft.theoreticalDiameter)}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  theoreticalDiameter: Number.parseFloat(e.target.value) || 0,
                }))
              }
            />
            <Input
              className="col-span-3"
              placeholder="قطر واقعی"
              inputMode="decimal"
              value={String(draft.actualDiameter)}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  actualDiameter: Number.parseFloat(e.target.value) || 0,
                }))
              }
            />
            <div className="col-span-3">
              <Button className="w-full" onClick={addDraftWindow}>
                <Plus className="ml-2 h-4 w-4" />
                افزودن پنجره
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FloorManager;
