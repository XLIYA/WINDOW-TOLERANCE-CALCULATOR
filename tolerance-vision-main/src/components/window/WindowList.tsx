import React from 'react';
import { Trash2, CheckCircle, AlertCircle, XCircle, ArrowUpDown } from 'lucide-react';
import { WindowData } from '@/types';

interface WindowListProps {
  windows: WindowData[];
  floorNumber: number;
  onRemove: (windowId: string) => void;
}

const STATUS_LABELS = {
  pass: 'قبول',
  warning: 'هشدار', 
  fail: 'مردود'
};

export const WindowList: React.FC<WindowListProps> = ({ windows, floorNumber, onRemove }) => {
  const getStatusIcon = (status: WindowData['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'fail':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusStyle = (status: WindowData['status']) => {
    switch (status) {
      case 'pass':
        return 'text-success bg-success-light border-success/20';
      case 'warning':
        return 'text-warning bg-warning-light border-warning/20';
      case 'fail':
        return 'text-destructive bg-destructive-light border-destructive/20';
    }
  };

  return (
    <div className="bg-card rounded-2xl border-2 border-border overflow-hidden shadow-lg animate-fade-in">
      <div className="px-8 py-6 bg-gradient-subtle border-b border-border">
        <h3 className="text-xl font-bold text-foreground">
          پنجره‌های طبقه {floorNumber}
        </h3>
        <p className="text-muted-foreground mt-1">
          {windows.length} پنجره ثبت شده
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="px-6 py-4 text-right text-sm font-bold text-foreground">
                کد پنجره
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-foreground">
                <div className="flex items-center gap-2">
                  <span>ابعاد</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-foreground">
                قطر نظری
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-foreground">
                اختلاف قطر
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-foreground">
                وضعیت
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-foreground">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {windows.map((window, index) => (
              <tr 
                key={window.id} 
                className="hover:bg-muted/20 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-foreground bg-primary/5 px-3 py-1 rounded-lg">
                    {window.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">
                    <span className="font-medium">{window.width}</span>
                    <span className="text-muted-foreground mx-1">×</span>
                    <span className="font-medium">{window.height}</span>
                    <span className="text-xs text-muted-foreground mr-1">mm</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-foreground font-medium">
                    {window.theoreticalDiagonal.toFixed(1)} mm
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border
                    ${window.diagonalDiff > 5 
                      ? 'bg-destructive-light text-destructive border-destructive/20' 
                      : window.diagonalDiff > 2
                      ? 'bg-warning-light text-warning border-warning/20'
                      : 'bg-success-light text-success border-success/20'
                    }
                  `}>
                    {window.diagonalDiff.toFixed(2)} mm
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border
                    ${getStatusStyle(window.status)}
                  `}>
                    {getStatusIcon(window.status)}
                    {STATUS_LABELS[window.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onRemove(window.id)}
                    className="group p-2 text-muted-foreground hover:text-destructive hover:bg-destructive-light rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};