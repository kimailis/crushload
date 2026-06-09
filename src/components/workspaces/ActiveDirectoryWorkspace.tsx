import React, { useState, useEffect } from 'react';
import { Users, User, ShieldAlert, Key, FolderGit2, Plus, Trash2, Server, ArrowRight, Settings2 } from 'lucide-react';
import { motion } from 'motion/react';

// Help desk / IT Sysadmin default records
const DEFAULT_USERS = [
  { name: 'jane_dev', group: 'Domain Admins', role: 'Data Architect', active: true },
  { name: 'david_finance', group: 'Finance', role: 'Treasury Analyst', active: true },
  { name: 'elena_risk', group: 'Risk Management', role: 'Risk Auditor', active: true },
  { name: 'marcus_ops', group: 'Operations', role: 'Site Lead', active: true },
  { name: 'guest_wifi_10', group: 'Guests', role: 'Visitor Account', active: false }
];

const DEFAULT_GROUPS = ['Domain Admins', 'Finance', 'Risk Management', 'Operations', 'Guests'];

const DEFAULT_GPOS = [
  { id: 'gpo-1', name: 'Secure SMB Encryption', enforced: true },
  { id: 'gpo-2', name: 'Corporate MFA Policy', enforced: true },
  { id: 'gpo-3', name: 'Disable External USB Drives', enforced: true },
  { id: 'gpo-4', name: 'Block Torrenting Ports', enforced: false }
];

