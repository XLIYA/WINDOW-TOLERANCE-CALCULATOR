// src/hooks/useExcelExport.ts
import { exportToExcelFancy } from "@/utils/export/exceljs-export";

// تایپ‌های اپ (از هوک‌ها)
import type { ProjectInfo as AppProjectInfo } from "@/hooks/useProjectInfo";
import type { FloorItem, WindowItem } from "@/hooks/useFloorsData";

// تایپ‌های ماژول ExcelJS اکسپورتر
import type {
  ProjectInfo as ExportProjectInfo,
  FloorData as ExportFloorData,
  WindowData as ExportWindowData,
} from "@/utils/export/exceljs-export";

/**
 * Hook providing Excel export functionality (ExcelJS - fancy)
 * بدون استفاده از any
 */
export const useExcelExport = () => {
  const mapWindow = (w: WindowItem): ExportWindowData => ({
    id: w.id,
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

    widthMean: w.widthMean,
    heightMean: w.heightMean,
    widthRange: w.widthRange,
    heightRange: w.heightRange,

    theoreticalDiagonal: w.theoreticalDiagonal,
    actualDiagonal: w.actualDiagonal,
    diagonalDiff: w.diagonalDiff,

    widthTolerance: w.widthTolerance,
    heightTolerance: w.heightTolerance,

    status: w.status as ExportWindowData["status"],
  });

  const mapProject = (projectInfo: AppProjectInfo, floorCount: number): ExportProjectInfo => ({
    buildingName: projectInfo.buildingName,
    engineerName: projectInfo.engineerName ?? "",
    floorCount,
    date: projectInfo.date ?? new Date().toLocaleDateString("fa-IR"),
    projectCode: projectInfo.projectCode ?? "",
    description: projectInfo.description ?? "",
  });

  const mapFloors = (floors: FloorItem[]): ExportFloorData[] =>
    floors.map((f) => ({
      id: f.id,
      floorNumber: f.floorNumber,
      windows: f.windows.map(mapWindow),
    }));

  const exportToExcel = async (projectInfo: AppProjectInfo, floors: FloorItem[]) => {
    if (!projectInfo?.buildingName) {
      alert("اطلاعات پروژه کامل نیست.");
      return;
    }
    if (!floors.length || !floors.some((f) => f.windows.length)) {
      alert("برای خروجی گرفتن، حداقل یک پنجره ثبت کنید.");
      return;
    }

    const utilProject = mapProject(projectInfo, floors.length);
    const utilFloors = mapFloors(floors);

    try {
      await exportToExcelFancy(utilProject, utilFloors);
    } catch (err) {
      // خطا لاگ می‌شود ولی any استفاده نشده
      console.error("Export error:", err);
      alert("در خروجی Excel مشکلی رخ داد.");
    }
  };

  return { exportToExcel };
};
