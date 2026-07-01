import PropTypes from 'prop-types';

export default function Card({
  image,
  title,
  description,
  className = '',
  children,
}) {
  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in ${className}`}
      role="article"
    >
      {image && (
        <div className="relative overflow-hidden h-48 bg-gray-200">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-6">
        {title && (
          <h3 className="text-xl font-bold text-text-dark mb-2 hover:text-primary transition-colors duration-200">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-text-muted leading-relaxed mb-4">
            {description}
          </p>
        )}

        {children && <div>{children}</div>}
      </div>
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
