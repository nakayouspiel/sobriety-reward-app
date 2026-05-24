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
    const swipeThreshold = 50; // Minimum distance to trigger swipe
    
    if (info.offset.x < -swipeThreshold) {
      // Swiped left -> Go to next tab
      const nextIndex = Math.min(currentIndex + 1, routes.length - 1);
      if (nextIndex !== currentIndex) {
        router.push(routes[nextIndex]);
      }
    } else if (info.offset.x > swipeThreshold) {
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
      transition={{ duration: 0.2 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={styles.container}
    >
      {children}
    </motion.div>
  );
}
