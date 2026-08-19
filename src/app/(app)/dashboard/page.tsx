'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProgressRing from '@/components/ui/ProgressRing';
import { subjects, getSubjectByCode } from '@/data/subjects';
import { chapters } from '@/data/chapters';
import { exams } from '@/data/exams';
import { getLocalDate, getProgress, getStreak, getUserProfile } from '@/lib/storage';
import type { TaskProgress } from '@/types';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const [progress, setProgress] = useState<TaskProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState('Student');
  const [currentTime, setCurrentTime] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress(getProgress());
      setStreak(getStreak());
      const profile = getUserProfile();
      if (profile) setUserName(profile.name);
      setCurrentTime(Date.now());
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const completed = progress.filter(p => p.status === 'completed').length;
  const total = chapters.length;
  const overallPct = total > 0 ? (completed / total) * 100 : 0;

  const today = getLocalDate(new Date(currentTime));
  const todayChapters = chapters.filter(c => c.coachingDate === today);
  const upcomingExams = exams.filter(e => e.examDate >= today).sort((a, b) => a.examDate.localeCompare(b.examDate)).slice(0, 3);

  const daysUntil = (date: string) => {
    const d = Math.ceil((new Date(`${date}T00:00`).getTime() - currentTime) / 86400000);
    return d <= 0 ? 'Today' : `in ${d}d`;
  };

  const needsRevision = progress.filter(p => {
    if (!p.lastRevised) return false;
    const days = (currentTime - new Date(p.lastRevised).getTime()) / 86400000;
    return days >= 7 && p.status !== 'not_started';
  });

  const hour = new Date(currentTime).getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1>{greeting}, {userName}!</h1>
          <p className={styles.date}>{new Date(currentTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <p className={styles.quote}>&ldquo;Success is the sum of small efforts, repeated day in and day out.&rdquo;</p>
      </header>

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.progressCard}`}>
          <ProgressRing progress={overallPct} size={160} strokeWidth={12} label="Overall" />
          <p className={styles.progressText}>{completed} of {total} chapters done</p>
        </div>

        <div className={`${styles.card} ${styles.subjectsCard}`}>
          <h2>Subject Progress</h2>
          <div className={styles.subjectList}>
            {subjects.map(sub => {
              const subChaps = chapters.filter(c => c.subjectCode === sub.code);
              const subDone = subChaps.filter(ch => progress.find(p => p.chapterId === ch.id && p.status === 'completed')).length;
              const pct = subChaps.length > 0 ? (subDone / subChaps.length) * 100 : 0;
              return (
                <div key={sub.id} className={styles.subjectRow} style={{ '--sc': sub.color } as React.CSSProperties}>
                  <span className={styles.subIcon}>{sub.icon}</span>
                  <span className={styles.subName}>{sub.name}</span>
                  <div className={styles.subBar}><div className={styles.subFill} style={{ width: `${pct}%`, background: sub.color }} /></div>
                  <span className={styles.subCount}>{subDone}/{subChaps.length}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${styles.card} ${styles.scheduleCard}`}>
          <h2>📖 Today&apos;s Classes</h2>
          {todayChapters.length === 0 ? <p className={styles.empty}>No classes today</p> : (
            <div className={styles.schedList}>
              {todayChapters.map(ch => {
                const sub = getSubjectByCode(ch.subjectCode);
                return (
                  <div key={ch.id} className={styles.schedItem} style={{ borderLeftColor: sub?.color }}>
                    <strong>{ch.code} {ch.part}</strong><span className={styles.schedTopic}>{ch.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`${styles.card} ${styles.examsCard}`}>
          <h2>📝 Upcoming Exams</h2>
          <div className={styles.examList}>
            {upcomingExams.map(ex => (
              <div key={ex.id} className={styles.examItem}>
                <div><strong>{ex.name}</strong><br/><span className={styles.examSub}>{ex.subjectsCovered}</span></div>
                <span className={styles.countdown}>{daysUntil(ex.examDate)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.card} ${styles.streakCard}`}>
          <span className={styles.fire}>🔥</span>
          <div><span className={styles.streakNum}>{streak}</span><span className={styles.streakLabel}>Day Streak</span></div>
        </div>

        <div className={`${styles.card} ${styles.actionsCard}`}>
          <h2>Quick Actions</h2>
          <div className={styles.actionBtns}>
            <Link href="/timer" className="btn btn-primary">⏱️ Start Timer</Link>
            <Link href="/calendar" className="btn btn-secondary">📅 Calendar</Link>
            <Link href="/chapters" className="btn btn-secondary">📚 Chapters</Link>
          </div>
        </div>

        {needsRevision.length > 0 && (
          <div className={`${styles.card} ${styles.revisionCard}`}>
            <h2>⚠️ Needs Revision</h2>
            {needsRevision.slice(0, 3).map(p => {
              const ch = chapters.find(c => c.id === p.chapterId);
              return ch ? <div key={p.id} className={styles.revItem}>{ch.code} {ch.part} — {ch.title}</div> : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
