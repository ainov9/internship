import { useState } from 'react';
import Button from './Button';

export default function Navbar({ onNavClick, onLoginClick, onSignupClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },

  ];   {/* la navigation li katkon dakhl la page  */}

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] border-b border-gray-200 bg-white/95 shadow-md backdrop-blur"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-3xl font-bold text-primary animate-pulse">
              Chat🤖
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (//en parcourant les liens de navigation pour les afficher
              <a
                key={link.href}//pour la performance et pour eviter les erreurs de rendu
                href={link.href} //lien de navigation
                onClick={(event) => {
                  event.preventDefault();
                  onNavClick(link.href);
                }}
                aria-label={link.label} //pour l'accessibilité
                className="text-text-dark hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button  si ona des bouton externe on utilise cette methode */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onLoginClick}
              className="text-text-dark hover:text-primary transition-colors duration-600 font-medium"
              aria-label="Login"
            >
              Login
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={onSignupClick}
            >
              Sign Up
            </Button>
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-text-dark hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
            onClick={toggleMenu}  // quand on clique, on appelle la fonction toggleMenu (ouvrir/fermer le menu)
            aria-expanded={isOpen}  // accessibilité : indique si le menu est ouvert (true/false)
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}    /*
        Si isOpen = true → affiche une croix (X) pour fermer
        Si isOpen = false → affiche 3 lignes (menu hamburger)
      */
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className="md:hidden animate-slide-up"
            role="region"
            aria-label="Mobile navigation"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-text-dark hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={(event) => {
                    event.preventDefault();
                    setIsOpen(false);
                    onNavClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div className="px-3 py-2 space-y-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLoginClick();
                  }}
                  className="w-full text-text-dark hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Login
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    onSignupClick();
                  }}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
