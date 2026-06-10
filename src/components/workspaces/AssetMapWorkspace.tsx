import React, { useState } from 'react';
import { Map, Radio, AlertTriangle, Plane, Flame, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

type AssetStatus = 'Active' | 'Compromised' | 'Silent' | 'Extracted' | 'Burned';

interface Asset {
  id: string; location: string; status: AssetStatus; latency: string; lat: number; lon: number;
}

// Equirectangular projection: lon/lat map linearly onto the map box.
const projX = (lon: number) => ((lon + 180) / 360) * 100;
const projY = (lat: number) => ((90 - lat) / 180) * 100;

const INITIAL_ASSETS: Asset[] = [
  { id: 'Alpha-1', location: 'London', status: 'Active', latency: '42ms', lat: 51.5, lon: -0.13 },
  { id: 'Tango-4', location: 'Hong Kong', status: 'Compromised', latency: 'ERROR', lat: 22.32, lon: 114.17 },
  { id: 'Echo-9', location: 'Moscow', status: 'Silent', latency: '900ms', lat: 55.75, lon: 37.62 },
  { id: 'Zulu-X', location: 'Bogota', status: 'Active', latency: '120ms', lat: 4.71, lon: -74.07 },
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

      {/* Faint global grid (decorative, full pane) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {/* Map + markers share ONE equirectangular box so dots line up with land */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-2">
        <div className="relative w-full max-h-full aspect-[2/1] max-w-[min(100%,_calc((75vh_-_1rem)*2))]">
          {/* Equirectangular world map fills the box exactly (-180..180, 90..-90) */}
          <div
            className="absolute inset-0 opacity-25 bg-no-repeat"
            style={{
              backgroundImage: "url('https://commons.wikimedia.org/wiki/Special:FilePath/Equirectangular_projection_SW.jpg')",
              backgroundSize: '100% 100%',
              filter: 'invert(1) sepia(1) hue-rotate(110deg) saturate(400%) brightness(0.8)',
            }}
          />
          {/* Self-contained graticule fallback (renders even if the map image is blocked) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 180" preserveAspectRatio="none" aria-hidden="true">
            {[30, 60, 90, 120, 150, 210, 240, 270, 300, 330].map(x => (
              <line key={`m${x}`} x1={x} y1="0" x2={x} y2="180" stroke="#10b981" strokeWidth="0.3" opacity="0.18" />
            ))}
            {[30, 60, 120, 150].map(y => (
              <line key={`p${y}`} x1="0" y1={y} x2="360" y2={y} stroke="#10b981" strokeWidth="0.3" opacity="0.18" />
            ))}
            {/* Prime meridian + equator emphasized */}
            <line x1="180" y1="0" x2="180" y2="180" stroke="#10b981" strokeWidth="0.5" opacity="0.35" />
            <line x1="0" y1="90" x2="360" y2="90" stroke="#10b981" strokeWidth="0.5" opacity="0.35" strokeDasharray="2 2" />
          </svg>

          {assets.map((asset, i) => (
            <motion.button
              key={asset.id}
              onClick={() => setSelectedId(asset.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${projX(asset.lon)}%`, top: `${projY(asset.lat)}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15 }}
              aria-label={`Select asset ${asset.id} in ${asset.location}, status ${asset.status}`}
            >
              <span className="relative flex items-center justify-center">
                <span className={`w-3 h-3 rounded-full relative z-10 ring-2 ${selectedId === asset.id ? 'ring-white' : 'ring-black/40'} ${dotColor(asset.status)}`} />
                {(asset.status === 'Compromised' || asset.status === 'Active') && (
                  <span className={`absolute -inset-1.5 rounded-full animate-ping opacity-50 ${asset.status === 'Compromised' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                )}
                {/* City label */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-zinc-300/80 bg-black/40 px-1 rounded pointer-events-none">{asset.location}</span>
              </span>
            </motion.button>
          ))}
        </div>
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
