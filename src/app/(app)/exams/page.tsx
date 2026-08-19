'use client';
import { useState, useEffect } from 'react';
import { exams } from '@/data/exams';
import { getExamScores, saveExamScore, generateId, getLocalDate, getUserProfile } from '@/lib/storage';
import type { ExamScore, ExamTrack, ExamType } from '@/types';
import styles from './exams.module.css';

const typeLabels: Record<ExamType, string> = { daily_class: 'Daily Class', weekly_live: 'Weekly Live', weekly_offline: 'Weekly Offline', monthly_revision: 'Monthly' };
const typeColors: Record<ExamType, string> = { daily_class: '#4f8cff', weekly_live: '#a78bfa', weekly_offline: '#34d399', monthly_revision: '#f59e0b' };

export default function ExamsPage() {
  const [scores, setScores] = useState<ExamScore[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [inputs, setInputs] = useState<Record<string, { mcq: string; written: string }>>({});
  const [mounted, setMounted] = useState(false);
  const [examTracks, setExamTracks] = useState<ExamTrack[]>(['engineering']);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setScores(getExamScores());
      const profile = getUserProfile();
      if (profile) setExamTracks(profile.examTracks?.length ? profile.examTracks : [profile.targetExam]);
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!mounted) return null;

  const filtered = exams.filter(e => examTracks.includes(e.track) && (filter === 'all' || e.type === filter));
  const scored = scores.length;
  const avgPct = scored > 0 ? Math.round(scores.reduce((a, s) => a + s.percentage, 0) / scored) : 0;

  const handleSave = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    const inp = inputs[examId];
    if (!exam || !inp) return;
    const mcq = Math.min(exam.totalMcq, Math.max(0, Number.parseInt(inp.mcq, 10) || 0));
    const written = Math.min(exam.totalWritten, Math.max(0, Number.parseInt(inp.written, 10) || 0));
    const total = mcq + written;
    const pct = exam.totalMarks > 0 ? Math.round((total / exam.totalMarks) * 100) : 0;
    const score: ExamScore = { id: generateId(), examId, mcqObtained: mcq, writtenObtained: written, totalObtained: total, percentage: pct, recordedAt: new Date().toISOString() };
    saveExamScore(score);
    setInputs(prev => ({ ...prev, [examId]: { mcq: String(mcq), written: String(written) } }));
    setScores(prev => { const idx = prev.findIndex(s => s.examId === examId); if (idx >= 0) { const n = [...prev]; n[idx] = score; return n; } return [...prev, score]; });
  };

  const getInput = (id: string) => {
    const saved = scores.find(score => score.examId === id);
    return inputs[id] ?? (saved ? { mcq: String(saved.mcqObtained), written: String(saved.writtenObtained) } : { mcq: '', written: '' });
  };
  const setInput = (id: string, field: 'mcq' | 'written', val: string) => setInputs(prev => ({ ...prev, [id]: { ...getInput(id), [field]: val } }));
  const pctColor = (p: number) => p >= 80 ? 'var(--accent)' : p >= 60 ? 'var(--status-completed)' : p >= 40 ? 'var(--status-in-progress)' : '#ef4444';

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Exam Scores</h1>
      <div className={styles.statsBar}>
        <div className={styles.statBox}><span className={styles.statNum}>{exams.length}</span><span>Total Exams</span></div>
        <div className={styles.statBox}><span className={styles.statNum}>{scored}</span><span>Scored</span></div>
        <div className={styles.statBox}><span className={styles.statNum}>{avgPct}%</span><span>Average</span></div>
      </div>
      <div className={styles.filterRow}>
        {['all', 'daily_class', 'weekly_live', 'weekly_offline', 'monthly_revision'].map(t => (
          <button key={t} className={`${styles.filterBtn} ${filter === t ? styles.filterActive : ''}`} onClick={() => setFilter(t)}>
            {t === 'all' ? 'All' : typeLabels[t as ExamType]}
          </button>
        ))}
      </div>
      <div className={styles.examList}>
        {filtered.map(exam => {
          const score = scores.find(s => s.examId === exam.id);
          const inp = getInput(exam.id);
          const today = getLocalDate();
          const isPast = exam.examDate <= today;

          return (
            <div key={exam.id} className={styles.examCard}>
              <div className={styles.examHeader}>
                <div>
                  <span className={styles.examName}>{exam.name}</span>
                  <span className={styles.typeBadge} style={{ background: `${typeColors[exam.type]}22`, color: typeColors[exam.type] }}>{typeLabels[exam.type]}</span>
                </div>
                <span className={styles.examDate}>{new Date(exam.examDate + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className={styles.examMeta}>{exam.subjectsCovered} • Total: {exam.totalMarks} marks</div>
              {isPast ? (
                <div className={styles.scoreSection}>
                  <div className={styles.scoreInputs}>
                    {exam.totalMcq > 0 && (
                      <label className={styles.scoreLabel}>MCQ
                        <div className={styles.scoreField}>
                          <input className="input" type="number" min="0" max={exam.totalMcq} value={inp.mcq} onChange={e => setInput(exam.id, 'mcq', e.target.value)} style={{ width: 70 }} />
                          <span>/ {exam.totalMcq}</span>
                        </div>
                      </label>
                    )}
                    {exam.totalWritten > 0 && (
                      <label className={styles.scoreLabel}>Written
                        <div className={styles.scoreField}>
                          <input className="input" type="number" min="0" max={exam.totalWritten} value={inp.written} onChange={e => setInput(exam.id, 'written', e.target.value)} style={{ width: 70 }} />
                          <span>/ {exam.totalWritten}</span>
                        </div>
                      </label>
                    )}
                    <button className="btn btn-primary" onClick={() => handleSave(exam.id)} style={{ alignSelf: 'flex-end' }}>Save</button>
                  </div>
                  {score && (
                    <div className={styles.pctBar}>
                      <div className={styles.pctFill} style={{ width: `${score.percentage}%`, background: pctColor(score.percentage) }} />
                      <span className={styles.pctText}>{score.percentage}%</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.upcoming}>📅 Upcoming</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
