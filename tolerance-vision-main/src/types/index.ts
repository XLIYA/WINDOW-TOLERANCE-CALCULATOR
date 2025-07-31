export interface ProjectInfo {
  buildingName: string;
  engineerName: string;
  projectCode?: string;
  date: string;
  description?: string;
}

export interface WindowData {
  id: string;
  code: string;
  width: number;
  height: number;
  diagonal1: number;
  diagonal2: number;
  theoreticalDiagonal: number;
  diagonalDiff: number;
  status: 'pass' | 'warning' | 'fail';
}

export interface FloorData {
  id: string;
  floorNumber: number;
  windows: WindowData[];
}

export interface Statistics {
  total: number;
  pass: number;
  warning: number;
  fail: number;
}

export type ChartType = 'bar' | 'line' | 'pie';