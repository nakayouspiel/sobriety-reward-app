'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, ReactNode, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SwipeContainer.module.css';

const routes = ['/', '/achievement', '/report'];

interface SwipeContainerProps {
  children: ReactNode;
}

export default function SwipeContainer({ children }: SwipeContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentIndex = routes.indexOf(pathname);
  
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swiped left -> Next tab
      const nextIndex = Math.min(currentIndex + 1, routes.length - 1);
      if (nextIndex !== currentIndex) {
        router.push(routes[nextIndex]);
      }
    } else if (isRightSwipe) {
      // Swiped right -> Previous tab
      const prevIndex = Math.max(currentIndex - 1, 0);
      if (prevIndex !== currentIndex) {
        router.push(routes[prevIndex]);
      }
    }
  };

  return (
    <div 
      className={styles.touchWrapper}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={styles.container}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
