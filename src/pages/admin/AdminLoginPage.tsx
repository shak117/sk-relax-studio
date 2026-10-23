import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { batchService } from '../../services/batchService';
import { usePageSEO } from '../../hooks/usePageSEO';

export const AdminLoginPage: React.FC = () => {
  usePageSEO({
    title: 'Admin Login | SK Relax Beauty Academy & Salon',
    description: 'Management login for SK Relax Beauty Academy & Salon batch administration.',
    path: '/admin/login'
  });

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to /admin/batches
    const token = batchService.getAuthToken();
    if (token) {
      batchService.checkAuth().then(isAuthed => {
        if (isAuthed) {
          navigate('/admin/batches', { replace: true });
        }
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await batchService.login(username, password);
      if (result.success) {
        navigate('/admin/batches', { replace: true });
      } else {
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-4">
          <ShieldCheck size={14} className="text-gold-400" />
          <span>Management Portal</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-white font-light">
          SK Relax <span className="font-serif italic text-gold-300">Admin CMS</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-ivory-300 font-sans">
          Manage upcoming academy course batches, dates, fees, and masterclass enrollments.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-luxury rounded-sm border border-gold-500/20">
          {error && (
            <div className="mb-6 p-3 rounded-sm bg-rose-50 border border-rose-200 text-rose-700 text-xs font-sans flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-forest-400">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm focus:outline-none focus:border-forest-900 text-forest-900 font-sans"
                  placeholder="Enter admin username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-forest-400">
                  <Lock size={15} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm focus:outline-none focus:border-forest-900 text-forest-900 font-sans"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-sm bg-forest-900 hover:bg-forest-800 text-gold-300 hover:text-white text-xs font-sans font-semibold uppercase tracking-widest transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-forest-900/10 text-center">
            <Link
              to="/"
              className="text-xs text-forest-700 hover:text-rose-600 font-sans underline transition-colors"
            >
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
