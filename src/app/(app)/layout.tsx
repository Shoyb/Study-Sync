'use client';
import Sidebar from '@/components/layout/Sidebar';
import { getUserProfile } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './AppLayout.module.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const profile = getUserProfile();
      if (!profile) router.replace('/');
      else {
        setReady(true);
        // Background sync to pull latest data in case they used another device
        try {
          const { pullAllData } = await import('@/app/actions');
          const data = await pullAllData(profile.id);
          Object.keys(data).forEach(key => {
            const current = localStorage.getItem(`studysync_${key}_${profile.id}`);
            const fresh = JSON.stringify(data[key as keyof typeof data]);
            if (current !== fresh) {
              localStorage.setItem(`studysync_${key}_${profile.id}`, fresh);
            }
          });
        } catch (e) { console.error('Sync failed', e); }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname, router]);

  if (!ready) return null;
  return (
    <div className={styles.appLayout}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