export default function ActiveDirectoryWorkspace() {
  const [users, setUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [gpos, setGpos] = useState<any[]>([]);
  
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserGroup, setNewUserGroup] = useState('Operations');
  
  const [newGroupName, setNewGroupName] = useState('');

  // Load state from localStorage if exists, else load defaults
  useEffect(() => {
    const savedUsers = localStorage.getItem('ad_sim_users');
    const savedGroups = localStorage.getItem('ad_sim_groups');
    const savedGpos = localStorage.getItem('ad_sim_gpos');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    else {
      setUsers(DEFAULT_USERS);
      localStorage.setItem('ad_sim_users', JSON.stringify(DEFAULT_USERS));
    }

    if (savedGroups) setGroups(JSON.parse(savedGroups));
    else {
      setGroups(DEFAULT_GROUPS);
      localStorage.setItem('ad_sim_groups', JSON.stringify(DEFAULT_GROUPS));
    }

    if (savedGpos) setGpos(JSON.parse(savedGpos));
    else {
      setGpos(DEFAULT_GPOS);
      localStorage.setItem('ad_sim_gpos', JSON.stringify(DEFAULT_GPOS));
    }
  }, []);

  const saveUsersState = (updated: any[]) => {
    setUsers(updated);
    localStorage.setItem('ad_sim_users', JSON.stringify(updated));
  };

  const saveGroupsState = (updated: string[]) => {
    setGroups(updated);
    localStorage.setItem('ad_sim_groups', JSON.stringify(updated));
  };

  const saveGposState = (updated: any[]) => {
    setGpos(updated);
    localStorage.setItem('ad_sim_gpos', JSON.stringify(updated));
  };

  // Add User handler
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    const name = newUserName.trim().toLowerCase().replace(/\s+/g, '_');
    const role = newUserRole.trim() || 'Staff Associate';
    
    const updated = [...users, { name, group: newUserGroup, role, active: true }];
    saveUsersState(updated);
    
    setNewUserName('');
    setNewUserRole('');
  };

  // Delete User handler
  const handleDeleteUser = (name: string) => {
    const updated = users.filter(u => u.name !== name);
    saveUsersState(updated);
  };

  // Add Group handler
  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const gName = newGroupName.trim();
    if (groups.includes(gName)) return;

    const updated = [...groups, gName];
    saveGroupsState(updated);
    setNewGroupName('');
  };

  // Delete Group handler
  const handleDeleteGroup = (gName: string) => {
    if (['Domain Admins', 'Guests'].includes(gName)) return; // protected groups
    const updated = groups.filter(g => g !== gName);
    saveGroupsState(updated);
  };

  // Toggle GPO enforcement
  const handleToggleGpo = (gpoId: string) => {
    const updated = gpos.map(g => g.id === gpoId ? { ...g, enforced: !g.enforced } : g);
    saveGposState(updated);
  };

  return (
    <motion.div key="ad" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/40 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="absolute inset-0 bg-[#02050e]/65 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Workspace header */}
        <header className="h-[60px] bg-black/20 flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-white/5 relative">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-indigo-400" />
            <h1 className="text-[13px] sm:text-[14px] font-bold tracking-widest text-zinc-300 uppercase flex items-center gap-2">
              Active Directory Manager <span className="text-zinc-600">|</span> <span className="text-zinc-500 font-mono text-[11px] uppercase">corp.local</span>
            </h1>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">LDAP / IT Engine Live</span>
        </header>

        {/* Workspace columns */}
        <main className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5 overflow-hidden">
          
          {/* Column 1: Groups (Width: 25%) */}
          <section className="flex-[0.8] flex flex-col min-w-0 h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 gap-4">
             <div>
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                   <FolderGit2 className="w-3.5 h-3.5" /> Security Groups
                </h3>
                
                <div className="space-y-2">
                   {groups.map((g, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 px-3 py-2 rounded-xl">
                         <span className="text-[12px] font-mono font-bold text-zinc-300">{g}</span>
                         {!['Domain Admins', 'Guests'].includes(g) && (
                           <button onClick={() => handleDeleteGroup(g)} className="text-zinc-500 hover:text-rose-400 p-1 rounded transition">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         )}
                      </div>
                   ))}
                </div>
             </div>

             <form onSubmit={handleAddGroup} className="mt-auto border-t border-white/5 pt-4">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Create New Group</h4>
                <div className="flex gap-2">
                   <input 
                     value={newGroupName}
                     onChange={e => setNewGroupName(e.target.value)}
                     placeholder="Finance Audit" 
                     className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-zinc-300"
                   />
                   <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 p-2 rounded-lg text-white font-bold transition">
                     <Plus className="w-4 h-4" />
                   </button>
                </div>
             </form>
          </section>

          {/* Column 2: Users (Width: 45%) */}
          <section className="flex-1.2 flex flex-col min-w-0 h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 gap-4">
             <div className="flex justify-between items-center mb-1">
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                   <User className="w-3.5 h-3.5" /> Domain Accounts
                </h3>
                <span className="text-[10px] font-mono text-zinc-600 font-bold">{users.length} Active Accounts</span>
             </div>

             <div className="flex-1 space-y-2 overflow-y-auto max-h-[340px] pr-1">
                {users.map((u, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 shadow-sm hover:bg-white/10 transition">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] ${
                           u.group === 'Domain Admins' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'
                         }`}>
                           {u.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                            <p className="text-[13px] font-mono font-bold text-zinc-200">{u.name}</p>
                            <span className="text-[10px] text-zinc-500 font-mono tracking-wide">{u.role}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                           u.group === 'Domain Admins' ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/10 text-indigo-300'
                         }`}>
                           {u.group}
                         </span>
                         <button onClick={() => handleDeleteUser(u.name)} className="text-zinc-500 hover:text-rose-400 p-1 rounded transition">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>

             <form onSubmit={handleAddUser} className="border-t border-white/5 pt-4 mt-auto grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-3">
                   <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Deploy Domain Account</h4>
                </div>
                <input 
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="e.g. jason_it" 
                  className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-zinc-300"
                />
                <input 
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  placeholder="Role: IT Support" 
                  className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-zinc-300"
                />
                <select 
                  value={newUserGroup}
                  onChange={e => setNewUserGroup(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-zinc-400"
                >
                  {groups.map((g, idx) => (
                    <option key={idx} value={g} className="bg-zinc-950 text-zinc-300">{g}</option>
                  ))}
                </select>
                <div className="sm:col-span-3">
                   <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 text-white font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase">
                      <Plus className="w-4 h-4" /> Add Users to corp.local
                   </button>
                </div>
             </form>
          </section>

          {/* Column 3: GPO (Width: 30%) */}
          <section className="flex-[0.9] flex flex-col min-w-0 h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 gap-4">
             <div>
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                   <Settings2 className="w-3.5 h-3.5" /> Group Policies (GPOs)
                </h3>
                
                <div className="space-y-2">
                   {gpos.map((gpo) => (
                      <div key={gpo.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-2.5">
                         <div className="flex justify-between items-start">
                            <span className="text-[12px] font-bold text-zinc-200 tracking-wide">{gpo.name}</span>
                            <span className={`w-2 h-2 rounded-full ${gpo.enforced ? 'bg-emerald-400 glow bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-zinc-600'}`} />
                         </div>
                         <div className="flex justify-between items-center text-[10px]">
                            <span className="text-zinc-500 font-mono">Scope: Domain-Wide</span>
                            <button 
                              onClick={() => handleToggleGpo(gpo.id)}
                              className={`px-2 py-1 rounded-md font-mono font-bold transition ${
                                gpo.enforced ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/30' : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/30'
                              }`}
                            >
                               {gpo.enforced ? 'DEACTIVATE' : 'ENFORCE'}
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="mt-auto bg-indigo-505/10 bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20 flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">IT Policy Note</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                   Enforcing Group Policy Objects (GPOs) pushes configuration locks to all joined domain endpoints instantly via simulated LDAP heartbeat.
                </p>
             </div>
          </section>

        </main>
      </div>
    </motion.div>
  );
}
