import { WindowData, Statistics, FloorData } from './types';
import { TOLERANCE_LIMITS, WARNING_MULTIPLIER } from './constants';

/**
 * Calculate the absolute tolerance between a measured dimension and its nominal value.
 * @param measured The measured value
 * @param nominal The nominal (expected) value
 * @returns The absolute difference between the two
 */
export const calculateTolerance = (measured: number, nominal: number): number => {
  return Math.abs(measured - nominal);
};

/**
 * Compute the theoretical diagonal of a rectangle given its width and height.
 * @param width The width in millimetres
 * @param height The height in millimetres
 * @returns The diagonal length using Pythagoras' theorem
 */
export const calculateTheoreticalDiagonal = (width: number, height: number): number => {
  return Math.sqrt(width * width + height * height);
};

/**
 * Calculate the absolute difference between two diagonal measurements.
 * @param diagonal1 First diagonal measurement
 * @param diagonal2 Second diagonal measurement
 * @returns The absolute difference between the two diagonals
 */
export const calculateDiagonalDifference = (diagonal1: number, diagonal2: number): number => {
  return Math.abs(diagonal1 - diagonal2);
};

/**
 * Determine whether a window passes, warns, or fails based on tolerance values.
 * @param widthTol The tolerance on the width
 * @param heightTol The tolerance on the height
 * @param diagDiff The difference between measured diagonals
 * @returns A status string: 'pass', 'warning', or 'fail'
 */
export const determineStatus = (
  widthTol: number,
  heightTol: number,
  diagDiff: number
): 'pass' | 'warning' | 'fail' => {
  if (
    widthTol <= TOLERANCE_LIMITS.width &&
    heightTol <= TOLERANCE_LIMITS.height &&
    diagDiff <= TOLERANCE_LIMITS.diagonal
  ) {
    return 'pass';
  } else if (
    widthTol <= TOLERANCE_LIMITS.width * WARNING_MULTIPLIER &&
    heightTol <= TOLERANCE_LIMITS.height * WARNING_MULTIPLIER &&
    diagDiff <= TOLERANCE_LIMITS.diagonal * WARNING_MULTIPLIER
  ) {
    return 'warning';
  }
  return 'fail';
};

/**
 * Calculate summary statistics across all windows in all floors.
 * @param floors An array of floors with windows
 * @returns Statistical summary (total, pass, warning, fail, passRate)
 */
export const calculateStatistics = (floors: FloorData[]): Statistics => {
  const allWindows = floors.flatMap(floor => floor.windows);
  const total = allWindows.length;

  if (total === 0) {
    return {
      total: 0,
      pass: 0,
      warning: 0,
      fail: 0,
      passRate: 0
    };
  }

  const pass = allWindows.filter(w => w.status === 'pass').length;
  const warning = allWindows.filter(w => w.status === 'warning').length;
  const fail = allWindows.filter(w => w.status === 'fail').length;
  const passRate = (pass / total) * 100;

  return {
    total,
    pass,
    warning,
    fail,
    passRate
  };
};

/**
 * Validate measured diagonals against the theoretical diagonal.
 * If the difference exceeds 10% of the theoretical diagonal the measurement is considered invalid.
 * @param width The measured width
 * @param height The measured height
 * @param diagonal1 The first diagonal measurement
 * @param diagonal2 The second diagonal measurement
 * @returns An object describing if the diagonals are valid and an optional error message
 */
export const validateDiagonals = (
  width: number,
  height: number,
  diagonal1: number,
  diagonal2: number
): { isValid: boolean; message?: string } => {
  const theoretical = calculateTheoreticalDiagonal(width, height);
  const tolerance = theoretical * 0.1; // 10% tolerance for input validation

  if (Math.abs(diagonal1 - theoretical) > tolerance) {
    return {
      isValid: false,
      message: `قطر 1 باید نزدیک به ${theoretical.toFixed(0)} میلی‌متر باشد`
    };
  }

  if (Math.abs(diagonal2 - theoretical) > tolerance) {
    return {
      isValid: false,
      message: `قطر 2 باید نزدیک به ${theoretical.toFixed(0)} میلی‌متر باشد`
    };
  }

  return { isValid: true };
};