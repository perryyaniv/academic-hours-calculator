import type { SessionGroup, CourseSettings } from '../types';
import { SessionGroupCard } from './SessionGroupCard';

interface Props {
  sessions: SessionGroup[];
  settings: CourseSettings;
  onAdd: () => void;
  onUpdate: (id: string, updated: SessionGroup) => void;
  onRemove: (id: string) => void;
}

export function SessionsList({ sessions, settings, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          קבוצות מפגשים
        </h2>
        <button onClick={onAdd} className="btn-primary flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          הוסף קבוצה
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="text-4xl mb-2">🗓️</div>
          <p className="text-sm font-medium">לא הוגדרו מפגשים עדיין</p>
          <p className="text-xs mt-1 text-gray-400">
            לחץ ״הוסף קבוצה״, או ״טען דוגמה״ בכותרת
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <SessionGroupCard
              key={session.id}
              group={session}
              index={index}
              settings={settings}
              onChange={(updated) => onUpdate(session.id, updated)}
              onRemove={() => onRemove(session.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
