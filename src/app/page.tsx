import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Terminal, Database, Layers, Lock, ArrowRight, LogIn, PenTool, TrendingUp, GitMerge, LifeBuoy, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { CAREER_MAP } from '../lib/career-config';

interface CareerTheme {
  icon: React.ElementType;
  tile: string;   // icon tile gradient (static classes for Tailwind JIT)
  blob: string;   // ambient glow color behind the card
  blurb: string;
}

const THEME: Record<string, CareerTheme> = {
  'cyber-architect': { icon: Shield, tile: 'from-blue-500 to-indigo-600', blob: 'bg-indigo-500/40', blurb: 'Defend the org from breaches, calm nervous execs, and patch the holes before the headlines hit.' },
  'copywriter': { icon: PenTool, tile: 'from-fuchsia-500 to-pink-500', blob: 'bg-fuchsia-500/40', blurb: "Turn vague feedback into 'synergistic' gold while the client rejects everything but the typos." },
  'economist': { icon: TrendingUp, tile: 'from-emerald-400 to-teal-500', blob: 'bg-emerald-500/40', blurb: 'Forecast the unforecastable — confident enough to trend, hedged enough to survive.' },
  'data-analyst': { icon: Database, tile: 'from-violet-500 to-purple-600', blob: 'bg-violet-500/40', blurb: 'Wrangle messy SQL into dashboards leadership will misread exactly the way they wanted.' },
  'data-engineer': { icon: GitMerge, tile: 'from-cyan-400 to-sky-500', blob: 'bg-cyan-500/40', blurb: "Keep the pipelines alive at 3 AM and explain why the data is 'just late, not wrong.'" },
  'sysadmin': { icon: LifeBuoy, tile: 'from-amber-400 to-orange-500', blob: 'bg-amber-500/40', blurb: 'Resolve impossible tickets, reset the same password forever, and make the printer work by sheer will.' },
  'investment-manager': { icon: TrendingUp, tile: 'from-amber-400 to-orange-600', blob: 'bg-orange-500/40', blurb: "Move other people's millions, dodge the risk committee, and call it 'conviction.'" },
  'crypto-laundry': { icon: GitMerge, tile: 'from-rose-500 to-pink-600', blob: 'bg-rose-500/40', blurb: 'Keep the funds flowing and the heat low across a maze of mixers and shell wallets.' },
  'cyber-activist': { icon: Terminal, tile: 'from-fuchsia-500 to-rose-600', blob: 'bg-fuchsia-500/40', blurb: 'Run the botnet, footprint the target, and drop the leak before legal wakes up.' },
  'spy-manager': { icon: Shield, tile: 'from-orange-400 to-rose-600', blob: 'bg-orange-500/40', blurb: "Run assets across the globe, burn what's compromised, and bring everyone home." }
};

const FALLBACK: CareerTheme = { icon: Terminal, tile: 'from-slate-500 to-slate-700', blob: 'bg-slate-500/40', blurb: 'Step into a high-pressure career and survive the chaos.' };

const spring = { type: 'spring', stiffness: 320, damping: 26 } as const;

