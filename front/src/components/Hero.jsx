import { useState, useEffect } from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/* ── Easing curve used throughout ── */
const smoothEase = [0.16, 1, 0.3, 1];

/* ── Staggered word reveal for the title ── */
function AnimatedTitle({ text, className }) {
  const words = text.split(' ');
  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1 + i * 0.08,
            ease: smoothEase,
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

export default function Hero({ title, subtitle, ctaText, onCtaClick, onAdminClick, onCreateAssistant, backgroundImage }) {
  /* ── Node glow sequencing state ── */
  const [glowMap, setGlowMap] = useState({});

  useEffect(() => {
    const nodes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let index = 0;
    const interval = setInterval(() => {
      setGlowMap((prev) => {
        const next = { ...prev };
        nodes.forEach((n) => (next[n] = false));
        next[index] = true;
        next[(index + 1) % nodes.length] = true;
        return next;
      });
      index = (index + 2) % nodes.length;
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { cx: 120, cy: 190, r: 4 },
    { cx: 260, cy: 120, r: 5 },
    { cx: 420, cy: 210, r: 4 },
    { cx: 610, cy: 110, r: 5 },
    { cx: 780, cy: 190, r: 4 },
    { cx: 980, cy: 120, r: 5 },
    { cx: 1100, cy: 230, r: 4 },
    { cx: 180, cy: 340, r: 4 },
    { cx: 350, cy: 260, r: 5 },
    { cx: 520, cy: 330, r: 4 },
    { cx: 700, cy: 245, r: 5 },
    { cx: 890, cy: 325, r: 4 },
    { cx: 1040, cy: 250, r: 5 },
  ];

  const lines = [
    'M120 190L260 120L420 210L610 110L780 190L980 120L1100 230',
    'M180 340L350 260L520 330L700 245L890 325L1040 250',
    'M260 120L350 260M420 210L520 330M610 110L700 245M780 190L890 325M980 120L1040 250',
  ];

  return (
    <section
      className="hero-background relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      role="region"
      aria-label="Hero section"
    >
      {/* ── Soft premium gradient background ── */}
      <div className="hero-aurora-bg absolute inset-0 z-0" />

      {/* Gradient drift overlays */}
      <div className="hero-gradient-drift pointer-events-none absolute inset-0 z-0 opacity-40" />
      <div className="hero-side-gradient-left pointer-events-none absolute inset-y-0 left-0 z-0 w-1/2 opacity-40" />
      <div className="hero-side-gradient-right pointer-events-none absolute inset-y-0 right-0 z-0 w-1/2 opacity-40" />

      {/* Glass-morphism blurred circles */}
      <div className="pointer-events-none absolute -left-28 top-10 z-0 h-72 w-72 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#6366F1]/12 blur-3xl md:h-96 md:w-96 hero-blob-a" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 h-80 w-80 rounded-full bg-gradient-to-br from-[#3B82F6]/10 to-[#6366F1]/8 blur-3xl md:h-[30rem] md:w-[30rem]" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 z-0 h-80 w-80 rounded-full bg-gradient-to-br from-[#EC4899]/15 to-[#8B5CF6]/10 blur-3xl md:h-[30rem] md:w-[30rem] hero-blob-b" />

      {/* Floating circles */}
      <div className="pointer-events-none absolute left-[8%] top-[28%] z-0 h-3 w-3 rounded-full bg-[#8B5CF6]/10 hero-float-circle" />
      <div className="pointer-events-none absolute right-[14%] top-[24%] z-0 h-5 w-5 rounded-full border border-[#8B5CF6]/10 bg-white/20 hero-float-circle hero-float-delay" />
      <div className="pointer-events-none absolute bottom-[26%] left-[18%] z-0 h-8 w-8 rounded-full border border-[#6366F1]/8 bg-[#8B5CF6]/5 hero-float-circle hero-float-slow" />

      {/* ── Neural network SVG ── */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-20 z-0 h-[62%] w-full hero-network-float"
        viewBox="0 0 1200 520"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {lines.map((d, i) => (
          <g key={`line-${i}`}>
            <path
              d={d}
              stroke="url(#network-line)"
              strokeWidth="0.8"
              className="hero-network-line"
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          </g>
        ))}
        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              className="hero-network-node"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r + 5}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="0.8"
              opacity={glowMap[i] ? 0.5 : 0}
              style={{ transition: 'opacity 1.2s ease' }}
            />
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r + 10}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="0.4"
              opacity={glowMap[i] ? 0.25 : 0}
              style={{ transition: 'opacity 1.2s ease' }}
            />
          </g>
        ))}
        <defs>
          <linearGradient id="network-line" x1="120" y1="110" x2="1100" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6" stopOpacity="0.25" />
            <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="1" stopColor="#EC4899" stopOpacity="0.12" />
          </linearGradient>
        </defs>
      </svg>

      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Staggered word title - solid dark color */}
        <AnimatedTitle
          text={title}
          className="text-5xl md:text-6xl font-bold text-text-dark mb-4 leading-tight"
        />

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-text-muted mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: smoothEase }}
        >
          {subtitle}
        </motion.p>

        {/* ── Buttons ── */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: smoothEase } },
            }}
          >
            <motion.div
              className="inline-block rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onCtaClick}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {ctaText}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: smoothEase } },
            }}
          >
            <motion.div
              className="group inline-block rounded-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-gray-300 text-text-dark group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: smoothEase } },
            }}
          >
            <motion.div
              className="group inline-block rounded-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={onAdminClick}
                className="border-primary text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300"
              >
                Enter as Admin
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Layered wave divider ── */}
      <div className="pointer-events-none absolute bottom-[-1px] left-0 z-10 w-full">
        <svg
          className="h-20 w-full text-white/90 md:h-28 hero-wave-drift"
          viewBox="0 0 1440 120"
          fill="none"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path
            d="M0 72L80 62C160 52 320 32 480 38C640 44 800 76 960 78C1120 80 1280 52 1360 38L1440 24V120H0V72Z"
            fill="url(#wave-gradient)"
          />
        </svg>
        <svg
          className="h-16 w-full text-white/60 -mt-8 md:h-20 hero-wave-drift"
          style={{ animationDelay: '-3s' }}
          viewBox="0 0 1440 100"
          fill="none"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50L80 60C160 70 320 90 480 85C640 80 800 50 960 48C1120 46 1280 60 1360 65L1440 70V100H0V50Z"
            fill="url(#wave-gradient-2)"
            opacity="0.6"
          />
        </svg>
        <defs>
          <linearGradient id="wave-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </div>
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
