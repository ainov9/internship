import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';

function FaqRow({ item, onAnswerClick }) {
  const prefersReducedMotion = useReducedMotion();// Check if the user prefers reduced motion for accessibility
  const [isHovered, setIsHovered] = useState(false);// State to track hover state for the answer button
  const answerPreview = item.answer || 'Not yet answered';// Provide a default message if the answer is empty
  return (
    <motion.tr
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="border-b border-slate-100 bg-white hover:bg-slate-50"
    >
      <td className="px-4 py-4 text-sm text-slate-700">{item.question}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{answerPreview}</td>
      <td className="px-4 py-4"><CategoryBadge category={item.category} /></td>
      <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
      <td className="px-4 py-4">
        <button
          type="button"
          aria-label={item.status === 'Answered' ? 'Edit answer for this question' : 'Answer this question'}
          onClick={() => onAnswerClick(item)}
          className={`rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:scale-105 hover:border-sky-400 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isHovered ? 'rotate-3' : ''}`}
        >
          ✏️
        </button>
      </td>
    </motion.tr>
  );
}

FaqRow.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string,
    category: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['Answered', 'Unanswered']).isRequired,
  }).isRequired,
  onAnswerClick: PropTypes.func.isRequired,
};

export default FaqRow;
