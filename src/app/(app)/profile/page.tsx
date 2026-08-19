'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { exams } from '@/data/exams';
import { getExamScores, getUserProfile, logoutUser, updateExamTracks } from '@/lib/storage';
import type { ExamScore, ExamTrack, UserProfile } from '@/types';
import styles from './profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [scores, setScores] = useState<ExamScore[]>([]);
  const [examTracks, setExamTracks] = useState<ExamTrack[]>(['engineering']);
  useEffect(() => {
    const timer = window.setTimeout(() => { const user = getUserProfile(); setProfile(user); setScores(getExamScores()); if (user) setExamTracks(user.examTracks?.length ? user.examTracks : [user.targetExam]); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score.percentage, 0) / scores.length) : 0;
  const best = scores.length ? Math.max(...scores.map(score => score.percentage)) : 0;
  const signOut = () => { logoutUser(); router.replace('/'); };

  return <div className={styles.container}>
    <header className={styles.header}><div className={styles.avatar}>{profile?.name?.slice(0, 1).toUpperCase() ?? 'S'}</div><div><h1>{profile?.name ?? 'Student'}</h1><p>{profile?.email || 'Local study profile'} · {profile?.targetExam ?? 'engineering'} track</p></div><button type="button" className="btn btn-ghost" onClick={signOut}>Sign out</button></header>
    <section><h2>Exam marks overview</h2><div className={styles.stats}><div><strong>{scores.length}</strong><span>Exams recorded</span></div><div><strong>{average}%</strong><span>Average score</span></div><div><strong>{best}%</strong><span>Best score</span></div></div></section>
    <section className={styles.tracks}><h2>Exam tracks</h2><p>Engineering is required. Add DU KA or Medical only if you will attend those exams.</p><div>{([['engineering', 'Engineering'], ['varsity_ka', 'DU KA'], ['medical', 'Medical']] as [ExamTrack, string][]).map(([track, label]) => <label key={track}><input type="checkbox" checked={examTracks.includes(track)} disabled={track === 'engineering'} onChange={() => setExamTracks(current => current.includes(track) ? current.filter(item => item !== track) : [...current, track])} /> {label}</label>)}</div><button type="button" className="btn btn-secondary" onClick={() => { updateExamTracks(examTracks); setProfile(getUserProfile()); }}>Save tracks</button></section>
    <section className={styles.marks}><div className={styles.sectionHead}><h2>Recorded marks</h2><button type="button" className="btn btn-secondary" onClick={() => router.push('/exams')}>Manage marks</button></div>{scores.length === 0 ? <p className={styles.empty}>No marks recorded yet. Add your results on the Exams page.</p> : <div className={styles.scoreList}>{[...scores].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)).map(score => { const exam = exams.find(item => item.id === score.examId); return <div key={score.id} className={styles.score}><div><strong>{exam?.name ?? 'Exam'}</strong><span>{score.mcqObtained} MCQ + {score.writtenObtained} written = {score.totalObtained}/{exam?.totalMarks ?? '?'}</span></div><b>{score.percentage}%</b></div>; })}</div>}</section>
  </div>;
}
