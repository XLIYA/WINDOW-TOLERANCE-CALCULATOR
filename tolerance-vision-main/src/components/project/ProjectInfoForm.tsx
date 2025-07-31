import React from 'react';
import { Building, User, Calendar, Hash, FileText } from 'lucide-react';

interface ProjectInfo {
  buildingName: string;
  engineerName: string;
  projectCode?: string;
  date: string;
  description?: string;
}

interface ProjectInfoFormProps {
  projectInfo: ProjectInfo;
  onUpdate: (updates: Partial<ProjectInfo>) => void;
}

export const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({ projectInfo, onUpdate }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
            نام ساختمان <span className="text-destructive">*</span>
          </label>
          <div className="relative group">
            <Building className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <input
              type="text"
              value={projectInfo.buildingName}
              onChange={(e) => onUpdate({ buildingName: e.target.value })}
              className="w-full pr-12 pl-4 py-3 bg-card border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder-muted-foreground"
              placeholder="مثال: برج میلاد"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
            مهندس ناظر <span className="text-destructive">*</span>
          </label>
          <div className="relative group">
            <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <input
              type="text"
              value={projectInfo.engineerName}
              onChange={(e) => onUpdate({ engineerName: e.target.value })}
              className="w-full pr-12 pl-4 py-3 bg-card border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder-muted-foreground"
              placeholder="مثال: مهندس احمدی"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
            کد پروژه
          </label>
          <div className="relative group">
            <Hash className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <input
              type="text"
              value={projectInfo.projectCode || ''}
              onChange={(e) => onUpdate({ projectCode: e.target.value })}
              className="w-full pr-12 pl-4 py-3 bg-card border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder-muted-foreground"
              placeholder="اختیاری"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">
            تاریخ
          </label>
          <div className="relative group">
            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <input
              type="text"
              value={projectInfo.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
              className="w-full pr-12 pl-4 py-3 bg-card border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder-muted-foreground"
              placeholder="1403/01/01"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          توضیحات
        </label>
        <div className="relative group">
          <FileText className="absolute right-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
          <textarea
            value={projectInfo.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full pr-12 pl-4 py-3 bg-card border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder-muted-foreground resize-none"
            rows={4}
            placeholder="توضیحات تکمیلی (اختیاری)"
          />
        </div>
      </div>
    </div>
  );
};