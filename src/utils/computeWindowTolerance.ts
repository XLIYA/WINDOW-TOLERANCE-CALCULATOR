// src/utils/computeWindowTolerance.ts
export type Status = 'pass' | 'warning' | 'fail';

export interface ToleranceInput {
  // سه اندازه عرض
  Wtop: number; Wmid: number; Wbot: number;
  // سه اندازه ارتفاع
  Hleft: number; Hmid: number; Hright: number;
  // ابعاد اسمی
  W0: number; H0: number;
  // LIMIT و ضریب هشدار
  T: number; k?: number; // k پیش‌فرض 1.5
}

export interface ToleranceResult {
  Wbar: number; Hbar: number;           // میانگین‌ها
  RangeW: number; RangeH: number;       // رنج‌ها
  TolW: number; TolH: number;           // خطای ابعادی نسبت به اسمی
  Dth: number; Dact: number; DeltaD: number; // قطرها و اختلاف‌شان
  DeltaScalar: number;                  // اسکالر ترکیبی: max(TolW, TolH, DeltaD, RangeW/2, RangeH/2)
  status: Status;
}

export function computeWindowTolerance(inp: ToleranceInput): ToleranceResult {
  const { Wtop, Wmid, Wbot, Hleft, Hmid, Hright, W0, H0, T, k = 1.5 } = inp;

  const Wbar = (Wtop + Wmid + Wbot) / 3;
  const Hbar = (Hleft + Hmid + Hright) / 3;

  const RangeW = Math.max(Wtop, Wmid, Wbot) - Math.min(Wtop, Wmid, Wbot);
  const RangeH = Math.max(Hleft, Hmid, Hright) - Math.min(Hleft, Hmid, Hright);

  const TolW = Math.abs(Wbar - W0);
  const TolH = Math.abs(Hbar - H0);

  const Dth = Math.sqrt(W0 * W0 + H0 * H0);
  const Dact = Math.sqrt(Wbar * Wbar + Hbar * Hbar);
  const DeltaD = Math.abs(Dact - Dth);

  const DeltaScalar = Math.max(TolW, TolH, DeltaD, RangeW / 2, RangeH / 2);

  const passCond =
    TolW <= T &&
    TolH <= T &&
    DeltaD <= T &&
    RangeW <= 2 * T &&
    RangeH <= 2 * T;

  const warnCond =
    TolW <= k * T &&
    TolH <= k * T &&
    DeltaD <= k * T &&
    RangeW <= 2 * k * T &&
    RangeH <= 2 * k * T;

  const status: Status = passCond ? 'pass' : warnCond ? 'warning' : 'fail';

  return { Wbar, Hbar, RangeW, RangeH, TolW, TolH, Dth, Dact, DeltaD, DeltaScalar, status };
}
