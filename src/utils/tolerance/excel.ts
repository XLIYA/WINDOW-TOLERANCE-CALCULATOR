import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ProjectInfo, FloorData } from './types';
import { TOLERANCE_LIMITS, STATUS_LABELS } from './constants';
import { calculateStatistics } from './calculations';

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
    ['تلورانس‌های پیش‌فرض (جهت اطلاع):'],
    ['عرض:', `${TOLERANCE_LIMITS.width} mm`],
    ['ارتفاع:', `${TOLERANCE_LIMITS.height} mm`],
    ['قطر:', `${TOLERANCE_LIMITS.diagonal} mm`],
    ['* توجه: در این پروژه برای هر پنجره LIMIT اختصاصی ثبت می‌شود.'],
  ];
  const projectWs = XLSX.utils.aoa_to_sheet(projectData);
  XLSX.utils.book_append_sheet(wb, projectWs, 'اطلاعات پروژه');

  // Floor Sheets
  floors.forEach((floor) => {
    const floorData = [
      [`طبقه ${floor.floorNumber}`],
      [''],
      [
        'کد',
        'عرض اسمی', 'ارتفاع اسمی', 'LIMIT',
        'عرض بالا', 'عرض وسط', 'عرض پایین',
        'ارتفاع چپ', 'ارتفاع وسط', 'ارتفاع راست',
        'میانگین عرض', 'میانگین ارتفاع',
        'رنج عرض', 'رنج ارتفاع',
        'قطر نظری', 'قطر واقعی', 'اختلاف قطر',
        'تلورانس عرض', 'تلورانس ارتفاع',
        'وضعیت'
      ],
      ...floor.windows.map(w => [
        w.code,
        w.nominalWidth, w.nominalHeight, w.limit,
        w.widthTop, w.widthMiddle, w.widthBottom,
        w.heightLeft, w.heightMiddle, w.heightRight,
        Number(w.widthMean.toFixed(1)), Number(w.heightMean.toFixed(1)),
        Number(w.widthRange.toFixed(1)), Number(w.heightRange.toFixed(1)),
        Number(w.theoreticalDiagonal.toFixed(1)), Number(w.actualDiagonal.toFixed(1)),
        Number(w.diagonalDiff.toFixed(1)),
        Number(w.widthTolerance.toFixed(1)), Number(w.heightTolerance.toFixed(1)),
        STATUS_LABELS[w.status]
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(floorData);
    XLSX.utils.book_append_sheet(wb, ws, `طبقه ${floor.floorNumber}`);
  });

  // Statistics Sheet
  const stats = calculateStatistics(floors); // ← بدون cast
  const summaryData = [
    ['خلاصه آماری'],
    [''],
    ['تعداد کل پنجره‌ها:', stats.total],
    ['قبول:', stats.pass],
    ['هشدار:', stats.warning],
    ['مردود:', stats.fail],
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'خلاصه آماری');

  // Save file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  const buf = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff;

  const safeDate = new Date().toLocaleDateString('fa-IR').replace(/\//g, '-'); // ← امن
  const fileName = `گزارش_تلورانس_${projectInfo.buildingName}_${safeDate}.xlsx`;
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), fileName);
};
