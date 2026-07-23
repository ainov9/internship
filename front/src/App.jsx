import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar, Hero, Card, Button, Footer, ChatBubble, Login, Signup, Dashboard } from './components'
import './App.css'

function App() {
  // Main App component - Manages routing between pages (home, login, signup) and user authentication state
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'login', 'signup'
  const [user, setUser] = useState(null);   // ona donner l'email dyal user li kay login wla kay signup
  const [pendingScrollTarget, setPendingScrollTarget] = useState(null);// ona l'element li bghina nscrolliw lih ila kan l'page li kayn daba hiya home
  const [isAdminView, setIsAdminView] = useState(false);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }; // Function to scroll to a specific section by ID

  useEffect(() => {
    if (currentPage !== 'home' || !pendingScrollTarget) return;

    requestAnimationFrame(() => {
      scrollToSection(pendingScrollTarget);
      setPendingScrollTarget(null);
    });// Use requestAnimationFrame to ensure smooth scrolling after the page has rendered
  }, [currentPage, pendingScrollTarget]);

  const handleNavClick = (href) => {
    const sectionId = href.replace('#', '');

    if (currentPage !== 'home') {
      setPendingScrollTarget(sectionId);
      setCurrentPage('home');
      return;
    }//le remplacement de # par rien pour obtenir l'id de la section

    scrollToSection(sectionId);// Scroll to the section if already on the home page
  };

  const scrollToChat = () => {
    scrollToSection('Bubble');
  };

  const handleAdminEnter = () => {
    setIsAdminView(true);
  };

  const handleLoginSuccess = (email) => {
// Called after successful login: stores user email in state and redirects to home page
    setUser({ email });
    setCurrentPage('home');
  };

  const handleSignupSuccess = (email) => {
// Called after successful signup: stores user email in state and redirects to home page
    setUser({ email });
    setCurrentPage('home');
  };

  const handleLogout = () => {
    
// Clears user session and redirects to home page
    setUser(null);
    setCurrentPage('home');
  };

  const features = [
    {
      title: 'Smart Conversations',
      description: 'Experience natural and intelligent conversations powered by advanced AI technology.',
      image: '/image.png',
    },
    {
      title: 'Instant Responses',
      description: 'Get quick and accurate answers to your questions anytime, anywhere.',
      image: '/image copy.png',
    },
    {
      title: '24/7 Support',
      description: 'Our chatbot is available round the clock to assist you with any queries.',
      image: '/image.png',
    },
    
  ]

  return (
    <div className="app-shell min-h-screen bg-transparent">
      <Navbar
        onNavClick={handleNavClick}
        onLoginClick={() => setCurrentPage('login')}
        onSignupClick={() => setCurrentPage('signup')}
        user={user}
        onLogout={handleLogout}
      />

      {isAdminView && (
        <div className="pt-20">
          <Dashboard isAdmin />
        </div>
      )}

      {!isAdminView && currentPage === 'login' && (
        <div className="page-enter">
          <Login
            onSwitchToSignup={() => setCurrentPage('signup')}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}

      {!isAdminView && currentPage === 'signup' && (
        <div className="page-enter">
          <Signup
            onSwitchToLogin={() => setCurrentPage('login')}
            onSignupSuccess={handleSignupSuccess}
          />
        </div>
      )}

      {!isAdminView && currentPage === 'home' && (
        <div className="home-page-background">
      {/* Hero Section */}
      <section
        id="home"
        className="flex min-h-screen scroll-mt-20 items-center justify-center bg-transparent"
      >
        <Hero
          title="Welcome to our  ChatBot"
          subtitle="Your intelligent conversational AI partner. Chat smarter, not harder."
          ctaText="Start Chatting"
          onCtaClick={scrollToChat}
          onAdminClick={handleAdminEnter}
          onLoginClick={() => setCurrentPage('login')}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 py-20 bg-gradient-to-b from-white via-[#faf9fe]/50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-text-dark mb-4"
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Why Choose Us?
            </motion.h2>
            <motion.p
              className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Discover the features that make our chatbot the perfect solution for your needs.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                  className="h-full"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={scrollToChat}
                    isMotion
                  >
                    Try Now
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="scroll-mt-20 py-20 bg-gradient-to-b from-white via-[#f8f9ff]/60 to-white">
        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-4xl font-bold text-text-dark mb-6 leading-tight">
                About Our ChatBot
              </h2>
              <p className="text-lg text-text-muted mb-4 leading-relaxed">
                Our chatbot is built with cutting-edge AI technology to provide you with the best conversational experience. Whether you need quick answers or detailed explanations, we've got you covered.
              </p>
              <p className="text-lg text-text-muted mb-8 leading-relaxed">
                We're committed to delivering accurate, helpful, and friendly responses to all your queries. Our team continuously works to improve the chatbot's capabilities and understanding.
              </p>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={scrollToChat}
                  isMotion
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src="/image.png"
                alt="About ChatBot"
                className="w-full rounded-2xl shadow-glass-lg hover:shadow-glow transition-all duration-500 ease-smooth"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="start-chat" className="scroll-mt-20 py-20 bg-gradient-to-br from-primary via-accent-indigo to-accent-teal relative overflow-hidden">
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)] pointer-events-none" />

        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Ready to Chat?
          </motion.h2>
          <motion.p
            className="text-xl text-white/90 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Start a conversation with our AI chatbot today and experience the future of communication.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary border-white hover:bg-white/90 hover:shadow-glow-lg"
                onClick={() => alert('Opening chat interface...')}
              >
                Start Chat Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 hover:shadow-glass"
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Us
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20 py-20 bg-gradient-to-b from-white via-[#f9f8ff]/60 to-[#faf9fe]">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center mb-12">
            <motion.h2
              className="text-4xl font-bold text-text-dark mb-4"
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Get In Touch
            </motion.h2>
            <motion.p
              className="text-xl text-text-muted leading-relaxed"
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Have questions? We'd love to hear from you. Send us a message!
            </motion.p>
          </div>

          <motion.form
            className="max-w-md mx-auto space-y-4"
            initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your name"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-2xl focus:outline-none smooth-focus transition-all duration-300 ease-smooth hover:border-gray-300"
                required
                aria-label="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-2xl focus:outline-none smooth-focus transition-all duration-300 ease-smooth hover:border-gray-300"
                required
                aria-label="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-2">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Your message here..."
                rows="4"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-2xl focus:outline-none smooth-focus transition-all duration-300 ease-smooth hover:border-gray-300 resize-none"
                required
                aria-label="Enter your message"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={(e) => {
                e.preventDefault()
                alert('Thank you for your message! We will get back to you soon.')
              }}
            >
              Send Message
            </Button>
          </motion.form>
        </motion.div>
      </section>
        </div>
      )}

      {/* Floating Chat Bubble */}
      <div id="Bubble">
        <ChatBubble />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
