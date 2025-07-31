import { useState } from 'react';

export interface ProjectInfo {
  buildingName: string;
  engineerName: string;
  projectCode?: string;
  date: string;
  description?: string;
}

export const useProjectInfo = () => {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    buildingName: '',
    engineerName: '',
    projectCode: '',
    date: new Date().toLocaleDateString('fa-IR'),
    description: ''
  });

  const updateProjectInfo = (updates: Partial<ProjectInfo>) => {
    setProjectInfo(prev => ({ ...prev, ...updates }));
  };

  const resetProjectInfo = () => {
    setProjectInfo({
      buildingName: '',
      engineerName: '',
      projectCode: '',
      date: new Date().toLocaleDateString('fa-IR'),
      description: ''
    });
  };

  const isProjectInfoComplete = () => {
    return !!(projectInfo.buildingName && projectInfo.engineerName);
  };

  return {
    projectInfo,
    updateProjectInfo,
    resetProjectInfo,
    isProjectInfoComplete
  };
};