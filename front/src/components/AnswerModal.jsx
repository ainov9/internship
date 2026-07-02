import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PropTypes from 'prop-types';

function AnswerModal({ isOpen, onClose, onSave, initialValue = '' }) {
  const [answer, setAnswer] = useState(initialValue);
  const titleId = useId();
  const descriptionId = useId();
  const inputRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      setAnswer(initialValue);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen, initialValue]);// Update the answer state and focus the input when the modal opens or the initial value changes
  
  useEffect(() => {
    if (!isOpen) return ;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
        exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
        role="presentation"
      >
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          <h2 id={titleId} className="text-xl font-semibold text-slate-900">
            Add answer
          </h2>
          <p id={descriptionId} className="mt-2 text-sm text-slate-500">
            Write a clear response for the selected FAQ item.
          </p>

          <label htmlFor="faq-answer" className="mt-5 block text-sm font-medium text-slate-700">
            Answer
          </label>
          <textarea
            id="faq-answer"
            ref={inputRef}
            rows={5}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white resize-none"
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-red-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(answer)}
              className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Save answer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

AnswerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
};

export default AnswerModal;
