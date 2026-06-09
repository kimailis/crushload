import React, { useState } from 'react';
import { Database, ShieldAlert, Key, Globe, Plus, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function OffshoreAccountsWorkspace({ config }: { config: CareerConfig }) {
  const [accounts, setAccounts] = useState([
    { id: 'CAY-84920', jurisdiction: 'Cayman Islands', balance: '$4.2M', status: 'Clean', risk: 'Low' },
    { id: 'SUI-11024', jurisdiction: 'Switzerland', balance: '$12.5M', status: 'Flagged', risk: 'High' },
    { id: 'PAN-99421', jurisdiction: 'Panama', balance: '$1.8M', status: 'Clean', risk: 'Medium' },
    { id: 'BVI-44012', jurisdiction: 'British Virgin Islands', balance: '$8.4M', status: 'Processing', risk: 'Low' },
  ]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const requestNode = () => {
    setFeedback('Provisioning new untraceable proxy node across 3 jurisdictions...');
    setTimeout(() => {
      setAccounts(prev => [...prev, { id: 'BMU-' + Math.floor(Math.random() * 90000 + 10000), jurisdiction: 'Bermuda', balance: '$0', status: 'Processing', risk: 'Low' }]);
      setFeedback('New routing node established successfully.');
      setTimeout(() => setFeedback(null), 3000);
    }, 1500);
  };

  return (
    <motion.div key="accounts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-8">
      <div className="mb-2 flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            Global Routing Network
          </h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Encrypted Ledger Access</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {feedback && <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {feedback}</span>}
          <button onClick={requestNode} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg text-xs transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Routing Node
          </button>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden shadow-xl flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1a1a1a] border-b border-white/5 text-xs text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="p-4 px-6 font-medium">Account ID</th>
              <th className="p-4 font-medium">Jurisdiction</th>
              <th className="p-4 font-medium">Ledger Balance</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 text-right px-6 font-medium">Risk Layer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {accounts.map((acc, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition">
                <td className="p-4 px-6 font-bold text-indigo-300 flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-zinc-500" /> {acc.id}
                </td>
                <td className="p-4 text-zinc-400">{acc.jurisdiction}</td>
                <td className="p-4 font-bold text-white">{acc.balance}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    acc.status === 'Flagged' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                    acc.status === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {acc.status}
                  </span>
                </td>
                <td className="p-4 px-6 text-right">
                    <span className={`text-xs ${acc.risk === 'High' ? 'text-rose-400' : acc.risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>{acc.risk}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
