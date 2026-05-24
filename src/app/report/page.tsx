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
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import styles from './page.module.css';
import { StampType } from '@/types';
import { Edit2, Save, TrendingDown, ShieldCheck, Zap } from 'lucide-react';

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

  const avgCurrent = chartData.length > 0 ? chartData.reduce((acc, d) => acc + d.current, 0) / chartData.length : 0;
  const reductionRate = Math.round(((200 - avgCurrent) / 200) * 100);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>分析レポート</h1>
        <div className={styles.badge}>
          <ShieldCheck size={14} />
          <span>膵臓保護モード稼働中</span>
        </div>
      </header>

      {/* Motivation Section */}
      <section className={styles.section}>
        <div className={styles.motivationCard}>
          <div className={styles.cardHeader}>
            <div className={styles.titleGroup}>
              <Zap size={18} className={styles.iconZap} />
              <h3>MISSION</h3>
            </div>
            <button onClick={handleSaveMotivation} className={styles.editBtn}>
              {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
            </button>
          </div>
          {isEditing ? (
            <textarea 
              className={styles.textarea}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              autoFocus
            />
          ) : (
            <p className={styles.motivationText}>「{motivation}」</p>
          )}
        </div>
      </section>

      {/* Impact Stats */}
      <div className={styles.impactGrid}>
        <div className={styles.impactCard}>
          <TrendingDown size={24} className={styles.iconDown} />
          <div className={styles.impactInfo}>
            <span className={styles.impactLabel}>アルコール削減率</span>
            <span className={styles.impactValue}>{reductionRate}%</span>
          </div>
        </div>
        <div className={styles.impactCard}>
          <ShieldCheck size={24} className={styles.iconShield} />
          <div className={styles.impactInfo}>
            <span className={styles.impactLabel}>膵臓休息レベル</span>
            <span className={styles.impactValue}>OPTIMAL</span>
          </div>
        </div>
      </div>

      {/* Visual Comparison Chart */}
      <section className={styles.section}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>膵臓への負荷比較 (純アルコールg)</h3>
            <div className={styles.legend}>
              <span className={styles.legendPast}>過去</span>
              <span className={styles.legendCurrent}>現在</span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#adb5bd', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#adb5bd', fontSize: 10 }}
                  domain={[0, 220]}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                {/* Past Bar (Ghostly) */}
                <Bar 
                  dataKey="past" 
                  fill="#e9ecef" 
                  radius={[6, 6, 0, 0]} 
                  barSize={24}
                />
                {/* Current Bar (Vibrant) */}
                <Bar 
                  dataKey="current" 
                  radius={[6, 6, 0, 0]} 
                  barSize={24}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.current === 0 ? 'var(--success)' : 'var(--primary)'} 
                    />
                  ))}
                </Bar>
                <ReferenceLine y={200} stroke="#adb5bd" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className={styles.chartNote}>
            グレーの壁（200g）をどれだけ削り取ったかがあなたの成果です。
          </p>
        </div>
      </section>

      <div className={styles.adviceCard}>
        <h3>AIインサイト</h3>
        <p>
          {reductionRate > 70 
            ? "驚異的な自己管理能力です。膵臓の細胞が着実に修復されています。このペースを維持してください。"
            : "過去の巨大な摂取量と比較すれば、現在の数値は十分に低いです。一歩ずつ、確実に目標へ近づいています。"}
        </p>
      </div>
    </div>
  );
}
