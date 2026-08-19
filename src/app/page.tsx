'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateId, loginUser, registerUser } from '@/lib/storage';
import type { ExamTrack } from '@/types';
import styles from './landing.module.css';

export default function LandingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [examTracks, setExamTracks] = useState<ExamTrack[]>(['engineering']);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const result = mode === 'register'
      ? await registerUser({ id: generateId(), name: name.trim(), email, targetExam: 'engineering', examTracks, coachingBatch: 'EAP26 Combo', createdAt: new Date().toISOString() }, password)
      : await loginUser(email, password);
    setSubmitting(false);
    if (result) { setError(result); return; }
    router.push('/dashboard');
  };

  return <div className={styles.landing}>
    <div className={styles.bg} />
    <div className={styles.hero}>
      <h1 className={styles.title}>Study<span>Sync</span></h1>
      <p className={styles.subtitle}>Track your admission preparation journey</p>
      <p className={styles.desc}>Built for HSC 2026 candidates · Udvash/Unmesh coaching integration</p>
      <div className={styles.features}>{['Chapter tracker', 'Exam calendar', 'Revision tracker', 'Exam marks', 'BUET timer', 'Study routine'].map(feature => <div key={feature} className={styles.featureCard}>{feature}</div>)}</div>
      <form className={styles.loginCard} onSubmit={submit}>
        <div className={styles.modeTabs}><button type="button" className={mode === 'register' ? styles.modeActive : ''} onClick={() => { setMode('register'); setError(''); }}>Create account</button><button type="button" className={mode === 'login' ? styles.modeActive : ''} onClick={() => { setMode('login'); setError(''); }}>Sign in</button></div>
        <h2>{mode === 'register' ? 'Create your study profile' : 'Welcome back'}</h2>
        {mode === 'register' && <input className="input" placeholder="Your name" value={name} onChange={event => setName(event.target.value)} required />}
        <input className="input" type="email" placeholder="Email address" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required />
        <input className="input" type="password" placeholder="Password (at least 6 characters)" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} value={password} onChange={event => setPassword(event.target.value)} required />
        {mode === 'register' && <><p className={styles.trackHint}>Engineering is included. Add any extra tracks you will attend.</p><div className={styles.trackOptions}>{([['engineering', 'Engineering (required)'], ['varsity_ka', 'DU KA'], ['medical', 'Medical']] as [ExamTrack, string][]).map(([value, label]) => <label key={value} className={`${styles.trackOption} ${examTracks.includes(value) ? styles.trackActive : ''}`}><input type="checkbox" checked={examTracks.includes(value)} disabled={value === 'engineering'} onChange={() => setExamTracks(current => current.includes(value) ? current.filter(track => track !== value) : [...current, value])} />{label}</label>)}</div></>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.startBtn} type="submit" disabled={submitting}>{submitting ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}</button>
        <p className={styles.localNote}>Your account is saved locally in this browser.</p>
      </form>
      <p className={styles.footer}>Built with care for HSC 2026 aspirants</p>
    </div>
  </div>;
}
