import { Subject } from '@/types';

export const subjects: Subject[] = [
  { id: 'physics', name: 'Physics', code: 'P', color: '#4f8cff', bgColor: 'rgba(79,140,255,0.1)', icon: '⚛️' },
  { id: 'chemistry', name: 'Chemistry', code: 'C', color: '#34d399', bgColor: 'rgba(52,211,153,0.1)', icon: '🧪' },
  { id: 'math', name: 'Math', code: 'M', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)', icon: '📐' },
  { id: 'higher-math', name: 'Higher Math', code: 'HM', color: '#a78bfa', bgColor: 'rgba(167,139,250,0.1)', icon: '🔢' },
  { id: 'biology', name: 'Biology', code: 'Bio', color: '#f87171', bgColor: 'rgba(248,113,113,0.1)', icon: '🧬' },
];

export function getSubjectByCode(code: string): Subject | undefined {
  return subjects.find(s => s.code === code);
}

export function getSubjectColor(code: string): string {
  return getSubjectByCode(code)?.color ?? '#6366f1';
}
