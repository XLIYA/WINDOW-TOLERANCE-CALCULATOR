import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ProjectInfo, FloorData } from './types';
import { TOLERANCE_LIMITS, STATUS_LABELS } from './constants';
import { calculateStatistics } from './calculations';

/**
 * Export project and window data to an Excel workbook. Generates separate
 * sheets for project info, each floor, and a summary statistics sheet.
 * Persians labels are used to align with the app's localisation.
 *
 * @param projectInfo Metadata about the current project
 * @param floors Array of floors containing windows and measurement data
 */
export const exportToExcel = (projectInfo: ProjectInfo, floors: FloorData[]): void => {
  const wb = XLSX.utils.book_new();

  // Project Info Sheet
  const projectData = [
    ['اطلاعات پروژه'],
    [''],
    ['نام ساختمان:', projectInfo.buildingName],
    ['مهندس ناظر:', projectInfo.engineerName],
    ['کد پروژه:', projectInfo.projectCode || '-'],
    ['تعداد طبقات:', floors.length],
    ['تاریخ:', projectInfo.date],
    ['توضیحات:', projectInfo.description || '-'],
    [''],
    ['تلورانس‌های مجاز:'],
    ['عرض:', `${TOLERANCE_LIMITS.width} mm`],
    ['ارتفاع:', `${TOLERANCE_LIMITS.height} mm`],
    ['قطر:', `${TOLERANCE_LIMITS.diagonal} mm`]
  ];

  const projectWs = XLSX.utils.aoa_to_sheet(projectData);
  XLSX.utils.book_append_sheet(wb, projectWs, 'اطلاعات پروژه');

  // Floor Sheets
  floors.forEach((floor) => {
    const floorData = [
      [`طبقه ${floor.floorNumber}`],
      [''],
      ['کد پنجره', 'عرض (mm)', 'ارتفاع (mm)', 'قطر نظری', 'قطر 1', 'قطر 2', 'اختلاف قطر', 'وضعیت'],
      ...floor.windows.map(window => [
        window.code,
        window.width,
        window.height,
        window.theoreticalDiagonal.toFixed(1),
        window.diagonal1,
        window.diagonal2,
        window.diagonalDiff.toFixed(2),
        STATUS_LABELS[window.status]
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(floorData);
    XLSX.utils.book_append_sheet(wb, ws, `طبقه ${floor.floorNumber}`);
  });

  // Statistics Sheet
  const stats = calculateStatistics(floors);
  const summaryData = [
    ['خلاصه آماری'],
    [''],
    ['تعداد کل پنجره‌ها:', stats.total],
    ['پنجره‌های قبول شده:', stats.pass],
    ['پنجره‌های با هشدار:', stats.warning],
    ['پنجره‌های مردود:', stats.fail],
    ['درصد قبولی:', `${stats.passRate.toFixed(2)}%`]
  ];

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'خلاصه آماری');

  // Save file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  const buf = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < wbout.length; i++) {
    view[i] = wbout.charCodeAt(i) & 0xFF;
  }

  const blob = new Blob([buf], { type: 'application/octet-stream' });
  const fileName = `گزارش_تلورانس_${projectInfo.buildingName}_${new Date().toLocaleDateString('fa-IR')}.xlsx`;
  saveAs(blob, fileName);
};