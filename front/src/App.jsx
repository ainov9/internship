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

  if (isAdminView) {
    return <Dashboard isAdmin />;
  }

  return (
    <div className="app-shell min-h-screen bg-transparent">
      {/* Navigation */}
      <Navbar
        onNavClick={handleNavClick}
        onLoginClick={() => setCurrentPage('login')}
        onSignupClick={() => setCurrentPage('signup')}
      />

      {currentPage === 'login' && (
        <Login
          onSwitchToSignup={() => setCurrentPage('signup')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPage === 'signup' && (
        <Signup
          onSwitchToLogin={() => setCurrentPage('login')}
          onSignupSuccess={handleSignupSuccess}
        />
      )}

      {currentPage === 'home' && (
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Why Choose Us?
            </motion.h2>
            <motion.p
              className="text-xl text-text-muted max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Discover the features that make our chatbot the perfect solution for your needs.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
            }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
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
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="scroll-mt-20 py-20 bg-gradient-to-b from-white via-[#f8f9ff]/60 to-white">
        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-4xl font-bold text-text-dark mb-6">
                About Our ChatBot
              </h2>
              <p className="text-lg text-text-muted mb-4 leading-relaxed">
                Our chatbot is built with cutting-edge AI technology to provide you with the best conversational experience. Whether you need quick answers or detailed explanations, we've got you covered.
              </p>
              <p className="text-lg text-text-muted mb-6 leading-relaxed">
                We're committed to delivering accurate, helpful, and friendly responses to all your queries. Our team continuously works to improve the chatbot's capabilities and understanding.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <img
                src="/image.png"
                alt="About ChatBot"
                className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="start-chat" className="scroll-mt-20 py-20 bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#0ea5e9] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0ea5e9]/20 via-transparent to-[#6366f1]/20" />
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-[40rem] rounded-full bg-white/10 blur-3xl" />
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            Ready to Chat?
          </motion.h2>
          <motion.p
            className="text-xl text-white mb-8"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            Start a conversation with our AI chatbot today and experience the future of communication.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary border-white hover:bg-opacity-90"
                onClick={() => alert('Opening chat interface...')}
              >
                Start Chat Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
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
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
          }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="text-center mb-12">
            <motion.h2
              className="text-4xl font-bold text-text-dark mb-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              Get In Touch
            </motion.h2>
            <motion.p
              className="text-xl text-text-muted"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              Have questions? We'd love to hear from you. Send us a message!
            </motion.p>
          </div>

          <motion.form
            className="max-w-md mx-auto space-y-4"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your name"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
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
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
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
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
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
