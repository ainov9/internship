import Button from './Button';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

export default function Hero({ title, subtitle, ctaText, onCtaClick, onAdminClick, backgroundImage }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      role="region"
      aria-label="Hero section"
    >
      {/* Background Image/Gradient */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-light via-white to-gray-50"
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
        }
      />

      {/* Content */}
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Animated Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-text-dark mb-4"
          variants={titleVariants}
        >
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {title}
          </span>
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-text-muted mb-8"
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>

        {/* Animated CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="primary"
              size="lg"
              onClick={onCtaClick}
              className="shadow-lg"
            >
              {ctaText}
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="secondary"
              size="lg"
              onClick={onAdminClick}
              className="shadow-lg"
            >
              Enter as Admin
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  onCtaClick: PropTypes.func.isRequired,
  onAdminClick: PropTypes.func,
  backgroundImage: PropTypes.string,
};
