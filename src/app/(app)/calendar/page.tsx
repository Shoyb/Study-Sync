'use client';

import { useEffect, useState } from 'react';
import { exams } from '@/data/exams';
import { deleteCustomCalendarExam, generateId, getCustomCalendarExams, getLocalDate, getUserProfile, saveCustomCalendarExam } from '@/lib/storage';
import type { CustomCalendarExam, Exam, ExamTrack, ExamType } from '@/types';
import styles from './calendar.module.css';

const DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const labels: Record<ExamType, string> = { daily_class: 'Daily class', weekly_live: 'Weekly live', weekly_offline: 'Weekly offline', monthly_revision: 'Monthly revision' };
const colors: Record<ExamType, string> = { daily_class: '#4f8cff', weekly_live: '#a78bfa', weekly_offline: '#34d399', monthly_revision: '#f59e0b' };
type CalendarExam = Exam | CustomCalendarExam;
const custom = (exam: CalendarExam): exam is CustomCalendarExam => !('type' in exam);

export default function CalendarPage() {
  const [current, setCurrent] = useState(() => new Date());
  const [tracks, setTracks] = useState<ExamTrack[]>(['engineering']);
  const [customExams, setCustomExams] = useState<CustomCalendarExam[]>([]);
  const [selected, setSelected] = useState<CalendarExam | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', subjects: '', marks: '', notes: '' });
  useEffect(() => { const timer = window.setTimeout(() => { const profile = getUserProfile(); if (profile) setTracks(profile.examTracks?.length ? profile.examTracks : [profile.targetExam]); setCustomExams(getCustomCalendarExams()); }, 0); return () => window.clearTimeout(timer); }, []);
  const year = current.getFullYear(); const month = current.getMonth(); const today = getLocalDate();
  const toDate = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const save = () => { if (!form.name.trim() || !form.date) return; saveCustomCalendarExam({ id: generateId(), name: form.name.trim(), examDate: form.date, subjectsCovered: form.subjects.trim() || 'Personal exam', totalMarks: Math.max(0, Number.parseInt(form.marks, 10) || 0), notes: form.notes.trim(), createdAt: new Date().toISOString() }); setCustomExams(getCustomCalendarExams()); setAdding(false); setForm({ name: '', date: '', subjects: '', marks: '', notes: '' }); };
  const cells = []; const first = (new Date(year, month, 1).getDay() + 1) % 7; const totalDays = new Date(year, month + 1, 0).getDate();
  for (let index = 0; index < first; index++) cells.push(<div key={`blank-${index}`} className={`${styles.cell} ${styles.empty}`} />);
  for (let day = 1; day <= totalDays; day++) { const date = toDate(day); const items: CalendarExam[] = [...exams.filter(exam => exam.examDate === date && tracks.includes(exam.track)), ...customExams.filter(exam => exam.examDate === date)]; cells.push(<div key={date} className={`${styles.cell} ${date === today ? styles.today : ''}`}><span className={styles.dayNum}>{day}</span><div className={styles.evtList}>{items.slice(0, 3).map(exam => { const color = custom(exam) ? '#ec4899' : colors[exam.type]; return <button key={exam.id} className={styles.pill} style={{ borderColor: color, background: `${color}22` }} onClick={() => setSelected(exam)}>{exam.name}</button>; })}{items.length > 3 && <span className={styles.more}>+{items.length - 3} more</span>}</div></div>); }
  return <div className={styles.container}>
    <div className={styles.header}><div><div className={styles.nav}><button className={styles.navBtn} onClick={() => setCurrent(new Date(year, month - 1))}>‹</button><h1 className={styles.monthTitle}>{current.toLocaleString('default', { month: 'long', year: 'numeric' })}</h1><button className={styles.navBtn} onClick={() => setCurrent(new Date(year, month + 1))}>›</button></div><p className={styles.description}>Coaching exams and your own personal exam schedule.</p></div><div className={styles.actions}><button className="btn btn-secondary" onClick={() => setCurrent(new Date())}>Today</button><button className="btn btn-primary" onClick={() => setAdding(true)}>+ Add exam</button></div></div>
    <div className={styles.grid}><div className={styles.weekRow}>{DAYS.map(day => <div key={day} className={styles.weekDay}>{day}</div>)}</div><div className={styles.daysGrid}>{cells}</div></div>
    <div className={styles.legend}>{(Object.keys(labels) as ExamType[]).map(type => <span key={type} className={styles.legendItem}><i className={styles.dot} style={{ background: colors[type] }} />{labels[type]}</span>)}<span className={styles.legendItem}><i className={styles.dot} style={{ background: '#ec4899' }} />Personal exam</span></div>
    {adding && <div className="modal-overlay" onClick={() => setAdding(false)}><section className="modal-content" onClick={event => event.stopPropagation()}><h2 className={styles.formTitle}>Add personal exam</h2><div className={styles.form}><input className="input" placeholder="Exam name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /><input className="input" type="date" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} /><input className="input" placeholder="Subjects / syllabus" value={form.subjects} onChange={event => setForm({ ...form, subjects: event.target.value })} /><input className="input" type="number" min="0" placeholder="Total marks (optional)" value={form.marks} onChange={event => setForm({ ...form, marks: event.target.value })} /><textarea className="textarea" placeholder="Notes (optional)" value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} /><div className={styles.formActions}><button className="btn btn-ghost" onClick={() => setAdding(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Add to calendar</button></div></div></section></div>}
    {selected && <div className="modal-overlay" onClick={() => setSelected(null)}><section className="modal-content" onClick={event => event.stopPropagation()}><div className={styles.modalHeader}><div><span className={styles.typeBadge} style={{ color: custom(selected) ? '#f472b6' : colors[selected.type] }}>{custom(selected) ? 'Personal exam' : labels[selected.type]}</span><h2>{selected.name}</h2></div><button className="btn btn-ghost" onClick={() => setSelected(null)}>×</button></div><p className={styles.modalDate}>{new Date(`${selected.examDate}T00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p><p className={styles.covered}>{selected.subjectsCovered}</p><p className={styles.customNotes}>Total marks: {selected.totalMarks || 'Not set'}{custom(selected) && selected.notes ? ` · ${selected.notes}` : ''}</p><div className={styles.formActions}>{custom(selected) && <button className="btn btn-danger" onClick={() => { deleteCustomCalendarExam(selected.id); setCustomExams(getCustomCalendarExams()); setSelected(null); }}>Delete</button>}<button className="btn btn-primary" onClick={() => setSelected(null)}>Close</button></div></section></div>}
  </div>;
}
