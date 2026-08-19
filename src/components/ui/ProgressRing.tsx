'use client';
import React from 'react';
import styles from './ProgressRing.module.css';

interface Props { progress: number; size?: number; strokeWidth?: number; color?: string; label?: string; }

export default function ProgressRing({ progress, size = 120, strokeWidth = 8, color = 'var(--accent)', label }: Props) {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = ((100 - Math.min(100, Math.max(0, progress))) / 100) * circumference;

  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <svg className={styles.svg} width={size} height={size}>
        <circle className={styles.bg} stroke="rgba(255,255,255,0.06)" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} />
        <circle className={styles.ring} stroke={color} cx={center} cy={center} r={radius} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className={styles.content}>
        <span className={styles.pct}>{Math.round(progress)}%</span>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
}
