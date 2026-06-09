import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ShieldAlert, Wifi, Server, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface CliWorkspaceProps {
  careerId?: string;
}

export default function CliWorkspace({ careerId }: CliWorkspaceProps) {
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  
  // Custom states for Sysadmin commands
  const [firewallBlocked, setFirewallBlocked] = useState<string[]>(['192.168.10.45', '10.0.4.11']);
  const [sshSession, setSshSession] = useState<string | null>(null); // e.g. 'web-server', 'dc-01'
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Initialize welcome banner
    if (careerId === 'sysadmin') {
      setTerminalHistory([
        'IT Operations Core Console [v3.4.1-corp]',
        'System Status: READY | Connection: LOCALHOST_SECURE',
        '------------------------------------------------',
        'Type "help" to list sysadmin control commands.',
        'Type "ad show users" or "ad show groups" to audit directory.',
        'Type "firewall status" for routing rule stats.',
        'Type "ssh web-server" or "ssh dc-01" to manage endpoints.',
        '------------------------------------------------'
      ]);
      setLogs(['Established secure IT workspace.', 'Syncing LDAP directory schemas...']);
    } else {
      setTerminalHistory([
        'CLI Operations Core Online.',
        'Type "help" to list general commands.'
      ]);
    }
  }, [careerId]);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const executeCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    const prefix = sshSession 
      ? `admin@${sshSession}:~$` 
      : `sysadmin@corp-router:~$`;

    setTerminalHistory(prev => [...prev, `${prefix} ${cmd}`]);
    const lowerCmd = cmd.toLowerCase().split(/\s+/);
    const mainCommand = lowerCmd[0];

    // SSH session sub-command route
    if (sshSession) {
      if (cmd === 'exit') {
        setTerminalHistory(prev => [...prev, `Closing SSH session to ${sshSession}...`, 'Returned to local console.']);
        setSshSession(null);
      } else if (mainCommand === 'help') {
        setTerminalHistory(prev => [
          ...prev, 
          `Host: ${sshSession} available command options:`,
          ' - ls          : List current files/configs',
          ' - cat <file>  : Output diagnostic logs',
          ' - restart     : Initiate software server restart',
          ' - exit        : Detach SSH console'
        ]);
      } else if (mainCommand === 'ls') {
        if (sshSession === 'web-server') {
          setTerminalHistory(prev => [...prev, 'drwxr-xr-x  nginx-configs', '-rw-r--r--  index.html', '-rw-r--r--  error.log']);
        } else if (sshSession === 'dc-01') {
          setTerminalHistory(prev => [...prev, 'drwxr-xr-x  ldap-schemas', '-rw-r--r--  sysvol.conf', '-rw-r--r--  audit.log']);
        } else {
          setTerminalHistory(prev => [...prev, 'drwxr-xr-x  root', '-rw-r--r--  service.conf']);
        }
      } else if (mainCommand === 'cat') {
        const file = lowerCmd[1];
        if (!file) {
          setTerminalHistory(prev => [...prev, 'Usage: cat <filename>']);
        } else if (file === 'error.log' && sshSession === 'web-server') {
          setTerminalHistory(prev => [...prev, '2026-06-09 12:45:01 [error] 1412#0: *25 limit_req filter triggered, client: 192.168.1.18']);
        } else if (file === 'sysvol.conf' && sshSession === 'dc-01') {
          setTerminalHistory(prev => [...prev, '[domain]\nname=corp.local\nsecurity=ADS\nenforce_mfa=true\nldaps=enforced']);
        } else {
          setTerminalHistory(prev => [...prev, `Reading target ${file}... file content empty.`]);
        }
      } else if (mainCommand === 'restart') {
        setTerminalHistory(prev => [...prev, `[system] Restarting services on remote host ${sshSession}...`, 'Waiting 1s...', `[success] Service stack active on ${sshSession}.`]);
      } else {
        setTerminalHistory(prev => [...prev, `bash: ${cmd}: command not supported on remote endpoint ${sshSession}. Type "help".`]);
      }

      setTerminalInput('');
      return;
    }

    // LOCAL SYSADMIN COMMAND ROUTING
    if (cmd === 'clear') {
      setTerminalHistory(['Console buffer cleared.']);
    } else if (mainCommand === 'help') {
      if (careerId === 'sysadmin') {
        setTerminalHistory(prev => [
          ...prev,
          '========================================',
          'Active Directory (AD) Commands:',
          ' - ad show users              : Lists directory accounts',
          ' - ad show groups             : Lists security groups',
          ' - ad create user <name> <grp>: Create domain account',
          ' - ad create group <name>     : Create group',
          ' - ad policy list             : List active GPOs',
          '----------------------------------------',
          'Basic Firewall Commands:',
          ' - firewall status            : Lists active safety blockages',
          ' - firewall block <ip>        : Prevent routing packets from IP',
          ' - firewall allow <ip>        : Lift block routing from IP',
          '----------------------------------------',
          'SSH connection utilities:',
          ' - ssh web-server             : Main nginx landing server',
          ' - ssh dc-01                  : Primary LDAP controller',
          '----------------------------------------',
          'Standard: "clear", "ping <host>"',
          '========================================'
        ]);
      } else {
        setTerminalHistory(prev => [
          ...prev,
          'Available shell tools:',
          ' - ls - List layout files',
          ' - ping [host] - Ping connection host endpoint',
          ' - top - View system processes',
          ' - clear - Flush terminal lines'
        ]);
      }
    } else if (mainCommand === 'ls') {
      setTerminalHistory(prev => [
        ...prev, 
        'drwxr-xr-x config', 
        'drwxr-xr-x sbin_apps', 
        '-rw-r--r-- ldap_heartbeat.log', 
        '-rwx------ config_routing_table.sh'
      ]);
    } else if (mainCommand === 'ping') {
      const target = lowerCmd[1] || '127.0.0.1';
      setTerminalHistory(prev => [
        ...prev, 
        `PING ${target} (127.0.0.1): 56 data bytes`,
        `64 bytes from ${target}: icmp_seq=0 ttl=64 time=0.035 ms`,
        `64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.042 ms`
      ]);
    } else if (mainCommand === 'top') {
      setTerminalHistory(prev => [
        ...prev,
        'PID   USER     PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
        '  1   root     20   0   45.2m   8.2m   4.1m S   1.8   0.4   0:02.12 node_system',
        '218   admin    20   0  180.5m  22.1m  12.5m S   0.8   1.1   0:05.45 sys-router',
        '552   ldap     20   0   12.1m   3.2m   2.1m S   0.2   0.2   0:00.18 domains_daemon'
      ]);
    }

    // Active Directory Engine (Parser)
    else if (mainCommand === 'ad') {
      const act = lowerCmd[1];
      const category = lowerCmd[2];

      const localUsers = JSON.parse(localStorage.getItem('ad_sim_users') || '[]');
      const localGroups = JSON.parse(localStorage.getItem('ad_sim_groups') || '[]');
      const localGpos = JSON.parse(localStorage.getItem('ad_sim_gpos') || '[]');

      if (act === 'show' || act === 'list') {
        if (category === 'users') {
          setTerminalHistory(prev => [
            ...prev,
            'NAME           GROUP             ROLE',
            '----           -----             ----',
            ...localUsers.map((u: any) => `${u.name.padEnd(14)} ${u.group.padEnd(17)} ${(u.role || '')}`)
          ]);
        } else if (category === 'groups') {
          setTerminalHistory(prev => [
            ...prev,
            'ACTIVE DIRECTORY SECURITY GROUPS:',
            '---------------------------------',
            ...localGroups.map((g: string) => ` - ${g}`)
          ]);
        } else if (category === 'policy' || category === 'gpos' || category === 'policies') {
          setTerminalHistory(prev => [
            ...prev,
            'GPO NAME                       ENFORCED',
            '--------                       --------',
            ...localGpos.map((g: any) => `${g.name.padEnd(30)} ${g.enforced ? 'TRUE' : 'FALSE'}`)
          ]);
        } else {
          setTerminalHistory(prev => [...prev, 'Audit subcategory missing. Choose "ad show users", "ad show groups" or "ad show policy".']);
        }
      } else if (act === 'create' || act === 'add') {
        const itemType = lowerCmd[2];
        const itemName = lowerCmd[3];

        if (itemType === 'user' && itemName) {
          const group = lowerCmd[4] || 'Operations';
          const newUser = { name: itemName.toLowerCase(), group, role: 'Staff Deployed via Shell', active: true };
          const updated = [...localUsers, newUser];
          localStorage.setItem('ad_sim_users', JSON.stringify(updated));
          setTerminalHistory(prev => [...prev, `SUCCESS: Account [${itemName}] added to AD under ${group}.`]);
        } else if (itemType === 'group' && itemName) {
          const updated = [...localGroups, itemName];
          localStorage.setItem('ad_sim_groups', JSON.stringify(updated));
          setTerminalHistory(prev => [...prev, `SUCCESS: Security Group [${itemName}] appended to ldap schema.`]);
        } else {
          setTerminalHistory(prev => [...prev, 'Parameters invalid. Format: ad create user <username> <group>']);
        }
      } else if (act === 'policy' || act === 'gpos') {
        setTerminalHistory(prev => [
          ...prev,
          'GPO NAME                       ENFORCED',
          '--------                       --------',
          ...localGpos.map((g: any) => `${g.name.padEnd(30)} ${g.enforced ? 'TRUE' : 'FALSE'}`)
        ]);
      } else {
        setTerminalHistory(prev => [...prev, 'Command invalid. Type "help" for AD examples.']);
      }
    }

    // Firewall commands
    else if (mainCommand === 'firewall') {
      const sub = lowerCmd[1];
      const ip = lowerCmd[2];

      if (sub === 'status') {
        setTerminalHistory(prev => [
          ...prev,
          'FIREWALL FILTER TABLE STATUS:',
          'Interface in_WAN incoming packet blocker:',
          '----------------------------------------',
          ...firewallBlocked.map(rule => ` - BLOCK INBOUND FROM IP: ${rule}`),
          '----------------------------------------',
          'Policy: DROP ALL other unauthorized SSH routing connections.'
        ]);
      } else if (sub === 'block' && ip) {
        if (firewallBlocked.includes(ip)) {
          setTerminalHistory(prev => [...prev, `Rule already active: IP ${ip} is blocked.`]);
        } else {
          setFirewallBlocked(prev => [...prev, ip]);
          setTerminalHistory(prev => [...prev, `SUCCESS: Packets from [${ip}] are now DROPPED by firewall.`]);
        }
      } else if (sub === 'allow' && ip) {
        setFirewallBlocked(prev => prev.filter(item => item !== ip));
        setTerminalHistory(prev => [...prev, `SUCCESS: Cleared firewall blockage rule for IP [${ip}].`]);
      } else {
        setTerminalHistory(prev => [...prev, 'Syntax: "firewall status", "firewall block <ip>", "firewall allow <ip>"']);
      }
    }

    // SSH connects
    else if (mainCommand === 'ssh') {
      const target = lowerCmd[1];
      if (!target) {
        setTerminalHistory(prev => [...prev, 'Usage: ssh <server_name> (e.g., ssh web-server, ssh dc-01)']);
      } else if (['web-server', 'dc-01'].includes(target)) {
        setTerminalHistory(prev => [
          ...prev, 
          `Establishing encrypted SSH handshakes on 10.0.12.55...`, 
          'RSA certificate valid.', 
          `Connected to remote endpoint: ${target}.`,
          `Type "help" inside remote stream to query options.`
        ]);
        setSshSession(target);
      } else {
        setTerminalHistory(prev => [...prev, `ssh: Connection timed out. Host ${target} unreachable over local routing table.`]);
      }
    }

    // Catch all
    else {
      setTerminalHistory(prev => [...prev, `bash: ${cmd}: command not recognized. Type "help" to see available commands.`]);
    }

    setTerminalInput('');
  };

  return (
    <motion.div key="cli" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-5xl mx-auto overflow-hidden bg-[#02050b]/90 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="h-10 bg-[#0e111a] border-b border-white/5 flex items-center px-4 gap-2 shrink-0 justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-zinc-400" />
          <span className="text-[11px] font-mono text-zinc-400 tracking-wider font-bold">
            {sshSession ? `SSH: admin@${sshSession}` : 'SYSADMIN TERMINAL INTERFACE - LOCAL'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#ffaa00]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM SECURE
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 font-mono text-[13px] text-emerald-400 leading-relaxed scrollbar-thin scrollbar-thumb-white/10 select-text">
        {terminalHistory.map((item, idx) => (
          <div key={idx} className="whitespace-pre-wrap mb-1">{item || ' '}</div>
        ))}
        <div ref={terminalBottomRef} />
      </div>
      
      <form onSubmit={executeCommand} className="w-full bg-[#05070f] p-3 flex items-center gap-2 border-t border-white/5 shrink-0 focus-within:ring-1 focus-within:ring-white/15">
        <span className="text-emerald-500 font-mono font-bold pl-2 truncate shrink-0">
          {sshSession ? `admin@${sshSession}:~$` : 'sysadmin@corp-router:~$'}
        </span>
        <input 
          type="text" 
          value={terminalInput} 
          onChange={e => setTerminalInput(e.target.value)} 
          autoFocus 
          className="flex-grow bg-transparent text-zinc-300 font-mono text-[15px] lg:text-[13px] outline-none placeholder-zinc-700 ml-1 rounded-none outline-transparent border-none p-0 focus:ring-0 focus:outline-none" 
        />
      </form>
    </motion.div>
  );
}
