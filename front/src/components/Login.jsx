import { useState } from 'react';
import Button from './Button';

export default function Login({ onSwitchToSignup, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setWelcomeMessage('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setWelcomeMessage(`Bienvenue ${email.split('@')[0]} ! Connexion en cours...`);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent-indigo/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-indigo/8 rounded-full blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: '-1.5s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
<<<<<<< HEAD
        <div className="glass-strong rounded-3xl shadow-glass-lg p-8 animate-scale-in">
=======
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up transition-shadow duration-500 hover:shadow-2xl">
>>>>>>> 960654c53ccb50494850bb3a07b2eb97a0f29540
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">ChatBot</h1>
            <h2 className="text-2xl font-bold text-text-dark mb-2">Welcome Back</h2>
            <p className="text-text-muted text-sm">Sign in to your account to continue</p>
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
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-2xl focus:outline-none smooth-focus transition-all duration-300 ease-smooth hover:border-gray-300"
                required
                aria-label="Password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-lg border-border accent-primary transition-all duration-200"
                  aria-label="Remember me"
                />
                <span className="ml-2 text-sm text-text-muted group-hover:text-text-dark transition-colors duration-200">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:text-accent-indigo transition-colors duration-300 font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/60"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/80 text-text-muted backdrop-blur-sm">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="w-full px-4 py-2.5 border border-gray-200/60 rounded-2xl hover:border-primary/40 hover:bg-primary/5 hover:shadow-glass transition-all duration-300 ease-smooth font-medium text-sm text-text-muted hover:text-primary">
              Google
            </button>
            <button className="w-full px-4 py-2.5 border border-gray-200/60 rounded-2xl hover:border-primary/40 hover:bg-primary/5 hover:shadow-glass transition-all duration-300 ease-smooth font-medium text-sm text-text-muted hover:text-primary">
              Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-text-muted text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-primary hover:text-accent-indigo font-semibold transition-colors duration-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-text-muted/70">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary/80 hover:text-primary transition-colors duration-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary/80 hover:text-primary transition-colors duration-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
