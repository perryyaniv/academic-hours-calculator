import type { SessionGroup, CourseSettings } from '../types';
import { timeToMinutes, computeBreak } from '../utils/calculations';

interface Props {
  group: SessionGroup;
  index: number;
  settings: CourseSettings;
  onChange: (updated: SessionGroup) => void;
  onRemove: () => void;
}

function formatBreak(minutes: number): string {
  if (minutes === 0) return 'אין הפסקה';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} דקות`;
  if (m === 0) return `${h} שעות`;
  return `${h}ש' ${m} דק'`;
}

export function SessionGroupCard({ group, index, settings, onChange, onRemove }: Props) {
  const startMin = timeToMinutes(group.startTime);
  const endMin = timeToMinutes(group.endTime);
  const validTimeRange = endMin > startMin;
  const clockMinutes = validTimeRange ? endMin - startMin : 0;

  const breakMinutes = validTimeRange
    ? computeBreak(group.startTime, group.endTime, group.hoursPerSession, settings.academicHourMinutes)
    : 0;

  const breakIsNegative = breakMinutes < -0.5;
  const exceedsMax = group.hoursPerSession > settings.maxHoursPerDay;
  const isValid = validTimeRange && group.hoursPerSession > 0 && group.count > 0 && !breakIsNegative;

  return (
    <div className={`border rounded-xl p-4 transition-colors ${
      breakIsNegative || exceedsMax
        ? 'border-red-300 bg-red-50/30'
        : 'border-gray-200 bg-gray-50/50'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-bb-green text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <input
            type="text"
            className="input bg-white text-sm font-medium max-w-52"
            placeholder="תיאור (אופציונלי)"
            value={group.label}
            onChange={(e) => onChange({ ...group, label: e.target.value })}
          />
        </div>
        <button onClick={onRemove} className="btn-danger" title="מחק">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="label">מספר מפגשים</label>
          <input
            type="number"
            className="input bg-white"
            value={group.count}
            min={1}
            onChange={(e) => onChange({ ...group, count: parseInt(e.target.value, 10) || 1 })}
          />
        </div>

        <div>
          <label className="label">שעת התחלה</label>
          <input
            type="time"
            className="input bg-white"
            value={group.startTime}
            onChange={(e) => onChange({ ...group, startTime: e.target.value })}
          />
        </div>

        <div>
          <label className="label">שעת סיום</label>
          <input
            type="time"
            className="input bg-white"
            value={group.endTime}
            onChange={(e) => onChange({ ...group, endTime: e.target.value })}
          />
        </div>

        <div>
          <label className="label">
            שעות אקדמיות
            <span className="text-gray-400 font-normal normal-case mr-1">(מקס׳ {settings.maxHoursPerDay})</span>
          </label>
          <input
            type="number"
            className={`input bg-white font-semibold ${
              exceedsMax ? 'border-red-400 text-red-700' : 'text-bb-green'
            }`}
            value={group.hoursPerSession}
            min={0.5}
            step={0.5}
            onChange={(e) => onChange({ ...group, hoursPerSession: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Computed break + summary */}
      {validTimeRange && group.hoursPerSession > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {/* Break badge */}
          <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${
            breakIsNegative
              ? 'bg-red-100 border border-red-300'
              : 'bg-bb-green/8 border border-bb-green/20'
          }`}
          style={{ backgroundColor: breakIsNegative ? undefined : 'rgb(33 125 99 / 0.06)' }}
          >
            <span className={`text-xs ${breakIsNegative ? 'text-red-600' : 'text-gray-500'}`}>הפסקה:</span>
            <span className={`font-semibold ${breakIsNegative ? 'text-red-700' : 'text-bb-green'}`}>
              {breakIsNegative
                ? `−${Math.round(Math.abs(breakMinutes))} דק׳`
                : formatBreak(Math.round(breakMinutes))}
            </span>
          </div>

          {isValid && (
            <span className="text-sm text-gray-500">
              {group.startTime}–{group.endTime}
              <span className="text-gray-300 mx-2">·</span>
              <span className="font-bold text-gray-800">
                סה״כ: {(group.hoursPerSession * group.count).toFixed(2)} שעות
              </span>
            </span>
          )}
        </div>
      )}

      {/* Validation errors */}
      {breakIsNegative && (
        <p className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
          ⚠️ השעות האקדמיות ({group.hoursPerSession} × {settings.academicHourMinutes} דק׳ = {Math.round(group.hoursPerSession * settings.academicHourMinutes)} דק׳) עולות על סך זמן המפגש ({clockMinutes} דק׳)
        </p>
      )}
      {exceedsMax && !breakIsNegative && (
        <p className="mt-2 text-xs text-red-600">
          ⚠️ חורג ממקסימום {settings.maxHoursPerDay} שע׳/יום
        </p>
      )}
      {!validTimeRange && group.endTime && (
        <p className="mt-2 text-xs text-red-500">שעת סיום חייבת להיות אחרי שעת התחלה</p>
      )}
    </div>
  );
}
