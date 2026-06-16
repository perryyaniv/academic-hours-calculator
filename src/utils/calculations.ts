import type {
  CourseSettings,
  SessionGroup,
  CalculationResult,
  SessionGroupResult,
  SolverResult,
} from '../types';

export function timeToMinutes(time: string): number {
  const parts = time.split(':');
  const h = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  return h * 60 + m;
}

export function minutesToTime(totalMinutes: number): string {
  if (totalMinutes < 0) return '--:--';
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatHours(hours: number): string {
  return parseFloat(hours.toFixed(4)).toFixed(2);
}

export function roundHours(hours: number): number {
  return Math.round(hours * 1000) / 1000;
}

// Break = total clock minutes − net academic minutes.
export function computeBreak(
  startTime: string,
  endTime: string,
  hoursPerSession: number,
  academicHourMinutes: number,
): number {
  const clockMinutes = timeToMinutes(endTime) - timeToMinutes(startTime);
  const netMinutes = hoursPerSession * academicHourMinutes;
  return clockMinutes - netMinutes;
}

export function calculateResults(
  settings: CourseSettings,
  sessions: SessionGroup[],
): CalculationResult {
  const sessionResults: SessionGroupResult[] = sessions.map((group) => {
    const startMin = timeToMinutes(group.startTime);
    const endMin = timeToMinutes(group.endTime);
    const clockMinutes = endMin - startMin;
    const netMinutes = group.hoursPerSession * settings.academicHourMinutes;
    const breakMinutes = clockMinutes - netMinutes;
    const breakIsNegative = breakMinutes < -0.5;
    const isValid =
      endMin > startMin &&
      group.hoursPerSession > 0 &&
      group.count > 0 &&
      !breakIsNegative;

    return {
      group,
      hoursPerSession: roundHours(group.hoursPerSession),
      totalHours: roundHours(group.hoursPerSession * group.count),
      clockMinutes,
      breakMinutes: Math.max(0, Math.round(breakMinutes)),
      breakIsNegative,
      isValid,
    };
  });

  const totalPlannedHours = roundHours(
    sessionResults.filter((r) => r.isValid).reduce((sum, r) => sum + r.totalHours, 0),
  );
  const remainingHours = roundHours(settings.totalHours - totalPlannedHours);

  return {
    sessionResults,
    totalPlannedHours,
    remainingHours,
    isComplete: Math.abs(remainingHours) < 0.001,
    isOver: totalPlannedHours > settings.totalHours + 0.001,
  };
}

export function solveLastSession(
  remainingHours: number,
  startTime: string,
  breakMinutes: number,
  academicHourMinutes: number,
  maxHoursPerDay: number,
): SolverResult {
  const netMinutesNeeded = remainingHours * academicHourMinutes;
  const totalMinutesNeeded = netMinutesNeeded + breakMinutes;
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + totalMinutesNeeded;

  const maxNetMinutes = maxHoursPerDay * academicHourMinutes;
  const maxTotalMinutes = maxNetMinutes + breakMinutes;
  const maxEndMinutes = startMinutes + maxTotalMinutes;

  return {
    endTime: minutesToTime(endMinutes),
    clockMinutes: totalMinutesNeeded,
    academicHours: remainingHours,
    exceedsMax: endMinutes > maxEndMinutes + 0.5,
    maxEndTime: minutesToTime(maxEndMinutes),
    maxAcademicHours: maxHoursPerDay,
  };
}
