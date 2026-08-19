'use client';
import { useEffect, useState } from 'react';
import { subjects, getSubjectByCode } from '@/data/subjects';
import { chapters } from '@/data/chapters';
import { getProgress, markStudyDay, updateChapterProgress } from '@/lib/storage';
import type { TaskProgress, TaskStatus } from '@/types';
import styles from './chapters.module.css';

const statusOrder: TaskStatus[] = ['not_started', 'in_progress', 'revision', 'completed'];
const statusLabels: Record<TaskStatus, string> = { not_started: 'Not Started', in_progress: 'In Progress', revision: 'Revision', completed: 'Completed' };

export default function ChaptersPage() {
  const [progress, setProgress] = useState<TaskProgress[]>([]);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress(getProgress());
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!mounted) return null;

  const getStatus = (chId: string): TaskStatus => progress.find(p => p.chapterId === chId)?.status ?? 'not_started';
  const getConfidence = (chId: string): number => progress.find(p => p.chapterId === chId)?.confidenceLevel ?? 0;
  const getNotes = (chId: string): string => progress.find(p => p.chapterId === chId)?.notes ?? '';

  const cycleStatus = (chId: string) => {
    const cur = getStatus(chId);
    const next = statusOrder[(statusOrder.indexOf(cur) + 1) % statusOrder.length];
    const updated: Partial<TaskProgress> = { status: next };
    if (next === 'revision' || next === 'completed') {
      updated.lastRevised = new Date().toISOString();
      updated.revisionCount = (progress.find(p => p.chapterId === chId)?.revisionCount ?? 0) + 1;
    }
    if (next === 'completed') markStudyDay();
    setProgress(updateChapterProgress(chId, updated));
  };

  const setConfidence = (chId: string, level: number) => { setProgress(updateChapterProgress(chId, { confidenceLevel: level })); };
  const setNotes = (chId: string, notes: string) => { setProgress(updateChapterProgress(chId, { notes })); };

  const filtered = chapters.filter(c => {
    if (filter !== 'all' && c.subjectCode !== filter) return false;
    if (statusFilter !== 'all' && getStatus(c.id) !== statusFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase()) && !c.topics.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const completed = progress.filter(p => p.status === 'completed').length;
  const inProg = progress.filter(p => p.status === 'in_progress').length;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Chapter Tracker</h1>
      <div className={styles.filters}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All</button>
          {subjects.map(s => (
            <button key={s.id} className={`${styles.tab} ${filter === s.code ? styles.active : ''}`}
              style={{ '--tc': s.color } as React.CSSProperties} onClick={() => setFilter(s.code)}>{s.icon} {s.name}</button>
          ))}
        </div>
        <div className={styles.controls}>
          <input className="input" placeholder="Search chapters..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 250 }} />
          <select className="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="all">All Status</option>
            {statusOrder.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.stats}>
        <span>Total: <strong>{chapters.length}</strong></span>
        <span>Completed: <strong className={styles.green}>{completed}</strong></span>
        <span>In Progress: <strong className={styles.amber}>{inProg}</strong></span>
      </div>
      <div className={styles.list}>
        {filtered.map(ch => {
          const sub = getSubjectByCode(ch.subjectCode);
          const status = getStatus(ch.id);
          const conf = getConfidence(ch.id);
          const notes = getNotes(ch.id);
          const isOpen = expandedId === ch.id;
          const pr = progress.find(p => p.chapterId === ch.id);

          return (
            <div key={ch.id} className={styles.card} style={{ '--sc': sub?.color ?? '#6366f1' } as React.CSSProperties}>
              <div className={styles.cardHeader} onClick={() => setExpandedId(isOpen ? null : ch.id)}>
                <div className={styles.cardLeft}>
                  <span className={styles.code}>{ch.code}</span>
                  <div>
                    <span className={styles.title}>{ch.title}</span>
                    <span className={styles.part}>{ch.part}</span>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <button className={`badge badge-${status.replace('_', '-')}`}
                    onClick={e => { e.stopPropagation(); cycleStatus(ch.id); }}>{statusLabels[status]}</button>
                  <div className="stars" onClick={e => e.stopPropagation()}>
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`star ${i <= conf ? 'filled' : ''}`} onClick={() => setConfidence(ch.id, i)}>★</span>
                    ))}
                  </div>
                  <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>
              {isOpen && (
                <div className={styles.cardBody}>
                  <div className={styles.topics}><strong>Topics:</strong> {ch.topics}</div>
                  <div className={styles.meta}>
                    <span>📅 Coaching: {ch.coachingDate}</span>
                    <span>🔄 Revisions: {pr?.revisionCount ?? 0}</span>
                    {pr?.lastRevised && <span>🕐 Last: {new Date(pr.lastRevised).toLocaleDateString()}</span>}
                  </div>
                  <textarea className="textarea" placeholder="Add notes..." value={notes}
                    onChange={e => setNotes(ch.id, e.target.value)} rows={3} />
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className={styles.empty}>No chapters match your filters.</p>}
      </div>
    </div>
  );
}
