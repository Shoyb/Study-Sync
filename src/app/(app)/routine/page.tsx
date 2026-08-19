'use client';
import { useEffect, useMemo, useState } from 'react';
import { chapters } from '@/data/chapters';
import { exams } from '@/data/exams';
import { subjects, getSubjectByCode } from '@/data/subjects';
import type { ExamTrack, SubjectCode } from '@/types';
import { getLocalDate, getUserProfile } from '@/lib/storage';
import styles from './routine.module.css';

const ROUTINE_START = new Date('2026-08-17');
const ROUTINE_END = new Date('2026-09-22');

export default function RoutinePage() {
  const [activeSubjects, setActiveSubjects] = useState<Set<SubjectCode>>(new Set(['P', 'C', 'M', 'HM']));
  const [currentTime, setCurrentTime] = useState(0);
  const [examTracks, setExamTracks] = useState<ExamTrack[]>(['engineering']);
  const toggleSubject = (code: SubjectCode) => setActiveSubjects(prev => {
    const next = new Set(prev);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    return next;
  });

  useEffect(() => {
    const timer = window.setTimeout(() => { setCurrentTime(Date.now()); const profile = getUserProfile(); if (profile) setExamTracks(profile.examTracks?.length ? profile.examTracks : [profile.targetExam]); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const today = getLocalDate(new Date(currentTime));
  const daysPassed = Math.max(0, Math.floor((currentTime - ROUTINE_START.getTime()) / 86400000));
  const totalDays = Math.floor((ROUTINE_END.getTime() - ROUTINE_START.getTime()) / 86400000);

  const timeline = useMemo(() => {
    const days: { date: string; dayName: string; items: { type: 'class' | 'exam'; label: string; detail: string; color: string }[] }[] = [];
    const d = new Date(ROUTINE_START);
    while (d <= ROUTINE_END) {
      const ds = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const items: typeof days[0]['items'] = [];

      chapters.filter(c => c.coachingDate === ds && activeSubjects.has(c.subjectCode)).forEach(ch => {
        const sub = getSubjectByCode(ch.subjectCode);
        items.push({ type: 'class', label: `${ch.code} ${ch.part}`, detail: ch.title + ' — ' + ch.topics.slice(0, 80), color: sub?.color ?? '#6366f1' });
      });

      exams.filter(e => e.examDate === ds && examTracks.includes(e.track)).forEach(ex => {
        items.push({ type: 'exam', label: ex.name, detail: `${ex.subjectsCovered} • ${ex.totalMarks} marks`, color: '#f59e0b' });
      });

      days.push({ date: ds, dayName, items });
      d.setDate(d.getDate() + 1);
    }
    return days;
  }, [activeSubjects, examTracks]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Step-01 Routine</h1>
          <p className={styles.range}>Aug 17 — Sep 22, 2026</p>
        </div>
        <div className={styles.progress}>
          <span className={styles.progressText}>Day {daysPassed} of {totalDays}</span>
          <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${Math.min(100, (daysPassed / totalDays) * 100)}%` }} /></div>
        </div>
      </div>

      <div className={styles.subjectFilters}>
        {subjects.filter(s => s.code !== 'Bio').map(s => (
          <button key={s.code} className={`${styles.filterBtn} ${activeSubjects.has(s.code) ? styles.filterOn : ''}`}
            style={{ '--fc': s.color } as React.CSSProperties} onClick={() => toggleSubject(s.code)}>
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      <div className={styles.timeline}>
        {timeline.map(day => {
          const isToday = day.date === today;
          const isPast = day.date < today;
          return (
            <div key={day.date} className={`${styles.timelineDay} ${isToday ? styles.isToday : ''} ${isPast ? styles.isPast : ''}`}>
              <div className={styles.dateSide}>
                <div className={`${styles.dot} ${isToday ? styles.dotToday : ''}`} />
                <span className={styles.dateText}>{new Date(day.date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className={styles.dayText}>{day.dayName}</span>
              </div>
              <div className={styles.line} />
              <div className={styles.eventSide}>
                {day.items.length === 0 ? (
                  <span className={styles.noEvent}>No events</span>
                ) : (
                  day.items.map((item, i) => (
                    <div key={i} className={`${styles.eventCard} ${item.type === 'exam' ? styles.examEvent : ''}`} style={{ borderLeftColor: item.color }}>
                      <div className={styles.eventLabel}>
                        <span className={styles.eventBadge} style={{ background: `${item.color}22`, color: item.color }}>
                          {item.type === 'exam' ? '📝' : '📖'} {item.label}
                        </span>
                      </div>
                      <p className={styles.eventDetail}>{item.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <h3>Exam Format Reference</h3>
        <div className={styles.formatGrid}>
          <div className={styles.formatCard}><strong>Daily Class</strong><br />MCQ(15) + Written(10) = 25 marks, 15 min</div>
          <div className={styles.formatCard}><strong>Weekly Live</strong><br />MCQ(120, 35min) + Written(180, 55min) = 300 marks, 1h30m</div>
          <div className={styles.formatCard}><strong>Offline</strong><br />MCQ(20) + Written(10) = 30 marks</div>
          <div className={styles.formatCard}><strong>Monthly Revision</strong><br />Written(600) = 600 marks, 3 hours</div>
        </div>
      </div>
    </div>
  );
}
