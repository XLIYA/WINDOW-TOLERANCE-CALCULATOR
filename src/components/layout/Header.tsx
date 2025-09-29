import React from 'react';
import { Calculator, RefreshCw, Download } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, onReset }) => {
  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-gradient-primary rounded-2xl shadow-lg">
                <Calculator className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl animate-glow opacity-50" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">سیستم کنترل تلورانس</h1>
              <p className="text-sm text-muted-foreground">محاسبه دقیق ابعاد پنجره‌های ساختمانی</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExport}
              className="group p-3 text-success hover:text-success-foreground hover:bg-success rounded-xl transition-all duration-300 hover:shadow-lg"
              title="دانلود گزارش"
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </button>

            <button
              onClick={onReset}
              className="group p-3 text-muted-foreground hover:text-foreground bg-card hover:bg-accent/40 active:scale-95 rounded-xl transition-all duration-300 hover:shadow-lg"
              title="شروع مجدد"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};