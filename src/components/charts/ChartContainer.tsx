import React, { useState } from 'react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Download } from 'lucide-react';
import { FloorData, ChartType } from '@/types';
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
} from 'recharts';
import { StatisticsCards } from '../statistics/StatisticsCards';
import { Statistics } from '@/types';

interface ChartContainerProps {
  floors: FloorData[];
}

const calculateStatistics = (floors: FloorData[]): Statistics => {
  const allWindows = floors.flatMap(floor => floor.windows);
  const total = allWindows.length;
  const pass = allWindows.filter(w => w.status === 'pass').length;
  const warning = allWindows.filter(w => w.status === 'warning').length;
  const fail = allWindows.filter(w => w.status === 'fail').length;
  const passRate = total > 0 ? (pass / total) * 100 : 0;
  return {
    total,
    pass,
    warning,
    fail,
    passRate,
  };
};

export const ChartContainer: React.FC<ChartContainerProps> = ({ floors }) => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('bar');
  
  const statistics = calculateStatistics(floors);

  // Prepare data for charts
  const barData = floors.map(floor => {
    const pass = floor.windows.filter(w => w.status === 'pass').length;
    const warning = floor.windows.filter(w => w.status === 'warning').length;
    const fail = floor.windows.filter(w => w.status === 'fail').length;
    return {
      name: `طبقه ${floor.floorNumber}`,
      pass,
      warning,
      fail,
    };
  });

  const aggregated = floors.reduce(
    (acc, floor) => {
      floor.windows.forEach(w => {
        acc[w.status]++;
      });
      return acc;
    },
    { pass: 0, warning: 0, fail: 0 }
  );

  const pieData = [
    { name: 'قبول', value: aggregated.pass, key: 'pass' },
    { name: 'هشدار', value: aggregated.warning, key: 'warning' },
    { name: 'مردود', value: aggregated.fail, key: 'fail' },
  ];

  const STATUS_COLORS: Record<string, string> = {
    pass: '#10b981',
    warning: '#f59e0b',
    fail: '#ef4444',
  };

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
              <ResponsiveContainer width="100%" height="100%">
                {selectedChart === 'bar' && (
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
                )}
                {selectedChart === 'line' && (
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
                )}
                {selectedChart === 'pie' && (
                  <RePieChart>
                    <ReTooltip />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.key]} />
                      ))}
                    </Pie>
                  </RePieChart>
                )}
              </ResponsiveContainer>
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