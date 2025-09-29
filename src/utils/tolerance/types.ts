export interface ProjectInfo {
  buildingName: string;
  engineerName: string;
  floorCount: number;
  date: string;
  projectCode?: string;
  description?: string;
}

export type Status = "pass" | "warning" | "fail";

export interface WindowData {
  id: string;
  code: string;

  nominalWidth: number;
  nominalHeight: number;
  limit: number;

  widthTop: number;
  widthMiddle: number;
  widthBottom: number;

  heightLeft: number;
  heightMiddle: number;
  heightRight: number;

  widthMean: number;
  heightMean: number;
  widthRange: number;
  heightRange: number;

  theoreticalDiagonal: number;
  actualDiagonal: number;
  diagonalDiff: number;

  widthTolerance: number;
  heightTolerance: number;

  status: Status;
}

export interface FloorData {
  id: string;
  floorNumber: number;
  windows: WindowData[];
  createdAt?: Date;
}

export interface Statistics {
  total: number;
  pass: number;
  warning: number;
  fail: number;
  passRate?: number;
}
