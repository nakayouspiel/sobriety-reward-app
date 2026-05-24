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

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 30; // Reduced threshold for better sensitivity
    const velocityThreshold = 10; // Add velocity check for faster swipes

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      // Swiped left -> Go to next tab
      const nextIndex = Math.min(currentIndex + 1, routes.length - 1);
      if (nextIndex !== currentIndex) {
        router.push(routes[nextIndex]);
      }
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      // Swiped right -> Go to previous tab
      const prevIndex = Math.max(currentIndex - 1, 0);
      if (prevIndex !== currentIndex) {
        router.push(routes[prevIndex]);
      }
    }
  };

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
      drag="x"
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className={styles.container}
    >
      {children}
    </motion.div>
  );
}
