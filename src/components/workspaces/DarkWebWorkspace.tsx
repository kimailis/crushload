import React, { useState } from 'react';
import { Eye, ShieldAlert, Lock, UserX, Cpu, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function DarkWebWorkspace({ config }: { config: CareerConfig }) {
  const [listings, setListings] = useState([
    { title: 'MegaCorp Auth Tokens', type: 'Access', price: '0.45 BTC', vendor: 'Ghost1x', status: 'available' },
    { title: 'Zero-Day Exploit (iOS 17)', type: 'Vulnerability', price: '2.1 BTC', vendor: 'zero_cool', status: 'available' },
    { title: 'Database Dump - GlobalBank', type: 'Data', price: '1.2 BTC', vendor: 'DataBroker', status: 'available' },
  ]);
  const [transaction, setTransaction] = useState<string | null>(null);

  const handlePurchase = (index: number) => {
     setTransaction('Negotiating with vendor wallet via Tor nodes...');
     setTimeout(() => {
        setListings(prev => prev.map((l, i) => i === index ? { ...l, status: 'purchased' } : l));
        setTransaction('Purchase complete. Decryption keys delivered to local storage.');
        setTimeout(() => setTransaction(null), 3000);
     }, 1500);
  };

  return (
    <motion.div key="darkweb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-5xl mx-auto bg-[#050505] overflow-hidden relative font-mono selection:bg-rose-500/30 border border-rose-500/10 rounded-[28px] shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      
      <div className="p-2 bg-black border-b border-rose-500/20 flex gap-2">
         <div className="bg-[#111] px-4 py-2 rounded text-zinc-500 text-xs w-full flex items-center gap-2 border border-white/5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" /> onion://t6x...market
         </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
           <div className="flex items-center gap-4 border-b border-rose-500/20 pb-6 mb-8 relative">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center">
                 <ShieldAlert className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-rose-500 tracking-tighter uppercase">The Silk Node</h1>
                 <p className="text-zinc-500 text-xs mt-1">Encrypted Marketplace v4.2</p>
              </div>
              {transaction && (
                 <div className="absolute right-0 top-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 px-4 py-2 rounded text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {transaction}
                 </div>
              )}
           </div>
           
           <div className="grid grid-cols-1 gap-4">
             {listings.map((listing, i) => (
               <div key={i} className={`bg-black/50 border border-white/10 p-4 rounded-lg flex items-center justify-between transition ${listing.status === 'purchased' ? 'opacity-40 grayscale' : 'hover:border-rose-500/50'}`}>
                 <div className="flex items-start gap-4">
                    <div className="mt-1"><Cpu className="w-5 h-5 text-zinc-600" /></div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-200">{listing.title}</h3>
                      <div className="flex gap-3 mt-1.5 text-xs text-zinc-500">
                         <span className="bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest">{listing.type}</span>
                         <span className="flex items-center gap-1"><UserX className="w-3 h-3" /> {listing.vendor}</span>
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-bold text-rose-400">{listing.price}</span>
                    {listing.status === 'purchased' ? (
                        <span className="text-xs text-amber-500 font-bold px-3 py-1.5">Acquired</span>
                    ) : (
                        <button onClick={() => handlePurchase(i)} className="bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 text-zinc-400 px-3 py-1.5 rounded text-xs transition cursor-pointer">Purchase</button>
                    )}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
