'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin, logoutAdmin, removeUser } from '@/lib/storage';
import { fetchUsersForAdmin } from '@/app/actions';
import styles from './admin.module.css';

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [allowed, setAllowed] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const timer = window.setTimeout(async () => { 
      if (!isAdmin()) { router.replace('/admin-login'); return; } 
      setAllowed(true); 
      setUsers(await fetchUsersForAdmin()); 
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);
  const remove = async (user: any) => {
    if (!confirm(`Remove ${user.name}? Their study data will also be removed.`)) return;
    const result = await removeUser(user.id);
    if (result) setMessage(result); else { setUsers(await fetchUsersForAdmin()); setMessage(`${user.name} was removed.`); }
  };
  if (!allowed) return null;
  return <div className={styles.container}>
    <header><div><h1>Admin Panel</h1><p>Administration panel for all users.</p></div><button type="button" className="btn btn-ghost" onClick={async () => { await logoutAdmin(); router.replace('/admin-login'); }}>Lock panel</button></header>
    <div className={styles.stats}><div><strong>{users.length}</strong><span>Users</span></div><div><strong>{users.filter(user => user.examTracks?.includes('engineering')).length}</strong><span>Engineering students</span></div><div><strong>{users.filter(user => user.examTracks?.includes('varsity_ka')).length}</strong><span>DU KA students</span></div><div><strong>{users.filter(user => user.examTracks?.includes('medical')).length}</strong><span>Medical students</span></div></div>
    {message && <p className={styles.message}>{message}</p>}
    <section><h2>User controls</h2>{users.map(user => <div key={user.id} className={styles.user}><div><strong>{user.name}</strong><p>{user.email} · Joined {new Date(user.createdAt).toLocaleDateString()}</p></div><button type="button" className="btn btn-danger" onClick={() => remove(user)}>Remove user</button></div>)}</section>
  </div>;
}
