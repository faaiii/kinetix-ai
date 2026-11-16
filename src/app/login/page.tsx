'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck, Github } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('Faisal Ahmed');
  const [email, setEmail] = useState('faisal@kinetix.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const user = {
        name: name || 'Faisal Ahmed',
        email: email || 'faisal@kinetix.ai',
        plan: 'Pro Plan',
        isLoggedIn: true,
        avatarInitials: (name || 'F').charAt(0).toUpperCase(),
      };
      localStorage.setItem('kinetix_auth_user', JSON.stringify(user));
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 500);
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setLoading(true);
    const user = {
      name: 'Faisal Ahmed',
      email: 'faisal@kinetix.ai',
      plan: 'Pro Plan',
      isLoggedIn: true,
      avatarInitials: 'F',
    };
    localStorage.setItem('kinetix_auth_user', JSON.stringify(user));
    setTimeout(() => {
      router.push('/');
    }, 400);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#090614] p-4 text-white select-none">
      {/* Ambient Apple Purple Mesh Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/25 rounded-full blur-[128px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Main Glassmorphic Auth Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-500 shadow-xl shadow-purple-500/25 mb-3 border border-purple-400/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isSignUp ? 'Create your Kinetix account' : 'Welcome back to Kinetix'}
          </h1>
          <p className="text-xs text-purple-200/70 mt-1">
            Next-generation unconstrained AI reasoning
          </p>
        </div>

        {/* Frosted Glass Card Container */}
        <div className="bg-white/[0.08] dark:bg-zinc-900/60 backdrop-blur-2xl border border-white/15 dark:border-purple-500/20 rounded-3xl p-7 shadow-2xl shadow-purple-950/50">
          {/* Sign In / Sign Up Segmented Control */}
          <div className="flex bg-black/30 border border-white/10 rounded-2xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                !isSignUp
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-200/60 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                isSignUp
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-200/60 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-purple-200 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-black/25 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-purple-300/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-purple-200 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-black/25 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-purple-300/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-purple-200">Password</label>
                {!isSignUp && (
                  <a href="#" className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/25 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-purple-300/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Quick Demo Access */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 px-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>1-Click Instant Demo Login (Faisal Ahmed)</span>
            </button>
          </div>

          {/* Social Logins */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="flex items-center justify-center space-x-2 py-2.5 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/10 text-xs text-white font-medium transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="flex items-center justify-center space-x-2 py-2.5 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/10 text-xs text-white font-medium transition-all"
            >
              <span className="font-bold text-sm"></span>
              <span>Apple</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-purple-200/50">
          <Link href="/" className="hover:text-purple-300 transition-colors">
            ← Return to Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
