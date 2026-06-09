import React, { useState, useEffect } from 'react';
import { ShieldAlert, Eye, EyeOff, Cpu, FolderOpen, Fingerprint, Globe, Terminal, CheckSquare, RefreshCw, UserCheck, Lock, Unlock, Send, Archive, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

interface IntelItem {
  id: string;
  source: string;
  codename: string;
  location: string;
  classification: 'COSMIC TOP SECRET' | 'TOP SECRET' | 'SECRET' | 'RESTRICTED';
  reliability: string;
  subject: string;
  content: string;
  rawPayloadHex: string;
  status: 'raw' | 'decrypting' | 'decrypted' | 'archived' | 'compromised';
  notes?: string;
  timestamp: string;
}

const INITIAL_INTEL: IntelItem[] = [
  {
    id: 'INT-8091',
    source: 'Asset "Foxbound"',
    codename: 'DEEP-SHELF-ALPHA',
    location: 'Barents Sea Basin',
    classification: 'COSMIC TOP SECRET',
    reliability: 'A1 (Confirmed)',
    subject: 'Subsea Fiber Optic Cable Tapping Signature Detected',
    content: 'Unmanned undersea sub-aquatic drones detected near the Svalbard subsea telecom trunk channel. Real-time hydrophone acoustics captured high-frequency signal induction humming. Raw microwave telemetry feeds show consistent telemetry drift matching known fiber induction clamping systems. Direct interception/clamping is suspected.',
    rawPayloadHex: '4F 50 45 52 41 54 49 4F 4E 20 54 41 50 20 41 43 54 49 56 45',
    status: 'raw',
    timestamp: '04:12:09 UTC'
  },
  {
    id: 'INT-4412',
    source: 'Asset "Valkyrie"',
    codename: 'GILDED-PENTHOUSE',
    location: 'Vienna Diplomatic Quarter',
    classification: 'TOP SECRET',
    reliability: 'B2 (Highly Probable)',
    subject: 'Diplomatic Microwave Intercept on Defector Movement',
    content: 'RF monitoring antennas locked onto secondary diplomat compound transceivers. Legacy packet headers indicate bulk scheduling logs for diplomatic transport of a key defense defector scheduled for 24-48 hours. Decoupling sequence confirms transport vessel tail numbers and route transits through neutral corridors.',
    rawPayloadHex: '54 52 41 4E 53 49 54 20 50 41 54 48 20 53 45 43 55 52 45 44',
    status: 'raw',
    timestamp: '06:34:55 UTC'
  },
  {
    id: 'INT-1077',
    source: 'Sentry Core (Satellite)',
    codename: 'THERMAL-SPIKE-V',
    location: 'Natanz Centrifuge Facility',
    classification: 'SECRET',
    reliability: 'A1 (Sensor Confirmed)',
    subject: 'Covert Centrifuge Sub-Vault Energy Load Spike',
    content: 'Multi-spectral satellite payload detected localized +12.4°C thermal signatures inside deep sub-surface centrifuge hall quadrant. Heavy electrical heat signature cycle indicates covert material processing. Local vibration telemetry matches load levels reserved for experimental military refinement cascades.',
    rawPayloadHex: '43 45 4E 54 52 49 46 55 47 45 20 4C 4F 41 44 20 53 50 49 4B 45',
    status: 'decrypted',
    timestamp: '08:15:22 UTC',
    notes: 'Satellite thermal logs verified against internal power flow sensors.'
  },
  {
    id: 'INT-2605',
    source: 'Asset "Ghost-Rider"',
    codename: 'ECHO-PERIMETER',
    location: 'Berlin Safehouse Beta',
    classification: 'SECRET',
    reliability: 'C3 (Doubtful)',
    subject: 'Passive IMSI Catcher Signature in Proximity',
    content: 'Decrypt hardware mapped virtual cell tower setups targeting Berlin safehouse coordinates. Active signal loops match techniques designed to force defectors mobile client devices into plaintext GSM towers to extract precise room location maps. Local tactical shield active.',
    rawPayloadHex: '49 4D 53 49 20 43 41 54 43 48 45 52 20 53 50 4F 4F 46 45 44',
    status: 'raw',
    timestamp: '11:58:30 UTC'
  }
];

export default function FieldIntelWorkspace({ config }: { config: CareerConfig }) {
  const [intelList, setIntelList] = useState<IntelItem[]>(INITIAL_INTEL);
  const [activeIntelId, setActiveIntelId] = useState<string>(INITIAL_INTEL[0].id);
  const [decryptionProgress, setDecryptionProgress] = useState<number>(0);
  const [scrollingHex, setScrollingHex] = useState<string>('');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  const selectedIntel = intelList.find(item => item.id === activeIntelId);

  // Scroll mock hex dump effect for active decrypting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedIntel?.status === 'decrypting') {
      interval = setInterval(() => {
        const hexChars = '0123456789ABCDEF ';
        let r = '';
        for (let i = 0; i < 48; i++) {
          r += hexChars[Math.floor(Math.random() * hexChars.length)];
        }
        setScrollingHex(r);
        setDecryptionProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // complete decryption
            setIntelList(prevList =>
              prevList.map(item =>
                item.id === selectedIntel.id
                  ? { ...item, status: 'decrypted' }
                  : item
              )
            );
            return 0;
          }
          return prev + 12; // speed of decrypting
        });
      }, 150);
    } else {
      setDecryptionProgress(0);
      setScrollingHex('');
    }
    return () => clearInterval(interval);
  }, [selectedIntel?.id, selectedIntel?.status]);

  const handleStartDecryption = (id: string) => {
    setIntelList(intelList.map(item =>
      item.id === id ? { ...item, status: 'decrypting' } : item
    ));
    setDecryptionProgress(0);
  };

  const handleResolveAction = (id: string, actionType: 'archive' | 'compromised' | 'actioned') => {
    setIntelList(intelList.map(item =>
      item.id === id
        ? {
            ...item,
            status: actionType === 'archive' ? 'archived' : actionType === 'compromised' ? 'compromised' : 'decrypted',
            notes: resolutionNotes || 'Operation sanitized and approved by Command Station.'
          }
        : item
    ));
    setResolutionNotes('');
  };

  return (
    <motion.div
      key="field-intel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col lg:flex-row h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/50 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative select-none"
    >
      {/* Visual cyber mesh background */}
      <div className="absolute inset-0 bg-[#020510] z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }} 
        />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4 pointer-events-none" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-950/20 rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Core Spy Terminal Header */}
        <header className="h-[64px] bg-transparent flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-white/5 relative">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl -z-10" />
          <div className="flex items-center gap-3">
            <Fingerprint className="w-5 h-5 text-rose-500 animate-pulse" />
            <h1 className="text-[13px] lg:text-[14px] font-bold tracking-widest text-zinc-100 uppercase flex items-center gap-2">
              FIELD INTEL SYSTEM <span className="text-zinc-700">|</span> <span className="text-zinc-400 font-mono text-[10px] lg:text-[11px] tracking-normal lowercase">class-a.net-intel</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400">Tactical Feed Active</span>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-rose-400">Class-1 Crypt</span>
            </div>
          </div>
        </header>

        {/* Workspace core */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10 w-full">
          
          {/* Left Summary list of Intel items */}
          <aside className="order-2 lg:order-none w-full lg:w-[320px] bg-slate-950/40 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-white/5 h-[220px] lg:h-full">
            <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center shrink-0">
              <h2 className="text-[11px] font-bold text-zinc-400 tracking-[0.2em] uppercase">Intelligence Inbox</h2>
              <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-indigo-500/20 font-mono">
                {intelList.filter(item => item.status === 'raw' || item.status === 'decrypting').length} pending
              </span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-2">
              {intelList.map(item => {
                const isActive = activeIntelId === item.id;
                const isRaw = item.status === 'raw';
                const isDecrypting = item.status === 'decrypting';
                const isDecrypted = item.status === 'decrypted';
                const isArchived = item.status === 'archived';
                const isCompromised = item.status === 'compromised';

                // Assign styles based on status
                let badgeStyle = 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
                if (isRaw) badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                if (isDecrypting) badgeStyle = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse';
                if (isDecrypted) badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (isArchived) badgeStyle = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                if (isCompromised) badgeStyle = 'bg-red-500/10 text-red-500 border-red-500/20';

                return (
                  <motion.div
                    key={item.id}
                    layoutId={`intel-item-${item.id}`}
                    onClick={() => setActiveIntelId(item.id)}
                    className={`p-3.5 rounded-2xl transition-all cursor-pointer border relative overflow-hidden group ${
                      isActive 
                        ? 'bg-white/10 border-white/20 shadow-inner' 
                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/5'
                    }`}
                  >
                    {/* Status side bar color band */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                      isRaw ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' :
                      isDecrypting ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' :
                      isDecrypted ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
                      isArchived ? 'bg-sky-500' : 'bg-red-600 shadow-[0_0_8px_#ef4444]'
                    }`} />

                    <div className="flex justify-between items-start mb-2 pl-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">{item.id}</span>
                      <span className={`text-[8.5px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md border ${badgeStyle}`}>
                        {item.status === 'raw' ? 'unresolved' : item.status}
                      </span>
                    </div>

                    <h4 className={`text-[12.5px] font-bold leading-tight pl-2 truncate ${
                      isActive ? 'text-white' : 'text-zinc-300'
                    }`}>
                      {item.subject}
                    </h4>

                    <div className="flex items-center justify-between mt-3 pl-2 text-[10px] text-zinc-500 font-mono">
                      <span>{item.codename}</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </aside>

          {/* Right Selected Intel Reading Pane */}
          <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 overflow-hidden">
            {selectedIntel ? (
              <motion.div
                key={selectedIntel.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 h-full w-full flex flex-col bg-[#05060b] border border-white/10 rounded-[24px] overflow-hidden shadow-2xl relative"
              >
                {/* Visual classification strip based on item clearance */}
                <div className={`absolute top-0 inset-x-0 h-1.5 ${
                  selectedIntel.classification === 'COSMIC TOP SECRET' ? 'bg-gradient-to-r from-red-600 via-rose-500 to-indigo-600' :
                  selectedIntel.classification === 'TOP SECRET' ? 'bg-rose-600' :
                  selectedIntel.classification === 'SECRET' ? 'bg-amber-600' : 'bg-zinc-600'
                }`} />

                {/* Intel Header details */}
                <div className="p-5 lg:p-6 border-b border-white/5 bg-black/30 shrink-0 relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2 lg:mb-3">
                      <span className="font-mono text-[11px] text-zinc-500 uppercase font-bold tracking-widest">{selectedIntel.id} // SEC-LVL:</span>
                      <span className={`text-[10px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded shadow ${
                        selectedIntel.classification === 'COSMIC TOP SECRET' ? 'bg-red-900/30 text-rose-300 border border-red-500/30' :
                        selectedIntel.classification === 'TOP SECRET' ? 'bg-rose-950/50 text-rose-400 border border-rose-500/20' :
                        selectedIntel.classification === 'SECRET' ? 'bg-amber-950/50 text-amber-400 border border-amber-500/20' : 'bg-black text-zinc-400 border border-zinc-700/50'
                      }`}>
                        {selectedIntel.classification}
                      </span>
                    </div>

                    <h2 className="text-md lg:text-xl font-bold text-white tracking-tight leading-snug">{selectedIntel.subject}</h2>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-[10.5px] font-mono text-zinc-400 tracking-wider">
                      <span>SOURCE: <span className="text-zinc-200 font-bold">{selectedIntel.source}</span></span>
                      <span>CODE: <span className="text-indigo-400 font-bold">{selectedIntel.codename}</span></span>
                      <span>LOC: <span className="text-emerald-400 font-bold">{selectedIntel.location}</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 select-text">
                    <span className="text-[10px] text-zinc-500 font-mono">RELIABILITY RATING</span>
                    <span className="text-[13px] font-bold text-indigo-300 font-mono tracking-wider">{selectedIntel.reliability}</span>
                  </div>
                </div>

                {/* Sub-body (Decryption controls or classified text display) */}
                <div className="p-5 lg:p-6 flex-1 flex flex-col relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 bg-slate-950/20">
                  {selectedIntel.status === 'raw' ? (
                    /* Lock state placeholder */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-rose-950/5 border border-rose-900/10 rounded-2xl">
                      <Lock className="w-12 h-12 text-rose-500/60 mb-3 animate-pulse" />
                      <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest">CYPHER ENCRYPTED INCOMING REPORT</h3>
                      <p className="text-zinc-500 text-[11px] max-w-md mt-1 font-mono tracking-wide leading-relaxed">
                        To guarantee safe air-tight transmission channels, this incoming field log has been cypherwrapped using {selectedIntel.classification === 'COSMIC TOP SECRET' ? 'AES-GCM-256' : 'AES-CBC-128'} hardware module routines.
                      </p>
                      
                      <div className="bg-black/40 border border-white/5 rounded-lg px-4 py-3 font-mono text-[10.5px] text-zinc-500 w-full max-w-sm mt-4 text-center select-all truncate">
                        SEC_CRYP_PAYLOAD: {selectedIntel.rawPayloadHex}...
                      </div>

                      <button
                        onClick={() => handleStartDecryption(selectedIntel.id)}
                        className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition cursor-pointer shadow-lg hover:shadow-indigo-500/20 uppercase tracking-widest"
                      >
                        <Unlock className="w-4 h-4" /> Initialize Cypher Decryption
                      </button>
                    </div>
                  ) : selectedIntel.status === 'decrypting' ? (
                    /* Decrypting scrolling effect */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-indigo-950/5 border border-indigo-500/10 rounded-2xl font-mono">
                      <RefreshCw className="w-12 h-12 text-indigo-400 mb-3 animate-spin" />
                      <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">Cryptographic Breakthrough in Progress</h3>
                      
                      <div className="w-full max-w-xs bg-white/5 h-1.5 rounded-full overflow-hidden my-3 border border-white/5">
                        <div className="bg-indigo-500 h-full transition-all duration-150" style={{ width: `${decryptionProgress}%` }} />
                      </div>
                      <span className="text-[10px] text-zinc-500 tracking-wider font-bold mb-4">{decryptionProgress}% DECRYPTED</span>

                      <div className="w-full max-w-sm bg-black/60 border border-indigo-500/20 rounded-lg p-3 text-[10.5px] text-indigo-300 select-all font-mono leading-none break-all text-center">
                        {scrollingHex || 'GENERATING_AES_KEYPASS_V_FEED...'}
                      </div>
                    </div>
                  ) : (
                    /* Decrypted standard rich text display */
                    <div className="flex-grow flex flex-col">
                      <div className="flex items-center gap-2 text-[10.5px] font-mono text-emerald-400 font-bold bg-emerald-950/20 px-3.5 py-2 rounded-xl border border-emerald-500/20 mb-4 self-start leading-none uppercase">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Decryption Verified Command Approved
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5 text-[12.5px] text-zinc-300 leading-relaxed font-mono relative shadow-inner">
                        <div className="absolute top-2.5 right-3 text-[8.5px] font-mono text-zinc-600 bg-black/60 px-2 py-0.5 rounded border border-white/5 leading-none uppercase">Verified Feed Output</div>
                        {selectedIntel.content}
                      </div>

                      {/* Display action logs / archives notes if preset */}
                      {selectedIntel.notes && (
                        <div className="bg-emerald-950/5 border border-emerald-500/10 rounded-xl p-4 mb-4 text-[11.5px] text-emerald-400 font-mono">
                          <span className="font-bold block mb-1 uppercase text-[10.5px]">Command Action Taken:</span>
                          "{selectedIntel.notes}"
                        </div>
                      )}

                      {/* Action Command Panel */}
                      {(selectedIntel.status === 'decrypted') && (
                        <div className="mt-auto pt-4 border-t border-white/5">
                          <label className="block text-[10.5px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                            Countermeasure & Directive Authorization
                          </label>

                          <div className="space-y-4">
                            <textarea
                              value={resolutionNotes}
                              onChange={(e) => setResolutionNotes(e.target.value)}
                              placeholder="Insert counter-contingency directives, sanitization notes, or operational signoffs..."
                              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[12px] font-mono text-zinc-300 resize-none focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500/50 min-h-[80px]"
                            />

                            <div className="flex flex-wrap justify-end gap-2">
                              <button
                                onClick={() => handleResolveAction(selectedIntel.id, 'compromised')}
                                className="px-4 py-2 text-[11px] font-bold text-rose-400 hover:text-white transition bg-rose-500/10 hover:bg-rose-600/30 rounded-lg border border-rose-500/20"
                              >
                                Flag Source Compromised
                              </button>
                              <button
                                onClick={() => handleResolveAction(selectedIntel.id, 'archive')}
                                className="px-4 py-2 text-[11px] font-bold text-sky-400 hover:text-white transition bg-sky-500/10 hover:bg-sky-600/30 rounded-lg border border-sky-500/20"
                              >
                                Sanitize & Archive Log
                              </button>
                              <button
                                onClick={() => handleResolveAction(selectedIntel.id, 'actioned')}
                                className="flex items-center gap-1.5 bg-indigo-600 border border-indigo-500/50 text-white hover:bg-indigo-500 px-5 py-2 rounded-lg text-[11px] font-bold transition shadow-md cursor-pointer"
                              >
                                <Send className="w-3 h-3" /> Authorize Field Intervention
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-zinc-600">
                <FolderOpen className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-[12px] uppercase tracking-widest font-bold font-mono text-zinc-500">Intel Feed Depleted</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </motion.div>
  );
}
