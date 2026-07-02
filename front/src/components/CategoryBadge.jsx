import PropTypes from 'prop-types';

function CategoryBadge({ category }) {
  const styles = {
    Billing: 'bg-violet-100 text-violet-700',
    Account: 'bg-sky-100 text-sky-700',
    Product: 'bg-emerald-100 text-emerald-700',
    General: 'bg-slate-100 text-slate-700',
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[category] || styles.General}`}>{category}</span>;
}

CategoryBadge.propTypes = {
  category: PropTypes.string.isRequired,
};

export default CategoryBadge;
