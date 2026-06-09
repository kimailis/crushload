import React, { useState } from 'react';
import { LifeBuoy, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function TicketingWorkspace({ config }: { config: CareerConfig }) {
  const [tickets, setTickets] = useState([
    { id: 'INC-4092', title: 'My computer cup holder is broken', reporter: 'VP of Sales', status: 'open', priority: 'high', response: '' },
    { id: 'REQ-1120', title: 'Need access to all production databases', reporter: 'New Intern', status: 'open', priority: 'low', response: '' },
  ]);

  const handleResolve = (id: string, response: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'resolved', response } : t));
  };

  return (
    <div className="flex-1 min-h-[100dvh] bg-[#f1f5f9] text-slate-800 font-sans flex flex-col pt-16">
       <div className="max-w-6xl w-full mx-auto p-6 lg:p-8 flex-1 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
             <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
               <LifeBuoy className="w-7 h-7 text-blue-600" /> IT Service Desk
             </h1>
             <div className="flex gap-4 text-sm font-medium">
               <span className="bg-white border px-3 py-1.5 rounded-lg text-slate-600 shadow-sm">My Queue: 2</span>
               <span className="bg-white border px-3 py-1.5 rounded-lg text-rose-600 shadow-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4"/> 1 Breach Warning
               </span>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
             <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-semibold text-sm text-slate-700 flex justify-between">
                  New Incidents <span className="bg-slate-200 text-slate-700 w-5 h-5 flex items-center justify-center rounded-full text-xs">2</span>
                </div>
                <div className="p-3 flex flex-col gap-3 flex-1 overflow-auto bg-slate-50/50">
                   <AnimatePresence>
                    {tickets.filter(t => t.status === 'open').map(ticket => (
                      <motion.div key={ticket.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden">
                        {ticket.priority === 'high' && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />}
                        {ticket.priority === 'low' && <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />}
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-xs font-bold text-slate-500">{ticket.id}</span>
                           <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">{ticket.priority} Prio</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug mb-3">{ticket.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                           <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">{ticket.reporter[0]}</div>
                           {ticket.reporter}
                        </div>
                      </motion.div>
                    ))}
                   </AnimatePresence>
                </div>
             </div>

             <div className="lg:col-span-2 flex flex-col gap-6">
                {tickets.filter(t => t.status === 'open')[0] && (
                  <div className="bg-white border border-slate-200 shadow-sm rounded-xl flex-1 flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                       <h2 className="text-xl font-bold text-slate-800 mb-2">{tickets.filter(t => t.status === 'open')[0].title}</h2>
                       <div className="flex gap-4 text-sm text-slate-500">
                         <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> Opened 4 hours ago</span>
                         <span className="font-medium text-slate-700">Reporter: {tickets.filter(t => t.status === 'open')[0].reporter}</span>
                       </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col bg-slate-50/30">
                       <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">"The cup holder on the side of my computer unit is broken and won't go back in. I spilled coffee on the carpet."</p>
                       
                       <div className="mt-auto">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Technician Response</label>
                          <form onSubmit={(e) => {
                             e.preventDefault();
                             const fd = new FormData(e.currentTarget);
                             handleResolve(tickets.filter(t => t.status === 'open')[0].id, fd.get('response') as string);
                          }}>
                             <textarea 
                               name="response" 
                               required 
                               placeholder="Reply to user..." 
                               className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] mb-4"
                             />
                             <div className="flex justify-end gap-3">
                                <button type="button" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">Reassign</button>
                                <button type="submit" className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2 rounded-lg text-sm font-semibold transition">Resolve Ticket</button>
                             </div>
                          </form>
                       </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}
