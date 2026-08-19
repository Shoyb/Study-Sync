'use client';
import { useState, useEffect, useRef } from 'react';
import { chapters } from '@/data/chapters';
import { saveTimerSession, getTimerSessions, generateId, markStudyDay } from '@/lib/storage';
import type { TimerSession } from '@/types';
import styles from './timer.module.css';

const fmt = (s: number) => { const m = Math.floor(s / 60); return `${m.toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`; };
const fmtLong = (s: number) => { const h = Math.floor(s/3600); const m = Math.floor((s%3600)/60); return h > 0 ? `${h}h ${m}m ${s%60}s` : `${m}m ${s%60}s`; };

function beep(freq = 880, dur = 300) {
  try { const ctx = new AudioContext(); const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value = freq; g.gain.value = 0.3; o.start(); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur/1000); o.stop(ctx.currentTime + dur/1000); } catch {}
}

export default function TimerPage() {
  const [tab, setTab] = useState<'countdown' | 'buet'>('countdown');
  const [history, setHistory] = useState<TimerSession[]>([]);
  // Countdown state
  const [cdTotal, setCdTotal] = useState(25 * 60);
  const [cdLeft, setCdLeft] = useState(25 * 60);
  const [cdState, setCdState] = useState<'idle' | 'running' | 'paused' | 'done'>('idle');
  const [cdChapter, setCdChapter] = useState('');
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const [resultMcq, setResultMcq] = useState('0');
  const [resultWritten, setResultWritten] = useState('0');
  // BUET state
  const [buetSec, setBuetSec] = useState(0);
  const [buetState, setBuetState] = useState<'idle' | 'running' | 'paused'>('idle');
  const [intervals, setIntervals] = useState<number[]>([]);
  const [isFS, setIsFS] = useState(false);

  const cdRef = useRef<ReturnType<typeof setInterval>>(null);
  const buetRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setHistory(getTimerSessions().slice(0, 10)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cdState === 'running') {
      cdRef.current = setInterval(() => {
        setCdLeft(prev => {
          if (prev <= 1) { setCdState('done'); beep(880, 800); clearInterval(cdRef.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (cdRef.current) clearInterval(cdRef.current); };
  }, [cdState, cdChapter, cdTotal]);

  // BUET timer
  useEffect(() => {
    if (buetState === 'running') {
      buetRef.current = setInterval(() => {
        setBuetSec(prev => {
          if (prev + 1 >= 180) { beep(600, 400); setIntervals(i => [...i, 180]); return 0; }
          return prev + 1;
        });
      }, 1000);
    }
    return () => { if (buetRef.current) clearInterval(buetRef.current); };
  }, [buetState]);

  const setPreset = (mins: number) => { setCdTotal(mins * 60); setCdLeft(mins * 60); setCdState('idle'); };
  const setCustomTime = () => {
    const total = (Math.max(0, Number.parseInt(customMinutes, 10) || 0) * 60) + Math.min(59, Math.max(0, Number.parseInt(customSeconds, 10) || 0));
    if (total > 0) { setCdTotal(total); setCdLeft(total); setCdState('idle'); }
  };
  const saveCountdown = () => {
    saveTimerSession({ id: generateId(), timerType: 'countdown', durationSeconds: cdTotal, chapterId: cdChapter || undefined, startedAt: new Date(Date.now() - cdTotal * 1000).toISOString(), endedAt: new Date().toISOString(), mcqAnswered: Math.max(0, Number.parseInt(resultMcq, 10) || 0), writtenAnswered: Math.max(0, Number.parseInt(resultWritten, 10) || 0) });
    markStudyDay(); setHistory(getTimerSessions().slice(0, 10)); setCdState('idle'); setCdLeft(cdTotal);
  };
  const buetColor = buetSec <= 120 ? '#34d399' : buetSec <= 150 ? '#f59e0b' : '#f87171';

  const stopBuet = () => {
    const totalSec = intervals.reduce((a, b) => a + b, 0) + buetSec;
    if (totalSec > 0) {
      saveTimerSession({ id: generateId(), timerType: 'buet_stopwatch', durationSeconds: totalSec, intervalsCompleted: intervals.length, startedAt: new Date(Date.now() - totalSec * 1000).toISOString(), endedAt: new Date().toISOString() });
      markStudyDay();
      setHistory(getTimerSessions().slice(0, 10));
    }
    setBuetState('idle'); setBuetSec(0); setIntervals([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'countdown' ? styles.active : ''}`} onClick={() => setTab('countdown')}>⏱️ Countdown Timer</button>
        <button className={`${styles.tab} ${tab === 'buet' ? styles.active : ''}`} onClick={() => setTab('buet')}>🎯 BUET 3-Min Stopwatch</button>
      </div>

      {tab === 'countdown' ? (
        <div className={styles.timerCard}>
          <div className={styles.presets}>
            {[25, 45, 60, 120].map(m => (
              <button key={m} className={`${styles.preset} ${cdTotal === m * 60 ? styles.presetActive : ''}`} onClick={() => setPreset(m)}>{m}m</button>
            ))}
          </div>
          <div className={styles.customTime}>
            <input className="input" type="number" min="0" placeholder="Minutes" value={customMinutes} onChange={e => setCustomMinutes(e.target.value)} />
            <input className="input" type="number" min="0" max="59" placeholder="Seconds" value={customSeconds} onChange={e => setCustomSeconds(e.target.value)} />
            <button type="button" className="btn btn-secondary" onClick={setCustomTime}>Set custom time</button>
          </div>
          <select className="select" value={cdChapter} onChange={e => setCdChapter(e.target.value)} style={{ maxWidth: 320, margin: '0 auto 1.5rem', display: 'block' }}>
            <option value="">Link to chapter (optional)</option>
            {chapters.map(c => <option key={c.id} value={c.id}>{c.code} {c.part} — {c.title}</option>)}
          </select>
          <div className={`${styles.display} ${cdState === 'running' ? styles.glow : ''} ${cdState === 'done' ? styles.done : ''}`}>
            {Math.floor(cdLeft / 3600) > 0 && `${Math.floor(cdLeft / 3600).toString().padStart(2,'0')}:`}{fmt(cdLeft % 3600)}
          </div>
          <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${cdTotal > 0 ? ((cdTotal - cdLeft) / cdTotal) * 100 : 0}%` }} /></div>
          <div className={styles.btns}>
            {cdState === 'idle' && <button className="btn btn-primary" onClick={() => setCdState('running')}>▶ Start</button>}
            {cdState === 'running' && <button className="btn btn-secondary" onClick={() => setCdState('paused')}>⏸ Pause</button>}
            {cdState === 'paused' && <button className="btn btn-primary" onClick={() => setCdState('running')}>▶ Resume</button>}
            {cdState === 'done' && <span className={styles.doneText}>✅ Complete!</span>}
            <button className="btn btn-ghost" onClick={() => { setCdState('idle'); setCdLeft(cdTotal); }}>↺ Reset</button>
          </div>
          {cdState === 'done' && <div className={styles.resultForm}>
            <h3>What did you complete?</h3>
            <label>MCQ answered<input className="input" type="number" min="0" value={resultMcq} onChange={e => setResultMcq(e.target.value)} /></label>
            <label>Written answered<input className="input" type="number" min="0" value={resultWritten} onChange={e => setResultWritten(e.target.value)} /></label>
            <button type="button" className="btn btn-primary" onClick={saveCountdown}>Save session</button>
          </div>}
        </div>
      ) : (
        <div className={`${styles.timerCard} ${isFS ? styles.fullscreen : ''}`}>
          <button className={styles.fsBtn} onClick={() => { if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(() => {}); setIsFS(true); } else { document.exitFullscreen(); setIsFS(false); } }}>
            {isFS ? '✕ Exit' : '⛶ Fullscreen'}
          </button>
          <div className={styles.buetHeader}>
            <h2>BUET MCQ Practice Timer</h2>
            <p className={styles.buetDesc}>3 minutes per question — practice your pacing</p>
          </div>
          <div className={styles.intervalBadge}>Interval #{intervals.length + 1}</div>
          <div className={`${styles.display} ${buetState === 'running' ? styles.glow : ''}`} style={{ color: buetState === 'running' ? buetColor : undefined }}>
            {fmt(buetSec)} <span className={styles.ofTotal}>/ 03:00</span>
          </div>
          <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${(buetSec / 180) * 100}%`, background: buetColor }} /></div>
          <div className={styles.btns}>
            {buetState !== 'running' && <button className="btn btn-primary" onClick={() => setBuetState('running')}>{buetState === 'paused' ? '▶ Resume' : '▶ Start'}</button>}
            {buetState === 'running' && <button className="btn btn-secondary" onClick={() => setBuetState('paused')}>⏸ Pause</button>}
            {buetState === 'running' && <button className="btn btn-secondary" onClick={() => { setIntervals(i => [...i, buetSec]); setBuetSec(0); beep(600, 200); }}>⏎ Mark</button>}
            <button className="btn btn-danger" onClick={stopBuet}>■ Stop & Save</button>
          </div>
          {intervals.length > 0 && (
            <>
              <div className={styles.statsGrid}>
                <div className={styles.stat}><span className={styles.statVal}>{intervals.length}</span><span className={styles.statLbl}>Intervals</span></div>
                <div className={styles.stat}><span className={styles.statVal}>{fmtLong(intervals.reduce((a,b)=>a+b,0))}</span><span className={styles.statLbl}>Total</span></div>
                <div className={styles.stat}><span className={styles.statVal}>{fmt(Math.round(intervals.reduce((a,b)=>a+b,0)/intervals.length))}</span><span className={styles.statLbl}>Average</span></div>
                <div className={styles.stat}><span className={styles.statVal}>{fmt(Math.min(...intervals))}</span><span className={styles.statLbl}>Fastest</span></div>
              </div>
              <div className={styles.log}>{intervals.map((t, i) => <div key={i} className={styles.logItem}><span>#{i+1}</span><span>{fmt(t)}</span></div>)}</div>
            </>
          )}
        </div>
      )}

      <div className={styles.history}>
        <h3>Recent Sessions</h3>
        {history.length === 0 ? <p className={styles.histEmpty}>No sessions recorded yet.</p> : (
          <div className={styles.histList}>{history.map(s => (
            <div key={s.id} className={styles.histItem}>
              <span>{s.timerType === 'buet_stopwatch' ? '🎯 BUET' : '⏱️ Countdown'}{s.intervalsCompleted ? ` (${s.intervalsCompleted} intervals)` : ''}</span>
              <span className={styles.histDur}>{fmtLong(s.durationSeconds)}{s.mcqAnswered || s.writtenAnswered ? ` · ${s.mcqAnswered ?? 0} MCQ, ${s.writtenAnswered ?? 0} written` : ''}</span>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  );
}
