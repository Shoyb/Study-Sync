import { TaskProgress, ExamScore, CalendarEvent, TimerSession, UserProfile, LocalAccount, PersonalExamRecord, ExamTrack, UserRole, CustomCalendarExam, CustomRevisionChapter } from '@/types';
import { authenticateUser, registerNewUser, logoutUserAction, pullAllData, pushData, fetchUsersForAdmin, removeUserAction, adminLoginAction, setupAdminAction } from '@/app/actions';

const PREFIX = 'studysync_';
const USER_DATA_KEYS = new Set(['progress', 'exam_scores', 'calendar_events', 'timer_sessions', 'study_dates', 'personal_exams', 'custom_calendar_exams', 'custom_revision_chapters']);

function storageKey(key: string): string {
  if (typeof window === 'undefined') return PREFIX + key;
  try {
    const profile = localStorage.getItem(PREFIX + 'user_profile');
    const userId = profile ? (JSON.parse(profile) as UserProfile).id : null;
    return userId && USER_DATA_KEYS.has(key) ? `${PREFIX}${key}_${userId}` : PREFIX + key;
  } catch {
    return PREFIX + key;
  }
}

export function getLocalDate(date = new Date()): string {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 10);
}

// ===== Generic Helpers =====
export function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(storageKey(key));
    return item ? JSON.parse(item) : defaultValue;
  } catch { return defaultValue; }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(key), JSON.stringify(value));
  
  // Background sync
  try {
    const profile = localStorage.getItem(PREFIX + 'user_profile');
    const userId = profile ? (JSON.parse(profile) as UserProfile).id : null;
    if (userId && (USER_DATA_KEYS.has(key) || key === 'user_profile')) {
      pushData(userId, key, value).catch(console.error);
    }
  } catch {}
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(storageKey(key));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getProgress(): TaskProgress[] { return getItem<TaskProgress[]>('progress', []); }
export function saveProgress(progress: TaskProgress[]): void { setItem('progress', progress); }
export function getChapterProgress(chapterId: string): TaskProgress | undefined { return getProgress().find(p => p.chapterId === chapterId); }
export function updateChapterProgress(chapterId: string, updates: Partial<TaskProgress>): TaskProgress[] {
  const progress = getProgress();
  const idx = progress.findIndex(p => p.chapterId === chapterId);
  const now = new Date().toISOString();
  if (idx >= 0) {
    progress[idx] = { ...progress[idx], ...updates, updatedAt: now };
  } else {
    progress.push({ id: generateId(), chapterId, status: 'not_started', confidenceLevel: 0, revisionCount: 0, lastRevised: null, notes: '', updatedAt: now, ...updates });
  }
  saveProgress(progress);
  return progress;
}

export function getExamScores(): ExamScore[] { return getItem<ExamScore[]>('exam_scores', []); }
export function saveExamScore(score: ExamScore): void {
  const scores = getExamScores();
  const idx = scores.findIndex(s => s.examId === score.examId);
  if (idx >= 0) scores[idx] = score; else scores.push(score);
  setItem('exam_scores', scores);
}
export function getScoreForExam(examId: string): ExamScore | undefined { return getExamScores().find(s => s.examId === examId); }

export function getCalendarEvents(): CalendarEvent[] { return getItem<CalendarEvent[]>('calendar_events', []); }
export function saveCalendarEvent(event: CalendarEvent): void { setItem('calendar_events', [...getCalendarEvents(), event]); }
export function updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): void {
  const events = getCalendarEvents();
  const idx = events.findIndex(e => e.id === id);
  if (idx >= 0) { events[idx] = { ...events[idx], ...updates }; setItem('calendar_events', events); }
}
export function deleteCalendarEvent(id: string): void { setItem('calendar_events', getCalendarEvents().filter(e => e.id !== id)); }

export function getTimerSessions(): TimerSession[] { return getItem<TimerSession[]>('timer_sessions', []); }
export function saveTimerSession(session: TimerSession): void { setItem('timer_sessions', [session, ...getTimerSessions()].slice(0, 50)); }

export function getPersonalExams(): PersonalExamRecord[] { return getItem<PersonalExamRecord[]>('personal_exams', []); }
export function savePersonalExam(record: PersonalExamRecord): void { setItem('personal_exams', [record, ...getPersonalExams()].slice(0, 50)); }

export function getUserProfile(): UserProfile | null { return getItem<UserProfile | null>('user_profile', null); }
export function saveUserProfile(profile: UserProfile): void { setItem('user_profile', profile); }

export async function logoutUser(): Promise<void> {
  const profile = getUserProfile();
  if (profile) {
    USER_DATA_KEYS.forEach(key => localStorage.removeItem(`${PREFIX}${key}_${profile.id}`));
  }
  removeItem('user_profile');
  removeItem('admin_session');
  await logoutUserAction();
}

