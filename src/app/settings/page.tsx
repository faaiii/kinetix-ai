'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Moon,
  Sun,
  Laptop,
  CreditCard,
  Download,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [name, setName] = useState('User Workspace');
  const [email] = useState('developer@example.com');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg text-text p-6 md:p-12 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs text-text-muted hover:text-text font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chat</span>
        </Link>
        <span className="text-xs text-text-muted font-medium">
          Account & Preferences
        </span>
      </div>

      <div>
        <h1 className="font-serif font-bold text-3xl text-text">Settings</h1>
        <p className="text-sm text-text-muted mt-1">
          Manage your personal profile, visual theme, and workspace subscription.
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-card space-y-4">
        <h2 className="font-semibold text-base text-text">Profile Information</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full bg-bg/50 border border-border rounded-lg px-3 py-2 text-sm text-text-muted cursor-not-allowed"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-1.5 px-4 py-2 bg-accent text-on-accent text-xs font-semibold rounded-lg hover:bg-accent-hover transition-colors shadow-card"
        >
          {isSaved && <Check className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'Changes Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Visual Theme Section */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-card space-y-4">
        <h2 className="font-semibold text-base text-text">Appearance & Theme</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light (Stone)', icon: Sun },
            { id: 'dark', label: 'Dark (Onyx)', icon: Moon },
            { id: 'system', label: 'System Sync', icon: Laptop },
          ].map((item) => {
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTheme(item.id as any)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-bg border-accent text-accent shadow-card'
                    : 'border-border text-text-muted hover:bg-surface-hover hover:text-text'
                }`}
              >
                <item.icon className="w-5 h-5 mb-2" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subscription & Rate Limits */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-base text-text">Plan & Usage</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Current subscription tier: <span className="font-semibold text-accent">Pro Plan</span>
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20 text-xs font-semibold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active</span>
          </span>
        </div>

        {/* 5-hour rolling usage meter */}
        <div className="p-3 bg-bg border border-border rounded-xl space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-text">Rolling Message Capacity (5-Hour Window)</span>
            <span className="text-text-muted font-mono">18 / 45 messages</span>
          </div>
          <div className="w-full h-2 rounded-full bg-border overflow-hidden">
            <div className="w-[40%] h-full bg-accent" />
          </div>
          <p className="text-[11px] text-text-muted">
            Next cooldown window resets in 2 hours 15 minutes.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center space-x-2 px-4 py-2 border border-border bg-bg hover:bg-surface-hover text-xs font-medium rounded-lg text-text transition-colors shadow-card"
        >
          <CreditCard className="w-4 h-4 text-accent" />
          <span>Manage Stripe Billing Portal</span>
        </button>
      </div>

      {/* Data Export */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-card flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-base text-text">Export Conversation Data</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Download your conversations, artifacts, and project knowledge as JSON.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Exporting full conversation archive...')}
          className="flex items-center space-x-1.5 px-3 py-2 bg-bg border border-border hover:bg-surface-hover text-xs font-medium rounded-lg text-text transition-colors shadow-card"
        >
          <Download className="w-4 h-4" />
          <span>Export Archive</span>
        </button>
      </div>
    </div>
  );
}
