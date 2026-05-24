'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine
} from 'recharts';
import styles from './page.module.css';
import { StampType } from '@/types';
import { calculateStats } from '@/lib/stats';
import { Edit2, Save, Beer, Gift, PartyPopper, Info } from 'lucide-react';

const getAlcoholAmount = (type: StampType): number => {
  switch (type) {
    case 'VICTORY': return 0;
    case 'HOME': return 40;
    case 'DATE': return 70;
    default: return 0;
  }
};

export default function ReportPage() {
  const [motivation, setMotivation] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sobriety_motivation') || 'アミラーゼ140を下げて膵臓の健康を取り戻す！奥様とずっと楽しく居酒屋へ行く！';
    }
    return 'アミラーゼ140を下げて膵臓の健康を取り戻す！奥様とずっと楽しく居酒屋へ行く！';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [chartData, setChartData] = useState<{name: string, current: number, past: number}[]>([]);
  const [poolStats, setPoolStats] = useState({ grams: 0, cans: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('sobriety_logs');
    const logs: Record<string, StampType> = saved ? JSON.parse(saved) : {};
    
    // Calculate Stats
    const stats = calculateStats(logs);
    setPoolStats({
      grams: stats.monthlyAlcoholPoolGrams,
      cans: stats.monthlyAlcoholPoolGrams / 20 // 20g per 500ml 5% can
    });

    // Chart Data
    const data = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateKey = d.toISOString().split('T')[0];
      const type = logs[dateKey];
      return {
        name: d.toLocaleDateString('ja-JP', { weekday: 'short' }),
        current: type ? getAlcoholAmount(type) : 0,
        past: 200,
      };
    });
    setChartData(data);
  }, []);

  const handleSaveMotivation = () => {
    if (isEditing) {
      localStorage.setItem('sobriety_motivation', motivation);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>飲酒の権利</h1>
        <p className={styles.subtitle}>我慢を未来の楽しみに換算</p>
      </header>

      {/* Alcohol Reward Pool - THE CORE FEATURE */}
      <section className={styles.poolSection}>
        <div className={styles.poolCard}>
          <div className={styles.poolHeader}>
            <div className={styles.poolTitle}>
              <Gift size={20} className={styles.iconGift} />
              <h3>報酬プール</h3>
            </div>
            <div className={styles.poolBadge}>次回の居酒屋デート用</div>
          </div>
          
          <div className={styles.poolMain}>
            <div className={styles.poolValue}>
              <span className={styles.poolNumber}>{poolStats.cans.toFixed(1)}</span>
              <span className={styles.poolUnit}>本分</span>
            </div>
            <div className={styles.poolVisual}>
              <div className={styles.beerIconGroup}>
                <Beer size={40} className={styles.iconBeer} />
                <div className={styles.plus}>+</div>
                <PartyPopper size={40} className={styles.iconParty} />
              </div>
            </div>
          </div>
          
          <div className={styles.poolDesc}>
            <p>仕事の日の「完全勝利」で貯まった飲酒の権利です。</p>
            <p className={styles.poolGrams}>蓄積純アルコール量: <b>{poolStats.grams}g</b></p>
          </div>
        </div>
      </section>

      {/* Simple Comparison Chart */}
      <section className={styles.section}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>膵臓への負荷比較 (g)</h3>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#adb5bd', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#adb5bd', fontSize: 10 }} domain={[0, 220]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="past" fill="#e9ecef" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="current" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={20} />
                <ReferenceLine y={200} stroke="#adb5bd" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.infoRow}>
            <Info size={14} />
            <p>グレーの壁(過去)に対し、現在は圧倒的に負荷が低いです。</p>
          </div>
        </div>
      </section>

      {/* Goal Section */}
      <section className={styles.section}>
        <div className={styles.motivationCard}>
          <div className={styles.cardHeader}>
            <h3>お酒を減らしたい理由</h3>
            <button onClick={handleSaveMotivation} className={styles.editBtn}>
              {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
            </button>
          </div>
          {isEditing ? (
            <textarea className={styles.textarea} value={motivation} onChange={(e) => setMotivation(e.target.value)} autoFocus />
          ) : (
            <p className={styles.motivationText}>「{motivation}」</p>
          )}
        </div>
      </section>
    </div>
  );
}
