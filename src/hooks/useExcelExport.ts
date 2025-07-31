import { ProjectInfo, FloorData } from '../types';
import { exportToExcel as exportExcel } from '../utils/tolerance';

/**
 * Hook providing Excel export functionality. Delegates to the shared
 * exportToExcel helper defined in `src/utils/tolerance/excel.ts`.
 */
export const useExcelExport = () => {
  const exportToExcel = (projectInfo: ProjectInfo, floors: FloorData[]) => {
    // Use the shared utility function to generate and download the report.
    exportExcel(projectInfo, floors);
  };

  return {
    exportToExcel,
  };
};