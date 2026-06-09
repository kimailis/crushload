import React, { useEffect, useRef } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export interface AdvisorPersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface AdvisorMessage {
  from: 'player' | 'advisor';
  text: string;
}

export default function AdvisorChat({
  advisor,
  thread,
  loading,
  input,
  onInputChange,
  onSend,
  onClose
}: {
  advisor: AdvisorPersona;
  thread: AdvisorMessage[];
  loading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread, loading]);

  return (
    <motion.div
      key="advisor-chat"
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-label={`Chat with ${advisor.name}`}
      className="fixed bottom-4 right-4 z-[1000] w-[calc(100vw-2rem)] sm:w-[380px] h-[480px] max-h-[75dvh] flex flex-col bg-[#0a0f1c]/95 backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-2xl shadow-black/50 overflow-hidden"
    >
      <div className="p-4 flex items-center gap-3 border-b border-white/10 bg-white/5 shrink-0">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xl">{advisor.avatar}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-zinc-50 truncate">{advisor.name}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {advisor.role}</p>
        </div>
        <button onClick={onClose} aria-label="Close advisor chat" className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-zinc-100 transition cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" aria-live="polite">
        {thread.length === 0 && (
          <div className="text-center text-zinc-500 text-[12px] mt-8 px-6 leading-relaxed">
            Ask {advisor.name.split(' ')[0]} for guidance on your current situation, priorities, or active missions.
          </div>
        )}
        {thread.map((msg, i) => (
          <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
            msg.from === 'player'
              ? 'self-end bg-indigo-600 text-white rounded-br-md'
              : 'self-start bg-white/5 border border-white/10 text-zinc-200 rounded-bl-md'
          }`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="self-start flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl rounded-bl-md text-zinc-400 text-[13px]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> typing…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={e => { e.preventDefault(); onSend(); }}
        className="p-3 border-t border-white/10 bg-black/30 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={e => onInputChange(e.target.value)}
          placeholder={`Message ${advisor.name.split(' ')[0]}…`}
          aria-label={`Message to ${advisor.name}`}
          className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-[13px] text-zinc-100 outline-none transition placeholder-zinc-600"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          aria-label="Send message"
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
}
