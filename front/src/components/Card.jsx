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
<<<<<<< HEAD
      className={`glass-strong rounded-2xl overflow-hidden shadow-soft hover:shadow-glass-lg transition-all duration-500 ease-smooth hover:-translate-y-2 hover:scale-[1.01] animate-fade-in card-glow group ${className}`}
      role="article"
    >
      {image && (
        <div className="relative overflow-hidden h-48 bg-gradient-to-br from-primary/5 to-accent-indigo/5">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-110"
=======
      className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 animate-fade-in ${className}`}
      role="article"
    >
      {image && (
        <div className="relative overflow-hidden h-48 bg-gray-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
>>>>>>> 960654c53ccb50494850bb3a07b2eb97a0f29540
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      <div className="p-6">
        {title && (
          <h3 className="text-xl font-bold text-text-dark mb-2 group-hover:text-primary transition-colors duration-300 ease-smooth">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-text-muted leading-relaxed mb-4 text-sm">
            {description}
          </p>
        )}

        {children && <div className="mt-2">{children}</div>}
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
