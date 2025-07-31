/**
 * Description of the project metadata captured for tolerance calculations.
 */
export interface ProjectInfo {
  buildingName: string;
  engineerName: string;
  floorCount: number;
  date: string;
  projectCode?: string;
  description?: string;
}

/**
 * Data captured for an individual window measurement.
 */
export interface WindowData {
  id: string;
  code: string;
  width: number;
  height: number;
  diagonal1: number;
  diagonal2: number;
  widthTolerance: number;
  heightTolerance: number;
  diagonalDiff: number;
  theoreticalDiagonal: number;
  status: 'pass' | 'warning' | 'fail';
  createdAt: Date;
}

/**
 * A floor contains a collection of windows.
 */
export interface FloorData {
  id: string;
  floorNumber: number;
  windows: WindowData[];
  createdAt: Date;
}

/**
 * Structure used for bar and line charts summarising floor performance.
 */
export interface ChartData {
  floor: string;
  pass: number;
  warning: number;
  fail: number;
  total: number;
}

/**
 * Structure used for pie charts summarising distribution of statuses.
 */
export interface PieChartData {
  name: string;
  value: number;
  percentage: string;
  color: string;
}

/**
 * Statistical summary returned from calculations.
 */
export interface Statistics {
  total: number;
  pass: number;
  warning: number;
  fail: number;
  passRate: number;
}

/**
 * Available chart types used across the UI.
 */
export type ChartType = 'bar' | 'line' | 'pie';

/**
 * Tolerance limits used to evaluate whether a measurement passes, warns, or fails.
 */
export interface ToleranceLimits {
  width: number;
  height: number;
  diagonal: number;
}