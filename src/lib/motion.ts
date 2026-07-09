import type { Transition, Variants } from 'motion/react';

/** Smooth deceleration — feels natural for UI entrances */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
};

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 28,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export const headerReveal: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export const staggerContainer = (stagger = 0.07, delay = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const cardHover = {
  y: -8,
  transition: springSnappy,
};

export const cardTap = { scale: 0.985 };

/** Timeline / list rows — subtle slide from the left */
export const timelineItem: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};
