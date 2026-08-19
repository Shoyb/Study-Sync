'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAdmin } from '@/lib/storage';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/calendar', icon: '📅', label: 'Calendar' },
  { href: '/chapters', icon: '📚', label: 'Chapters' },
  { href: '/revisions', icon: '🔄', label: 'Revisions' },
  { href: '/timer', icon: '⏱️', label: 'Timer' },
  { href: '/practice', icon: '🧪', label: 'Practice Exams' },
  { href: '/exams', icon: '📝', label: 'Exams' },
  { href: '/routine', icon: '📋', label: 'Routine' },
  { href: '/profile', icon: '👤', label: 'Profile' },
  { href: '/statistics', icon: '📈', label: 'Statistics' },
  { href: '/users', icon: '👥', label: 'Users' },
  { href: '/admin-login', icon: '🔒', label: 'Admin sign in' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setAdmin(isAdmin()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const visibleItems = admin ? [...navItems.filter(item => item.href !== '/admin-login'), { href: '/admin', icon: '🛠️', label: 'Admin' }] : navItems;

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>StudySync</span>
        </div>
        <nav className={styles.nav}>
          {visibleItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.footer}>
          <div className={styles.footerText}>Step-01 Progress</div>
          <div className={styles.progressTrack}><div className={styles.progressFill} /></div>
        </div>
      </aside>
      <nav className={styles.mobileNav}>
        {visibleItems.map(item => (
          <Link key={item.href} href={item.href}
            className={`${styles.mobileItem} ${pathname === item.href ? styles.mobileActive : ''}`}>
            <span>{item.icon}</span>
            <span className={styles.mobileLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
