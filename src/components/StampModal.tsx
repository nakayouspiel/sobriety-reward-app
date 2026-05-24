'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { X } from 'lucide-react';
import styles from './StampModal.module.css';
import { StampType } from '@/types';
import { STAMP_OPTIONS } from '@/constants/stamps';
import { clsx } from 'clsx';

interface StampModalProps {
  date: Date;
  currentType?: StampType;
  onSelect: (type: StampType | null) => void;
  onClose: () => void;
}

export default function StampModal({ date, currentType, onSelect, onClose }: StampModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.dateInfo}>
            <h2>{format(date, 'M月 d日 (E)', { locale: ja })}</h2>
            <p className={styles.subtitle}>記録を選択</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
        </header>

        <div className={styles.options}>
          {(Object.values(STAMP_OPTIONS)).map((option) => (
            <button 
              key={option.type}
              className={clsx(styles.optionCard, currentType === option.type && styles.selected)}
              onClick={() => onSelect(option.type)}
            >
              <span className={styles.icon}>{option.icon}</span>
              <div className={styles.labelGroup}>
                <span className={styles.label}>{option.label}</span>
                <span className={styles.description}>{option.description}</span>
              </div>
            </button>
          ))}
          
          <button 
            className={styles.clearBtn} 
            onClick={() => onSelect(null)}
          >
            記録を削除
          </button>
        </div>
      </div>
    </div>
  );
}
