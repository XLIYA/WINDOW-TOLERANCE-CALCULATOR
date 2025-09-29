import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export type Status = "pass" | "warning" | "fail";

export interface ProjectInfo {
  buildingName: string;
  engineerName: string;
  floorCount: number;
  date: string;
  projectCode?: string;
  description?: string;
}

export interface WindowData {
  id: string;
  code: string;

  // اگر واقعاً لازم داری، OK است — در خروجی استفاده‌اش نمی‌کنیم
  title?: string;

  nominalWidth: number;
  nominalHeight: number;
  limit: number;

  widthTop: number;
  widthMiddle: number;
  widthBottom: number;
  heightLeft: number;
  heightMiddle: number;
  heightRight: number;

  widthMean: number;
  heightMean: number;
  widthRange: number;
  heightRange: number;

  theoreticalDiagonal: number;
  actualDiagonal: number;
  diagonalDiff: number;

  widthTolerance: number;
  heightTolerance: number;

  status: Status;
}

export interface FloorData {
  id: string;
  floorNumber: number;
  windows: WindowData[];
}

const statusFa: Record<Status, string> = {
  pass: "قبول",
  warning: "هشدار",
  fail: "مردود",
};

const statusColor: Record<Status, string> = {
  pass: "FFDCFCE7",
  warning: "FFFFF7CD",
  fail: "FFFEE2E2",
};

function mm(n: number) {
  return Number.isFinite(n) ? n : 0;
}

export async function exportToExcelFancy(project: ProjectInfo, floors: FloorData[]) {
  const wb = new ExcelJS.Workbook();

  // ✅ به‌جای wb.properties از فیلدهای پشتیبانی‌شده استفاده کن
  wb.creator = project.engineerName || "Engineer";
  wb.lastModifiedBy = project.engineerName || "Engineer";
  wb.created = new Date();
  wb.modified = new Date();
  wb.lastPrinted = new Date();

  // Sheet 1: اطلاعات پروژه
  {
    const ws = wb.addWorksheet("اطلاعات پروژه", {
      views: [{ rightToLeft: true }],
    });

    ws.columns = [
      { header: "عنوان", width: 25 },
      { header: "مقدار", width: 60 },
    ];

    const titleRow = ws.addRow(["اطلاعات پروژه", ""]);
    titleRow.font = { bold: true, size: 14 };
    ws.mergeCells(titleRow.number, 1, titleRow.number, 2);
    ws.addRow([]);

    const rows: Array<[string, string | number]> = [
      ["نام ساختمان", project.buildingName],
      ["مهندس ناظر", project.engineerName],
      ["کد پروژه", project.projectCode || "-"],
      ["تعداد طبقات", floors.length],
      ["تاریخ", project.date],
      ["توضیحات", project.description || "-"],
    ];
    rows.forEach((r) => ws.addRow(r));

    ws.getRow(1).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEFF1F5" } };
      cell.border = {
        top: { style: "thin", color: { argb: "FFCBD5E1" } },
        left: { style: "thin", color: { argb: "FFCBD5E1" } },
        bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
        right: { style: "thin", color: { argb: "FFCBD5E1" } },
      };
      cell.alignment = { horizontal: "center" };
      cell.font = { bold: true };
    });
  }

  // Sheets: هر طبقه یک شیت
  floors.forEach((floor) => {
    const ws = wb.addWorksheet(`طبقه ${floor.floorNumber}`, {
      views: [{ rightToLeft: true }],
    });

    ws.columns = [
      { header: "کد", width: 12 },
      { header: "عرض اسمی", width: 12 },
      { header: "ارتفاع اسمی", width: 12 },
      { header: "LIMIT", width: 10 },

      { header: "عرض بالا", width: 12 },
      { header: "عرض وسط", width: 12 },
      { header: "عرض پایین", width: 12 },

      { header: "ارتفاع چپ", width: 12 },
      { header: "ارتفاع وسط", width: 12 },
      { header: "ارتفاع راست", width: 12 },

      { header: "میانگین عرض", width: 12 },
      { header: "میانگین ارتفاع", width: 12 },
      { header: "رنج عرض", width: 10 },
      { header: "رنج ارتفاع", width: 10 },

      { header: "قطر نظری", width: 12 },
      { header: "قطر واقعی", width: 12 },
      { header: "اختلاف قطر", width: 12 },

      { header: "تلورانس عرض", width: 12 },
      { header: "تلورانس ارتفاع", width: 12 },

      { header: "وضعیت", width: 10 },
    ];

    ws.getRow(1).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEFF6FF" } };
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFCBD5E1" } },
        left: { style: "thin", color: { argb: "FFCBD5E1" } },
        bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
        right: { style: "thin", color: { argb: "FFCBD5E1" } },
      };
    });

    const numFmt = "0.0";

    floor.windows.forEach((w) => {
      const row = ws.addRow([
        w.code,
        mm(w.nominalWidth),
        mm(w.nominalHeight),
        mm(w.limit),

        mm(w.widthTop),
        mm(w.widthMiddle),
        mm(w.widthBottom),

        mm(w.heightLeft),
        mm(w.heightMiddle),
        mm(w.heightRight),

        mm(w.widthMean),
        mm(w.heightMean),
        mm(w.widthRange),
        mm(w.heightRange),

        mm(w.theoreticalDiagonal),
        mm(w.actualDiagonal),
        mm(w.diagonalDiff),

        mm(w.widthTolerance),
        mm(w.heightTolerance),

        statusFa[w.status],
      ]);

      row.eachCell((cell, col) => {
        if (col !== 1 && col !== 20) cell.numFmt = numFmt;
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { top: { style: "hair" }, bottom: { style: "hair" }, left: { style: "hair" }, right: { style: "hair" } };
      });

      const statusCell = row.getCell(20);
      const bg = statusColor[w.status];
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      statusCell.font = { bold: true };
    });

    ws.addRow([]);
    const footer = ws.addRow([
      "تعداد پنجره‌ها",
      floor.windows.length,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
    footer.font = { bold: true };
  });

  // Sheet خلاصه آماری
  {
    const ws = wb.addWorksheet("خلاصه آماری", {
      views: [{ rightToLeft: true }],
    });
    ws.columns = [{ header: "عنوان", width: 25 }, { header: "مقدار", width: 25 }];

    const all = floors.flatMap((f) => f.windows);
    const total = all.length;
    const pass = all.filter((w) => w.status === "pass").length;
    const warning = all.filter((w) => w.status === "warning").length;
    const fail = all.filter((w) => w.status === "fail").length;

    ws.addRow(["خلاصه آماری", ""]).font = { bold: true, size: 14 };
    ws.addRow([]);
    ws.addRow(["تعداد کل پنجره‌ها", total]);
    ws.addRow(["قبول", pass]);
    ws.addRow(["هشدار", warning]);
    ws.addRow(["مردود", fail]);

    ws.getRow(1).eachCell((c) => {
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEFF1F5" } };
      c.font = { bold: true };
      c.alignment = { horizontal: "center" };
    });
  }

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const fileName = `گزارش_تلورانس_${project.buildingName}_${new Date()
    .toLocaleDateString("fa-IR")
    .replace(/\//g, "-")}.xlsx`;
  saveAs(blob, fileName);
}
