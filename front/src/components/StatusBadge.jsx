import PropTypes from 'prop-types';

function StatusBadge({ status }) {
  const isAnswered = status === 'Answered';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isAnswered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
      {status}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['Answered', 'Unanswered']).isRequired,
};

export default StatusBadge;
