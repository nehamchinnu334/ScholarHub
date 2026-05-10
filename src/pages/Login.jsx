import { supabase } from '../supabase';
import React, { useState } from 'react';
import { School, LogIn, Mail, Lock, UserPlus } from 'lucide-react';

export const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLogin();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data?.session) {
          onLogin(); 
        } else {
          setSuccessMsg('Account created! Please check your email to confirm your registration.');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary-container/20 via-surface to-surface">
      {/* Header */}
      <header className="w-full bg-surface border-b border-outline-variant/30 h-16 flex items-center justify-center shrink-0">
        <div className="flex items-center gap-2">
          <School className="text-primary w-6 h-6" />
          <span className="font-display text-xl font-black text-primary tracking-tight">ScholarHub</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-[440px]">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_24px_rgba(1,45,29,0.08)] p-10 border border-outline-variant/40 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-primary tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-sm font-medium text-on-surface-variant opacity-70">
                {isLogin ? 'Please enter your academic credentials to continue.' : 'Join the most trusted academic resource network.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-error/5 border border-error/20 rounded-lg text-error text-[11px] font-bold text-center">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-primary text-[11px] font-bold text-center">
                  {successMsg}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/40">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu"
                      className="w-full pl-11 pr-4 h-12 bg-surface border border-outline-variant/60 rounded-lg text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Password</label>
                    {isLogin && <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">Forgot?</button>}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/40">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 h-12 bg-surface border border-outline-variant/60 rounded-lg text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center gap-2 px-1">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" />
                  <label htmlFor="remember" className="text-xs font-medium text-on-surface-variant cursor-pointer select-none">Remember me for 30 days</label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-3 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading && isLogin ? (
                  <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                    <span className="text-sm font-semibold tracking-wide">
                      {isLogin ? 'Sign In' : 'Sign Up'}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-outline-variant/30"></div>
                <span className="px-4 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">OR</span>
                <div className="flex-grow h-px bg-outline-variant/30"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full h-12 flex items-center justify-center gap-3 bg-surface border border-outline-variant/60 text-on-surface rounded-lg font-bold shadow-sm hover:bg-surface-container-low active:scale-[0.98] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-semibold tracking-wide">Continue with Google</span>
              </button>
            </form>

            <div className="pt-2 text-center">
              <p className="text-sm font-medium text-on-surface-variant">
                {isLogin ? "New to ScholarHub?" : "Already have an account?"}{' '}
                <button 
                  type="button" 
                  onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                  className="text-primary font-bold hover:underline"
                >
                  {isLogin ? 'Create an account' : 'Sign in instead'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-margin border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary">ScholarHub</span>
          <span className="text-xs text-on-surface-variant/60">© 2026 ScholarHub Academic Systems</span>
        </div>
        <div className="flex items-center gap-6 text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Help Center</a>
        </div>
      </footer>
    </div>
  );
};