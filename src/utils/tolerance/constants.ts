import { ToleranceLimits } from './types';

/**
 * Permissible tolerance limits for window dimensions (in millimetres).
 */
export const TOLERANCE_LIMITS: ToleranceLimits = {
  width: 3,
  height: 3,
  diagonal: 5
};

/**
 * Multiplier used for determining when to flag a warning state.
 */
export const WARNING_MULTIPLIER = 1.5;

/**
 * Colour codes corresponding to each status. Can be reused for charts and UI badges.
 */
export const STATUS_COLORS = {
  pass: '#10b981',
  warning: '#f59e0b',
  fail: '#ef4444'
} as const;

/**
 * Localised Persian labels for each status.
 */
export const STATUS_LABELS = {
  pass: 'قبول',
  warning: 'هشدار',
  fail: 'مردود'
} as const;

/**
 * Palette used for charts. Combines primary colours with status colours.
 */
export const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#3b82f6',
  ...STATUS_COLORS
} as const;

/**
 * Keys used for persisting data in local storage.
 */
export const LOCAL_STORAGE_KEYS = {
  PROJECT_INFO: 'window_tolerance_project_info',
  FLOORS_DATA: 'window_tolerance_floors_data',
  PREFERENCES: 'window_tolerance_preferences'
} as const;

/**
 * Standard animation durations used across the application.
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;