import React, { useState } from 'react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Download } from 'lucide-react';
import { FloorData, ChartType, Statistics } from '@/types';
import { StatisticsCards } from '../statistics/StatisticsCards';

interface ChartContainerProps {
  floors: FloorData[];
}

const calculateStatistics = (floors: FloorData[]): Statistics => {
  const allWindows = floors.flatMap(floor => floor.windows);
  return {
    total: allWindows.length,
    pass: allWindows.filter(w => w.status === 'pass').length,
    warning: allWindows.filter(w => w.status === 'warning').length,
    fail: allWindows.filter(w => w.status === 'fail').length
  };
};

export const ChartContainer: React.FC<ChartContainerProps> = ({ floors }) => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('bar');
  
  const statistics = calculateStatistics(floors);

  const chartButtons: { type: ChartType; label: string; icon: React.ElementType }[] = [
    { type: 'bar', label: 'میله‌ای', icon: BarChart3 },
    { type: 'line', label: 'خطی', icon: TrendingUp },
    { type: 'pie', label: 'دایره‌ای', icon: PieChartIcon }
  ];

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <StatisticsCards statistics={statistics} />

      {/* Charts */}
      {statistics.total > 0 && (
        <div className="bg-card rounded-2xl border-2 border-border overflow-hidden shadow-lg">
          <div className="px-8 py-6 bg-gradient-subtle border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">نمودار تحلیل داده‌ها</h3>
              
              <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-1.5 border border-border">
                {chartButtons.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                      ${selectedChart === type 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-card'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="h-80 bg-muted/10 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {selectedChart === 'bar' && <BarChart3 className="w-8 h-8 text-primary" />}
                  {selectedChart === 'line' && <TrendingUp className="w-8 h-8 text-primary" />}
                  {selectedChart === 'pie' && <PieChartIcon className="w-8 h-8 text-primary" />}
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">نمودار {chartButtons.find(c => c.type === selectedChart)?.label}</h4>
                <p className="text-muted-foreground">نمودار در حال توسعه است</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Report */}
      <div className="bg-gradient-subtle rounded-2xl p-8 border-2 border-primary/20 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">خلاصه گزارش پروژه</h3>
          <div className="p-2 bg-primary/10 rounded-xl">
            <Download className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground mb-2">میانگین دقت</p>
            <p className="text-3xl font-bold text-success">
              {statistics.total > 0 
                ? `${((statistics.pass / statistics.total) * 100).toFixed(1)}%`
                : '0%'
              }
            </p>
            <p className="text-xs text-muted-foreground mt-1">از کل پنجره‌ها</p>
          </div>
          
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground mb-2">بیشترین انحراف</p>
            <p className="text-3xl font-bold text-destructive">
              {floors.reduce((max, floor) => {
                const floorMax = Math.max(...floor.windows.map(w => w.diagonalDiff));
                return Math.max(max, floorMax || 0);
              }, 0).toFixed(2)} mm
            </p>
            <p className="text-xs text-muted-foreground mt-1">حداکثر اختلاف</p>
          </div>
          
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground mb-2">تعداد طبقات</p>
            <p className="text-3xl font-bold text-primary">
              {floors.length} طبقه
            </p>
            <p className="text-xs text-muted-foreground mt-1">کل طبقات پروژه</p>
          </div>
        </div>
      </div>
    </div>
  );
};