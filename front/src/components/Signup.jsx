import { useState } from 'react';
import Button from './Button';

export default function Signup({ onSwitchToLogin, onSignupSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setWelcomeMessage(`Bienvenue ${formData.firstName}! Création du compte en cours...`);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSignupSuccess(formData.email);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent-indigo/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent-indigo/10 rounded-full blur-3xl animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: '-1.5s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="glass-strong rounded-3xl shadow-glass-lg p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">ChatBot</h1>
            <h2 className="text-2xl font-bold text-text-dark mb-2">Create Account</h2>
            <p className="text-text-muted text-sm">Join us to start chatting today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200/60 rounded-2xl animate-slide-down">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Welcome Message */}
          {welcomeMessage && !error && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200/60 rounded-2xl animate-slide-down">
              <p className="text-green-700 text-sm">{welcomeMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-text-dark mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-2xl focus:outline-none smooth-focus transition-all duration-300 ease-smooth hover:border-gray-300"
                  required
                  aria-label="First name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-text-dark mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-2xl focus:outline-none smooth-focus transition-all duration-300 ease-smooth hover:border-gray-300"
                  required
                  aria-label="Last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-2xl focus:outline-none smooth-focus transition-all duration-300 ease-smooth hover:border-gray-300"
                required
                aria-label="Email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-2xl focus:outline-none smooth-focus transition-all duration-300 ease-smooth hover:border-gray-300"
                required
                aria-label="Password"
              />
              <p className="text-xs text-text-muted/70 mt-1.5">At least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-dark mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-2xl focus:outline-none smooth-focus transition-all duration-300 ease-smooth hover:border-gray-300"
                required
                aria-label="Confirm password"
              />
            </div>

            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-lg border-border accent-primary transition-all duration-200"
                required
                aria-label="Agree to terms"
              />
              <span className="ml-2 text-sm text-text-muted group-hover:text-text-dark transition-colors duration-200">
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-accent-indigo transition-colors duration-300">
                  Terms of Service
                </a>
              </span>
            </label>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/60"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/80 text-text-muted backdrop-blur-sm">Or sign up with</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="w-full px-4 py-2.5 border border-gray-200/60 rounded-2xl hover:border-primary/40 hover:bg-primary/5 hover:shadow-glass transition-all duration-300 ease-smooth font-medium text-sm text-text-muted hover:text-primary">
              Google
            </button>
            <button className="w-full px-4 py-2.5 border border-gray-200/60 rounded-2xl hover:border-primary/40 hover:bg-primary/5 hover:shadow-glass transition-all duration-300 ease-smooth font-medium text-sm text-text-muted hover:text-primary">
              Facebook
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-text-muted text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-primary hover:text-accent-indigo font-semibold transition-colors duration-300"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