export default function LandingPage() {
  const isAuthenticated = localStorage.getItem('sim_user_auth') === 'true';
  const navigate = useNavigate();

  const handleEnterSim = (careerId: string) => {
    navigate(isAuthenticated ? `/sim/${careerId}` : '/login');
  };

  const careers = Object.values(CAREER_MAP);

  const renderCard = (career: typeof careers[number], premium: boolean, delay: number) => {
    const theme = THEME[career.id] || FALLBACK;
    const Icon = theme.icon;
    return (
      <motion.button
        key={career.id}
        type="button"
        onClick={() => handleEnterSim(career.id)}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, ...spring }}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.985 }}
        aria-label={`Enter the ${career.name} simulation`}
        className="group relative flex flex-col text-left rounded-[28px] p-6 bg-white/[0.04] backdrop-blur-2xl ring-1 ring-white/10 hover:ring-white/20 shadow-[0_16px_50px_-20px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer transition-[box-shadow,background-color] hover:bg-white/[0.06]"
      >
        {/* Ambient accent glow + top sheen */}
        <div className={`pointer-events-none absolute -top-20 -right-12 w-48 h-48 rounded-full blur-3xl opacity-25 group-hover:opacity-60 transition-opacity duration-500 ${theme.blob}`} />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="relative flex items-start justify-between mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${theme.tile} text-white shadow-lg shadow-black/30 ring-1 ring-white/20 group-hover:scale-105 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
          {premium ? (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-200/90 bg-white/5 ring-1 ring-white/10 px-2.5 py-1 rounded-full">
              <Lock className="w-3 h-3" /> Premium
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-200/90 bg-white/5 ring-1 ring-white/10 px-2.5 py-1 rounded-full">
              Free
            </span>
          )}
        </div>

        <h3 className="relative text-[19px] font-semibold text-white tracking-tight mb-2">{career.name}</h3>
        <p className="relative text-[13.5px] text-slate-400 leading-relaxed mb-6 flex-1">{theme.blurb}</p>

        <div className="relative w-full rounded-2xl p-4 bg-black/20 ring-1 ring-white/[0.06] mb-5">
          <h4 className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-3">Starting Stats</h4>
          <div className="flex flex-col gap-2">
            {career.metrics.map(m => (
              <div key={m.id} className="flex items-center justify-between text-[12px]">
                <span className="text-slate-400">{m.name}</span>
                <span className="text-slate-200 font-mono bg-white/[0.06] ring-1 ring-white/10 px-2 py-0.5 rounded-lg">{m.startValue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-auto w-full flex items-center justify-between rounded-2xl px-5 py-3 bg-white/[0.06] group-hover:bg-white/[0.12] ring-1 ring-white/10 transition-colors">
          <span className="text-[13px] font-semibold text-white">{isAuthenticated ? 'Enter simulation' : 'Sign in to play'}</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative flex flex-col">
      {/* Layered ambient light field */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-indigo-600/25 blur-[140px] rounded-full" />
        <div className="absolute top-[10%] right-[-15%] w-[55%] h-[55%] bg-violet-600/15 blur-[160px] rounded-full" />
        <div className="absolute top-[35%] left-[25%] w-[50%] h-[50%] bg-teal-500/10 blur-[170px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[10%] w-[55%] h-[55%] bg-fuchsia-600/10 blur-[180px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-8 pt-4">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-5 flex items-center justify-between bg-white/[0.05] backdrop-blur-2xl ring-1 ring-white/10 rounded-[20px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-[17px] font-semibold text-white tracking-tight">CrushLoad</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-slate-300 hover:text-white transition px-3 py-2 rounded-xl hover:bg-white/5">My Profile</Link>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-sm font-medium text-slate-400 hover:text-rose-300 transition cursor-pointer px-3 py-2 rounded-xl hover:bg-white/5">Sign out</button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-[14px] font-semibold bg-white text-slate-900 hover:bg-white/90 px-5 py-2.5 rounded-2xl shadow-lg shadow-black/20 transition">
                <LogIn className="w-4 h-4" /> Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="mb-16 lg:mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10 text-indigo-200 text-[11px] font-semibold tracking-wide mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Immersive career simulations
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.05] mb-5">
            Experience the reality of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-teal-300">corporate chaos</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Step into modern tech and corporate careers and live the exact, gloriously stressful scenarios you'd face on the job. Pick a role and dive in.
          </p>
        </motion.div>

        {/* Free tier */}
        <div className="flex items-center gap-3 mb-6 px-1">
          <h2 className="text-sm font-semibold tracking-tight text-white">Free tracks</h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {careers.filter(c => c.tier === 'free').map((career, i) => renderCard(career, false, i * 0.06))}
        </div>

        {/* Premium tier */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={spring} className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10 text-amber-200/90 text-[11px] font-semibold tracking-wide mb-5">
            <Lock className="w-3 h-3" /> CrushLoad Premium
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight mb-4">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-300">Shadow Tracks</span>
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            High-stakes, off-the-books, adrenaline-fueled scenarios — for subscribers who want the wild side. (All fictional, all satire.)
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {careers.filter(c => c.tier === 'paid').map((career, i) => renderCard(career, true, i * 0.06))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto rounded-[28px] bg-white/[0.04] backdrop-blur-2xl ring-1 ring-white/10 p-8 sm:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center ring-1 ring-white/20">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-[15px] font-semibold text-white">CrushLoad</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Friendly, slightly unhinged career simulations. Learn what a job actually feels like — minus the real-world consequences.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Explore</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition cursor-pointer">Browse careers</button></li>
                <li><Link to={isAuthenticated ? '/profile' : '/login'} className="hover:text-white transition">{isAuthenticated ? 'My profile' : 'Sign in'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link to="/acceptable-use" className="hover:text-white transition">Acceptable use</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} CrushLoad. Made for fun.</p>
            <div className="flex gap-4">
              <span>v2.4.9</span>
              <span>All scenarios are fictional satire</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
