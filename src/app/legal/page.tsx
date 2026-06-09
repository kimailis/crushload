import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Scale, Accessibility } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <header className="h-20 px-6 sm:px-8 border-b border-white/5 bg-[#020617]/50 backdrop-blur-2xl flex items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to CrushLoad
        </Link>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 space-y-12">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">Legal &amp; Compliance</h1>
          <p className="text-slate-400 leading-relaxed">
            CrushLoad is a fictional career-simulation game. This page explains how the app handles
            your data, what you agree to by playing, and our accessibility commitments.
          </p>
        </div>

        <section aria-labelledby="fiction" className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          <h2 id="fiction" className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Scale className="w-5 h-5 text-indigo-400" /> Fictional Content Disclaimer
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            All scenarios, companies, characters, missions and "Shadow Track" roles (including those
            themed around hacking, money laundering or espionage) are <strong className="text-slate-200">entirely
            fictional satire</strong>, created for entertainment and career-awareness purposes. Nothing in this
            game is an instruction, encouragement or endorsement of any illegal activity. Simulated tools do
            not perform real network, financial or system operations.
          </p>
        </section>

        <section aria-labelledby="privacy" className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          <h2 id="privacy" className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400" /> Privacy Policy
          </h2>
          <ul className="text-sm text-slate-400 leading-relaxed space-y-3 list-disc pl-5">
            <li>
              <strong className="text-slate-200">Local storage only.</strong> Your session flag and in-game
              progress are stored in your browser's local storage. We do not operate user accounts or store
              personal data on our servers. Clicking "Disconnect" clears all locally stored data.
            </li>
            <li>
              <strong className="text-slate-200">AI features.</strong> When you chat with in-game advisors or
              request new missions, your message and a snapshot of your <em>fictional game state</em> (simulated
              architecture, scores, alerts) are sent to our server and forwarded to Google's Gemini API to
              generate the response. Do not include personal or sensitive information in advisor messages.
            </li>
            <li>
              <strong className="text-slate-200">No tracking, no sale of data.</strong> We do not use advertising
              trackers, analytics cookies, or sell any data.
            </li>
          </ul>
        </section>

        <section aria-labelledby="terms" className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          <h2 id="terms" className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-400" /> Terms of Service &amp; Acceptable Use
          </h2>
          <ul className="text-sm text-slate-400 leading-relaxed space-y-3 list-disc pl-5">
            <li>CrushLoad is provided "as is", for entertainment and educational purposes, without warranty of any kind.</li>
            <li>You may not use the app's AI features to generate harmful, unlawful or abusive content, or attempt to misuse them beyond gameplay.</li>
            <li>Automated or excessive use of AI features is rate-limited to keep the service available and affordable for everyone.</li>
            <li>Premium "Shadow Track" content is fictional adult-themed satire and intended for users aged 16+.</li>
          </ul>
        </section>

        <section aria-labelledby="accessibility" className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          <h2 id="accessibility" className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Accessibility className="w-5 h-5 text-indigo-400" /> Accessibility Statement
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            We aim to conform with WCAG 2.1 AA. The app supports keyboard navigation with visible focus
            indicators, honors your reduced-motion system preference, allows page zoom, and labels
            interactive controls for assistive technologies. If you encounter an accessibility barrier,
            please open an issue in the project repository so we can fix it.
          </p>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} CrushLoad. All scenarios are fictional.
      </footer>
    </div>
  );
}
