import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { User } from '../types';
import { api } from '../lib/api';

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
    setLoading(true);
    try {
      const res = await api.login(signInEmail, signInPassword);
      onAuthSuccess(res.user, res.token);
      onShowToast(`Welcome back, ${res.user.name}!`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await api.register({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        phone: signUpPhone,
        address: {
          street: signUpStreet,
          city: signUpCity,
          county: signUpCounty,
        },
      });
      onAuthSuccess(res.user, res.token);
      onShowToast(`Karibu BRANDED, ${res.user.name}! Account created.`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'customer' | 'admin') => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await api.demoLogin(role);
      onAuthSuccess(res.user, res.token);
      onShowToast(
        role === 'admin'
          ? 'Logged in as BRANDED Store Administrator!'
          : `Logged in as Demo Customer (${res.user.name})!`
      );
      onClose();
    } catch (err: any) {
      setErrorMessage('Demo login failed.');
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
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black text-xs">
            B
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              BRANDED<span className="text-amber-500">.</span> Account
            </h2>
            <p className="text-xs text-neutral-400">Save wishlist, track orders & faster M-Pesa checkout</p>
          </div>
        </div>

        {/* 1-Click Quick Demo Login Pill Section */}
        <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#222222] mb-5 space-y-2">
          <p className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            1-Click Instant Demo Login:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('customer')}
              className="bg-[#121212] hover:bg-[#181818] border border-[#222222] py-1.5 px-2 rounded-lg text-xs font-semibold text-neutral-200 transition flex items-center justify-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="bg-[#121212] hover:bg-[#181818] border border-[#222222] py-1.5 px-2 rounded-lg text-xs font-semibold text-amber-400 transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Store Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#222222] mb-5 text-xs font-bold uppercase tracking-wider">
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
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
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
                  placeholder="demo@branded.co.ke"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Password</label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl pl-9 pr-9 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
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
              id="submit-signin-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-98 shadow-lg shadow-amber-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In to Account</span>}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
              <div className="relative">
                <input
                  id="signup-name"
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="Basil Wanyonyi"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone (+254)</label>
                <input
                  id="signup-phone"
                  type="text"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">City</label>
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
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Street / Area</label>
                <input
                  id="signup-street"
                  type="text"
                  value={signUpStreet}
                  onChange={(e) => setSignUpStreet(e.target.value)}
                  placeholder="Kilimani"
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Create Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222222] rounded-xl pl-9 pr-9 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create BRANDED Account</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
