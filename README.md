# computeWindowTolerance — محاسبه‌گر تلورانس پنجره

ابزار وب برای **ثبت اندازه‌های پنجره به‌صورت سه‌نقطه‌ای** (عرض: بالا/وسط/پایین و ارتفاع: چپ/وسط/راست)، محاسبه‌ی خودکار **تلورانس/اعوجاج**، گزارش وضعیت **قبول/هشدار/مردود** و خروجی **Excel** حرفه‌ای.

> Frontend-only (بدون بک‌اند). ساخته‌شده با **Vite + React + TypeScript + Tailwind + shadcn/ui** و **lucide-react**. خروجی Excel با **ExcelJS** (نسخه شیک) و **SheetJS (XLSX)** (نسخه ساده) پشتیبانی می‌شود.

---

## فهرست مطالب
- [ویژگی‌ها](#ویژگیها)
- [نمای کلی](#نمای-کلی)
- [الگوریتم محاسبات تلورانس](#الگوریتم-محاسبات-تلورانس)
- [ساختار پروژه](#ساختار-پروژه)
- [راه‌اندازی](#راهاندازی)
- [اسکریپت‌ها](#اسکریپتها)
- [خروجی Excel](#خروجی-excel)
- [مدل داده](#مدل-داده)
- [کامپوننت‌های کلیدی](#کامپوننتهای-کلیدی)
- [کیفیت کد](#کیفیت-کد)
- [نکات UI/UX](#نکات-uiux)
- [نقشه‌راه](#نقشهراه)
- [عیب‌یابی](#عیبیابی)
- [مجوز](#مجوز)

---

## ویژگی‌ها

- 🎯 **ورود دادهٔ سه‌نقطه‌ای** برای هر پنجره
  - عرض: بالا / وسط / پایین
  - ارتفاع: چپ / وسط / راست
- 📏 **حد تلورانس (LIMIT)** اختصاصی برای هر پنجره + ضریب هشدار قابل‌تنظیم
- 🧮 **محاسبات خودکار** میانگین‌ها، رنج‌ها، قطر نظری/واقعی، اختلاف قطر و تلورانس‌ها
- ✅ وضعیت نهایی: **pass / warning / fail**
- 📊 **صفحه گزارش و نمودارها**
- 📤 **خروجی Excel**
  - نسخه‌ی **ExcelJS**: شیت‌های استایل‌دار، راست‌به‌چپ، رنگ وضعیت، عرض ستون‌ها، فرمت اعداد، فوتر خلاصه.
  - نسخه‌ی **SheetJS (XLSX)**: خروجی سبک و سریع
- 🧭 **Flow سه‌مرحله‌ای**: اطلاعات پروژه → ورود داده → گزارش/دانلود
- 🌗 **RTL** و سازگاری با تم روشن/تاریک
- 🧩 TypeScript کامل (بدون any) + ESLint/Prettier

---

## نمای کلی

1) کاربر اطلاعات پروژه را وارد می‌کند.  
2) طبقات را می‌سازد و برای هر طبقه پنجره‌ها را با اندازه‌های سه‌نقطه‌ای + LIMIT ثبت می‌کند.  
3) سیستم با فرمول استاندارد، خطاها/اعوجاج را محاسبه و وضعیت را مشخص می‌کند.  
4) گزارش وضعیت و خروجی Excel در اختیار کاربر قرار می‌گیرد.

---

## الگوریتم محاسبات تلورانس

**ورودی‌ها**  
- عرض‌ها: `Wtop, Wmid, Wbot`  
- ارتفاع‌ها: `Hleft, Hmid, Hright`  
- ابعاد اسمی: `W0, H0`  
- حد مجاز: `T` (LIMIT) و ضریب هشدار `k` (پیش‌فرض 1.5)

**میانگین‌ها**
```
W̄ = (Wtop + Wmid + Wbot) / 3
H̄ = (Hleft + Hmid + Hright) / 3
```

**رنج‌ها (اعوجاج مقطعی)**
```
RangeW = max(W*) - min(W*)
RangeH = max(H*) - min(H*)
```

**تلورانس ابعادی نسبت به اسمی**
```
TolW = | W̄ - W0 |
TolH = | H̄ - H0 |
```

**قطر نظری/واقعی و اختلاف**
```
Dth  = sqrt(W0^2 + H0^2)
Dact = sqrt(W̄^2 + H̄^2)
ΔD   = | Dact - Dth |
```

**قانون پذیرش**
```
PASS    : TolW ≤ T  ∧  TolH ≤ T  ∧  ΔD ≤ T  ∧  RangeW ≤ 2T  ∧  RangeH ≤ 2T
WARNING : همان شروط با k*T (و حداقل یکی > T)
FAIL    : غیر از دو حالت بالا
```

**اسکالر ترکیبی (اختیاری)**
```
Δ = max( TolW, TolH, ΔD, RangeW/2, RangeH/2 )
```

**پیاده‌سازی مرجع**: [`src/utils/computeWindowTolerance.ts`](src/utils/computeWindowTolerance.ts)

---

## ساختار پروژه

```
src/
  components/
    floor/FloorManager.tsx          # مدیریت طبقات + فرم ورود پنجره
    charts/ChartContainer.tsx       # نمودارها/گزارش
    layout/Header.tsx               # هدر + دکمه دانلود
    project/ProjectInfoForm.tsx     # فرم اطلاعات پروژه
  hooks/
    useFloorsData.ts                # منطق و مدل پنجره‌ها + محاسبات مشتق‌شده
    useProjectInfo.ts               # وضعیت/فرم پروژه
    useExcelExport.ts               # واسط خروجی Excel (ExcelJS)
  utils/
    computeWindowTolerance.ts       # فرمول تلورانس سه‌نقطه‌ای
    export/exceljs-export.ts        # خروجی Excel شیک (ExcelJS)
    tolerance/                      # خروجی ساده (SheetJS) + تایپ‌ها/کالس
  types/                            # تایپ‌های عمومی (در صورت وجود)
  pages/
    Index.tsx                       # صفحه اصلی (3 مرحله)
```

---

## راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- npm یا pnpm

### نصب و اجرا
```bash
# نصب
npm i

# اجرا در حالت توسعه
npm run dev

# ساخت نسخه تولید
npm run build

# پیش‌نمایش تولید
npm run preview

# بررسی کد با ESLint
npm run lint
```

---

## اسکریپت‌ها

| اسکریپت | توضیح |
|---|---|
| `dev` | اجرای محیط توسعه Vite |
| `build` | ساخت باندل تولید |
| `preview` | پیش‌نمایش باندل تولید |
| `lint` | اجرای ESLint با قوانین TypeScript |
| `format` | (در صورت تعریف) اجرای Prettier |

---

## خروجی Excel

### ExcelJS (ترجیحی)
- فایل: [`src/utils/export/exceljs-export.ts`](src/utils/export/exceljs-export.ts)
- امکانات: راست‌به‌چپ، استایل هدر، رنگ وضعیت (قبول/هشدار/مردود)، عرض ستون‌ها، فرمت اعداد، فوتر خلاصه.
- استفاده:
```ts
import { useExcelExport } from "@/hooks/useExcelExport";
const { exportToExcel } = useExcelExport();
exportToExcel(projectInfo, floors);
```

### SheetJS (ساده)
- فایل: [`src/utils/tolerance/excel.ts`](src/utils/tolerance/excel.ts)
- خروجی سریع با جدول‌های ساده (بدون استایل رنگی).

---

## مدل داده

### WindowInput
```ts
interface WindowInput {
  code: string;
  nominalWidth: number;
  nominalHeight: number;
  limit: number;
  widthTop: number; widthMiddle: number; widthBottom: number;
  heightLeft: number; heightMiddle: number; heightRight: number;
}
```

### WindowItem (مشتق‌شده)
```ts
interface WindowItem extends WindowInput {
  id: string; floorId: string;
  widthMean: number; heightMean: number;
  widthRange: number; heightRange: number;
  theoreticalDiagonal: number; actualDiagonal: number; diagonalDiff: number;
  widthTolerance: number; heightTolerance: number;
  status: 'pass' | 'warning' | 'fail';
}
```

### FloorItem
```ts
interface FloorItem {
  id: string;
  name?: string;
  floorNumber: number;
  windows: WindowItem[];
}
```

---

## کامپوننت‌های کلیدی

- **FloorManager**: فرم ورود پنجره با لیبل‌های واضح، اعتبارسنجی مقدماتی، لیست پنجره‌های طبقه.
- **Header**: شامل دکمه‌ی دانلود Excel که به `useExcelExport` متصل است.
- **ChartContainer**: نمایش آمار/نمودارها (در صورت استفاده از تایپ‌های قدیمی، آداپتور در `Index.tsx`).

---

## کیفیت کد

- TypeScript قوی؛ بدون `any` (قوانین `@typescript-eslint/no-explicit-any` پاس می‌شود).
- ESLint + Prettier (قابل سفارشی‌سازی).
- پوشه‌بندی ماژولار و قابل نگهداری.

---

## نکات UI/UX

- راست‌به‌چپ، قابل‌خواندن در هر دو تم روشن/تاریک.
- استفاده از توکن‌های عمومی shadcn/ui: `bg-muted`, `text-muted-foreground`, `border` و…
- کال‌اوت راهنما با مرزبندی و پس‌زمینه‌ی ملایم (نمونه در `Index.tsx`).

---

## نقشه‌راه

- [ ] ذخیره‌سازی Local/Cloud
- [ ] افزودن لوگو به ExcelJS و Freeze Header
- [ ] Pivot خلاصه‌آماری در Excel
- [ ] تست واحد برای فرمول `computeWindowTolerance`
- [ ] چندزبانه‌سازی (i18n) و English UI

---

## عیب‌یابی

- **دانلود اکسل کار نمی‌کند**: مطمئن شوید `useExcelExport` به `Header` وصل است و `projectInfo` و `floors` مقدار دارند. در کنسول خطا را بررسی کنید.
- **رنگ/پس‌زمینه‌ی راهنما سفید است**: از `bg-muted/50` و `text-muted-foreground` استفاده کنید یا توکن‌های سفارشی را در `tailwind.config.js` تعریف کنید.
- **ارور ESLint درباره any**: نسخه‌های نهایی `useExcelExport.ts` و `Index.tsx` بدون any هستند؛ حتماً جایگزین شوند.
- **ناسازگاری ExcelJS properties**: از `wb.creator/created/...` استفاده کنید؛ `wb.properties.title` ممکن است در تایپ نسخه شما وجود نداشته باشد.

---

## مجوز

این پروژه تحت مجوز MIT منتشر می‌شود (در صورت نیاز تغییر دهید).

---

### یادداشت توسعه
اگر نیاز دارید تلورانس را وزنی کنید (حساسیت بیشتر به رنج‌ها یا اختلاف قطر)، در `computeWindowTolerance` به‌سادگی می‌توان ضرایب وزنی افزود و آستانه‌ها را تطبیق داد.
