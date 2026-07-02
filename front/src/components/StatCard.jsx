import { motion, useReducedMotion } from 'framer-motion';
import PropTypes from 'prop-types';

function StatCard({ label, value, icon, trend, trendDirection }) { // Define the StatCard component that displays a statistic with an icon and trend information
  const prefersReducedMotion = useReducedMotion(); // Check if the user prefers reduced motion for accessibility
  const isPositive = trendDirection === 'up';// Determine if the trend is positive based on the trendDirection prop

  return (
    <motion.article
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01, boxShadow: '0 18px 30px rgba(15, 23, 42, 0.12)' }}
      transition={{ duration: 0.75 }}
      viewport={{ once: true, amount: 0.4 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</div>
      </div>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
        <span>{isPositive ? '▲' : '▼'}</span>
        <span>{trend}</span>
      </p>
    </motion.article>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  trend: PropTypes.string.isRequired,
  trendDirection: PropTypes.oneOf(['up', 'down']).isRequired,
};

export default StatCard;
