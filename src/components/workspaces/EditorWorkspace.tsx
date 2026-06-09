import React, { useState } from 'react';
import { PenTool, CheckCircle, FileText, Send, Loader2, Info, User, Clock, FileBadge } from 'lucide-react';
import { motion } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function EditorWorkspace({ config }: { config: CareerConfig }) {
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'rejected' | 'accepted'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = () => {
    setStatus('submitting');
    setFeedback(null);
    setTimeout(() => {
      if (draft.includes('Synergistic Paradigms')) {
         setStatus('accepted');
         setFeedback('Perfect! Exactly what the client wanted. Very synergistic.');
      } else {
         setStatus('rejected');
         setFeedback("Rejected. Needs more 'pop'. Try adding 'Synergistic Paradigms'.");
      }
    }, 1500);
  };

  return (
    <motion.div key="editor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/50 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="absolute inset-0 bg-[#0a0f1c] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        <header className="h-[64px] bg-transparent flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-white/5 relative">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl -z-10" />
          <div className="flex items-center gap-3 lg:gap-4">
            <h1 className="text-[14px] lg:text-[15px] font-bold tracking-widest text-zinc-300 uppercase flex items-center gap-2">
              <FileBadge className="w-4 h-4 text-indigo-400" />
              Document Processor <span className="text-zinc-600">|</span> <span className="text-zinc-500 font-mono text-[11px] lg:text-xs">Draft_v5.final.docx</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 shadow-inner">
                <span className="text-[13px] font-bold tracking-widest uppercase text-indigo-400">Word Count: {draft.trim().split(/\s+/).filter(w => w.length > 0).length}</span>
             </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
          <aside className="order-3 lg:order-none w-full lg:w-[260px] xl:w-[280px] bg-slate-900/40 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-white/5">
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center shrink-0">
               <h2 className="text-[12px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Metadata</h2>
            </div>
            <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-6">
               <div>
                 <h3 className="text-[10px] font-bold text-zinc-600 tracking-[0.2em] uppercase mb-3">Client</h3>
                 <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                   <User className="w-4 h-4 text-zinc-400" />
                   <span className="text-[13px] font-medium text-zinc-300">Generic Corp</span>
                 </div>
               </div>
               <div>
                 <h3 className="text-[10px] font-bold text-zinc-600 tracking-[0.2em] uppercase mb-3">Deadline</h3>
                 <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                   <Clock className="w-4 h-4 text-zinc-400" />
                   <span className="text-[13px] font-medium text-zinc-300">Today, 5:00 PM</span>
                 </div>
               </div>
               <div>
                 <h3 className="text-[10px] font-bold text-zinc-600 tracking-[0.2em] uppercase mb-3">Requirements</h3>
                 <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                   <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                   <span className="text-[12px] font-medium text-zinc-400 leading-relaxed">Needs more corporate synergy and dynamic paradigms. Make it pop.</span>
                 </div>
               </div>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-black/20">
               <button 
                  onClick={handleSubmit}
                  disabled={draft.trim().length === 0 || status === 'submitting' || status === 'accepted'}
                  className="w-full bg-indigo-600 border border-indigo-500/50 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-indigo-900/50 disabled:border-indigo-900/50 disabled:text-zinc-500 text-white p-3 rounded-xl text-[12px] font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:shadow-none"
               >
                  {status === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {status === 'submitting' ? 'Submitting...' : 'Submit Direct'}
               </button>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 overflow-hidden relative z-10">
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 h-full w-full flex flex-col bg-[#050505] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                
                {status === 'accepted' && (
                   <div className="absolute inset-0 bg-[#0a0f1c]/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                      <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                         <CheckCircle className="w-12 h-12" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Draft Approved!</h2>
                      <p className="text-zinc-400 text-lg">{feedback}</p>
                   </div>
                )}
                
                {status === 'rejected' && (
                   <div className="bg-rose-500/10 border-b border-rose-500/20 p-4 text-rose-400 text-[13px] font-bold tracking-widest z-10 flex items-center justify-center gap-2 relative shadow-inner uppercase">
                      <CheckCircle className="w-4 h-4" /> {feedback}
                   </div>
                )}

                <div className="bg-black/40 border-b p-3 flex items-center justify-between border-white/5 shrink-0 z-10">
                   <div className="flex items-center gap-2 px-2 text-[12px] font-mono text-zinc-500">
                     <PenTool className="w-3.5 h-3.5" /> <span className="uppercase tracking-widest">Editor Mode</span>
                   </div>
                </div>
                
                <textarea 
                   value={draft}
                   onChange={e => {
                     setDraft(e.target.value);
                     if (status === 'rejected') setStatus('idle');
                   }}
                   disabled={status === 'accepted' || status === 'submitting'}
                   placeholder="Start typing your minimalist masterpiece..."
                   className="flex-1 w-full p-8 lg:p-12 resize-none outline-none text-lg lg:text-xl leading-relaxed text-zinc-300 font-serif bg-transparent disabled:opacity-50 placeholder-zinc-700 scrollbar-thin scrollbar-thumb-white/10"
                />
             </motion.div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
