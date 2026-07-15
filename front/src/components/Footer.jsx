export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-text-dark text-white py-12 relative overflow-hidden"
      role="contentinfo"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(170,59,255,0.08),transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold gradient-text mb-3">ChatBot</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your intelligent conversational AI partner.
            </p>
          </div>

          {/* Links Section */}
          <div className="animate-fade-in">
            <h4 className="text-lg font-semibold mb-4 text-white/90">Quick Links</h4>
            <ul className="space-y-2.5" role="list">
              {['Home', 'Features', 'About'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-primary transition-all duration-300 ease-smooth text-sm hover:translate-x-1 inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Section */}
          <div className="animate-fade-in">
            <h4 className="text-lg font-semibold mb-4 text-white/90">Follow Us</h4>
            <div className="flex space-x-3">
              {[
                { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-1-5.63A10.9 10.9 0 0123 3z' },
                { label: 'Facebook', path: 'M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z' },
                { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="text-gray-400 hover:text-primary transition-all duration-300 ease-smooth hover:scale-110 hover:-translate-y-0.5"
                  aria-label={social.label}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.path} />
                    {social.label === 'LinkedIn' && <circle cx="4" cy="4" r="2" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} ChatBot. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-gray-400 hover:text-primary text-sm transition-colors duration-300 ease-smooth"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
