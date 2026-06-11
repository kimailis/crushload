import React, { useState } from 'react';
import { LifeBuoy, AlertCircle, CheckCircle, Clock, Inbox, CheckSquare, Settings, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function TicketingWorkspace({ config }: { config: CareerConfig }) {
  const [tickets, setTickets] = useState([
    { id: 'INC-4092', title: 'My computer cup holder is broken', reporter: 'VP of Sales', status: 'open', priority: 'high', response: '' },
    { id: 'REQ-1120', title: 'Need access to all production databases', reporter: 'New Intern', status: 'open', priority: 'low', response: '' },
    { id: 'INC-4115', title: 'Boardroom printer says PC LOAD LETTER', reporter: 'Angry CEO', status: 'open', priority: 'critical', response: '' },
    { id: 'INC-4101', title: 'WiFi drops whenever the microwave runs', reporter: 'Break Room Crew', status: 'open', priority: 'medium', response: '' },
    { id: 'REQ-1134', title: 'Unblock "research" website (it is a browser game)', reporter: 'Marketing Lead', status: 'open', priority: 'low', response: '' },
  ]);

  const [activeTicket, setActiveTicket] = useState(tickets[0].id);

  const handleResolve = (id: string, response: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'resolved', response } : t));
    const remainingOpen = tickets.filter(t => t.id !== id && t.status === 'open');
    if (remainingOpen.length > 0) {
       setActiveTicket(remainingOpen[0].id);
    }
  };

  const handleEscalate = (id: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'escalated', response: 'Escalated to Tier-2 support queue.' } : t));
    const remainingOpen = tickets.filter(t => t.id !== id && t.status === 'open');
    if (remainingOpen.length > 0) {
       setActiveTicket(remainingOpen[0].id);
    }
  };

  const selectedTicket = tickets.find(t => t.id === activeTicket);

  return (
    <motion.div key="ticketing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/50 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="absolute inset-0 bg-[#0a0f1c] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        <header className="h-[64px] bg-transparent flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-white/5 relative">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl -z-10" />
          <div className="flex items-center gap-3 lg:gap-4">
             <h1 className="text-[14px] lg:text-[15px] font-bold tracking-widest text-zinc-300 uppercase flex items-center gap-2">
               <LifeBuoy className="w-4 h-4 text-indigo-400" />
               IT Support Desk <span className="text-zinc-600">|</span> <span className="text-zinc-500 font-mono text-[11px] lg:text-xs">global-queue-prod</span>
             </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20 shadow-inner">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span className="text-[13px] font-bold tracking-widest uppercase text-rose-400">1 Breach Warning</span>
             </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10 w-full">
          <aside className="order-3 lg:order-none w-full lg:w-[280px] xl:w-[320px] bg-slate-900/40 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-white/5 h-[200px] lg:h-full">
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center shrink-0">
               <h2 className="text-[12px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Open Tickets</h2>
               <span className="bg-indigo-500/20 text-indigo-400 w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold border border-indigo-500/30">
                  {tickets.filter(t => t.status === 'open').length}
               </span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-3">
               <AnimatePresence>
                {tickets.filter(t => t.status === 'open').map(ticket => (
                  <motion.div 
                    key={ticket.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }} 
                    onClick={() => setActiveTicket(ticket.id)}
                    className={`p-4 rounded-2xl shadow-lg transition cursor-pointer relative overflow-hidden group
                      ${activeTicket === ticket.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'} border
                    `}
                  >
                    {ticket.priority === 'high' && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />}
                    {ticket.priority === 'low' && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
                    <div className="flex justify-between items-start mb-3">
                       <span className={`text-[11px] font-mono font-bold transition ${activeTicket === ticket.id ? 'text-zinc-200' : 'text-zinc-400'}`}>{ticket.id}</span>
                       <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded shadow-sm
                          ${ticket.priority === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}
                       `}>{ticket.priority}</span>
                    </div>
                    <h4 className={`text-[13px] font-bold leading-snug mb-3 transition ${activeTicket === ticket.id ? 'text-white' : 'text-zinc-300'}`}>{ticket.title}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-medium">
                       <div className="w-5 h-5 bg-black/40 rounded-md flex items-center justify-center font-bold text-zinc-300 border border-white/5">{ticket.reporter[0]}</div>
                       {ticket.reporter}
                    </div>
                  </motion.div>
                ))}
               </AnimatePresence>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 overflow-hidden relative z-10">
             {selectedTicket && selectedTicket.status === 'open' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 h-full w-full flex flex-col bg-[#050505] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                  
                  <div className="p-6 lg:p-8 border-b border-white/5 bg-black/20 shrink-0 relative z-10 flex justify-between items-start">
                     <div>
                       <div className="flex items-center gap-3 mb-3">
                          <span className="text-zinc-500 font-mono text-[12px] uppercase font-bold tracking-widest">{selectedTicket.id}</span>
                       </div>
                       <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 tracking-tight">{selectedTicket.title}</h2>
                       <div className="flex gap-6 text-[12px] font-medium text-zinc-500 uppercase tracking-widest font-bold">
                         <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-400"/> Opened 4 hours ago</span>
                         <span className="flex items-center gap-2">Reporter: <span className="text-zinc-300">{selectedTicket.reporter}</span></span>
                       </div>
                     </div>
                  </div>
                  
                  <div className="p-6 lg:p-8 flex-1 flex flex-col relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 bg-[#0a0f1c]/50">
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-[14px] text-zinc-300 leading-relaxed italic shadow-inner">
                       "The cup holder on the side of my computer unit is broken and won't go back in. I spilled coffee on the carpet."
                     </div>
                     
                     <div className="mt-auto pt-6">
                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Activity className="w-4 h-4 text-indigo-400" />
                           Technician Resolution Notes
                        </label>
                        <form onSubmit={(e) => {
                           e.preventDefault();
                           const fd = new FormData(e.currentTarget);
                           handleResolve(selectedTicket.id, fd.get('response') as string);
                        }}>
                           <textarea 
                             name="response" 
                             required 
                             placeholder="Document your resolution steps here..." 
                             className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-[14px] font-mono text-zinc-300 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 min-h-[140px] mb-6 shadow-inner placeholder-zinc-700 transition"
                           />
                           <div className="flex justify-end gap-3">
                              <button type="button" onClick={() => handleEscalate(selectedTicket.id)} className="px-6 py-3 text-[13px] font-bold text-zinc-400 hover:text-white transition hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 cursor-pointer">Escalate Incident</button>
                              <button type="submit" className="bg-indigo-600 border border-indigo-500/50 text-white hover:bg-indigo-500 px-8 py-3 rounded-xl text-[13px] font-bold transition shadow-[0_0_20px_rgba(79,70,229,0.3)]">Close Incident</button>
                           </div>
                        </form>
                     </div>
                  </div>
                </motion.div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
                   <CheckSquare className="w-12 h-12 mb-4 opacity-20" />
                   <p className="text-[13px] uppercase tracking-widest font-bold">Queue Empty</p>
                </div>
             )}
          </div>
        </main>
      </div>
    </motion.div>
  );
}
