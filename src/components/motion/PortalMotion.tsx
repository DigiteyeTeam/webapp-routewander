import type { ComponentProps, ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';
import {
  cardHover,
  cardTap,
  easeOut,
  fadeUp,
  staggerContainer,
} from '../../lib/motion';

/** Animated outlet — re-animates on portal route change */
export function PortalPageOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.38, ease: easeOut }}
        className="w-full"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}

export function PortalMobileBackdrop({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="md:hidden fixed inset-0 bg-black/50 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />
  );
}

export function MotionPage({ className, children }: { className?: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={staggerContainer(0.07, 0.05)}
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function MotionHeader({ className, children, ...props }: ComponentProps<'header'>) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.header
      className={className}
      variants={fadeUp}
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      {...props}
    >
      {children}
    </motion.header>
  );
}

export function MotionSection({ className, children, ...props }: ComponentProps<'section'>) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      className={className}
      variants={fadeUp}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-32px' }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function MotionCard({ className, children }: { className?: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      whileHover={reduceMotion ? undefined : cardHover}
      whileTap={reduceMotion ? undefined : cardTap}
    >
      {children}
    </motion.div>
  );
}

export function MotionList({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={staggerContainer(0.06, 0.04)}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-24px' }}
    >
      {children}
    </motion.div>
  );
}

export function MotionListItem({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
