import { useState } from 'react';
import type { CalculationResult, CourseSettings } from '../types';
import { solveLastSession, formatHours } from '../utils/calculations';
import { NumberInput } from './NumberInput';

interface Props {
  results: CalculationResult;
  settings: CourseSettings;
}

export function ResultsPanel({ results, settings }: Props) {
  const { sessionResults, totalPlannedHours, remainingHours, isComplete, isOver } = results;

  const [solverStart, setSolverStart] = useState('08:30');
  const [solverBreak, setSolverBreak] = useState(0);

  const progressPct = Math.min(100, (totalPlannedHours / settings.totalHours) * 100);

  const solver =
    remainingHours > 0.001
      ? solveLastSession(
          remainingHours,
          solverStart,
          solverBreak,
          settings.academicHourMinutes,
          settings.maxHoursPerDay,
        )
      : null;

  return (
    <div className="card space-y-5">
      <h2 className="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        תוצאות
      </h2>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-semibold text-gray-800">
            {formatHours(totalPlannedHours)} שעות מתוכננות
          </span>
          <span className="text-gray-500">
            יעד: <span className="font-semibold text-bb-green">{formatHours(settings.totalHours)}</span> שעות
          </span>
        </div>
        <div className={`h-3 rounded-full overflow-hidden ${isOver || (!isComplete && sessionResults.length > 0) ? 'bg-red-100' : 'bg-gray-100'}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOver
                ? 'bg-red-500'
                : isComplete
                ? 'bg-bb-green'
                : 'bg-amber-400'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-xs text-gray-400">{progressPct.toFixed(1)}%</span>
          {isOver ? (
            <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-200">
              ⚠ חריגה של {formatHours(Math.abs(remainingHours))} שעות
            </span>
          ) : isComplete ? (
            <span className="text-xs bg-bb-green text-white font-bold px-2 py-0.5 rounded-full">
              ✓ הושלם
            </span>
          ) : (
            <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-300">
              נותרו {formatHours(remainingHours)} שעות
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      {sessionResults.length > 0 && (
        <div className="w-full">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-bb-green/5 border-b-2 border-bb-green/20">
                <th className="text-right py-2 px-2 font-semibold text-bb-green">קבוצה</th>
                <th className="hidden sm:table-cell text-center py-2 px-2 font-semibold text-bb-green">מפגשים</th>
                <th className="hidden sm:table-cell text-center py-2 px-2 font-semibold text-bb-green">שע׳/מפגש</th>
                <th className="text-center py-2 px-2 font-semibold text-bb-green">שעות</th>
                <th className="hidden sm:table-cell text-center py-2 px-2 font-semibold text-bb-green">הפסקה</th>
                <th className="text-center py-2 px-2 font-semibold text-bb-green">עד</th>
              </tr>
            </thead>
            <tbody>
              {sessionResults.map((r, i) => (
                <tr
                  key={r.group.id}
                  className={`border-b border-gray-100 ${!r.isValid ? 'opacity-40' : ''}`}
                >
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center bg-bb-green text-white text-xs font-bold rounded-full w-5 h-5 shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-gray-800 truncate">
                          {r.group.label || `${r.group.startTime}–${r.group.endTime}`}
                        </div>
                        {/* Extra info visible on mobile only */}
                        <div className="sm:hidden text-xs text-gray-400 mt-0.5">
                          {r.group.count} מפגשים · {r.isValid ? formatHours(r.hoursPerSession) : '—'} שע׳
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell py-2 px-2 text-center text-gray-700">{r.group.count}</td>
                  <td className="hidden sm:table-cell py-2 px-2 text-center font-mono font-medium text-bb-green">
                    {r.isValid ? formatHours(r.hoursPerSession) : '—'}
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-bold text-gray-900">
                    {r.isValid ? formatHours(r.totalHours) : '—'}
                  </td>
                  <td className="hidden sm:table-cell py-2 px-2 text-center text-gray-400 text-xs">
                    {r.isValid ? (r.breakMinutes > 0 ? `${r.breakMinutes}′` : '—') : '—'}
                  </td>
                  <td className="py-2 px-2 text-center text-gray-400 text-xs font-mono">
                    {r.isValid ? r.group.endTime : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Mobile tfoot — 3 visible columns */}
            <tfoot className="sm:hidden">
              <tr className="bg-bb-green/5 border-t-2 border-bb-green/20">
                <td className="py-2 px-2 font-bold text-gray-800">סה״כ מתוכנן</td>
                <td className="py-2 px-2 text-center font-mono font-bold text-lg text-gray-900">
                  {formatHours(totalPlannedHours)}
                </td>
                <td />
              </tr>
              {!isComplete && (
                <tr>
                  <td className="py-1.5 px-2 font-semibold">
                    <span className={isOver ? 'text-red-600' : 'text-bb-green'}>
                      {isOver ? 'חריגה' : 'נותרו'}
                    </span>
                  </td>
                  <td className={`py-1.5 px-2 text-center font-mono font-bold text-lg ${isOver ? 'text-red-600' : 'text-bb-green'}`}>
                    {isOver ? '+' : ''}{formatHours(Math.abs(remainingHours))}
                  </td>
                  <td />
                </tr>
              )}
            </tfoot>
            {/* Desktop tfoot — 6 visible columns */}
            <tfoot className="hidden sm:table-footer-group">
              <tr className="bg-bb-green/5 border-t-2 border-bb-green/20">
                <td className="py-2 px-2 font-bold text-gray-800" colSpan={3}>סה״כ מתוכנן</td>
                <td className="py-2 px-2 text-center font-mono font-bold text-lg text-gray-900">
                  {formatHours(totalPlannedHours)}
                </td>
                <td /><td />
              </tr>
              {!isComplete && (
                <tr>
                  <td className="py-1.5 px-2 font-semibold" colSpan={3}>
                    <span className={isOver ? 'text-red-600' : 'text-bb-green'}>
                      {isOver ? 'חריגה' : 'נותרו'}
                    </span>
                  </td>
                  <td className={`py-1.5 px-2 text-center font-mono font-bold text-lg ${isOver ? 'text-red-600' : 'text-bb-green'}`}>
                    {isOver ? '+' : ''}{formatHours(Math.abs(remainingHours))}
                  </td>
                  <td /><td />
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      )}

      {/* Solver */}
      {solver && (
        <div className="border-t-2 border-bb-yellow/40 pt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <span className="text-bb-yellow text-base">★</span>
            מחשב מפגש אחרון — להשלמת{' '}
            <span className="text-bb-green font-bold">{formatHours(remainingHours)}</span>{' '}
            שעות
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-3">
            <div>
              <label className="label">שעת התחלה</label>
              <input
                type="time"
                className="input"
                value={solverStart}
                onChange={(e) => setSolverStart(e.target.value)}
              />
            </div>
            <div>
              <label className="label">הפסקה (דקות)</label>
              <NumberInput
                value={solverBreak}
                min={0}
                step={5}
                onChange={(v) => setSolverBreak(Math.round(v))}
              />
            </div>
          </div>

          {solver.exceedsMax ? (
            <div className="rounded-xl bg-amber-50 border border-amber-300 p-4">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl leading-none mt-0.5">⚠️</span>
                <div>
                  <p className="font-bold text-amber-800">
                    לא ניתן להשלים {formatHours(remainingHours)} שעות ביום אחד
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    שעת סיום מחושבת:{' '}
                    <span className="font-mono font-bold">{solver.endTime}</span>
                    {' '}— חורגת ממקסימום {settings.maxHoursPerDay} שע׳/יום
                  </p>
                  <p className="text-sm text-amber-700 mt-0.5">
                    מקסימום אפשרי מ-{solverStart}:{' '}
                    <span className="font-mono font-bold">{solver.maxEndTime}</span>{' '}
                    ({settings.maxHoursPerDay} שעות)
                  </p>
                  <p className="text-xs text-amber-600 bg-amber-100 rounded-lg px-3 py-1.5 mt-2 inline-block">
                    💡 הוסף מפגש נוסף, הגדל מקסימום שעות ביום, או שנה שעת ההתחלה
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-bb-green/5 border-2 border-bb-green/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bb-green flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-bb-green font-bold text-base">
                    {solverStart}{' '}
                    <span className="text-gray-500 font-normal">עד</span>{' '}
                    <span className="font-mono text-xl">{solver.endTime}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {formatHours(solver.academicHours)} שעות אקדמיות
                    {' '}·{' '}
                    {(solver.clockMinutes / 60).toFixed(2)} שעות קלנדריות
                    {solverBreak > 0 && (
                      <span className="text-gray-400"> (כולל {solverBreak} דק׳ הפסקה)</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status banners */}
      {isOver && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-2.5">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-bold text-red-700">חרגת מסה״כ שעות הקורס</p>
            <p className="text-sm text-red-600 mt-0.5">
              תכננת {formatHours(totalPlannedHours)} שעות —{' '}
              {formatHours(Math.abs(remainingHours))} שעות מעל היעד (
              {formatHours(settings.totalHours)}).
            </p>
          </div>
        </div>
      )}

      {isComplete && sessionResults.length > 0 && (
        <div className="rounded-xl bg-bb-green/5 border-2 border-bb-green p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bb-yellow flex items-center justify-center shrink-0">
            <span className="text-lg">🎯</span>
          </div>
          <p className="font-bold text-bb-green text-base">
            מושלם! תכננת בדיוק {formatHours(settings.totalHours)} שעות אקדמיות.
          </p>
        </div>
      )}
    </div>
  );
}
