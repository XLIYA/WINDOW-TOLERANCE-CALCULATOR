// src/components/charts/ChartContainer.tsx
import React, { useMemo, useState } from "react";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Download,
} from "lucide-react";
import { FloorData, ChartType, Statistics } from "@/types";

import {
  BarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { StatisticsCards } from "../statistics/StatisticsCards";

interface ChartContainerProps {
  floors: FloorData[];
}

const STATUS_COLORS: Record<"pass" | "warning" | "fail", string> = {
  pass: "#10b981",   // سبز
  warning: "#f59e0b",// زرد
  fail: "#ef4444",   // قرمز
};

// ⚠️ مطابق نوع Statistics فعلی شما: بدون passRate
const calculateStatistics = (floors: FloorData[]): Statistics => {
  const allWindows = floors.flatMap((floor) => floor.windows);
  const total = allWindows.length;
  const pass = allWindows.filter((w) => w.status === "pass").length;
  const warning = allWindows.filter((w) => w.status === "warning").length;
  const fail = allWindows.filter((w) => w.status === "fail").length;
  return { total, pass, warning, fail };
};

export const ChartContainer: React.FC<ChartContainerProps> = ({ floors }) => {
  const [selectedChart, setSelectedChart] = useState<ChartType>("bar");

  const statistics = useMemo(() => calculateStatistics(floors), [floors]);
  const passRate = useMemo(
    () => (statistics.total > 0 ? (statistics.pass / statistics.total) * 100 : 0),
    [statistics.total, statistics.pass]
  );

  /** دادهٔ نمودار میله‌ای/خطی */
  const barData = useMemo(() => {
    return floors.map((floor) => {
      const pass = floor.windows.filter((w) => w.status === "pass").length;
      const warning = floor.windows.filter((w) => w.status === "warning").length;
      const fail = floor.windows.filter((w) => w.status === "fail").length;

      return {
        name: `طبقه ${floor.floorNumber}`,
        pass,
        warning,
        fail,
      };
    });
  }, [floors]);

  /** دادهٔ نمودار دایره‌ای */
  const pieData = useMemo(() => {
    const aggregated = floors.reduce(
      (acc, floor) => {
        floor.windows.forEach((w) => {
          if (w.status === "pass" || w.status === "warning" || w.status === "fail") {
            acc[w.status] += 1;
          }
        });
        return acc;
      },
      { pass: 0, warning: 0, fail: 0 }
    );

    return [
      { name: "قبول", value: aggregated.pass, key: "pass" as const },
      { name: "هشدار", value: aggregated.warning, key: "warning" as const },
      { name: "مردود", value: aggregated.fail, key: "fail" as const },
    ];
  }, [floors]);

  const chartButtons: { type: ChartType; label: string; icon: React.ElementType }[] = [
    { type: "bar", label: "میله‌ای", icon: BarChart3 },
    { type: "line", label: "خطی", icon: TrendingUp },
    { type: "pie", label: "دایره‌ای", icon: PieChartIcon },
  ];

  /** بیشترین انحراف با محافظ */
  const maxDeviation = useMemo(() => {
    const perFloorMax = floors.map((floor) => {
      if (floor.windows.length === 0) return 0;
      const diffs = floor.windows
        .map((w) => (Number.isFinite(w.diagonalDiff) ? w.diagonalDiff : 0))
        .filter((x) => Number.isFinite(x));
      return diffs.length ? Math.max(...diffs) : 0;
    });
    return perFloorMax.length ? Math.max(...perFloorMax) : 0;
  }, [floors]);

  /** ✅ فقط یک کودک برای ResponsiveContainer */
  const chartElement = useMemo<React.ReactElement>(() => {
    if (selectedChart === "bar") {
      return (
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} />
          <YAxis allowDecimals={false} />
          <ReTooltip />
          <Legend />
          <Bar dataKey="pass" name="قبول" fill={STATUS_COLORS.pass} />
          <Bar dataKey="warning" name="هشدار" fill={STATUS_COLORS.warning} />
          <Bar dataKey="fail" name="مردود" fill={STATUS_COLORS.fail} />
        </BarChart>
      );
    }
    if (selectedChart === "line") {
      return (
        <ReLineChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} />
          <YAxis allowDecimals={false} />
          <ReTooltip />
          <Legend />
          <Line type="monotone" dataKey="pass" name="قبول" stroke={STATUS_COLORS.pass} />
          <Line type="monotone" dataKey="warning" name="هشدار" stroke={STATUS_COLORS.warning} />
          <Line type="monotone" dataKey="fail" name="مردود" stroke={STATUS_COLORS.fail} />
        </ReLineChart>
      );
    }
    // pie
    return (
      <RePieChart>
        <ReTooltip />
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={STATUS_COLORS[entry.key]}
            />
          ))}
        </Pie>
      </RePieChart>
    );
  }, [selectedChart, barData, pieData]);

  return (
    <div className="space-y-8">
      {/* کارت‌های آمار – نوع Statistics بدون passRate */}
      <StatisticsCards statistics={statistics} />

      {statistics.total > 0 && (
        <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg">
          <div className="border-b border-border bg-gradient-subtle px-8 py-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">نمودار تحلیل داده‌ها</h3>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-1.5">
                {chartButtons.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      selectedChart === type
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex h-80 items-center justify-center rounded-xl bg-muted/10">
              <ResponsiveContainer width="100%" height="100%">
                {chartElement /* ✅ یک کودک واحد */}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* خلاصه گزارش پایین نمودار */}
      <div className="rounded-2xl border-2 border-primary/20 bg-gradient-subtle p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">خلاصه گزارش پروژه</h3>
          <div className="rounded-xl bg-primary/10 p-2">
            <Download className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-muted-foreground">میانگین دقت</p>
            <p className="text-3xl font-bold text-success">
              {passRate.toFixed(1)}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">از کل پنجره‌ها</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-muted-foreground">بیشترین انحراف</p>
            <p className="text-3xl font-bold text-destructive">
              {maxDeviation.toFixed(2)} mm
            </p>
            <p className="mt-1 text-xs text-muted-foreground">حداکثر اختلاف</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-muted-foreground">تعداد طبقات</p>
            <p className="text-3xl font-bold text-primary">{floors.length} طبقه</p>
            <p className="mt-1 text-xs text-muted-foreground">کل طبقات پروژه</p>
          </div>
        </div>
      </div>
    </div>
  );
};
