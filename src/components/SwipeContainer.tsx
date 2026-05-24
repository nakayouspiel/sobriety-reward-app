'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import styles from './SwipeContainer.module.css';
import { ReactNode } from 'react';

const routes = ['/', '/achievement', '/report'];

interface SwipeContainerProps {
  children: ReactNode;
}

export default function SwipeContainer({ children }: SwipeContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentIndex = routes.indexOf(pathname);

  const handlePanEnd = (event: any, info: PanInfo) => {
    // Pixel 9等の大画面向けに閾値を調整
    const threshold = 40; 
    const velocityThreshold = 0.1;

    // 水平方向の動きが垂直方向より大きい場合のみ処理（スクロールを優先するため）
    if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
      if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
        // Left Swipe -> Next
        const nextIndex = Math.min(currentIndex + 1, routes.length - 1);
        if (nextIndex !== currentIndex) {
          router.push(routes[nextIndex]);
        }
      } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
        // Right Swipe -> Prev
        const prevIndex = Math.max(currentIndex - 1, 0);
        if (prevIndex !== currentIndex) {
          router.push(routes[prevIndex]);
        }
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onPanEnd={handlePanEnd}
          className={styles.container}
          style={{ touchAction: 'pan-y' }} // 縦スクロールを許可し、横スワイプをアプリで制御
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
