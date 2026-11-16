'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Key,
  FolderArchive,
  Cpu,
  CheckCircle,
  ChevronDown,
  Lock,
  Layers,
  Terminal,
} from 'lucide-react';

export default function LaunchLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/20">
      {/* Navigation Header */}
      <nav className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-2.5">
          <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-on-accent font-serif font-bold text-base shadow-card">
            K
          </span>
          <span className="font-serif font-bold text-text text-lg tracking-tight">
            Kinetix
          </span>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <a href="#features" className="text-text-muted hover:text-text transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-text-muted hover:text-text transition-colors">
            Pricing
          </a>
          <a href="#faq" className="text-text-muted hover:text-text transition-colors">
            FAQ
          </a>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-accent text-on-accent font-medium text-xs hover:bg-accent-hover transition-all shadow-card flex items-center space-x-1.5"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-border bg-surface text-xs font-semibold text-accent shadow-card">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Unconstrained AI Engineering Workspace</span>
        </div>

        <h1 className="font-serif font-bold text-4xl sm:text-6xl text-text tracking-tight leading-[1.15] max-w-3xl mx-auto">
          Deep AI reasoning without the 5-hour lockouts.
        </h1>

        <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
          Build interactive components, execute live code in a split-screen canvas, and monitor exact token telemetry. When your quota runs low, toggle instant BYOK fallback. Your flow never stops.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-accent text-on-accent font-semibold text-sm hover:bg-accent-hover transition-all shadow-pop flex items-center justify-center space-x-2"
          >
            <span>Start Engineering Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface border border-border hover:bg-surface-hover text-text font-semibold text-sm transition-all shadow-card"
          >
            Explore Interactive Canvas
          </a>
        </div>

        {/* Mockup Preview Card */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-surface shadow-pop overflow-hidden p-3 sm:p-4">
            <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-border/60 text-xs text-text-muted">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/40" />
                <div className="w-3 h-3 rounded-full bg-accent/40" />
                <div className="w-3 h-3 rounded-full bg-success/40" />
              </div>
              <span className="font-mono text-[11px] pl-2">kinetix.workspace/active-canvas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-xl bg-bg border border-border space-y-3 font-mono text-xs">
                <div className="text-text-muted text-[11px]">User Prompt</div>
                <div className="text-text font-sans">
                  "Build a real-time revenue analytics dashboard in HTML and SVG with live hover states."
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-border/80 text-[11px] text-accent space-y-1">
                  <div className="font-semibold flex items-center space-x-1">
                    <Terminal className="w-3 h-3" />
                    <span>Thought for 6 seconds</span>
                  </div>
                  <p className="text-text-muted text-[10px] font-sans">
                    Constructed standalone HTML with embedded responsive SVG funnel chart.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-border shadow-inner flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-800">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                    Interactive HTML Artifact
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">v1 (Live Preview)</span>
                </div>
                <div className="py-6 text-center space-y-2">
                  <div className="text-2xl font-bold text-slate-900">$148,200 MRR</div>
                  <div className="text-xs text-emerald-600 font-medium">+14.2% monthly growth</div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-accent h-full w-[75%]" />
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  Isolated iframe sandbox • 0 console errors
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 border-t border-border bg-surface/50">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-text">
              Traditional AI Workspaces Cut You Off Mid-Sprint.
            </h2>
            <p className="text-sm text-text-muted max-w-xl mx-auto">
              We analyzed thousands of developer reviews to fix the exact pain points that ruin engineering momentum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-bg shadow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center font-bold">
                !
              </div>
              <h3 className="font-semibold text-lg text-text">The Token Black Hole</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                You pay $20 every month, but after just 12 prompts in a complex technical thread, you get locked out for 5 hours. Behind the scenes, the entire message history is quietly re-read on every turn without disclosing your consumption.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-bg shadow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                #
              </div>
              <h3 className="font-semibold text-lg text-text">Preachy Refusals on Normal Code</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Ask to debug a reverse proxy, test open localhost ports, or inspect security payloads, and you get an ethical warning instead of working code. Kinetix gives you an objective senior engineering partner that executes what you ask.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-text">
            Engineered for Continuous Velocity
          </h2>
          <p className="text-sm text-text-muted max-w-xl mx-auto">
            Every feature is built to solve developer friction and keep your focus intact.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Key,
              title: 'BYOK Overflow Fallback',
              desc: 'Never hit a hard wall. When monthly limits run low, plug in your own API key to continue working at cost.',
            },
            {
              icon: Layers,
              title: 'Live Token Telemetry',
              desc: 'Inspect exact token consumption and cost on every prompt. Full visibility replaces arbitrary mystery lockouts.',
            },
            {
              icon: FolderArchive,
              title: 'Multi-File ZIP Bundler',
              desc: 'Download full front-end components, styling, and scripts packaged into clean, runnable ZIP archives with one click.',
            },
            {
              icon: Cpu,
              title: 'Local Ollama Routing',
              desc: 'Route sensitive corporate code directly to localhost models for 100% private, air-gapped generation.',
            },
            {
              icon: Shield,
              title: 'Sandboxed Artifacts Runner',
              desc: 'Isolate untrusted code in a strictly partitioned iframe that executes live without risking parent DOM access.',
            },
            {
              icon: CheckCircle,
              title: 'Guaranteed 1-Click Cancel',
              desc: 'Full self-serve Stripe Billing Portal access with zero dark patterns, retention games, or delayed cancellations.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-border bg-surface shadow-card space-y-2 hover:border-accent/40 transition-colors"
            >
              <f.icon className="w-5 h-5 text-accent mb-2" />
              <h3 className="font-semibold text-sm text-text">{f.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 border-t border-border bg-surface/40">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-text">
              Simple, Transparent Pricing
            </h2>
            <p className="text-sm text-text-muted max-w-xl mx-auto">
              Start building free. Upgrade when your engineering workflow demands unlimited momentum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Developer */}
            <div className="p-6 rounded-2xl border border-border bg-bg shadow-card space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-base text-text">Developer</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-text">$0</span>
                  <span className="text-xs text-text-muted"> / forever</span>
                </div>
                <p className="text-xs text-text-muted">For solo builders and personal prototypes.</p>
                <div className="space-y-2 mt-6 text-xs text-text">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Core chat workspace</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Interactive HTML & SVG sandbox</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>3 active project workspaces</span>
                  </div>
                </div>
              </div>
              <Link
                href="/"
                className="w-full text-center py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-hover font-semibold text-xs transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-2xl border-2 border-accent bg-bg shadow-pop space-y-4 flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-accent text-on-accent text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Most Popular
              </span>
              <div>
                <h3 className="font-semibold text-base text-text">Pro</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-text">$20</span>
                  <span className="text-xs text-text-muted"> / month ($16 billed annually)</span>
                </div>
                <p className="text-xs text-text-muted">For software engineers and power users.</p>
                <div className="space-y-2 mt-6 text-xs text-text">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Kinetix 3.7 Reasoning Engine</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>5x token capacity & live telemetry</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Instant BYOK overflow fallback</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Multi-file artifact ZIP export</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Local Ollama model connection</span>
                  </div>
                </div>
              </div>
              <Link
                href="/settings"
                className="w-full text-center py-2.5 rounded-xl bg-accent text-on-accent hover:bg-accent-hover font-semibold text-xs transition-colors shadow-card"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Team */}
            <div className="p-6 rounded-2xl border border-border bg-bg shadow-card space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-base text-text">Team</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-text">$30</span>
                  <span className="text-xs text-text-muted"> / user / month</span>
                </div>
                <p className="text-xs text-text-muted">For engineering startups and teams.</p>
                <div className="space-y-2 mt-6 text-xs text-text">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Everything in Pro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Shared project knowledge hubs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Centralized Stripe invoicing</span>
                  </div>
                </div>
              </div>
              <Link
                href="/settings"
                className="w-full text-center py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-hover font-semibold text-xs transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-3xl mx-auto space-y-8">
        <h2 className="font-serif font-bold text-3xl text-center text-text">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {[
            {
              q: 'What happens when I hit my rolling 5-hour capacity?',
              a: 'Unlike platforms that cut you off with zero options, Kinetix displays exact live token counts and allows instant BYOK fallback so you can plug in your own API key and continue without delay.',
            },
            {
              q: 'Can I use Kinetix completely offline for proprietary code?',
              a: 'Yes. Kinetix features a native Local Model connector that routes prompts directly to Ollama running on your workstation with zero cloud telemetry.',
            },
            {
              q: 'How does the Artifact canvas execute code safely?',
              a: 'All code and HTML artifacts execute in an isolated sandbox iframe (allow-scripts without allow-same-origin), preventing any script from accessing your cookies or parent application state.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes, with one click through our Stripe Customer Portal. No support tickets or dark patterns.',
            },
          ].map((item, idx) => (
            <div key={idx} className="border border-border rounded-xl bg-surface overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-text"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-text-muted leading-relaxed border-t border-border/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 border-t border-border bg-surface text-center space-y-6">
        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-text">
          Ready for an AI workspace that respects your velocity?
        </h2>
        <p className="text-sm text-text-muted max-w-lg mx-auto">
          Experience unconstrained deep reasoning, live interactive artifacts, and transparent token telemetry.
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-accent text-on-accent font-semibold text-sm hover:bg-accent-hover transition-all shadow-pop"
        >
          <span>Start Engineering with Kinetix</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div className="text-xs text-text-muted">
          No credit card required • Cancel anytime in one click
        </div>
      </section>
    </div>
  );
}
