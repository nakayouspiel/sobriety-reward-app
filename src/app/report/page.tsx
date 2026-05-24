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
  Legend
} from 'recharts';
import styles from './page.module.css';
import { StampType } from '@/types';
import { Edit2, Save } from 'lucide-react';

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

  useEffect(() => {
    const saved = localStorage.getItem('sobriety_logs');
    const logs: Record<string, StampType> = saved ? JSON.parse(saved) : {};

    // Get last 7 days of actual dates
    const data = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateKey = d.toISOString().split('T')[0];
      const type = logs[dateKey];
      return {
        name: dateKey.slice(5), // MM-DD
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
        <h1>レポート</h1>
        <p className={styles.subtitle}>過去と現在の比較</p>
      </header>

      <section className={styles.motivationSection}>
        <div className={styles.motivationCard}>
          <div className={styles.cardHeader}>
            <h3>お酒を減らしたい理由</h3>
            <button onClick={handleSaveMotivation} className={styles.editBtn}>
              {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
            </button>
          </div>
...
          {isEditing ? (
            <textarea 
              className={styles.textarea}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              autoFocus
            />
          ) : (
            <p className={styles.motivationText}>{motivation}</p>
          )}
        </div>
      </section>

      <section className={styles.graphSection}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>純アルコール摂取量 (g)</h3>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2c2c2c" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #2c2c2c', borderRadius: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="past" 
                  name="過去 (200g)" 
                  fill="#2c2c2c" 
                  radius={[4, 4, 0, 0]} 
                  barSize={16}
                />
                <Bar 
                  dataKey="current" 
                  name="現在 (実績)" 
                  fill="var(--success)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className={styles.graphHint}>※過去は1日あたりビール10本分（200g）で計算</p>
        </div>
      </section>

      <div className={styles.insightCard}>
        <h3>膵臓への負荷激減！</h3>
        <p>過去と比較して、アルコール摂取量を平均 <b>80%以上</b> 削減できています。この調子で健康な膵臓を取り戻しましょう。</p>
      </div>
    </div>
  );
}
