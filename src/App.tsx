import { useState, useEffect } from 'react';
import type { CourseSettings, SessionGroup } from './types';
// SessionGroup imported for addSession default
import { calculateResults } from './utils/calculations';
import { Header } from './components/Header';
import { CourseSettingsCard } from './components/CourseSettingsCard';
import { SessionsList } from './components/SessionsList';
import { ResultsPanel } from './components/ResultsPanel';

const DEFAULT_SETTINGS: CourseSettings = {
  totalHours: 100,
  academicHourMinutes: 45,
  maxHoursPerDay: 8,
};


function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [settings, setSettings] = useState<CourseSettings>(() =>
    loadFromStorage('ahc-settings', DEFAULT_SETTINGS),
  );
  const [sessions, setSessions] = useState<SessionGroup[]>(() =>
    loadFromStorage('ahc-sessions', []),
  );

  useEffect(() => {
    localStorage.setItem('ahc-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ahc-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = () => {
    const newSession: SessionGroup = {
      id: `session-${Date.now()}`,
      label: '',
      count: 1,
      startTime: '08:00',
      endTime: '16:00',
      hoursPerSession: 8,
    };
    setSessions((prev) => [...prev, newSession]);
  };

  const updateSession = (id: string, updated: SessionGroup) =>
    setSessions((prev) => prev.map((s) => (s.id === id ? updated : s)));

  const removeSession = (id: string) =>
    setSessions((prev) => prev.filter((s) => s.id !== id));

  const reset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSessions([]);
  };

  const results = calculateResults(settings, sessions);

  return (
    <div dir="rtl" className="min-h-screen bg-bb-bg">
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4 pb-20">
        <Header onReset={reset} />
        <CourseSettingsCard settings={settings} onChange={setSettings} />
        <SessionsList
          sessions={sessions}
          settings={settings}
          onAdd={addSession}
          onUpdate={updateSession}
          onRemove={removeSession}
        />
        {sessions.length > 0 && (
          <ResultsPanel results={results} settings={settings} />
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-bb-green/95 backdrop-blur text-center text-xs text-white/60 py-2 px-4">
        <span className="text-white/80 font-medium">המכללה האקדמית בית ברל</span>
        {' '}· מחשבון שעות אקדמיות · נתונים נשמרים מקומית בדפדפן
      </footer>
    </div>
  );
}
