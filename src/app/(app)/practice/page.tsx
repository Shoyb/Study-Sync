'use client';

import { useEffect, useRef, useState } from 'react';
import { generateId, getPersonalExams, markStudyDay, savePersonalExam } from '@/lib/storage';
import type { PersonalExamRecord } from '@/types';
import styles from './practice.module.css';

const format = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
const number = (value: string) => Math.max(0, Number.parseInt(value, 10) || 0);

export default function PracticePage() {
  const [name, setName] = useState('Personal practice exam');
  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [minutes, setMinutes] = useState('30');
  const [plannedMcq, setPlannedMcq] = useState('20');
  const [plannedWritten, setPlannedWritten] = useState('0');
  const [active, setActive] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<PersonalExamRecord[]>([]);
  const [mcqAnswered, setMcqAnswered] = useState('0');
  const [writtenAnswered, setWrittenAnswered] = useState('0');
  const [mcqMarks, setMcqMarks] = useState('0');
  const [writtenMarks, setWrittenMarks] = useState('0');
  const [totalMcqMarks, setTotalMcqMarks] = useState('20');
  const [totalWrittenMarks, setTotalWrittenMarks] = useState('0');
  const ref = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => { const timer = window.setTimeout(() => setHistory(getPersonalExams()), 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => setElapsed(value => {
      const next = value + 1;
      if (mode === 'countdown' && next >= duration) { setRunning(false); setFinished(true); return duration; }
      return next;
    }), 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [duration, mode, running]);

  const start = () => {
    const seconds = number(minutes) * 60;
    if (mode === 'countdown' && seconds === 0) return;
    setDuration(seconds); setElapsed(0); setFinished(false); setActive(true); setRunning(true);
    setMcqAnswered('0'); setWrittenAnswered('0'); setMcqMarks('0'); setWrittenMarks('0');
  };
  const finish = () => { setRunning(false); setFinished(true); };
  const save = () => {
    const record: PersonalExamRecord = { id: generateId(), name: name.trim() || 'Personal practice exam', mode, plannedMcq: number(plannedMcq), plannedWritten: number(plannedWritten), mcqAnswered: number(mcqAnswered), writtenAnswered: number(writtenAnswered), mcqMarks: number(mcqMarks), writtenMarks: number(writtenMarks), totalMcqMarks: number(totalMcqMarks), totalWrittenMarks: number(totalWrittenMarks), durationSeconds: elapsed, createdAt: new Date().toISOString() };
    savePersonalExam(record); markStudyDay(); setHistory(getPersonalExams()); setActive(false); setFinished(false); setRunning(false);
  };
  const clock = mode === 'countdown' ? Math.max(0, duration - elapsed) : elapsed;

  return <div className={styles.container}>
    <header><h1>Personal Practice Exams</h1><p>These are separate from Udvash/coaching exams and marks.</p></header>
    {!active ? <section className={styles.setup}><h2>Create practice exam</h2><label>Name<input className="input" value={name} onChange={event => setName(event.target.value)} /></label><div className={styles.grid}><label>MCQ questions<input className="input" type="number" min="0" value={plannedMcq} onChange={event => setPlannedMcq(event.target.value)} /></label><label>Written questions<input className="input" type="number" min="0" value={plannedWritten} onChange={event => setPlannedWritten(event.target.value)} /></label><label>Time (minutes)<input className="input" type="number" min="1" disabled={mode === 'stopwatch'} value={minutes} onChange={event => setMinutes(event.target.value)} /></label></div><div className={styles.modes}><button type="button" className={mode === 'countdown' ? styles.selected : ''} onClick={() => setMode('countdown')}>Countdown</button><button type="button" className={mode === 'stopwatch' ? styles.selected : ''} onClick={() => setMode('stopwatch')}>Stopwatch</button></div><button type="button" className="btn btn-primary" onClick={start}>Start practice exam</button></section> : <section className={styles.active}><p>{name}</p><div className={styles.clock}>{format(clock)}</div><p>{mode === 'countdown' ? `${format(elapsed)} elapsed` : 'Stopwatch running'}</p>{!finished && <div className={styles.controls}>{running ? <button type="button" className="btn btn-secondary" onClick={() => setRunning(false)}>Pause</button> : <button type="button" className="btn btn-primary" onClick={() => setRunning(true)}>Resume</button>}<button type="button" className="btn btn-danger" onClick={finish}>Finish exam</button></div>}{finished && <div className={styles.result}><h2>Record your result</h2><div className={styles.grid}><label>MCQ answered<input className="input" type="number" min="0" max={plannedMcq} value={mcqAnswered} onChange={event => setMcqAnswered(event.target.value)} /></label><label>Written answered<input className="input" type="number" min="0" max={plannedWritten} value={writtenAnswered} onChange={event => setWrittenAnswered(event.target.value)} /></label><label>MCQ marks earned<input className="input" type="number" min="0" value={mcqMarks} onChange={event => setMcqMarks(event.target.value)} /></label><label>MCQ marks possible<input className="input" type="number" min="0" value={totalMcqMarks} onChange={event => setTotalMcqMarks(event.target.value)} /></label><label>Written marks earned<input className="input" type="number" min="0" value={writtenMarks} onChange={event => setWrittenMarks(event.target.value)} /></label><label>Written marks possible<input className="input" type="number" min="0" value={totalWrittenMarks} onChange={event => setTotalWrittenMarks(event.target.value)} /></label></div><button type="button" className="btn btn-primary" onClick={save}>Save personal exam</button></div>}</section>}
    <section className={styles.history}><h2>Recent personal exams</h2>{history.length === 0 ? <p>No personal exams recorded yet.</p> : history.map(record => <div key={record.id}><span><strong>{record.name}</strong> · {record.mcqAnswered}/{record.plannedMcq} MCQ, {record.writtenAnswered}/{record.plannedWritten} written</span><b>{record.mcqMarks + record.writtenMarks}/{record.totalMcqMarks + record.totalWrittenMarks} marks · {format(record.durationSeconds)}</b></div>)}</section>
  </div>;
}
