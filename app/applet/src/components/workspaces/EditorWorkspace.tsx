import React, { useState } from 'react';
import { PenTool, CheckCircle, FileText, Send, Loader2 } from 'lucide-react';
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
    <div className="flex-1 min-h-[100dvh] bg-[#f8f9fa] text-zinc-900 font-sans flex flex-col pt-16">
       <div className="max-w-4xl w-full mx-auto p-6 lg:p-12 flex-1 flex flex-col">
          <div className="mb-8 flex items-center justify-between">
             <div>
                <h1 className="text-3xl font-serif text-zinc-800 tracking-tight">Mainifesto Draft_v5.final.docx</h1>
                <p className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
                   <FileText className="w-4 h-4" /> Client: Generic Corp | Due: 5 PM
                </p>
             </div>
             <div className="bg-white border text-sm px-4 py-2 rounded-full shadow-sm text-zinc-600 font-medium">
                {draft.trim().split(/\s+/).filter(w => w.length > 0).length} words
             </div>
          </div>

          <div className="flex-1 bg-white border shadow-sm rounded-xl overflow-hidden flex flex-col relative transition-shadow focus-within:ring-2 focus-within:ring-blue-500/20">
             {status === 'accepted' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10" />
                   </div>
                   <h2 className="text-2xl font-bold text-zinc-800 mb-2">Draft Approved!</h2>
                   <p className="text-zinc-600">{feedback}</p>
                </div>
             )}
             
             {status === 'rejected' && (
                <div className="absolute top-0 left-0 right-0 bg-red-50 border-b border-red-100 p-4 text-red-700 text-sm font-medium z-10 flex items-center justify-center gap-2 animate-in slide-in-from-top-4">
                   {feedback}
                </div>
             )}

             <div className="bg-zinc-50 border-b p-3 flex items-center gap-2 border-zinc-200">
                <button className="p-2 hover:bg-zinc-200 rounded text-zinc-600"><PenTool className="w-4 h-4" /></button>
             </div>
             
             <textarea 
                value={draft}
                onChange={e => {
                  setDraft(e.target.value);
                  if (status === 'rejected') setStatus('idle');
                }}
                disabled={status === 'accepted' || status === 'submitting'}
                placeholder="Start typing your minimalist masterpiece..."
                className="flex-1 w-full p-8 lg:p-12 resize-none outline-none text-lg leading-relaxed text-zinc-800 bg-transparent disabled:opacity-50"
             />
          </div>

          <div className="mt-8 flex justify-end">
             <button 
                onClick={handleSubmit}
                disabled={draft.trim().length === 0 || status === 'submitting' || status === 'accepted'}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-medium tracking-wide flex items-center gap-2 transition shadow-lg shadow-blue-500/20"
             >
                {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {status === 'submitting' ? 'Submitting...' : 'Submit for Review'}
             </button>
          </div>
       </div>
    </div>
  );
}
