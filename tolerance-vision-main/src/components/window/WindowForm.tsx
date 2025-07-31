import React, { useState } from 'react';
import { Plus, Hash, Maximize2, Info } from 'lucide-react';

interface WindowFormData {
  code: string;
  width: string;
  height: string;
  diagonal1: string;
  diagonal2: string;
}

interface WindowFormProps {
  floorNumber: number;
  onSubmit: (data: {
    code: string;
    width: number;
    height: number;
    diagonal1: number;
    diagonal2: number;
  }) => void;
}

export const WindowForm: React.FC<WindowFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<WindowFormData>({
    code: '',
    width: '',
    height: '',
    diagonal1: '',
    diagonal2: ''
  });

  const [errors, setErrors] = useState<Partial<WindowFormData>>({});
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (field: keyof WindowFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<WindowFormData> = {};

    if (!formData.code) {
      newErrors.code = 'کد پنجره الزامی است';
    }
    if (!formData.width || parseFloat(formData.width) <= 0) {
      newErrors.width = 'عرض نامعتبر';
    }
    if (!formData.height || parseFloat(formData.height) <= 0) {
      newErrors.height = 'ارتفاع نامعتبر';
    }
    if (!formData.diagonal1 || parseFloat(formData.diagonal1) <= 0) {
      newErrors.diagonal1 = 'قطر 1 نامعتبر';
    }
    if (!formData.diagonal2 || parseFloat(formData.diagonal2) <= 0) {
      newErrors.diagonal2 = 'قطر 2 نامعتبر';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        code: formData.code,
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        diagonal1: parseFloat(formData.diagonal1),
        diagonal2: parseFloat(formData.diagonal2)
      });

      setFormData({
        code: '',
        width: '',
        height: '',
        diagonal1: '',
        diagonal2: ''
      });
    }
  };

  const theoreticalDiagonal = formData.width && formData.height
    ? Math.sqrt(Math.pow(parseFloat(formData.width) || 0, 2) + Math.pow(parseFloat(formData.height) || 0, 2))
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Window Code */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">کد پنجره</label>
          <div className="relative group">
            <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              className={`
                w-full pr-10 pl-3 py-2.5 rounded-xl border-2 transition-all duration-300 text-sm
                ${errors.code 
                  ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20' 
                  : 'border-border focus:border-primary focus:ring-primary/20'
                }
                bg-card focus:ring-2 focus:outline-none
              `}
              placeholder="W-101"
            />
            {errors.code && (
              <p className="mt-1 text-xs text-destructive">{errors.code}</p>
            )}
          </div>
        </div>

        {/* Width */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">عرض (mm)</label>
          <div className="relative group">
            <Maximize2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <input
              type="number"
              value={formData.width}
              onChange={(e) => handleChange('width', e.target.value)}
              className={`
                w-full pr-10 pl-3 py-2.5 rounded-xl border-2 transition-all duration-300 text-sm
                ${errors.width 
                  ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20' 
                  : 'border-border focus:border-primary focus:ring-primary/20'
                }
                bg-card focus:ring-2 focus:outline-none
              `}
              placeholder="1200"
            />
            {errors.width && (
              <p className="mt-1 text-xs text-destructive">{errors.width}</p>
            )}
          </div>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">ارتفاع (mm)</label>
          <div className="relative group">
            <Maximize2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 rotate-90" />
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleChange('height', e.target.value)}
              className={`
                w-full pr-10 pl-3 py-2.5 rounded-xl border-2 transition-all duration-300 text-sm
                ${errors.height 
                  ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20' 
                  : 'border-border focus:border-primary focus:ring-primary/20'
                }
                bg-card focus:ring-2 focus:outline-none
              `}
              placeholder="1500"
            />
            {errors.height && (
              <p className="mt-1 text-xs text-destructive">{errors.height}</p>
            )}
          </div>
        </div>

        {/* Diagonal 1 */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
            قطر 1 (mm)
            {theoreticalDiagonal > 0 && (
              <span className="text-xs text-muted-foreground mr-1">
                (نظری: {theoreticalDiagonal.toFixed(0)})
              </span>
            )}
          </label>
          <input
            type="number"
            value={formData.diagonal1}
            onChange={(e) => handleChange('diagonal1', e.target.value)}
            className={`
              w-full px-3 py-2.5 rounded-xl border-2 transition-all duration-300 text-sm
              ${errors.diagonal1 
                ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20' 
                : 'border-border focus:border-primary focus:ring-primary/20'
              }
              bg-card focus:ring-2 focus:outline-none
            `}
            placeholder="1920"
          />
          {errors.diagonal1 && (
            <p className="mt-1 text-xs text-destructive">{errors.diagonal1}</p>
          )}
        </div>

        {/* Diagonal 2 */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">قطر 2 (mm)</label>
          <input
            type="number"
            value={formData.diagonal2}
            onChange={(e) => handleChange('diagonal2', e.target.value)}
            className={`
              w-full px-3 py-2.5 rounded-xl border-2 transition-all duration-300 text-sm
              ${errors.diagonal2 
                ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20' 
                : 'border-border focus:border-primary focus:ring-primary/20'
              }
              bg-card focus:ring-2 focus:outline-none
            `}
            placeholder="1922"
          />
          {errors.diagonal2 && (
            <p className="mt-1 text-xs text-destructive">{errors.diagonal2}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4">
        <button
          type="submit"
          className="group px-6 py-3 bg-gradient-secondary text-secondary-foreground rounded-xl hover:shadow-glow transition-all duration-300 flex items-center gap-2 font-semibold hover:scale-105"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          افزودن پنجره
        </button>
        
        <div className="relative">
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="p-3 text-muted-foreground hover:text-primary transition-colors duration-300 hover:bg-primary/5 rounded-xl"
          >
            <Info className="w-5 h-5" />
          </button>
          
          {showTooltip && (
            <div className="absolute left-0 bottom-full mb-3 w-72 p-4 bg-primary text-primary-foreground text-sm rounded-xl shadow-xl z-10 animate-fade-in">
              <div className="absolute bottom-0 left-6 transform translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
              </div>
              <strong className="block mb-1">راهنمای اندازه‌گیری:</strong>
              قطرهای اندازه‌گیری شده باید نزدیک به قطر نظری (محاسبه شده از عرض و ارتفاع) باشند. اختلاف مجاز: حداکثر 10%
            </div>
          )}
        </div>
      </div>
    </form>
  );
};