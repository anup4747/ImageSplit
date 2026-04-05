'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser, getCurrentUser } from '@/lib/user-auth';
import { motion } from 'framer-motion';
import { UserPlus, AtSign, Lock, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const user = await getCurrentUser();
      if (user) {
        router.replace('/upload');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await registerUser(email, password);
      if (result.token) {
        router.replace('/upload');
        return;
      }
      setMessage(result.message ?? 'Check your email to confirm your account.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 overflow-hidden">
      {/* Background blobs — matches portfolio hero */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-100/50 blur-[120px]" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Logo pill — matches portfolio badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-10"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 shadow-lg shadow-indigo-500/5 hover:bg-indigo-100 transition-colors duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-medium tracking-wide text-indigo-700 uppercase">
              ImageSplit Studio
            </span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Card top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="px-10 py-10 sm:px-12 sm:py-12">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                  <UserPlus className="w-4.5 h-4.5 text-indigo-600" />
                </div>
                <span className="text-xs font-medium tracking-wide text-indigo-700 uppercase">
                  Create account
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-slate-900 mb-2">
                Start creating
              </h1>
              <p className="text-slate-600 font-light leading-relaxed">
                Build premium wall designs and keep your editor locked behind your own account.
              </p>
            </div>

            {/* Benefit bullets — mirrors portfolio philosophy section */}
            <ul className="space-y-2.5 mb-8">
              {[
                'Gallery-quality resolution retention',
                'AI-assisted composition analysis',
                'Calibrated for professional printing',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 text-sm text-slate-600"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5 mb-1.5">
                    <AtSign className="w-3.5 h-3.5 text-indigo-500" />
                    Email address
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 font-normal"
                    placeholder="you@domain.com"
                    required
                  />
                </label>
              </motion.div>

              {/* Password field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5 mb-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-500" />
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 font-normal"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </label>
              </motion.div>

              {/* Error message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </motion.p>
              )}

              {/* Success message */}
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  {message}
                </motion.p>
              )}

              {/* Submit — matches portfolio's dark pill CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="pt-2"
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full px-8 py-4 bg-slate-900 text-white rounded-full font-semibold text-base cursor-pointer overflow-hidden shadow-[0_0_40px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_0_60px_-15px_rgba(15,23,42,0.5)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'Creating account...' : 'Create account'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>
              </motion.div>
            </form>

            {/* Footer links */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-500">
              <p>
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to homepage
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
