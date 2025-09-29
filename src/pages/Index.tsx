
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProjectInfoForm } from '@/components/project/ProjectInfoForm';
import { FloorManager } from '@/components/floor/FloorManager';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { useProjectInfo } from '@/hooks/useProjectInfo';
import { useWindowData } from '@/hooks/useWindowData';
import { useExcelExport } from '@/hooks/useExcelExport';
import { Info, ChevronRight, CheckCircle, Clock, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const { projectInfo, updateProjectInfo, resetProjectInfo, isProjectInfoComplete } = useProjectInfo();
  const {
    floors,
    currentFloorIndex,
    setCurrentFloorIndex,
    addFloor,
    removeFloor,
    addWindow,
    removeWindow,
    clearAllData,
  } = useWindowData();

  const { exportToExcel } = useExcelExport();

  const handleReset = () => {
    if (window.confirm('آیا از شروع مجدد اطمینان دارید؟ تمام داده‌ها حذف خواهند شد.')) {
      resetProjectInfo();
      clearAllData();
      setActiveStep(0);
    }
  };

  const handleExport = () => {
    exportToExcel(projectInfo, floors);
  };

  const steps = [
    {
      id: 0,
      title: 'اطلاعات پروژه',
      icon: Info,
      description: 'ثبت اطلاعات اولیه پروژه'
    },
    {
      id: 1,
      title: 'ورود داده‌های پنجره',
      icon: Clock,
      description: 'وارد کردن ابعاد پنجره‌ها'
    },
    {
      id: 2,
      title: 'نمایش گزارش',
      icon: BarChart3,
      description: 'مشاهده نتایج و تحلیل‌ها'
    }
  ];

  const canProceedToNextStep = () => {
    if (activeStep === 0) return isProjectInfoComplete();
    if (activeStep === 1) return floors.some(floor => floor.windows.length > 0);
    return true;
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < activeStep) return 'completed';
    if (stepId === activeStep) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onExport={handleExport} onReset={handleReset} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;

              return (
                <React.Fragment key={step.id}>
                  <div
                    className={`
                      group flex flex-col items-center cursor-pointer transition-all duration-300
                      ${status !== 'pending' ? 'opacity-100' : 'opacity-60'}
                    `}
                    onClick={() => {
                      if (step.id === 0 || (step.id === 1 && isProjectInfoComplete()) || (step.id === 2 && canProceedToNextStep())) {
                        setActiveStep(step.id);
                      }
                    }}
                  >
                    <div className={`
                      relative w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300
                      ${status === 'completed'
                        ? 'bg-success text-success-foreground shadow-lg animate-scale-in'
                        : status === 'active'
                          ? 'bg-gradient-secondary text-secondary-foreground shadow-glow animate-glow'
                          : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {status === 'completed' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}

                      {status === 'active' && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-secondary opacity-20 animate-pulse" />
                      )}
                    </div>

                    <div className="mt-3 text-center">
                      <span className={`
                        block text-sm font-semibold transition-all duration-300
                        ${status === 'active' ? 'text-secondary' : status === 'completed' ? 'text-success' : 'text-muted-foreground'}
                      `}>
                        {step.title}
                      </span>
                      <span className="block text-xs text-muted-foreground mt-1">
                        {step.description}
                      </span>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex items-center mx-8">
                      <div className={`
                        w-20 h-0.5 transition-all duration-500
                        ${getStepStatus(step.id) === 'completed' ? 'bg-success' : 'bg-border'}
                      `} />
                      <ChevronRight className={`
                        w-5 h-5 mx-2 transition-all duration-300
                        ${getStepStatus(step.id) === 'completed' ? 'text-success' : 'text-muted-foreground'}
                      `} />
                      <div className={`
                        w-20 h-0.5 transition-all duration-500
                        ${getStepStatus(step.id) === 'completed' ? 'bg-success' : 'bg-border'}
                      `} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden animate-fade-in">
          {/* Step 1: Project Info */}
          {activeStep === 0 && (
            <div className="p-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-secondary rounded-2xl mb-4 shadow-glow">
                    <Info className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">اطلاعات پروژه</h2>
                  <p className="text-muted-foreground text-lg">لطفا اطلاعات اولیه پروژه را با دقت وارد کنید</p>
                </div>

                <div className="bg-gradient-subtle rounded-2xl p-8 border border-border">
                  <ProjectInfoForm
                    projectInfo={projectInfo}
                    onUpdate={updateProjectInfo}
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setActiveStep(1)}
                    disabled={!isProjectInfoComplete()}
                    className={`
                      group px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3
                      ${isProjectInfoComplete()
                        ? 'bg-gradient-secondary text-secondary-foreground hover:shadow-glow transform hover:-translate-y-1 hover:scale-105'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }
                    `}
                  >
                    <span>مرحله بعد</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Window Data Entry */}
          {activeStep === 1 && (
            <div className="p-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-2xl mb-4 shadow-lg">
                  <Clock className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">ورود داده‌های پنجره</h2>
                <p className="text-muted-foreground text-lg">اطلاعات پنجره‌های هر طبقه را با دقت وارد کنید</p>
              </div>

              <FloorManager
                floors={floors}
                currentFloorIndex={currentFloorIndex}
                projectInfo={projectInfo}
                onFloorSelect={setCurrentFloorIndex}
                onAddFloor={addFloor}
                onRemoveFloor={removeFloor}
                onAddWindow={addWindow}
                onRemoveWindow={removeWindow}
              />

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setActiveStep(0)}
                  className="group px-8 py-4 rounded-2xl font-semibold text-accent-foreground bg-accent-light hover:bg-accent transition-all duration-300 flex items-center gap-3"
                >
                  <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>مرحله قبل</span>
                </button>
                <button
                  onClick={() => setActiveStep(2)}
                  disabled={!floors.some(floor => floor.windows.length > 0)}
                  className={`
                    group px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3
                    ${floors.some(floor => floor.windows.length > 0)
                      ? 'bg-gradient-secondary text-secondary-foreground hover:shadow-glow transform hover:-translate-y-1 hover:scale-105'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }
                  `}
                >
                  <span>نمایش گزارش</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Reports and Charts */}
          {activeStep === 2 && (
            <div className="p-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">گزارش و نمودارها</h2>
                <p className="text-muted-foreground text-lg">نتایج تحلیل تلورانس پنجره‌های پروژه</p>
              </div>

              <ChartContainer floors={floors} />

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setActiveStep(1)}
                  className="group px-8 py-4 rounded-2xl font-semibold text-accent-foreground bg-accent-light hover:bg-accent transition-all duration-300 flex items-center gap-3"
                >
                  <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>ویرایش داده‌ها</span>
                </button>
                <button
                  onClick={handleExport}
                  className="group px-8 py-4 rounded-2xl font-semibold bg-success text-success-foreground hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-3"
                >
                  <span>دانلود گزارش Excel</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-secondary-light rounded-2xl p-8 border border-secondary/20 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Info className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-secondary text-lg mb-2">راهنمای استفاده</h3>
              <p className="text-secondary/80 leading-relaxed">
                {activeStep === 0 && 'فیلدهای ستاره‌دار اجباری هستند. پس از تکمیل اطلاعات، "مرحله بعد" را بزنید.'}
                {activeStep === 1 && 'برای هر طبقه می‌توانید چند پنجره اضافه کنید. قطرهای واقعی را نزدیک به قطر نظری وارد نمایید.'}
                {activeStep === 2 && 'در این بخش آمار کلی پروژه را می‌بینید و می‌توانید خروجی Excel بگیرید.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}