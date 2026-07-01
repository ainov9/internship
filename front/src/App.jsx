import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar, Hero, Card, Button, Footer, ChatBubble, Login, Signup } from './components'
import './App.css'

function App() {
  // Main App component - Manages routing between pages (home, login, signup) and user authentication state
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'login', 'signup'
  const [user, setUser] = useState(null); 
  const [pendingScrollTarget, setPendingScrollTarget] = useState(null);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (currentPage !== 'home' || !pendingScrollTarget) return;

    requestAnimationFrame(() => {
      scrollToSection(pendingScrollTarget);
      setPendingScrollTarget(null);
    });
  }, [currentPage, pendingScrollTarget]);

  const handleNavClick = (href) => {
    const sectionId = href.replace('#', '');

    if (currentPage !== 'home') {
      setPendingScrollTarget(sectionId);
      setCurrentPage('home');
      return;
    }

    scrollToSection(sectionId);
  };

  const scrollToChat = () => {
    scrollToSection('start-chat');
  }

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

  // Show Login page
  if (currentPage === 'login') {
    return (
      <>
        <Navbar 
          onNavClick={handleNavClick}
          onLoginClick={() => setCurrentPage('login')}
          onSignupClick={() => setCurrentPage('signup')}
        />
        <Login 
          onSwitchToSignup={() => setCurrentPage('signup')}
          onLoginSuccess={handleLoginSuccess}
        />
        <Footer />
      </>
    );
  }

  // Show Signup page
  if (currentPage === 'signup') {
    return (
      <>
        <Navbar 
          onNavClick={handleNavClick}
          onLoginClick={() => setCurrentPage('login')}
          onSignupClick={() => setCurrentPage('signup')}
        />
        <Signup 
          onSwitchToLogin={() => setCurrentPage('login')}
          onSignupSuccess={handleSignupSuccess}
        />
        <Footer />
      </>
    );
  }

  // Show Home page
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar 
        onNavClick={handleNavClick}
        onLoginClick={() => setCurrentPage('login')}
        onSignupClick={() => setCurrentPage('signup')}
      />

      {/* Hero Section */}
      <section
        id="home"
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-light via-white to-gray-50"
      >
        <Hero
          title="Welcome to our  ChatBot"
          subtitle="Your intelligent conversational AI partner. Chat smarter, not harder."
          ctaText="Start Chatting"
          onCtaClick={scrollToChat}
          onLoginClick={() => setCurrentPage('login')}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-text-dark mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Why Choose Us?
            </motion.h2>
            <motion.p
              className="text-xl text-text-muted max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Discover the features that make our chatbot the perfect solution for your needs.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -10 }}
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
      <section id="about" className="py-20 bg-white">
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
              transition={{ duration: 0.7 }}
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
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/image.png"
                alt="About ChatBot"
                className="w-full rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="start-chat" className="py-20 bg-gradient-to-r from-primary to-purple-600">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Ready to Chat?
          </motion.h2>
          <motion.p
            className="text-xl text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Start a conversation with our AI chatbot today and experience the future of communication.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
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
      <section id="contact" className="py-20 bg-white">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center mb-12">
            <motion.h2
              className="text-4xl font-bold text-text-dark mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Get In Touch
            </motion.h2>
            <motion.p
              className="text-xl text-text-muted"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Have questions? We'd love to hear from you. Send us a message!
            </motion.p>
          </div>

          <motion.form
            className="max-w-md mx-auto space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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

      {/* Floating Chat Bubble */}
      <ChatBubble />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
