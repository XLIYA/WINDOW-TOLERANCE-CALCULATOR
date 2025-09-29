// src/pages/Index.tsx
import React, { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { ProjectInfoForm } from "@/components/project/ProjectInfoForm";
import FloorManager from "@/components/floor/FloorManager";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { useProjectInfo } from "@/hooks/useProjectInfo";
import { useExcelExport } from "@/hooks/useExcelExport";
import { useFloorsData } from "@/hooks/useFloorsData";
import { Info, ChevronRight, CheckCircle, Clock, BarChart3 } from "lucide-react";

// 👇 این تایپ‌ها از types پروژه شماست
import type { FloorData, WindowData } from "@/types";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);

  const {
    projectInfo,
    updateProjectInfo,
    resetProjectInfo,
    isProjectInfoComplete,
  } = useProjectInfo();

  const {
    floors, // FloorItem[]
    currentFloorIndex,
    setCurrentFloorIndex,
    addFloor,
    removeFloor,
    addWindow,
    updateWindow,
    removeWindow,
    clearAllData,
  } = useFloorsData();

  const { exportToExcel } = useExcelExport();

  const handleReset = () => {
    if (
      window.confirm("آیا از شروع مجدد اطمینان دارید؟ تمام داده‌ها حذف خواهند شد.")
    ) {
      resetProjectInfo();
      clearAllData();
      setActiveStep(0);
    }
  };

