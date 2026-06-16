export interface CourseSettings {
  totalHours: number;
  academicHourMinutes: number;
  maxHoursPerDay: number;
}

export interface SessionGroup {
  id: string;
  label: string;
  count: number;
  startTime: string;
  endTime: string;          // user sets
  hoursPerSession: number;  // academic hours — user sets
  // breakMinutes is derived: (end-start) - (hours × academicHourMinutes)
}

export interface SessionGroupResult {
  group: SessionGroup;
  hoursPerSession: number;
  totalHours: number;
  clockMinutes: number;
  breakMinutes: number;     // computed
  breakIsNegative: boolean;
  isValid: boolean;
}

export interface CalculationResult {
  sessionResults: SessionGroupResult[];
  totalPlannedHours: number;
  remainingHours: number;
  isComplete: boolean;
  isOver: boolean;
}

export interface SolverResult {
  endTime: string;
  clockMinutes: number;
  academicHours: number;
  exceedsMax: boolean;
  maxEndTime: string;
  maxAcademicHours: number;
}