export function getCustomCalendarExams(): CustomCalendarExam[] { return getItem<CustomCalendarExam[]>('custom_calendar_exams', []); }
export function saveCustomCalendarExam(exam: CustomCalendarExam): void { setItem('custom_calendar_exams', [exam, ...getCustomCalendarExams()]); }
export function deleteCustomCalendarExam(id: string): void { setItem('custom_calendar_exams', getCustomCalendarExams().filter(exam => exam.id !== id)); }

export function getCustomRevisionChapters(): CustomRevisionChapter[] { return getItem<CustomRevisionChapter[]>('custom_revision_chapters', []); }
export function saveCustomRevisionChapter(chapter: CustomRevisionChapter): void { setItem('custom_revision_chapters', [...getCustomRevisionChapters(), chapter]); }
export function deleteCustomRevisionChapter(id: string): void { setItem('custom_revision_chapters', getCustomRevisionChapters().filter(chapter => chapter.id !== id)); }

// DB calls instead of local arrays
export function getAccounts(): LocalAccount[] {
  // We can't do sync getAccounts easily, but it's only used in Admin page which we can fetch async
  return getItem<LocalAccount[]>('accounts', []);
}

export function isAdmin(): boolean {
  const profile = getUserProfile();
  return profile?.role === 'admin';
}

export async function removeUser(userId: string): Promise<string | null> {
  if (!isAdmin()) return 'Only an admin can remove users.';
  const res = await removeUserAction(userId);
  if (res.error) return res.error;
  return null;
}

export function updateExamTracks(examTracks: ExamTrack[]): void {
  const profile = getUserProfile();
  if (!profile) return;
  const updated: UserProfile = { ...profile, targetExam: 'engineering', examTracks: examTracks.includes('engineering') ? examTracks : ['engineering', ...examTracks] };
  saveUserProfile(updated);
}

async function hashPassword(password: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function hasAdminCredential(): boolean {
  // Mocked for sync UI
  return getItem<boolean>('has_admin', true);
}

export async function setupAdminCredential(password: string): Promise<string | null> {
  const profile = getUserProfile();
  if (!profile) return 'Sign in with a user account first.';
  const res = await setupAdminAction(await hashPassword(password), profile.id);
  if (res.success) {
    setItem('admin_session', profile.id);
    return null;
  }
  return 'Failed to setup admin';
}

export async function loginAdmin(password: string): Promise<string | null> {
  const profile = getUserProfile();
  const res = await adminLoginAction(await hashPassword(password));
  if (res.error) return res.error;
  if (res.success && profile) {
    setItem('admin_session', profile.id);
  }
  return null;
}

export async function logoutAdmin(): Promise<void> { 
  removeItem('admin_session'); 
}

export async function registerUser(profile: UserProfile, password: string): Promise<string | null> {
  const email = profile.email.trim().toLowerCase();
  const hash = await hashPassword(password);
  const result = await registerNewUser({ ...profile, email }, hash);
  if (result.error) return result.error;
  if (result.user) {
    saveUserProfile({ ...result.user, createdAt: result.user.createdAt.toISOString() } as unknown as UserProfile);
    return null;
  }
  return 'Unknown error';
}

export async function loginUser(email: string, password: string): Promise<string | null> {
  const hash = await hashPassword(password);
  const result = await authenticateUser(email.trim().toLowerCase(), hash);
  if (result.error) return result.error;
  
  if (result.user) {
    const data = await pullAllData(result.user.id);
    Object.keys(data).forEach(key => {
      localStorage.setItem(`${PREFIX}${key}_${result.user!.id}`, JSON.stringify(data[key as keyof typeof data]));
    });
    saveUserProfile({ ...result.user, createdAt: result.user.createdAt.toISOString() } as unknown as UserProfile);
    return null;
  }
  return 'Unknown error';
}

export function getStudyDates(): string[] { return getItem<string[]>('study_dates', []); }
export function markStudyDay(date?: string): void {
  const today = date || getLocalDate();
  const dates = getStudyDates();
  if (!dates.includes(today)) {
    dates.push(today);
    setItem('study_dates', dates);
  }
}
export function getStreak(): number {
  const dates = getStudyDates().sort().reverse();
  if (dates.length === 0) return 0;
  const today = getLocalDate();
  if (dates[0] !== today) {
    const yesterday = getLocalDate(new Date(Date.now() - 86400000));
    if (dates[0] !== yesterday) return 0;
  }
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const d1 = new Date(dates[i - 1]).getTime();
    const d2 = new Date(dates[i]).getTime();
    if (d1 - d2 === 86400000) streak++; else break;
  }
  return streak;
}

export const storage = { get: <T>(key: string, def?: T) => getItem(key, def as T), set: <T>(key: string, val: T) => setItem(key, val), remove: removeItem };
