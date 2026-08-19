'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasAdminCredential, isAdmin, loginAdmin, setupAdminCredential } from '@/lib/storage';
import styles from './admin-login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [configured, setConfigured] = useState(true);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { if (isAdmin()) { router.replace('/admin'); return; } setConfigured(hasAdminCredential()); setReady(true); }, 0); return () => window.clearTimeout(timer); }, [router]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMessage('');
    const error = configured ? await loginAdmin(password) : await setupAdminCredential(password);
    if (error) setMessage(error); else router.replace('/admin');
  };
  if (!ready) return null;
  return <div className={styles.container}><form className={styles.card} onSubmit={submit}><h1>{configured ? 'Admin sign in' : 'Set up admin credentials'}</h1><p>{configured ? 'Enter the separate admin password to unlock the admin panel.' : 'No admin password exists in this browser yet. Create one now. This should only be done by the site owner.'}</p><input className="input" type="password" minLength={8} autoComplete="current-password" placeholder="Admin password" value={password} onChange={event => setPassword(event.target.value)} required />{message && <span className={styles.error}>{message}</span>}<button type="submit" className="btn btn-primary">{configured ? 'Unlock admin panel' : 'Create admin credential'}</button></form></div>;
}
