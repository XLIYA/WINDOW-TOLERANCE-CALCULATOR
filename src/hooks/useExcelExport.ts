// src/hooks/useExcelExport.ts
import { exportToExcel as exportExcel } from "../utils/tolerance";

// تایپ‌های اپ
import type {
  ProjectInfo as AppProjectInfo,
  FloorData as AppFloorData,
} from "../types";

// تایپ‌های ماژول export (utils)
import type {
  ProjectInfo as UtilProjectInfo,
  FloorData as UtilFloorData,
} from "../utils/tolerance/types";

/**
 * Hook providing Excel export functionality.
 * Adapts app-level types to the util's required types.
 */
export const useExcelExport = () => {
  const exportToExcel = (projectInfo: AppProjectInfo, floors: AppFloorData[]) => {
    // 1) آداپت ProjectInfo: پرکردن فیلد اجباری floorCount از روی تعداد طبقات
    const utilProjectInfo: UtilProjectInfo = {
      ...(projectInfo as unknown as Partial<UtilProjectInfo>),
      floorCount:
        (projectInfo as unknown as Partial<UtilProjectInfo>).floorCount ??
        floors.length,
    } as UtilProjectInfo;

    // 2) آداپت FloorData (اگر ساختار یکی است، کافیست cast کنیم)
    const utilFloors: UtilFloorData[] = floors as unknown as UtilFloorData[];

    // 3) صدا زدن تابع util
    exportExcel(utilProjectInfo, utilFloors);
  };

  return { exportToExcel };
};
