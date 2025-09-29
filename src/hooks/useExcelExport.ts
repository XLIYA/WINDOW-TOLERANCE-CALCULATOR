// src/hooks/useExcelExport.ts


// تایپ‌ها از هوک‌های داخلی پروژه
import type { ProjectInfo as AppProjectInfo } from "@/hooks/useProjectInfo";
import type { FloorItem as AppFloorItem, WindowItem as AppWindowItem } from "@/hooks/useFloorsData";
import { exportToExcelFancy } from "@/utils/tolerance/export/exceljs-export";

/**
 * Hook providing Excel export functionality (ExcelJS - fancy)
 * این نسخه مستقیماً از داده‌های هوک useFloorsData استفاده می‌کند تا
 * همه‌ی فیلدهای جدید (LIMIT، سه‌نقطه‌ای‌ها، میانگین‌ها و...) در خروجی بیایند.
 */
export const useExcelExport = () => {
  const exportToExcel = async (projectInfo: AppProjectInfo, floors: AppFloorItem[]) => {
    // گاردهای کاربردی
    if (!projectInfo || !projectInfo.buildingName) {
      alert("اطلاعات پروژه کامل نیست.");
      return;
    }
    if (!floors?.length || !floors.some((f) => f.windows?.length)) {
      alert("برای خروجی گرفتن، حداقل یک پنجره ثبت کنید.");
      return;
    }

    // آداپت ساده از مدل داخلی هوک → مدل مورد نیاز اکسپورتر
    const utilProject = {
      buildingName: projectInfo.buildingName,
      engineerName: (projectInfo as any).engineerName ?? "",
      floorCount: floors.length,
      date: projectInfo.date ?? new Date().toLocaleDateString("fa-IR"),
      projectCode: (projectInfo as any).projectCode ?? "",
      description: (projectInfo as any).description ?? "",
    };

    const utilFloors = floors.map((f) => ({
      id: f.id,
      floorNumber: f.floorNumber,
      windows: f.windows.map((w: AppWindowItem) => ({
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

        status: w.status,
      })),
    }));

    try {
      await exportToExcelFancy(utilProject as any, utilFloors as any);
    } catch (err) {
      console.error("Export error:", err);
      alert("در خروجی Excel مشکلی رخ داد.");
    }
  };

  return { exportToExcel };
};
