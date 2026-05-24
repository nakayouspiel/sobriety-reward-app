'use client';

import { useState } from 'react';
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
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './page.module.css';
import { StampType } from '@/types';
import { STAMP_OPTIONS } from '@/constants/stamps';
import StampModal from '@/components/StampModal';

// Mock data (initially empty for user)
const mockLogs: Record<string, StampType> = {};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [logs, setLogs] = useState<Record<string, StampType>>(() => {
    // Attempt to load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sobriety_logs');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleSelectStamp = (type: StampType | null) => {
    if (!selectedDate) return;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    
    const newLogs = { ...logs };
    if (type) {
      newLogs[dateKey] = type;
    } else {
      delete newLogs[dateKey];
    }
    
    setLogs(newLogs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sobriety_logs', JSON.stringify(newLogs));
    }
    setSelectedDate(null);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>{format(currentMonth, 'yyyy年 M月', { locale: ja })}</h1>
        <div className={styles.controls}>
          <button onClick={prevMonth} aria-label="先月"><ChevronLeft /></button>
          <button onClick={nextMonth} aria-label="来月"><ChevronRight /></button>
        </div>
      </header>

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
                <div className={styles.stampIcon} style={{ color: stamp.color }}>
                  {stamp.icon}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <StampModal 
          date={selectedDate}
          currentType={logs[format(selectedDate, 'yyyy-MM-dd')]}
          onSelect={handleSelectStamp}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}

// Utility to combine classes
function clsx(...args: any[]) {
  return args.filter(Boolean).join(' ');
}
