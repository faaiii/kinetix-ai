'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
        <span className="text-xs text-text-muted font-medium">Privacy Policy</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-accent font-semibold text-xs uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Legal & Transparency</span>
        </div>
        <h1 className="font-serif font-bold text-3xl text-text">Privacy Policy</h1>
        <p className="text-xs text-text-muted">Last updated: November 16, 2026</p>
      </div>

      <div className="prose prose-sm text-text-muted space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-text">1. Overview</h2>
          <p>
            Kinetix ("we", "our", or "us") provides an unconstrained conversational AI engineering workspace. This policy outlines how your data, prompts, and project knowledge documents are handled.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-text">2. Sub-Processors & Data Flow</h2>
          <p>We work exclusively with vetted infrastructure processors to deliver our services:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Stripe, Inc.:</strong> Payment processing, customer portal, and billing management. We never store credit card numbers.</li>
            <li><strong>Supabase, Inc.:</strong> Cloud PostgreSQL database, Row-Level Security (RLS) enforcement, and authentication.</li>
            <li><strong>Vercel, Inc.:</strong> Global edge hosting, serverless compute, and static asset distribution.</li>
            <li><strong>Model Inference Providers:</strong> Frontier cloud AI providers (Google, OpenAI, and upstream model providers when using cloud routing). Prompts are processed ephemerally and are not used to train foundation models.</li>
            <li><strong>Local / Air-Gapped Models (Ollama):</strong> When using localhost mode, prompt payloads never leave your personal workstation.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-text">3. Project Knowledge & Artifact Isolation</h2>
          <p>
            Knowledge documents uploaded to your projects are stored in dedicated tenant-isolated storage buckets. Interactive artifacts are executed exclusively client-side in an isolated iframe sandbox (<code>sandbox="allow-scripts"</code>) without access to your cookies or parent window DOM.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-text">4. Account Deletion & Right to Erasure</h2>
          <p>
            You have the absolute right to delete your account and all associated project files and conversation threads at any time. Clicking "Delete Account" in Account Settings permanently erases all records via cascading database deletion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-text">5. Contact</h2>
          <p>For privacy inquiries or data erasure verification, contact <code>privacy@kinetixai.dev</code>.</p>
        </section>
      </div>
    </div>
  );
}
