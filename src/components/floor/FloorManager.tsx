import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

export interface WindowItem {
  id: string;
  code: string;
  theoreticalDiameter: number;
  actualDiameter: number;
  floorId: string;
}

export interface WindowInput {
  code: string;
  theoreticalDiameter: number;
  actualDiameter: number;
}

export interface FloorItem {
  id: string;
  name: string;
  windows: WindowItem[];
}

interface FloorManagerProps {
  floors: FloorItem[];
  onAddWindow: (floorId: string, data: WindowInput) => void;
  onRemoveWindow: (floorId: string, windowId: string) => void;
  onUpdateWindow: (floorId: string, windowId: string, patch: Partial<WindowInput>) => void;
}

const FloorManager: React.FC<FloorManagerProps> = ({
  floors,
  onAddWindow,
  onRemoveWindow,
  onUpdateWindow,
}) => {
  const [drafts, setDrafts] = React.useState<Record<
    string,
    WindowInput
  >>({}); // key = floorId

  const handleDraftChange = (
    floorId: string,
    field: keyof WindowInput,
    value: string
  ) => {
    setDrafts((prev) => {
      const current = prev[floorId] ?? {
        code: "",
        theoreticalDiameter: 0,
        actualDiameter: 0,
      };
      let next: WindowInput = current;
      if (field === "code") {
        next = { ...current, code: value };
      } else {
        const num = Number.parseFloat(value);
        next = {
          ...current,
          [field]: Number.isFinite(num) ? num : 0,
        } as WindowInput;
      }
      return { ...prev, [floorId]: next };
    });
  };

  const handleAdd = (floorId: string) => {
    const d = drafts[floorId];
    if (!d || !d.code.trim()) return;
    onAddWindow(floorId, {
      code: d.code.trim(),
      theoreticalDiameter: d.theoreticalDiameter,
      actualDiameter: d.actualDiameter,
    });
    setDrafts((prev) => ({ ...prev, [floorId]: { code: "", theoreticalDiameter: 0, actualDiameter: 0 } }));
  };

  return (
    <div className="space-y-6">
      {floors.map((floor) => (
        <Card key={floor.id} className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">{floor.name}</h3>
          </div>

          {/* لیست پنجره‌ها */}
          <div className="space-y-3">
            {floor.windows.map((w) => (
              <div
                key={w.id}
                className="grid grid-cols-12 gap-2 items-center"
              >
                <Input
                  className="col-span-3"
                  placeholder="کد"
                  value={w.code}
                  onChange={(e) =>
                    onUpdateWindow(floor.id, w.id, { code: e.target.value })
                  }
                  aria-label="کد پنجره"
                />
                <Input
                  className="col-span-3"
                  placeholder="قطر نظری"
                  inputMode="decimal"
                  value={String(w.theoreticalDiameter)}
                  onChange={(e) =>
                    onUpdateWindow(floor.id, w.id, {
                      theoreticalDiameter: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  aria-label="قطر نظری"
                />
                <Input
                  className="col-span-3"
                  placeholder="قطر واقعی"
                  inputMode="decimal"
                  value={String(w.actualDiameter)}
                  onChange={(e) =>
                    onUpdateWindow(floor.id, w.id, {
                      actualDiameter: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  aria-label="قطر واقعی"
                />
                <div className="col-span-3 flex justify-end">
                  <Button
                    variant="destructive"
                    size="icon"
                    title="حذف پنجره"
                    onClick={() => onRemoveWindow(floor.id, w.id)}
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
              value={drafts[floor.id]?.code ?? ""}
              onChange={(e) =>
                handleDraftChange(floor.id, "code", e.target.value)
              }
            />
            <Input
              className="col-span-3"
              placeholder="قطر نظری"
              inputMode="decimal"
              value={String(drafts[floor.id]?.theoreticalDiameter ?? 0)}
              onChange={(e) =>
                handleDraftChange(floor.id, "theoreticalDiameter", e.target.value)
              }
            />
            <Input
              className="col-span-3"
              placeholder="قطر واقعی"
              inputMode="decimal"
              value={String(drafts[floor.id]?.actualDiameter ?? 0)}
              onChange={(e) =>
                handleDraftChange(floor.id, "actualDiameter", e.target.value)
              }
            />
            <div className="col-span-3">
              <Button className="w-full" onClick={() => handleAdd(floor.id)}>
                <Plus className="h-4 w-4 ml-2" />
                افزودن پنجره
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FloorManager;
