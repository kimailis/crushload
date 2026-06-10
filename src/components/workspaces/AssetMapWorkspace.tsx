import React, { useState } from 'react';
import { Map, Radio, AlertTriangle, Plane, Flame, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

type AssetStatus = 'Active' | 'Compromised' | 'Silent' | 'Extracted' | 'Burned';

interface Asset {
  id: string; location: string; status: AssetStatus; latency: string; x: string; y: string;
}

const INITIAL_ASSETS: Asset[] = [
  { id: 'Alpha-1', location: 'London', status: 'Active', latency: '42ms', x: '45%', y: '30%' },
  { id: 'Tango-4', location: 'Hong Kong', status: 'Compromised', latency: 'ERROR', x: '80%', y: '45%' },
  { id: 'Echo-9', location: 'Moscow', status: 'Silent', latency: '900ms', x: '65%', y: '25%' },
  { id: 'Zulu-X', location: 'Bogota', status: 'Active', latency: '120ms', x: '25%', y: '55%' },
];

const dotColor = (s: AssetStatus) =>
  s === 'Compromised' ? 'bg-rose-500' : s === 'Silent' ? 'bg-amber-500' : s === 'Burned' ? 'bg-zinc-600' : s === 'Extracted' ? 'bg-sky-400' : 'bg-emerald-500';

export default function AssetMapWorkspace({ config }: { config: CareerConfig }) {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(['Satellite uplink established.']);

  const selected = assets.find(a => a.id === selectedId) || null;
  const activeCount = assets.filter(a => a.status === 'Active').length;

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 6));

  const ping = (id: string) => {
    const ms = Math.floor(Math.random() * 300) + 30;
    setAssets(prev => prev.map(a => a.id === id ? { ...a, latency: `${ms}ms`, status: a.status === 'Silent' ? 'Active' : a.status } : a));
    addLog(`[PING] ${id} responded in ${ms}ms.`);
  };

  const extract = (id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: 'Extracted', latency: 'OFFLINE' } : a));
    addLog(`[EXFIL] ${id} routed to extraction corridor. Asset is safe.`);
  };

  const burn = (id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: 'Burned', latency: 'WIPED' } : a));
    addLog(`[BURN] ${id} safehouse electronics wiped. Trail severed.`);
  };

  return (
    <motion.div key="map" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-[#030712] border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative font-mono selection:bg-emerald-500/30">

      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-20 space-y-4 w-56">
        <div className="bg-black/60 border border-white/10 p-4 rounded-xl backdrop-blur-md">
          <h2 className="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-2 flex items-center gap-2"><Map className="w-4 h-4" /> Global Asset Tracking</h2>
          <div className="text-zinc-400 text-[10px] space-y-1">
            <p>Network: OK</p>
            <p>Sat Link: SECURE</p>
            <p>Active Assets: {activeCount}/{assets.length}</p>
          </div>
        </div>

        <div className="bg-black/60 border border-white/10 p-3 rounded-xl backdrop-blur-md">
          <h3 className="text-zinc-400 font-bold tracking-widest text-[10px] uppercase mb-2 flex items-center gap-1.5"><Radio className="w-3.5 h-3.5" /> Comms Log</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {log.map((l, i) => (
              <p key={i} className="text-emerald-400/80 text-[10px] leading-tight break-words">{l}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Roster (right) */}
      <div className="absolute top-4 right-4 z-20 w-56 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden">
        <h3 className="text-zinc-300 font-bold tracking-widest text-[10px] uppercase px-3 py-2 border-b border-white/10">Asset Roster</h3>
        <div className="divide-y divide-white/5">
          {assets.map(a => (
            <button key={a.id} onClick={() => setSelectedId(a.id)} className={`w-full flex items-center justify-between px-3 py-2 text-left transition ${selectedId === a.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${dotColor(a.status)}`} />
                <span className="text-[11px] text-zinc-200 font-bold">{a.id}</span>
              </span>
              <span className="text-[9px] text-zinc-500 uppercase">{a.status}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid + map */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-contain bg-center bg-no-repeat opacity-10 invert sepia hue-rotate-[130deg] saturate-[300%]" />
      </div>

      {/* Markers */}
      <div className="relative z-10 w-full h-full">
        {assets.map((asset, i) => (
          <motion.button
            key={asset.id}
            onClick={() => setSelectedId(asset.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: asset.x, top: asset.y }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            aria-label={`Select asset ${asset.id} in ${asset.location}, status ${asset.status}`}
          >
            <span className="relative flex items-center justify-center">
              <span className={`w-3.5 h-3.5 rounded-full relative z-10 ring-2 ${selectedId === asset.id ? 'ring-white' : 'ring-transparent'} ${dotColor(asset.status)}`} />
              {(asset.status === 'Compromised' || asset.status === 'Active') && (
                <span className={`absolute -inset-2 rounded-full animate-ping opacity-50 ${asset.status === 'Compromised' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              )}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Detail / ops panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] sm:w-[440px] bg-black/80 border border-white/15 rounded-2xl backdrop-blur-xl p-5 shadow-2xl"
          >
            <button onClick={() => setSelectedId(null)} aria-label="Close asset panel" className="absolute top-3 right-3 text-zinc-500 hover:text-white transition"><X className="w-4 h-4" /></button>
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-3 h-3 rounded-full ${dotColor(selected.status)}`} />
              <h3 className="text-white font-bold tracking-wide">{selected.id}</h3>
              <span className="text-zinc-500 text-[11px]">· {selected.location}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
              <div className="bg-white/5 rounded-lg px-3 py-2 flex justify-between"><span className="text-zinc-500">Status</span><span className="text-zinc-200">{selected.status}</span></div>
              <div className="bg-white/5 rounded-lg px-3 py-2 flex justify-between"><span className="text-zinc-500">Latency</span><span className="text-zinc-200">{selected.latency}</span></div>
            </div>
            {selected.status === 'Extracted' || selected.status === 'Burned' ? (
              <p className="text-center text-[11px] text-zinc-500 uppercase tracking-widest py-2">Asset offline — no further actions</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => ping(selected.id)} className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-[11px] font-bold py-2.5 rounded-xl transition uppercase tracking-wider"><Radio className="w-3.5 h-3.5" /> Ping</button>
                <button onClick={() => extract(selected.id)} className="flex items-center justify-center gap-1.5 bg-sky-500/15 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 text-[11px] font-bold py-2.5 rounded-xl transition uppercase tracking-wider"><Plane className="w-3.5 h-3.5" /> Extract</button>
                <button onClick={() => burn(selected.id)} className="flex items-center justify-center gap-1.5 bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[11px] font-bold py-2.5 rounded-xl transition uppercase tracking-wider"><Flame className="w-3.5 h-3.5" /> Burn</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanner sweep */}
      <div className="absolute top-0 bottom-0 left-0 w-full border-b-2 border-emerald-500/20 bg-emerald-500/5 animate-[scan_4s_ease-in-out_infinite] pointer-events-none" />
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100vh); }
        }
      `}</style>
    </motion.div>
  );
}
