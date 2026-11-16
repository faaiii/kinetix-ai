'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-bg text-text p-6 md:p-12 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs text-text-muted hover:text-text font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="text-xs text-text-muted font-medium">Terms of Service</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-accent font-semibold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>User Agreement</span>
        </div>
        <h1 className="font-serif font-bold text-3xl text-text">Terms of Service</h1>
        <p className="text-xs text-text-muted">Last updated: November 16, 2026</p>
      </div>

      <div className="prose prose-sm text-text-muted space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-text">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Kinetix, you agree to be bound by these Terms. If you are entering into these Terms on behalf of an entity, you represent that you possess the authority to bind that entity.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-text">2. Ownership of Generated Output</h2>
          <p>
            You retain 100% full intellectual property ownership of all prompts, custom instructions, knowledge documents, and code artifacts generated through Kinetix. Kinetix claims no copyright over your code or components.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-text">3. Subscriptions & Billing</h2>
          <p>
            Paid subscriptions (Pro and Team tiers) are billed on a recurring monthly or annual basis via Stripe. You may cancel your subscription at any time with one click through our customer portal, taking effect at the conclusion of your current billing period.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-text">4. Acceptable Use</h2>
          <p>
            You agree not to use Kinetix to generate malicious malware, execute distributed denial-of-service attacks, or violate applicable local laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-text">5. Limitation of Liability</h2>
          <p>
            Kinetix is provided "as is" without warranty of any kind. In no event shall Kinetix be liable for indirect, incidental, or consequential damages resulting from code execution or service interruptions.
          </p>
        </section>
      </div>
    </div>
  );
}
