import type { CourseSettings } from '../types';

interface Props {
  settings: CourseSettings;
  onChange: (settings: CourseSettings) => void;
}

export function CourseSettingsCard({ settings, onChange }: Props) {
  const set = (partial: Partial<CourseSettings>) =>
    onChange({ ...settings, ...partial });

  return (
    <div className="card">
      <h2 className="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        הגדרות קורס
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label className="label">סה״כ שעות אקדמיות</label>
          <input
            type="number"
            className="input text-lg font-bold text-bb-green"
            value={settings.totalHours}
            min={1}
            step={0.5}
            onChange={(e) =>
              set({ totalHours: parseFloat(e.target.value) || 0 })
            }
          />
        </div>

        <div>
          <label className="label">שעה אקדמית = כמה דקות?</label>
          <input
            type="number"
            className="input"
            value={settings.academicHourMinutes}
            min={1}
            max={120}
            onChange={(e) =>
              set({ academicHourMinutes: parseInt(e.target.value, 10) || 60 })
            }
          />
        </div>

        <div>
          <label className="label">מקסימום שעות אקדמיות ביום</label>
          <input
            type="number"
            className="input"
            value={settings.maxHoursPerDay}
            min={1}
            max={24}
            step={0.5}
            onChange={(e) =>
              set({ maxHoursPerDay: parseFloat(e.target.value) || 8 })
            }
          />
        </div>
      </div>
    </div>
  );
}
