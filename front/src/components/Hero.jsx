import Button from './Button';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

export default function Hero({ title, subtitle, ctaText, onCtaClick, onAdminClick, onCreateAssistant, backgroundImage }) {
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
      className="hero-background relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      role="region"
      aria-label="Hero section"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_34%),linear-gradient(135deg,#fbfaff_0%,#f5f3ff_42%,#ffffff_100%)]"
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
        }
      />
      <div className="hero-gradient-drift pointer-events-none absolute inset-0 z-0 opacity-80" />
      <div className="hero-side-gradient-left pointer-events-none absolute inset-y-0 left-0 z-0 w-1/2 opacity-80" />
      <div className="hero-side-gradient-right pointer-events-none absolute inset-y-0 right-0 z-0 w-1/2 opacity-80" />

      <div className="pointer-events-none absolute -left-32 top-10 z-0 h-72 w-72 rounded-full bg-gradient-to-br from-[#7C3AED]/35 to-[#A855F7]/20 blur-3xl md:h-96 md:w-96 hero-blob-a" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 z-0 h-80 w-80 rounded-full bg-gradient-to-br from-[#A855F7]/25 via-fuchsia-300/20 to-sky-300/20 blur-3xl md:h-[30rem] md:w-[30rem] hero-blob-b" />

      <div className="pointer-events-none absolute left-[8%] top-[28%] z-0 h-3 w-3 rounded-full bg-[#7C3AED]/20 hero-float-circle" />
      <div className="pointer-events-none absolute right-[14%] top-[24%] z-0 h-5 w-5 rounded-full border border-[#A855F7]/20 bg-white/20 hero-float-circle hero-float-delay" />
      <div className="pointer-events-none absolute bottom-[26%] left-[18%] z-0 h-8 w-8 rounded-full border border-[#7C3AED]/15 bg-[#A855F7]/10 hero-float-circle hero-float-slow" />

      <svg
        className="pointer-events-none absolute inset-x-0 top-20 z-0 h-[62%] w-full opacity-[0.18]"
        viewBox="0 0 1200 520"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <g stroke="url(#network-line)" strokeWidth="1">
          <path d="M120 190L260 120L420 210L610 110L780 190L980 120L1100 230" />
          <path d="M180 340L350 260L520 330L700 245L890 325L1040 250" />
          <path d="M260 120L350 260M420 210L520 330M610 110L700 245M780 190L890 325M980 120L1040 250" />
        </g>
        <g fill="#7C3AED">
          <circle cx="120" cy="190" r="4" />
          <circle cx="260" cy="120" r="5" />
          <circle cx="420" cy="210" r="4" />
          <circle cx="610" cy="110" r="5" />
          <circle cx="780" cy="190" r="4" />
          <circle cx="980" cy="120" r="5" />
          <circle cx="1100" cy="230" r="4" />
          <circle cx="180" cy="340" r="4" />
          <circle cx="350" cy="260" r="5" />
          <circle cx="520" cy="330" r="4" />
          <circle cx="700" cy="245" r="5" />
          <circle cx="890" cy="325" r="4" />
          <circle cx="1040" cy="250" r="5" />
        </g>
        <defs>
          <linearGradient id="network-line" x1="120" y1="110" x2="1100" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C3AED" stopOpacity="0.35" />
            <stop offset="0.5" stopColor="#A855F7" stopOpacity="0.55" />
            <stop offset="1" stopColor="#38BDF8" stopOpacity="0.25" />
          </linearGradient>
        </defs>
      </svg>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(124,58,237,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
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
              onClick={onCreateAssistant || onAdminClick}
              className="shadow-lg"
            >
              Create Assistant
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

      <svg
        className="pointer-events-none absolute bottom-[-1px] left-0 z-10 h-20 w-full text-gray-50 md:h-28"
        viewBox="0 0 1440 120"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M0 72L80 62C160 52 320 32 480 38C640 44 800 76 960 78C1120 80 1280 52 1360 38L1440 24V120H0V72Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  onCtaClick: PropTypes.func.isRequired,
  onAdminClick: PropTypes.func,
  onCreateAssistant: PropTypes.func,
  backgroundImage: PropTypes.string,
};
