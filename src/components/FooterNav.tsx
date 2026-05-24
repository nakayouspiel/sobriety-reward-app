'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Award, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './FooterNav.module.css';

const navItems = [
  { href: '/', label: '記録', icon: Calendar },
  { href: '/achievement', label: '成果', icon: Award },
  { href: '/report', label: 'レポート', icon: BarChart3 },
];

export default function FooterNav() {
  const pathname = usePathname();
  const buildTime = "BUILD_16_15"; // Very obvious string

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'red',
        color: 'white',
        fontSize: '12px',
        textAlign: 'center',
        zIndex: 9999,
        padding: '2px'
      }}>
        DEBUG: {buildTime}
      </div>
      <nav className={styles.nav}>
        <div className={styles.container}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={clsx(styles.item, isActive && styles.active)}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
