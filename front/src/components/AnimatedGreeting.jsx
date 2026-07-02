import { motion, useReducedMotion } from 'framer-motion';
import PropTypes from 'prop-types';

function AnimatedGreeting({ name }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-3">
        <motion.span
          aria-hidden="true"
          animate={prefersReducedMotion ? undefined : { rotate: [0, 12, -10, 8, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 2 }}
          className="text-3xl"
        >
          👋
        </motion.span>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Hi, {name}. Here&apos;s what&apos;s happening today.
        </h1>
      </div>
      <p className="text-sm text-slate-500 sm:text-base">
        Monitor FAQs, resolve unanswered questions, and keep your bot knowledge fresh.
      </p>
    </motion.div>
  );
}

AnimatedGreeting.propTypes = {
  name: PropTypes.string,
};

export default AnimatedGreeting;
