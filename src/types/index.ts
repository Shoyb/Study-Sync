export type SubjectCode = 'P' | 'C' | 'M' | 'HM' | 'Bio';
export type ExamTrack = 'engineering' | 'medical' | 'varsity_ka' | 'varsity_kha';
export type TaskStatus = 'not_started' | 'in_progress' | 'revision' | 'completed';
export type TimerType = 'countdown' | 'buet_stopwatch';
export type EventType = 'class' | 'revision' | 'exam' | 'custom';
export type ExamType = 'daily_class' | 'weekly_live' | 'weekly_offline' | 'monthly_revision';
export type UserRole = 'admin' | 'user';

export interface Subject {
  id: string;
  name: string;
  code: SubjectCode;
  color: string;
  bgColor: string;
  icon: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  subjectCode: SubjectCode;
  code: string;
  title: string;
  part: string;
  topics: string;
  stepNumber: number;
  coachingDate: string;
  orderIndex: number;
}

export interface TaskProgress {
  id: string;
  chapterId: string;
  status: TaskStatus;
  confidenceLevel: number;
  revisionCount: number;
  lastRevised: string | null;
  notes: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  subjectsCovered: string;
  examDate: string;
  totalMcq: number;
  totalWritten: number;
  totalMarks: number;
  track: ExamTrack;
}

export interface ExamScore {
  id: string;
  examId: string;
  mcqObtained: number;
  writtenObtained: number;
  totalObtained: number;
  percentage: number;
  recordedAt: string;
}

export interface CalendarEvent {
  id: string;
  chapterId?: string;
  scheduledDate: string;
  eventType: EventType;
  title: string;
  color: string;
  completed: boolean;
}

export interface TimerSession {
  id: string;
  chapterId?: string;
  timerType: TimerType;
  durationSeconds: number;
  intervalsCompleted?: number;
  startedAt: string;
  endedAt: string;
  mcqAnswered?: number;
  writtenAnswered?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  targetExam: ExamTrack;
  examTracks?: ExamTrack[];
  coachingBatch: string;
  createdAt: string;
  role?: UserRole;
}

export interface PersonalExamRecord {
  id: string;
  name: string;
  mode: 'countdown' | 'stopwatch';
  plannedMcq: number;
  plannedWritten: number;
  mcqAnswered: number;
  writtenAnswered: number;
  mcqMarks: number;
  writtenMarks: number;
  totalMcqMarks: number;
  totalWrittenMarks: number;
  durationSeconds: number;
  createdAt: string;
}

export interface LocalAccount extends UserProfile {
  passwordHash: string;
  role: UserRole;
}

export interface CustomCalendarExam {
  id: string;
  name: string;
  examDate: string;
  subjectsCovered: string;
  totalMarks: number;
  notes: string;
  createdAt: string;
}

export interface CustomRevisionChapter {
  id: string;
  subjectCode: SubjectCode;
  paper: string;
  title: string;
  createdAt: string;
}

export interface RoutineDay {
  date: string;
  dayName: string;
  classes: { code: string; part: string; subject: SubjectCode }[];
  liveExams: string[];
  offlineExams: { code: string; subject: SubjectCode; mcq: number; written: number }[];
}
