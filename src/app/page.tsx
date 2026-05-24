'use client';

import { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval 
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import styles from './page.module.css';
import { StampType } from '@/types';
import { STAMP_OPTIONS } from '@/constants/stamps';
import StampModal from '@/components/StampModal';
import { clsx } from 'clsx';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [logs, setLogs] = useState<Record<string, StampType>>({});

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sobriety_logs');
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  const saveLog = (date: Date, type: StampType | null) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const newLogs = { ...logs };
    if (type) {
      newLogs[dateKey] = type;
    } else {
      delete newLogs[dateKey];
    }
    setLogs(newLogs);
    localStorage.setItem('sobriety_logs', JSON.stringify(newLogs));
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const todayStamp = logs[todayKey];

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>記録</h1>
        <div className={styles.statusBadge}>
          <Zap size={12} fill="var(--primary)" color="var(--primary)" />
          <span>毎日AM 5:00 更新</span>
        </div>
      </header>

      {/* Quick Record Section for Today - THE SPEED UI */}
      <section className={styles.quickSection}>
        <div className={styles.quickCard}>
          <div className={styles.quickHeader}>
            <span className={styles.todayLabel}>今日の記録</span>
            <span className={styles.todayDate}>{format(new Date(), 'M/d (E)', { locale: ja })}</span>
          </div>
          <div className={styles.quickOptions}>
            {(Object.values(STAMP_OPTIONS)).map((option) => (
              <button 
                key={option.type}
                className={clsx(styles.quickBtn, todayStamp === option.type && styles.quickActive)}
                onClick={() => saveLog(new Date(), option.type)}
                style={{ '--active-color': option.color } as any}
              >
                <span className={styles.quickIcon}>{option.icon}</span>
                <span className={styles.quickLabel}>{option.label.replace('（外食）', '')}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <h2>{format(currentMonth, 'yyyy年 M月', { locale: ja })}</h2>
          <div className={styles.controls}>
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft size={20} /></button>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className={styles.weekDays}>
          {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
            <div key={d} className={styles.weekDay}>{d}</div>
          ))}
        </div>

        <div className={styles.calendarGrid}>
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const stampType = logs[dateKey];
            const stamp = stampType ? STAMP_OPTIONS[stampType] : null;
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={day.toString()}
                className={clsx(
                  styles.dayCell, 
                  !isCurrentMonth && styles.notCurrentMonth,
                  isToday && styles.today
                )}
                onClick={() => onDateClick(day)}
              >
                <span className={styles.dayNumber}>{format(day, 'd')}</span>
                {stamp && (
                  <div className={styles.stampIcon}>
                    {stamp.icon}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <StampModal 
          date={selectedDate}
          currentType={logs[format(selectedDate, 'yyyy-MM-dd')]}
          onSelect={(type) => {
            saveLog(selectedDate, type);
            setSelectedDate(null);
          }}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
