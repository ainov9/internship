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
  const baseStyles = 'font-semibold transition-all duration-300 ease-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40 active:scale-[0.97]';

  const variants = {
    primary: 'bg-gradient-to-br from-primary via-accent-indigo to-primary bg-[length:200%_200%] text-white hover:shadow-glow hover:bg-[length:100%_100%] hover:-translate-y-0.5',
    secondary: 'border-2 border-primary/30 text-primary hover:border-primary hover:bg-primary/5 hover:shadow-glass hover:-translate-y-0.5',
    outline: 'border-2 border-gray-200 text-text-dark hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:shadow-glass hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  const bubbleStyles = isBubble
    ? 'rounded-full w-20 h-20 md:w-28 md:h-28 flex items-center justify-center shadow-glass hover:animate-bubble-bounce hover:shadow-glow-lg text-2xl'
    : '';

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
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
