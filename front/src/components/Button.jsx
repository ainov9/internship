import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isBubble = false,
  ariaLabel,
  isMotion = false,
  ...props
}) {
  const baseStyles = 'font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';

  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90 hover:shadow-lg hover:shadow-primary/30',
    secondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    outline: 'border-2 border-gray-300 text-text-dark hover:border-primary hover:text-primary',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const bubbleStyles = isBubble
    ? 'rounded-full w-20 h-20 md:w-28 md:h-28 flex items-center justify-center shadow-lg hover:animate-bubble-bounce hover:shadow-2xl text-2xl'
    : 'rounded-lg';

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${bubbleStyles} ${className}`;

  const ButtonElement = (
    <button
      className={combinedClassName}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Button')}
      {...props}
    >
      {children}
    </button>
  );

  if (isMotion) {
    return (
      <motion.button
        className={combinedClassName}
        aria-label={ariaLabel || (typeof children === 'string' ? children : 'Button')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  return ButtonElement;
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  isBubble: PropTypes.bool,
  ariaLabel: PropTypes.string,
  isMotion: PropTypes.bool,
};
