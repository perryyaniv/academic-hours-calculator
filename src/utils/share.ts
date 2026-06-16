import type { CourseSettings, SessionGroup } from '../types';

interface SharedData {
  v: 1;
  settings: CourseSettings;
  sessions: SessionGroup[];
}

export function encodeShareData(settings: CourseSettings, sessions: SessionGroup[]): string {
  const data: SharedData = { v: 1, settings, sessions };
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function decodeShareData(encoded: string): SharedData | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const data = JSON.parse(json) as SharedData;
    if (data.v !== 1 || !data.settings || !Array.isArray(data.sessions)) return null;
    return data;
  } catch {
    return null;
  }
}

export function buildShareUrl(settings: CourseSettings, sessions: SessionGroup[]): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('d', encodeShareData(settings, sessions));
  return url.toString();
}

export function loadFromUrl(): SharedData | null {
  const params = new URLSearchParams(window.location.search);
  const d = params.get('d');
  return d ? decodeShareData(d) : null;
}
