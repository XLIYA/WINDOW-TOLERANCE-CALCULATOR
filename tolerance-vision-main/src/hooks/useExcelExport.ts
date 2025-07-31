import { ProjectInfo, FloorData } from '../types';

export const useExcelExport = () => {
  const exportToExcel = (projectInfo: ProjectInfo, floors: FloorData[]) => {
    // Mock implementation - در پروژه واقعی باید از کتابخانه‌ای مثل xlsx استفاده کنید
    console.log('Exporting to Excel:', { projectInfo, floors });
    alert('قابلیت دانلود Excel در حال توسعه است');
  };

  return {
    exportToExcel
  };
};