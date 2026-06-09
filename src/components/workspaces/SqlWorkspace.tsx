import React, { useState } from 'react';
import { Database, Play, History, Table, Search, AlertCircle, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

type MockDb = Record<string, { cols: string[], rows: any[][] }>;

// Highly detailed simulated corporate database tables
const ANALYST_DB: MockDb = {
  employees: {
    cols: ['emp_id', 'full_name', 'department', 'salary_usd', 'hire_date'],
    rows: [
      [101, 'Jane Carter', 'Data Engineering', 115000, '2023-01-15'],
      [102, 'David Vance', 'Finance & Treasury', 125000, '2022-09-10'],
      [103, 'Elena Petrova', 'Risk Management', 108000, '2024-03-01'],
      [104, 'Marcus Aurelius', 'Operations', 92000, '2023-11-20'],
      [105, 'Amira El-Sayed', 'Executive Group', 210000, '2021-05-18'],
      [106, 'Lucas Thorne', 'Information Security', 135000, '2022-10-05']
    ]
  },
  sales_performance: {
    cols: ['quarter', 'sales_rep', 'contracts_closed', 'total_revenue_usd', 'retention_rate'],
    rows: [
      ['2026-Q1', 'Jane Carter', 12, 450000, '98%'],
      ['2026-Q1', 'David Vance', 8, 310000, '95%'],
      ['2026-Q1', 'Sarah Jenkins', 18, 620000, '100%'],
      ['2026-Q2', 'Jane Carter', 15, 590000, '99%'],
      ['2026-Q2', 'David Vance', 11, 410000, '96%'],
      ['2026-Q2', 'Sarah Jenkins', 22, 780000, '97%']
    ]
  },
  server_status: {
    cols: ['server_id', 'hostname', 'region', 'uptime_percent', 'cpu_load_percent', 'status'],
    rows: [
      ['srv-db-01', 'db-master.corp.local', 'us-east-1', 99.99, 45, 'ONLINE'],
      ['srv-web-01', 'web-front-a.corp.local', 'us-east-1', 99.95, 78, 'HEAVY_LOAD'],
      ['srv-web-02', 'web-front-b.corp.local', 'eu-west-1', 99.98, 24, 'ONLINE'],
      ['srv-vpn-01', 'secure-gateway.corp.local', 'us-west-2', 99.85, 12, 'ONLINE'],
      ['srv-ad-01', 'domain-controller.corp.local', 'us-east-1', 100.00, 31, 'ONLINE']
    ]
  },
  security_policy: {
    cols: ['policy_id', 'policy_name', 'scope', 'enforced_status', 'severity_level'],
    rows: [
      ['GP-MFA-01', 'Enforce Biometric MFA', 'All Employees', 'ENFORCED', 'CRITICAL'],
      ['GP-FW-05', 'Restrict Non-VPN SSH Access', 'Internal Network', 'ENFORCED', 'HIGH'],
      ['GP-DATA-10', 'Encrypted TLS 1.3 Routing', 'All DB Streams', 'ENFORCED', 'HIGH'],
      ['GP-USB-03', 'Block External Storage Drives', 'All Endpoints', 'PARTIAL', 'MEDIUM']
    ]
  }
};

const ENGINEER_DB: MockDb = {
  pipeline_runs: {
    cols: ['run_id', 'dag_name', 'started_at', 'duration_min', 'state'],
    rows: [
      ['run-8841', 'production_revenue_pipeline_v3', '2026-06-09 02:00', 42, 'FAILED'],
      ['run-8840', 'customer_events_hourly', '2026-06-09 01:00', 8, 'SUCCESS'],
      ['run-8839', 'ml_feature_refresh', '2026-06-09 00:30', 95, 'SUCCESS'],
      ['run-8838', 'production_revenue_pipeline_v3', '2026-06-08 02:00', 38, 'SUCCESS'],
      ['run-8837', 'gdpr_deletion_sweep', '2026-06-08 01:15', 12, 'SUCCESS']
    ]
  },
  dag_tasks: {
    cols: ['task_id', 'dag_name', 'retries', 'avg_runtime_sec', 'last_state'],
    rows: [
      ['extract_sales_db', 'production_revenue_pipeline_v3', 0, 180, 'SUCCESS'],
      ['extract_web_logs', 'production_revenue_pipeline_v3', 1, 240, 'SUCCESS'],
      ['transform_coalesce', 'production_revenue_pipeline_v3', 0, 310, 'SUCCESS'],
      ['join_events_db', 'production_revenue_pipeline_v3', 3, 520, 'FAILED'],
      ['load_analytics_dw', 'production_revenue_pipeline_v3', 0, 95, 'SKIPPED']
    ]
  },
  kafka_topics: {
    cols: ['topic', 'partitions', 'lag', 'throughput_mb_s', 'status'],
    rows: [
      ['user.events.raw', 24, 1250, 18.4, 'BACKPRESSURE'],
      ['orders.transactions', 12, 0, 6.2, 'HEALTHY'],
      ['logs.application', 48, 320, 41.0, 'HEALTHY'],
      ['ml.features.stream', 6, 8900, 2.1, 'LAGGING']
    ]
  },
  warehouse_costs: {
    cols: ['warehouse', 'credits_used', 'queries_run', 'avg_query_sec', 'owner_team'],
    rows: [
      ['ANALYTICS_XL', 4200, 18211, 14.2, 'Data Analytics'],
      ['ETL_LOADER', 2800, 902, 96.5, 'Data Engineering'],
      ['DS_SANDBOX', 6100, 4421, 44.8, 'Data Science'],
      ['FINANCE_RPT', 450, 1200, 8.1, 'Finance']
    ]
  }
};

const DB_BY_CAREER: Record<string, MockDb> = {
  'data-engineer': ENGINEER_DB
};

const ANALYST_QUERIES = [
  { label: 'Get all employees', sql: 'SELECT * FROM employees;' },
  { label: 'View sales performance Q2', sql: "SELECT * FROM sales_performance WHERE quarter = '2026-Q2';" },
  { label: 'High load servers (>50% CPU)', sql: 'SELECT hostname, cpu_load_percent, status FROM server_status WHERE cpu_load_percent > 50;' },
  { label: 'Critical security policies', sql: "SELECT * FROM security_policy WHERE severity_level = 'CRITICAL';" },
];

const ENGINEER_QUERIES = [
  { label: 'Failed pipeline runs', sql: "SELECT * FROM pipeline_runs WHERE state = 'FAILED';" },
  { label: 'Flaky tasks (retries > 0)', sql: 'SELECT * FROM dag_tasks WHERE retries > 0;' },
  { label: 'Lagging Kafka topics', sql: 'SELECT topic, lag, status FROM kafka_topics WHERE lag > 500;' },
  { label: 'Warehouse spend by team', sql: 'SELECT warehouse, credits_used, owner_team FROM warehouse_costs;' },
];

const QUERIES_BY_CAREER: Record<string, typeof ANALYST_QUERIES> = {
  'data-engineer': ENGINEER_QUERIES
};

// Tiny SQL evaluator: supports SELECT <cols|*> FROM <table> [WHERE col <op> value]
function runQuery(db: MockDb, rawQuery: string): { cols: string[], rows: any[][] } {
  const cleaned = rawQuery.trim().replace(/;$/, '').toLowerCase();
  const tableName = Object.keys(db).find(tbl => cleaned.includes(`from ${tbl}`));
  if (!tableName) {
    throw new Error('Relation "' + (cleaned.split(/from\s+/)[1]?.split(/\s/)[0] || '?') + '" does not exist. Check table schemas listed on left panel.');
  }

  const table = db[tableName];
  let cols = [...table.cols];
  let rows = table.rows.map(r => [...r]);

  const whereMatch = cleaned.match(/where\s+(\w+)\s*(=|!=|>=|<=|>|<)\s*'?"?([^'"]+?)'?"?\s*$/);
  if (whereMatch) {
    const [, col, op, rawVal] = whereMatch;
    const colIdx = table.cols.findIndex(c => c.toLowerCase() === col);
    if (colIdx === -1) throw new Error(`Column "${col}" does not exist on ${tableName}.`);
    const val = rawVal.trim();
    const numVal = Number(val);
    rows = rows.filter(r => {
      const cell = r[colIdx];
      if (typeof cell === 'number' && !Number.isNaN(numVal)) {
        switch (op) {
          case '=': return cell === numVal;
          case '!=': return cell !== numVal;
          case '>': return cell > numVal;
          case '<': return cell < numVal;
          case '>=': return cell >= numVal;
          case '<=': return cell <= numVal;
        }
      }
      const cellStr = String(cell).toLowerCase();
      return op === '!=' ? cellStr !== val : cellStr === val;
    });
  }

  const selectMatch = cleaned.match(/select\s+(.+?)\s+from/);
  if (selectMatch && selectMatch[1].trim() !== '*') {
    const wanted = selectMatch[1].split(',').map(c => c.trim());
    const indices = wanted.map(w => table.cols.findIndex(c => c.toLowerCase() === w));
    if (indices.some(i => i === -1)) {
      throw new Error(`Unknown column in SELECT list. Available: ${table.cols.join(', ')}.`);
    }
    cols = indices.map(i => table.cols[i]);
    rows = rows.map(r => indices.map(i => r[i]));
  }

  return { cols, rows };
}

export default function SqlWorkspace({ careerId }: { careerId?: string }) {
  const MOCK_DB = DB_BY_CAREER[careerId || ''] || ANALYST_DB;
  const SAMPLE_QUERIES = QUERIES_BY_CAREER[careerId || ''] || ANALYST_QUERIES;
  const firstTable = Object.keys(MOCK_DB)[0];

  const [query, setQuery] = useState(`SELECT * FROM ${firstTable};`);
  const [selectedTable, setSelectedTable] = useState<string>(firstTable);
  const [history, setHistory] = useState<string[]>([`SELECT * FROM ${firstTable};`]);
  const [results, setResults] = useState<{ cols: string[], rows: any[][] }>({
    cols: MOCK_DB[firstTable].cols,
    rows: MOCK_DB[firstTable].rows
  });
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleTableClick = (tableName: string) => {
    setSelectedTable(tableName);
    const sql = `SELECT * FROM ${tableName};`;
    setQuery(sql);
    setErrorStatus(null);
    setResults({
      cols: MOCK_DB[tableName].cols,
      rows: MOCK_DB[tableName].rows
    });
  };

  const executeQuery = () => {
    setErrorStatus(null);
    if (!history.includes(query)) {
      setHistory(prev => [query, ...prev].slice(0, 10));
    }
    try {
      setResults(runQuery(MOCK_DB, query));
    } catch (e: any) {
      setErrorStatus(e.message || 'Syntax error near line 1.');
    }
  };

  return (
    <motion.div key="sql" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/40 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="absolute inset-0 bg-[#060814]/70 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Editor Shell Header */}
        <header className="h-[60px] bg-black/20 flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-white/5 relative">
          <div className="flex items-center gap-3">
            <h1 className="text-[13px] sm:text-[14px] font-bold tracking-widest text-[#ffcc00] uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              SQL Execution Bench <span className="text-zinc-600">|</span> <span className="text-zinc-500 font-mono text-[11px]">corp-postgresql-primary</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={executeQuery} className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 text-white px-4 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-2 transition shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer">
                <Play className="w-3.5 h-3.5 fill-white text-white" /> RUN
             </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
          {/* Left Schemas Sidebar */}
          <aside className="order-3 lg:order-none w-full lg:w-[240px] bg-slate-950/40 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-white/5 overflow-y-auto p-4 gap-4 scrollbar-thin scrollbar-thumb-white/10">
            <div>
              <h2 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] mb-3 uppercase flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5" /> Corporate Tables
              </h2>
              <div className="space-y-1">
                {Object.keys(MOCK_DB).map(tbl => (
                  <button 
                    key={tbl}
                    onClick={() => handleTableClick(tbl)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition text-[12px] font-medium outline-none border ${
                      selectedTable === tbl 
                        ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300' 
                        : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{tbl}</span>
                    <span className="text-[10px] font-mono opacity-40">({MOCK_DB[tbl].rows.length}r)</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] mb-3 uppercase">Presets</h2>
              <div className="space-y-1">
                {SAMPLE_QUERIES.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setQuery(q.sql);
                      setErrorStatus(null);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-zinc-300 transition block truncate"
                    title={q.sql}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] mb-2 uppercase flex items-center gap-1"><History className="w-3 h-3" /> History</h2>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={i} className="text-[9px] font-mono text-zinc-600 truncate px-1 py-0.5" title={h}>{h}</div>
                ))}
              </div>
            </div>
          </aside>

          {/* Central Workspace */}
          <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 overflow-hidden relative z-10 gap-4">
             {/* Edit Code Terminal */}
             <div className="flex-[0.5] min-h-[160px] w-full flex flex-col bg-black/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="h-8 bg-black/40 border-b border-white/5 flex items-center px-4 gap-2 shrink-0 justify-between">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-widest uppercase flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-indigo-400" /> PostgreSQL Editor</span>
                  <span className="text-[10px] text-emerald-500/80 font-mono">Status: Connected</span>
                </div>
                <textarea 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-grow bg-transparent text-indigo-300 font-mono text-[13px] md:text-[14px] p-4 outline-none resize-none leading-relaxed scrollbar-thin scrollbar-thumb-white/10"
                  spellCheck={false}
                />
             </div>

             {/* Error Notification */}
             {errorStatus && (
               <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-2.5 text-[12px] font-mono">
                 <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                 <span>ERROR: {errorStatus}</span>
               </div>
             )}

             {/* Results Grid Table */}
             <div className="flex-grow min-h-[220px] w-full flex flex-col bg-[#02050c]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="h-8 bg-black/20 border-b border-white/5 flex items-center px-4 gap-2 shrink-0 justify-between">
                  <div className="flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase">Returned Rows</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-600">{results.rows.length} rows returned</span>
                </div>
                
                <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
                  {results.rows.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-[11px] uppercase tracking-wider font-mono gap-1.5">
                       <FileSpreadsheet className="w-6 h-6 opacity-40 text-zinc-500" /> No Rows Returned
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse font-sans">
                      <thead>
                        <tr>
                          {results.cols.map((c, i) => (
                            <th key={i} className="py-2 px-3 border-b border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-indigo-500/5 transition-colors group border-b border-white/5">
                            {row.map((cell, j) => (
                              <td key={j} className="py-2 px-3 text-[12px] font-mono text-zinc-300 font-medium group-hover:text-white transition">
                                {typeof cell === 'number' && results.cols[j].includes('usd') ? `$${cell.toLocaleString()}` : String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
             </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
