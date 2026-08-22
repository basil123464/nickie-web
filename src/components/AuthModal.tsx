import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, Eye, EyeOff, Sparkles, ArrowRight, Loader2, Info } from 'lucide-react';
import { User } from '../types';
import { api } from '../lib/api';
import { STORE_CONFIG } from '../data/products';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string) => void;
  onShowToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onShowToast,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpStreet, setSignUpStreet] = useState('');
  const [signUpCity, setSignUpCity] = useState('Nairobi');
  const [signUpCounty, setSignUpCounty] = useState('Nairobi County');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!signInEmail.trim() || !signInPassword) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(signInEmail, signInPassword);
      onAuthSuccess(res.user, res.token);
      onShowToast(`Welcome back, ${res.user.name}!`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setErrorMessage('Full name, email address, and password are required.');
      return;
    }
    if (signUpPassword.length < 4) {
      setErrorMessage('Password should be at least 4 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        phone: signUpPhone.trim(),
        address: {
          street: signUpStreet.trim() || 'Nairobi',
          city: signUpCity.trim() || 'Nairobi',
          county: signUpCounty.trim() || 'Nairobi County',
        },
      });
      onAuthSuccess(res.user, res.token);
      onShowToast(`Welcome to ${STORE_CONFIG.name}, ${res.user.name}! Account created.`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#121212] border border-[#222222] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#181818] border border-transparent hover:border-[#222222] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Intro */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/20">
            N
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {STORE_CONFIG.name}
            </h2>
            <p className="text-xs text-neutral-400">Save wishlist, track your orders & quick checkout</p>
          </div>
        </div>

        {/* Sign-in Optional Banner */}
        <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#262626] mb-4 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-neutral-300 leading-relaxed">
            <strong className="text-amber-400 font-bold">Signing in is optional:</strong> You can browse all club kits, customize print names & numbers, and place WhatsApp or M-Pesa orders without creating an account.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#222222] mb-4 text-xs font-bold uppercase tracking-wider">
          <button
            id="auth-tab-signin"
            onClick={() => {
              setTab('signin');
              setErrorMessage('');
            }}
            className={`flex-1 pb-3 text-center transition border-b-2 ${
              tab === 'signin'
                ? 'text-amber-400 border-amber-400'
                : 'text-neutral-500 border-transparent hover:text-neutral-300'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            onClick={() => {
              setTab('signup');
              setErrorMessage('');
            }}
            className={`flex-1 pb-3 text-center transition border-b-2 ${
              tab === 'signup'
                ? 'text-amber-400 border-amber-400'
                : 'text-neutral-500 border-transparent hover:text-neutral-300'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  id="signin-email"
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-neutral-500"
                />
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-300">Password</label>
              </div>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl pl-9 pr-9 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono placeholder-neutral-500"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="submit-signin-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-98 shadow-lg shadow-amber-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-neutral-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setTab('signup');
                    setErrorMessage('');
                  }}
                  className="text-amber-400 hover:underline font-bold"
                >
                  Create one now
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Sign Up Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name *</label>
              <div className="relative">
                <input
                  id="signup-name"
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="Your Name (e.g. Basil Wanyonyi)"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-neutral-500"
                />
                <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address *</label>
                <input
                  id="signup-email"
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-neutral-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone Number</label>
                <input
                  id="signup-phone"
                  type="text"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono placeholder-neutral-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">City / Town</label>
                <input
                  id="signup-city"
                  type="text"
                  value={signUpCity}
                  onChange={(e) => setSignUpCity(e.target.value)}
                  placeholder="Nairobi"
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Area / Estate</label>
                <input
                  id="signup-street"
                  type="text"
                  value={signUpStreet}
                  onChange={(e) => setSignUpStreet(e.target.value)}
                  placeholder="e.g. Kilimani, Westlands"
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Create Password *</label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Choose a password"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl pl-9 pr-9 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono placeholder-neutral-500"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="submit-signup-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-98 shadow-lg shadow-amber-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Account</span>}
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-neutral-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setTab('signin');
                    setErrorMessage('');
                  }}
                  className="text-amber-400 hover:underline font-bold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Quick Dismiss / Continue as Guest */}
        <div className="mt-4 pt-3 border-t border-[#222222] text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white transition font-medium"
          >
            Continue as Guest without signing in →
          </button>
        </div>
      </div>
    </div>
  );
};
