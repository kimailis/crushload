import React from 'react';
import { Map, MapPin, Eye, Radio, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function AssetMapWorkspace({ config }: { config: CareerConfig }) {
  const assets = [
    { id: 'Alpha-1', location: 'London', status: 'Active', latency: '42ms', x: '45%', y: '30%' },
    { id: 'Tango-4', location: 'Hong Kong', status: 'Compromised', latency: 'ERROR', x: '80%', y: '45%' },
    { id: 'Echo-9', location: 'Moscow', status: 'Silent', latency: '900ms', x: '65%', y: '25%' },
    { id: 'Zulu-X', location: 'Bogota', status: 'Active', latency: '120ms', x: '25%', y: '55%' },
  ];

  return (
    <motion.div key="map" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-[#030712] border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative font-mono selection:bg-emerald-500/30">
      
      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-20 space-y-4">
         <div className="bg-black/60 border border-white/10 p-4 rounded-xl backdrop-blur-md">
            <h2 className="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-2 flex items-center gap-2"><Map className="w-4 h-4" /> Global Asset Tracking</h2>
            <div className="text-zinc-400 text-[10px] space-y-1">
               <p>Network: OK</p>
               <p>Sat Link: SECURE</p>
               <p>Active Assets: 3/4</p>
            </div>
         </div>
         
         <div className="bg-black/60 border border-rose-500/20 p-4 rounded-xl backdrop-blur-md">
            <h3 className="text-rose-500 font-bold tracking-widest text-[10px] uppercase mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> High Priority Alert</h3>
            <p className="text-rose-400 text-[11px] leading-tight">Tango-4 has missed consecutive check-ins. Extraction requested.</p>
         </div>
      </div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        {/* Simplified Map Outline placeholder */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-contain bg-center bg-no-repeat opacity-10 invert sepia hue-rotate-[130deg] saturate-[300%]" />
      </div>

      {/* Map Markers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 z-10">
         {assets.map((asset, i) => (
            <motion.div 
               key={asset.id}
               className="absolute"
               style={{ left: asset.x, top: asset.y }}
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: i * 0.2 }}
            >
               <div className="relative group flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center relative z-10 ${asset.status === 'Compromised' ? 'bg-rose-500' : asset.status === 'Silent' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                     {(asset.status === 'Compromised' || asset.status === 'Active') && (
                       <span className={`absolute -inset-2 rounded-full animate-ping opacity-50 ${asset.status === 'Compromised' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                     )}
                  </div>
                  
                  <div className="absolute top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 border border-white/20 p-2 rounded text-[10px] whitespace-nowrap z-20 pointer-events-none shadow-xl">
                     <p className="font-bold text-white uppercase">{asset.id}</p>
                     <p className="text-zinc-400">{asset.location}</p>
                     <p className={`mt-1 font-mono ${asset.status === 'Compromised' ? 'text-rose-400' : 'text-emerald-400'}`}>Status: {asset.status}</p>
                  </div>
               </div>
            </motion.div>
         ))}
      </div>
      
      {/* Crosshair Scanner effect */}
      <div className="absolute top-0 bottom-0 left-0 w-full border-b-2 border-emerald-500/20 bg-emerald-500/5 animate-[scan_4s_ease-in-out_infinite]" />
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100vh); }
        }
      `}</style>
    </motion.div>
  );
}
