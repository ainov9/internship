import PropTypes from 'prop-types';
import FaqRow from './FaqRow';

function FaqTable({ items, onAnswerClick }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-slate-700">Question</th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-slate-700">Answer Preview</th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-slate-700">Category</th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <FaqRow key={item.id} item={item} onAnswerClick={onAnswerClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

FaqTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      question: PropTypes.string.isRequired,
      answer: PropTypes.string,
      category: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['Answered', 'Unanswered']).isRequired,
    }),
  ).isRequired,
  onAnswerClick: PropTypes.func.isRequired,
};

export default FaqTable;
