'use client';

import { useEffect, useMemo, useState } from 'react';
import { chapters } from '@/data/chapters';
import { subjects } from '@/data/subjects';
import { getExamScores, getPersonalExams, getProgress, getTimerSessions } from '@/lib/storage';
import type { ExamScore, PersonalExamRecord, TaskProgress, TimerSession } from '@/types';
import styles from './statistics.module.css';

const pct = (value: number, total: number) => total ? Math.round((value / total) * 100) : 0;

export default function StatisticsPage() {
  const [progress, setProgress] = useState<TaskProgress[]>([]);
  const [scores, setScores] = useState<ExamScore[]>([]);
  const [personal, setPersonal] = useState<PersonalExamRecord[]>([]);
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => { setProgress(getProgress()); setScores(getExamScores()); setPersonal(getPersonalExams()); setSessions(getTimerSessions()); setReady(true); }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const data = useMemo(() => {
    const completed = progress.filter(item => item.status === 'completed').length;
    const totalRevisions = progress.reduce((sum, item) => sum + item.revisionCount, 0);
    const coachingAverage = scores.length ? Math.round(scores.reduce((sum, score) => sum + score.percentage, 0) / scores.length) : 0;
    const personalMarks = personal.reduce((sum, exam) => sum + exam.mcqMarks + exam.writtenMarks, 0);
    const personalTotal = personal.reduce((sum, exam) => sum + exam.totalMcqMarks + exam.totalWrittenMarks, 0);
    const studyMinutes = Math.round(sessions.reduce((sum, session) => sum + session.durationSeconds, 0) / 60);
    return { completed, totalRevisions, coachingAverage, personalAverage: pct(personalMarks, personalTotal), studyMinutes };
  }, [personal, progress, scores, sessions]);
  if (!ready) return null;
  const scorePoints = [...scores].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt)).slice(-8);
  const maxScore = Math.max(100, ...scorePoints.map(score => score.percentage));
  return <div className={styles.container}>
    <header><h1>Your Statistics</h1><p>A personal overview of your study progress, marks, revisions, and practice.</p></header>
    <div className={styles.kpis}><div><strong>{pct(data.completed, chapters.length)}%</strong><span>Chapters completed</span></div><div><strong>{data.totalRevisions}</strong><span>Revisions recorded</span></div><div><strong>{data.coachingAverage}%</strong><span>Coaching mark average</span></div><div><strong>{data.studyMinutes}</strong><span>Minutes timed</span></div></div>
    <div className={styles.grid}>
      <section className={styles.card}><h2>Subject completion</h2>{subjects.map(subject => { const subjectChapters = chapters.filter(chapter => chapter.subjectCode === subject.code); const done = subjectChapters.filter(chapter => progress.some(item => item.chapterId === chapter.id && item.status === 'completed')).length; const value = pct(done, subjectChapters.length); return <div key={subject.id} className={styles.subject}><div><span>{subject.name}</span><b>{done}/{subjectChapters.length}</b></div><div className={styles.track}><i style={{ width: `${value}%`, background: subject.color }} /></div></div>; })}</section>
      <section className={styles.card}><h2>Chapter status</h2><div className={styles.donut} style={{ background: `conic-gradient(var(--status-completed) 0 ${pct(data.completed, chapters.length)}%, var(--status-in-progress) ${pct(data.completed, chapters.length)}% 100%)` }}><span>{data.completed}<small>done</small></span></div><p className={styles.caption}>{chapters.length - data.completed} chapters remain. Record revisions from the Revision Tracker.</p></section>
      <section className={`${styles.card} ${styles.wide}`}><h2>Coaching exam performance</h2>{scorePoints.length === 0 ? <p className={styles.empty}>Record coaching marks on the Exams page to see this chart.</p> : <div className={styles.chart}>{scorePoints.map((score, index) => <div key={score.id} className={styles.barWrap}><div className={styles.bar} style={{ height: `${(score.percentage / maxScore) * 100}%` }} title={`${score.percentage}%`} /><span>{score.percentage}%</span><small>#{index + 1}</small></div>)}</div>}</section>
      <section className={styles.card}><h2>Personal practice</h2><div className={styles.practice}><strong>{data.personalAverage}%</strong><span>Average mark rate</span><p>{personal.length} personal exams · {personal.reduce((sum, exam) => sum + exam.mcqAnswered + exam.writtenAnswered, 0)} questions answered</p></div></section>
      <section className={styles.card}><h2>Timed practice</h2><div className={styles.practice}><strong>{Math.floor(data.studyMinutes / 60)}h {data.studyMinutes % 60}m</strong><span>Tracked study time</span><p>{sessions.length} timer sessions saved</p></div></section>
    </div>
  </div>;
}
