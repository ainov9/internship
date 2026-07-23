import { useState, useEffect } from 'react';
import Button from './Button';

export default function Navbar({ onNavClick, onLoginClick, onSignupClick, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ease-smooth ${
        scrolled
          ? 'bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-gray-200'
          : 'bg-white border-b border-gray-100'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-3xl font-bold gradient-text select-none">
              NEXTAITEK
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  onNavClick(link.href);
                }}
                aria-label={link.label}
                className="relative px-4 py-2 text-sm font-medium text-text-muted hover:text-primary transition-all duration-300 ease-smooth rounded-lg hover:bg-primary/5 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent-indigo rounded-full transition-all duration-300 ease-smooth group-hover:w-3/4" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-text-muted">{user.email}</span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-text-muted hover:text-primary transition-all duration-300 ease-smooth rounded-lg hover:bg-primary/5"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-text-muted hover:text-primary transition-all duration-300 ease-smooth rounded-lg hover:bg-primary/5"
                  aria-label="Login"
                >
                  Login
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onSignupClick}
                  className="shadow-sm hover:shadow-glow transition-shadow duration-300"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 transition-all duration-300 ease-smooth"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6 transition-transform duration-300 ease-smooth"
              style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-smooth ${
            isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
          role="region"
          aria-label="Mobile navigation"
        >
          <div className="px-2 pt-2 pb-4 space-y-1 glass-strong rounded-2xl mt-2 mb-3 shadow-glass">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-dark hover:text-primary hover:bg-primary/5 block px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 ease-smooth"
                style={{ transitionDelay: isOpen ? `${i * 50}ms` : '0ms' }}
                onClick={(event) => {
                  event.preventDefault();
                  setIsOpen(false);
                  onNavClick(link.href);
                }}
              >
                {link.label}
              </a>
            ))}
            <div className="px-3 py-3 space-y-2 border-t border-gray-100/50 mt-2">
              {user ? (
                <>
                  <span className="block px-4 py-2 text-sm text-text-muted">{user.email}</span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="w-full text-text-dark hover:text-primary hover:bg-primary/5 block px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 ease-smooth"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onLoginClick();
                    }}
                    className="w-full text-text-dark hover:text-primary hover:bg-primary/5 block px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 ease-smooth"
                  >
                    Login
                  </button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full shadow-sm"
                    onClick={() => {
                      setIsOpen(false);
                      onSignupClick();
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
