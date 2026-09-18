import { defaultReaderPreferences,initialProfile,readerPreferencesKey } from './constants';
import type { Answer,Evidence,Profile,ReaderPreferences,Screen } from './types';
export const assessmentStorageKey = 'privacy-risk-self-check-v1';
export type AssessmentState = {profile: Profile; answers: Record<number, Answer>; evidence: Record<number, Evidence[]>; screen: Screen};
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export function clearAssessment(store: Store) {
  try { store.removeItem(assessmentStorageKey); } catch { /* Storage may be disabled. */ }
}
export function loadAssessment(store: Store): AssessmentState | null {
  try {
    const raw = store.getItem(assessmentStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const profile = parsed.profile ?? {};
    return {
      profile: {...initialProfile,...profile,
        organization: typeof profile.organization === 'string' ? profile.organization : '',
        systemName: typeof profile.systemName === 'string' ? profile.systemName : '',
        fileName: typeof profile.fileName === 'string' ? profile.fileName : ''},
      answers: parsed.answers ?? {}, evidence: parsed.evidence ?? {},
      screen: ['intro','profile','check','result','cases'].includes(parsed.screen) ? parsed.screen : 'intro',
    };
  } catch { clearAssessment(store); return null; }
}
export function saveAssessment(store: Store, state: AssessmentState) {
  // Reset must leave the assessment key absent, including after the save effect.
  if (state.screen === 'intro' && !Object.keys(state.answers).length && !Object.keys(state.evidence).length && JSON.stringify(state.profile) === JSON.stringify(initialProfile)) {
    clearAssessment(store); return;
  }
  try { store.setItem(assessmentStorageKey, JSON.stringify(state)); } catch { /* Keep the current in-memory assessment usable. */ }
}
export function loadReaderPreferences(store: Store): ReaderPreferences {
  try {
    const parsed = JSON.parse(store.getItem(readerPreferencesKey) ?? 'null');
    if (!parsed) return defaultReaderPreferences;
    return {theme: parsed.theme === 'dark' ? 'dark' : 'light',fontSize: Math.min(22,Math.max(14,Number(parsed.fontSize)||17)),lineHeight:Math.min(2,Math.max(1.4,Number(parsed.lineHeight)||1.6))};
  } catch { return defaultReaderPreferences; }
}
export function saveReaderPreferences(store: Store, preferences: ReaderPreferences) {
  try { store.setItem(readerPreferencesKey,JSON.stringify(preferences)); } catch { /* Preferences still work for this session. */ }
}