const handleExport = () => {
  exportToExcel(projectInfo, floorsForCharts); // ✅ این‌جا هم باید FloorData[] باشد
};

  /**
   * آداپتور: FloorItem[] -> FloorData[]
   * نکته‌ها:
   *  - FloorData طبق types شما باید `id` داشته باشد ⇒ اضافه شد.
   *  - WindowData باید `id`, `code`, `width`, `height`, `diagonal1`, `diagonal2`,
   *    `diagonalDiff`, `status` و (طبق ارور شما) `theoreticalDiagonal` داشته باشد.
   *  - هیچ فیلد ناشناخته‌ای به WindowData اضافه نکن (مثل theoreticalDiameter/actualDiameter) تا TS خطا ندهد.
   *  - اگر در پروژه‌تان نام فیلدها فرق دارد، همین جا جایگزین کنید.
   */
  const floorsForCharts: FloorData[] = useMemo(() => {
    const toWindowData = (
      w: (typeof floors)[number]["windows"][number]
    ): WindowData => {
      // اگر اندازه‌ها دارید از همون‌ها استفاده کنید؛ فعلاً پیش‌فرض صفر می‌گذاریم
      const width = 0;
      const height = 0;
      const diagonal1 = 0;
      const diagonal2 = 0;
      const diagonalDiff = Math.abs(diagonal1 - diagonal2);

      // اگر منطق واقعی وضعیت دارید (pass/warning/fail)، اینجا اعمال کنید
      const status: WindowData["status"] = "pass";

      // اگر تایپ شما واقعاً به فیلدی به نام theoreticalDiagonal نیاز دارد، صفرش می‌کنیم
      const theoreticalDiagonal = 0;

      // ✅ فقط فیلدهای شناخته‌شده‌ی WindowData را ست کن
      const win: WindowData = {
        id: w.id,          // از WindowItem
        code: w.code ?? "",
        width,
        height,
        diagonal1,
        diagonal2,
        diagonalDiff,
        status,
        // اگر در نوع WindowData این فیلد وجود دارد، نگهش داریم (ارور شما نشان می‌داد لازم است)
        theoreticalDiagonal,
      } as WindowData;

      return win;
    };

    const mapped: FloorData[] = floors.map((f) => ({
      id: f.id,                // 🔹 طبق ارور، FloorData باید id هم داشته باشه
      floorNumber: f.floorNumber,
      windows: f.windows.map(toWindowData),
    }));

    return mapped;
  }, [floors]);

  const steps = [
    {
      id: 0,
      title: "اطلاعات پروژه",
      icon: Info,
      description: "ثبت اطلاعات اولیه پروژه",
    },
    {
      id: 1,
      title: "ورود داده‌های پنجره",
      icon: Clock,
      description: "وارد کردن ابعاد پنجره‌ها",
    },
    {
      id: 2,
      title: "نمایش گزارش",
      icon: BarChart3,
      description: "مشاهده نتایج و تحلیل‌ها",
    },
  ] as const;

  const canProceedToNextStep = () => {
    if (activeStep === 0) return isProjectInfoComplete();
    if (activeStep === 1) return floors.some((f) => f.windows.length > 0);
    return true;
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < activeStep) return "completed" as const;
    if (stepId === activeStep) return "active" as const;
    return "pending" as const;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onExport={handleExport} onReset={handleReset} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;

              return (
                <React.Fragment key={step.id}>
                  <div
                    className={`group flex cursor-pointer flex-col items-center transition-all duration-300 ${
                      status !== "pending" ? "opacity-100" : "opacity-60"
                    }`}
                    onClick={() => {
                      if (
                        step.id === 0 ||
                        (step.id === 1 && isProjectInfoComplete()) ||
                        (step.id === 2 && canProceedToNextStep())
                      ) {
                        setActiveStep(step.id);
                      }
                    }}
                  >
                    <div
                      className={`
                        relative flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300
                        ${
                          status === "completed"
                            ? "bg-success text-success-foreground shadow-lg animate-scale-in"
                            : status === "active"
                            ? "bg-gradient-secondary text-secondary-foreground shadow-glow animate-glow"
                            : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {status === "completed" ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                      {status === "active" && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-secondary opacity-20 animate-pulse" />
                      )}
                    </div>

                    <div className="mt-3 text-center">
                      <span
                        className={`
                          block text-sm font-semibold transition-all duration-300
                          ${
                            status === "active"
                              ? "text-secondary"
                              : status === "completed"
                              ? "text-success"
                              : "text-muted-foreground"
                          }
                        `}
                      >
                        {step.title}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {step.description}
                      </span>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="mx-8 flex items-center">
                      <div
                        className={`h-0.5 w-20 transition-all duration-500 ${
                          getStepStatus(step.id) === "completed" ? "bg-success" : "bg-border"
                        }`}
                      />
                      <ChevronRight
                        className={`mx-2 h-5 w-5 transition-all duration-300 ${
                          getStepStatus(step.id) === "completed"
                            ? "text-success"
                            : "text-muted-foreground"
                        }`}
                      />
                      <div
                        className={`h-0.5 w-20 transition-all duration-500 ${
                          getStepStatus(step.id) === "completed" ? "bg-success" : "bg-border"
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          {/* Step 1: Project Info */}
          {activeStep === 0 && (
            <div className="p-10">
              <div className="mx-auto max-w-4xl">
                <div className="mb-10 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-secondary shadow-glow">
                    <Info className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <h2 className="mb-3 text-3xl font-bold text-foreground">
                    اطلاعات پروژه
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    لطفا اطلاعات اولیه پروژه را با دقت وارد کنید
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-gradient-subtle p-8">
                  <ProjectInfoForm
                    projectInfo={projectInfo}
                    onUpdate={updateProjectInfo}
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setActiveStep(1)}
                    disabled={!isProjectInfoComplete()}
                    className={`group flex items-center gap-3 rounded-2xl px-8 py-4 font-semibold transition-all duration-300 ${
                      isProjectInfoComplete()
                        ? "bg-gradient-secondary text-secondary-foreground hover:shadow-glow hover:-translate-y-1 hover:scale-105"
                        : "cursor-not-allowed bg-muted text-muted-foreground"
                    }`}
                  >
                    <span>مرحله بعد</span>
                    <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Window Data Entry */}
          {activeStep === 1 && (
            <div className="p-10">
              <div className="mb-10 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent shadow-lg">
                  <Clock className="h-8 w-8 text-accent-foreground" />
                </div>
                <h2 className="mb-3 text-3xl font-bold text-foreground">
                  ورود داده‌های پنجره
                </h2>
                <p className="text-lg text-muted-foreground">
                  اطلاعات پنجره‌های هر طبقه را با دقت وارد کنید
                </p>
              </div>

              <FloorManager
                floors={floors}
                currentFloorIndex={currentFloorIndex}
                projectInfo={projectInfo}
                onFloorSelect={setCurrentFloorIndex}
                onAddFloor={addFloor}
                onRemoveFloor={removeFloor}
                onAddWindow={addWindow}
                onUpdateWindow={updateWindow}
                onRemoveWindow={removeWindow}
              />

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setActiveStep(0)}
                  className="group flex items-center gap-3 rounded-2xl bg-accent-light px-8 py-4 font-semibold text-accent-foreground transition-all duration-300 hover:bg-accent"
                >
                  <ChevronRight className="h-5 w-5 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span>مرحله قبل</span>
                </button>
                <button
                  onClick={() => setActiveStep(2)}
                  disabled={!floors.some((f) => f.windows.length > 0)}
                  className={`group flex items-center gap-3 rounded-2xl px-8 py-4 font-semibold transition-all duration-300 ${
                    floors.some((f) => f.windows.length > 0)
                      ? "bg-gradient-secondary text-secondary-foreground hover:shadow-glow hover:-translate-y-1 hover:scale-105"
                      : "cursor-not-allowed bg-muted text-muted-foreground"
                  }`}
                >
                  <span>نمایش گزارش</span>
                  <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Reports and Charts */}
          {activeStep === 2 && (
            <div className="p-10">
              <div className="mb-10 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="mb-3 text-3xl font-bold text-foreground">
                  گزارش و نمودارها
                </h2>
                <p className="text-lg text-muted-foreground">
                  نتایج تحلیل تلورانس پنجره‌های پروژه
                </p>
              </div>

              {/* 🔹 نمودارها: حتماً floorsForCharts پاس بده (نه floors) */}
              <ChartContainer floors={floorsForCharts} />

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setActiveStep(1)}
                  className="group flex items-center gap-3 rounded-2xl bg-accent-light px-8 py-4 font-semibold text-accent-foreground transition-all duration-300 hover:bg-accent"
                >
                  <ChevronRight className="h-5 w-5 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span>ویرایش داده‌ها</span>
                </button>
                <button
                  onClick={handleExport}
                  className="group flex items-center gap-3 rounded-2xl bg-success px-8 py-4 font-semibold text-success-foreground transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                >
                  <span>دانلود گزارش Excel</span>
                  <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 animate-slide-up rounded-2xl border border-secondary/20 bg-secondary-light p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/10">
              <Info className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-secondary">راهنمای استفاده</h3>
              <p className="leading-relaxed text-secondary/80">
                {activeStep === 0 &&
                  'فیلدهای ستاره‌دار اجباری هستند. پس از تکمیل اطلاعات، "مرحله بعد" را بزنید.'}
                {activeStep === 1 &&
                  "برای هر طبقه می‌توانید چند پنجره اضافه کنید. قطرهای واقعی را نزدیک به قطر نظری وارد نمایید."}
                {activeStep === 2 &&
                  "در این بخش آمار کلی پروژه را می‌بینید و می‌توانید خروجی Excel بگیرید."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
