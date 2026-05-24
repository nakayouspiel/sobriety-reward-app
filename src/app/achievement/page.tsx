'use client';

import { useEffect, useState } from 'react';
import { calculateStats } from '@/lib/stats';
import { AchievementStats, StampType } from '@/types';
import styles from './page.module.css';
import { Beer, Banknote, Heart, Utensils } from 'lucide-react';

// Mock logs
const mockLogs: Record<string, StampType> = {
  '2026-05-15': 'VICTORY',
  '2026-05-16': 'VICTORY',
  '2026-05-17': 'DATE',
  '2026-05-18': 'VICTORY',
  '2026-05-19': 'VICTORY',
  '2026-05-20': 'VICTORY',
  '2026-05-21': 'HOME',
  '2026-05-22': 'VICTORY',
  '2026-05-23': 'VICTORY',
};

export default function AchievementPage() {
  const [stats, setStats] = useState<AchievementStats | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sobriety_logs');
    const logs = saved ? JSON.parse(saved) : {};
    setStats(calculateStats(logs));
  }, []);

  if (!stats) return null;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>努力の成果</h1>
        <p className={styles.subtitle}>積み上げた軌跡</p>
      </header>

      <section className={styles.timerSection}>
        <div className={styles.timerCard}>
          <p className={styles.timerLabel}>禁酒継続期間</p>
          <div className={styles.timerValue}>
            <span className={styles.timerNumber}>{stats.soberDays}</span>
            <span className={styles.timerUnit}>日</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${Math.min(100, (stats.soberDays / 30) * 100)}%` }}></div>
          </div>
          <p className={styles.timerHint}>目指せ！30日連続</p>
        </div>
      </section>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.gold}`}>
            <Banknote size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>浮いた軍資金</p>
            <p className={styles.statValue}>{stats.totalSavedAmount.toLocaleString()}<span>円</span></p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.emerald}`}>
            <Heart size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>膵臓が回避した量</p>
            <p className={styles.statValue}>{stats.totalAlcoholGrams.toLocaleString()}<span>g</span></p>
            <p className={styles.statSub}>ロング缶 {(stats.totalAlcoholGrams / 20).toFixed(1)} 本分</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.orange}`}>
            <Utensils size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>削った液体カロリー</p>
            <p className={styles.statValue}>{stats.totalCalories.toLocaleString()}<span>kcal</span></p>
            <p className={styles.statSub}>ご飯茶碗 {(stats.totalCalories / 150).toFixed(1)} 杯分</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.blue}`}>
            <Beer size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>完全勝利回数</p>
            <p className={styles.statValue}>{stats.totalVictoryCount}<span>回</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
