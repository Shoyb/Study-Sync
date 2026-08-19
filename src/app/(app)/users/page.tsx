'use client';

import { useEffect, useState } from 'react';
import { fetchUsersForAdmin } from '@/app/actions';
import styles from './users.module.css';

const trackLabels: Record<string, string> = { engineering: 'Engineering', varsity_ka: 'DU KA', medical: 'Medical' };

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => { const timer = window.setTimeout(async () => setUsers(await fetchUsersForAdmin()), 0); return () => window.clearTimeout(timer); }, []);
  return <div className={styles.container}>
    <header><h1>StudySync Users</h1><p>Profiles saved on the server.</p></header>
    <div className={styles.list}>{users.map(user => <article key={user.id} className={styles.user}><div className={styles.avatar}>{user.name.slice(0, 1).toUpperCase()}</div><div><h2>{user.name}</h2><p>{user.email}</p><small>{(user.examTracks?.length ? user.examTracks : [user.targetExam]).map((track: string) => trackLabels[track] ?? track).join(' · ')}</small></div></article>)}</div>
  </div>;
}
