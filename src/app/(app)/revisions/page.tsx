'use client';

import { useEffect, useState } from 'react';
import { syllabusChapters } from '@/data/syllabusChapters';
import { getSubjectByCode } from '@/data/subjects';
import { deleteCustomRevisionChapter, generateId, getCustomRevisionChapters, getProgress, markStudyDay, saveCustomRevisionChapter, updateChapterProgress } from '@/lib/storage';
import type { CustomRevisionChapter, SubjectCode, TaskProgress } from '@/types';
import styles from './revisions.module.css';

export default function RevisionsPage() {
  const [progress, setProgress] = useState<TaskProgress[]>([]);
  const [customChapters, setCustomChapters] = useState<CustomRevisionChapter[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState<SubjectCode>('P');
  const [paper, setPaper] = useState('Custom chapter');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => { setProgress(getProgress()); setCustomChapters(getCustomRevisionChapters()); setMounted(true); }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!mounted) return null;

  const totalRevisions = progress.reduce((total, item) => total + item.revisionCount, 0);
  const revisedChapters = progress.filter(item => item.revisionCount > 0).length;
  const recordRevision = (chapterId: string) => {
    const current = progress.find(item => item.chapterId === chapterId);
    setProgress(updateChapterProgress(chapterId, { status: 'revision', revisionCount: (current?.revisionCount ?? 0) + 1, lastRevised: new Date().toISOString() }));
    markStudyDay();
  };
  const allChapters = [...syllabusChapters, ...customChapters];
  const addChapter = () => {
    if (!title.trim()) return;
    saveCustomRevisionChapter({ id: generateId(), subjectCode, paper: paper.trim() || 'Custom chapter', title: title.trim(), createdAt: new Date().toISOString() });
    setCustomChapters(getCustomRevisionChapters()); setTitle(''); setPaper('Custom chapter'); setShowForm(false);
  };

  return <div className={styles.container}>
    <header className={styles.header}><div><h1>Revision Tracker</h1><p>Keep a clear count of every syllabus chapter revision.</p></div><button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add chapter</button></header>
    <div className={styles.stats}><div><strong>{totalRevisions}</strong><span>Total revisions</span></div><div><strong>{revisedChapters}</strong><span>Chapters revised</span></div><div><strong>{allChapters.length - revisedChapters}</strong><span>Not revised yet</span></div></div>
    {showForm && <div className={styles.addForm}><select className="select" value={subjectCode} onChange={event => setSubjectCode(event.target.value as SubjectCode)}><option value="P">Physics</option><option value="C">Chemistry</option><option value="M">Higher Math</option><option value="HM">Additional Math</option><option value="Bio">Biology</option></select><input className="input" placeholder="Paper / group" value={paper} onChange={event => setPaper(event.target.value)} /><input className="input" placeholder="Chapter title" value={title} onChange={event => setTitle(event.target.value)} /><button className="btn btn-primary" onClick={addChapter}>Add</button><button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button></div>}
    <div className={styles.list}>{allChapters.map(chapter => {
      const item = progress.find(entry => entry.chapterId === chapter.id);
      const subject = getSubjectByCode(chapter.subjectCode);
      const count = item?.revisionCount ?? 0;
      const isCustom = customChapters.some(custom => custom.id === chapter.id);
      return <article key={chapter.id} className={styles.card} style={{ borderLeftColor: subject?.color }}><div><span className={styles.code}>{chapter.paper}{isCustom ? ' · Personal' : ''}</span><h2>{chapter.title}</h2><p>{count === 0 ? 'Not revised yet' : `Revised ${count} ${count === 1 ? 'time' : 'times'}${item?.lastRevised ? ` · Last: ${new Date(item.lastRevised).toLocaleDateString()}` : ''}`}</p></div><div className={styles.cardActions}><button type="button" className="btn btn-secondary" onClick={() => recordRevision(chapter.id)}>+ Record revision</button>{isCustom && <button className="btn btn-ghost" onClick={() => { deleteCustomRevisionChapter(chapter.id); setCustomChapters(getCustomRevisionChapters()); }}>Delete</button>}</div></article>;
    })}</div>
  </div>;
}
