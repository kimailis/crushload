import React, { useState, useRef, useMemo } from 'react';
import { Database, Play, History, Table, AlertCircle, FileSpreadsheet, ChevronRight, ChevronDown, Clock } from 'lucide-react';
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
  { label: 'All employees', sql: 'SELECT * FROM employees;' },
  { label: 'Top earners, sorted', sql: 'SELECT full_name, salary_usd FROM employees ORDER BY salary_usd DESC LIMIT 3;' },
  { label: 'Q2 sales over $500k', sql: "SELECT * FROM sales_performance WHERE quarter = '2026-Q2' AND total_revenue_usd > 500000;" },
  { label: 'Count critical policies', sql: "SELECT COUNT(*) FROM security_policy WHERE severity_level = 'CRITICAL';" },
  { label: 'Servers under heavy load', sql: 'SELECT hostname, cpu_load_percent, status FROM server_status WHERE cpu_load_percent > 50;' },
];

const ENGINEER_QUERIES = [
  { label: 'Failed pipeline runs', sql: "SELECT * FROM pipeline_runs WHERE state = 'FAILED';" },
  { label: 'Slowest tasks, sorted', sql: 'SELECT task_id, avg_runtime_sec FROM dag_tasks ORDER BY avg_runtime_sec DESC;' },
  { label: 'Flaky revenue-DAG tasks', sql: "SELECT * FROM dag_tasks WHERE retries > 0 AND dag_name LIKE '%revenue%';" },
  { label: 'Count lagging topics', sql: 'SELECT COUNT(*) FROM kafka_topics WHERE lag > 500;' },
  { label: 'Costliest warehouses', sql: 'SELECT warehouse, credits_used, owner_team FROM warehouse_costs ORDER BY credits_used DESC LIMIT 3;' },
];

const QUERIES_BY_CAREER: Record<string, typeof ANALYST_QUERIES> = {
  'data-engineer': ENGINEER_QUERIES
};

interface QueryResult { cols: string[]; rows: any[][] }

// Mini SQL engine. Supports:
//   SELECT *|col[, col…]|COUNT(*) FROM table
//   [WHERE col op value [AND col op value …]]   op: = != <> > < >= <= LIKE
//   [ORDER BY col [ASC|DESC]] [LIMIT n]
function runQuery(db: MockDb, rawQuery: string): QueryResult {
  const sql = rawQuery.trim().replace(/;\s*$/, '').replace(/\s+/g, ' ');
  const m = sql.match(/^select\s+(.+?)\s+from\s+([a-z0-9_]+)(?:\s+where\s+(.+?))?(?:\s+order\s+by\s+([a-z0-9_]+)(?:\s+(asc|desc))?)?(?:\s+limit\s+(\d+))?$/i);
  if (!m) {
    throw new Error('Could not parse query. Supported: SELECT cols|*|COUNT(*) FROM table [WHERE …] [ORDER BY col] [LIMIT n]');
  }
  const [, selectPart, tableName, wherePart, orderCol, orderDir, limitStr] = m;

  const tableKey = Object.keys(db).find(t => t.toLowerCase() === tableName.toLowerCase());
  if (!tableKey) {
    throw new Error(`Table "${tableName}" does not exist. Available: ${Object.keys(db).join(', ')}`);
  }
  const table = db[tableKey];
  const colIdx = (name: string) => {
    const i = table.cols.findIndex(c => c.toLowerCase() === name.toLowerCase());
    if (i === -1) throw new Error(`Column "${name}" not found on ${tableKey}. Columns: ${table.cols.join(', ')}`);
    return i;
  };

  let rows = table.rows.map(r => [...r]);

  if (wherePart) {
    const conds = wherePart.split(/\s+and\s+/i);
    for (const cond of conds) {
      const cm = cond.trim().match(/^([a-z0-9_]+)\s*(=|!=|<>|>=|<=|>|<|like)\s*(.+)$/i);
      if (!cm) throw new Error(`Could not parse condition "${cond.trim()}". Use: column = value, column > 10, column LIKE '%text%'`);
      const [, colName, opRaw, rawVal] = cm;
      const op = opRaw.toLowerCase();
      const idx = colIdx(colName);
      const val = rawVal.trim().replace(/^['"]|['"]$/g, '');
      const numVal = Number(val);
      rows = rows.filter(r => {
        const cell = r[idx];
        if (op === 'like') {
          const pattern = '^' + val.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$';
          return new RegExp(pattern).test(String(cell).toLowerCase());
        }
        if (typeof cell === 'number' && !Number.isNaN(numVal)) {
          switch (op) {
            case '=': return cell === numVal;
            case '!=': case '<>': return cell !== numVal;
            case '>': return cell > numVal;
            case '<': return cell < numVal;
            case '>=': return cell >= numVal;
            case '<=': return cell <= numVal;
          }
        }
        const a = String(cell).toLowerCase(), b = val.toLowerCase();
        switch (op) {
          case '=': return a === b;
          case '!=': case '<>': return a !== b;
          case '>': return a > b;
          case '<': return a < b;
          case '>=': return a >= b;
          case '<=': return a <= b;
        }
        return false;
      });
    }
  }

  if (orderCol) {
    const idx = colIdx(orderCol);
    const dir = (orderDir || 'asc').toLowerCase() === 'desc' ? -1 : 1;
    rows.sort((a, b) => {
      const x = a[idx], y = b[idx];
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir;
      return String(x).localeCompare(String(y)) * dir;
    });
  }

  if (limitStr) rows = rows.slice(0, parseInt(limitStr, 10));

  const sel = selectPart.trim();
  if (/^count\s*\(\s*\*\s*\)$/i.test(sel)) {
    return { cols: ['count'], rows: [[rows.length]] };
  }
  if (sel !== '*') {
    const wanted = sel.split(',').map(c => c.trim());
    const indices = wanted.map(colIdx);
    return { cols: indices.map(i => table.cols[i]), rows: rows.map(r => indices.map(i => r[i])) };
  }
  return { cols: [...table.cols], rows };
}

export default function SqlWorkspace({ careerId }: { careerId?: string }) {
  const MOCK_DB = DB_BY_CAREER[careerId || ''] || ANALYST_DB;
  const SAMPLE_QUERIES = QUERIES_BY_CAREER[careerId || ''] || ANALYST_QUERIES;
  const firstTable = Object.keys(MOCK_DB)[0];

  const [query, setQuery] = useState(`SELECT * FROM ${firstTable};`);
  const [selectedTable, setSelectedTable] = useState<string>(firstTable);
  const [expandedTable, setExpandedTable] = useState<string | null>(firstTable);
  const [history, setHistory] = useState<string[]>([]);
  const [results, setResults] = useState<QueryResult>({ cols: MOCK_DB[firstTable].cols, rows: MOCK_DB[firstTable].rows });
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [execMs, setExecMs] = useState<number | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => Math.max(query.split('\n').length, 1), [query]);

  const executeQuery = (sql?: string) => {
    const q = (sql ?? query).trim();
    if (!q) return;
    setErrorStatus(null);
    try {
      const res = runQuery(MOCK_DB, q);
      setResults(res);
      setExecMs(Math.round(8 + Math.random() * 40 + res.rows.length * 1.5));
      setHistory(prev => [q, ...prev.filter(h => h !== q)].slice(0, 8));
    } catch (e: any) {
      setErrorStatus(e.message || 'Syntax error near line 1.');
      setExecMs(null);
    }
  };

  const handleTableClick = (tableName: string) => {
    setSelectedTable(tableName);
    setExpandedTable(prev => prev === tableName ? null : tableName);
    const sql = `SELECT * FROM ${tableName};`;
    setQuery(sql);
    executeQuery(sql);
  };

  const insertColumn = (col: string) => {
    setQuery(prev => {
      const trimmed = prev.trim().replace(/;\s*$/, '');
      return `${trimmed} ${col};`;
    });
    editorRef.current?.focus();
  };

  const onEditorKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  return (
    <motion.div key="sql" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-[#0b0e1a] border border-white/10 rounded-[24px] shadow-2xl relative">

      {/* Toolbar */}
      <header className="h-[52px] bg-black/40 flex items-center justify-between px-4 shrink-0 border-b border-white/10 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Database className="w-4 h-4 text-indigo-400 shrink-0" />
          <h1 className="text-[13px] font-bold tracking-wider text-zinc-200 uppercase truncate">
            SQL Bench <span className="hidden sm:inline text-zinc-600 font-normal">·</span> <span className="hidden sm:inline text-zinc-500 font-mono text-[11px] normal-case">corp-postgresql-primary</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {execMs !== null && !errorStatus && (
            <span className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-zinc-500"><Clock className="w-3.5 h-3.5" /> {execMs} ms</span>
          )}
          <span className="hidden lg:inline text-[10px] font-mono text-zinc-600">Ctrl+Enter</span>
          <button onClick={() => executeQuery()} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-[12px] font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-600/20 cursor-pointer">
            <Play className="w-3.5 h-3.5 fill-white" /> RUN
          </button>
        </div>
      </header>

      <main className="flex-1 flex min-h-0">
        {/* Schema sidebar */}
        <aside className="hidden md:flex w-[230px] flex-col shrink-0 border-r border-white/10 bg-black/20 overflow-y-auto p-3 gap-4">
          <div>
            <h2 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] mb-2 uppercase flex items-center gap-1.5 px-1">
              <Table className="w-3.5 h-3.5" /> Tables
            </h2>
            <div className="space-y-0.5">
              {Object.keys(MOCK_DB).map(tbl => (
                <div key={tbl}>
                  <button
                    onClick={() => handleTableClick(tbl)}
                    className={`w-full flex items-center gap-1.5 px-2 py-2 rounded-lg transition text-[12.5px] font-medium font-mono ${
                      selectedTable === tbl ? 'bg-indigo-600/20 text-indigo-300' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    {expandedTable === tbl ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
                    <span className="truncate">{tbl}</span>
                    <span className="ml-auto text-[10px] opacity-40">{MOCK_DB[tbl].rows.length}</span>
                  </button>
                  {expandedTable === tbl && (
                    <div className="ml-5 border-l border-white/10 pl-2 py-1 space-y-0.5">
                      {MOCK_DB[tbl].cols.map(col => (
                        <button key={col} onClick={() => insertColumn(col)} title={`Insert "${col}" into query`} className="block w-full text-left text-[11px] font-mono text-zinc-500 hover:text-indigo-300 px-1.5 py-0.5 rounded transition truncate">
                          {col}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] mb-2 uppercase px-1">Try these</h2>
            <div className="space-y-1">
              {SAMPLE_QUERIES.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(q.sql); executeQuery(q.sql); }}
                  className="w-full text-left px-2.5 py-2 rounded-lg bg-white/[0.03] hover:bg-indigo-600/15 border border-white/5 hover:border-indigo-500/30 text-[11.5px] text-zinc-300 transition block truncate cursor-pointer"
                  title={q.sql}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {history.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] mb-2 uppercase flex items-center gap-1 px-1"><History className="w-3 h-3" /> History</h2>
              <div className="space-y-0.5">
                {history.map((h, i) => (
                  <button key={i} onClick={() => { setQuery(h); executeQuery(h); }} className="block w-full text-left text-[10.5px] font-mono text-zinc-500 hover:text-zinc-300 px-1.5 py-1 rounded hover:bg-white/5 transition truncate" title={h}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Editor + results */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Editor */}
          <div className="h-[38%] min-h-[120px] flex flex-col border-b border-white/10 bg-[#060812]">
            <div className="h-8 flex items-center justify-between px-3 border-b border-white/5 shrink-0">
              <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-widest uppercase">Query Editor</span>
              <span className="text-[10px] text-emerald-500/80 font-mono">● Connected</span>
            </div>
            <div className="flex-1 flex min-h-0">
              <div ref={gutterRef} className="w-10 shrink-0 overflow-hidden bg-black/30 text-right pr-2 pt-3 select-none" aria-hidden="true">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="text-[12px] leading-[1.6] font-mono text-zinc-700">{i + 1}</div>
                ))}
              </div>
              <textarea
                ref={editorRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onEditorKeyDown}
                onScroll={e => { if (gutterRef.current) gutterRef.current.scrollTop = (e.target as HTMLTextAreaElement).scrollTop; }}
                spellCheck={false}
                aria-label="SQL query editor"
                className="flex-1 bg-transparent text-indigo-200 font-mono text-[14px] leading-[1.6] p-3 pt-3 outline-none resize-none min-w-0"
              />
            </div>
          </div>

          {/* Error */}
          {errorStatus && (
            <div className="px-4 py-2.5 bg-rose-500/10 border-b border-rose-500/20 text-rose-300 flex items-start gap-2 text-[12px] font-mono shrink-0">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorStatus}</span>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#080a14]">
            <div className="h-8 flex items-center justify-between px-3 border-b border-white/5 shrink-0">
              <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-widest uppercase flex items-center gap-1.5"><Table className="w-3 h-3" /> Results</span>
              <span className="text-[10px] font-mono text-zinc-500">{results.rows.length} row{results.rows.length === 1 ? '' : 's'}</span>
            </div>
            <div className="flex-1 overflow-auto min-h-0">
              {results.rows.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-[11px] uppercase tracking-wider font-mono gap-2 py-10">
                  <FileSpreadsheet className="w-6 h-6 opacity-40" /> No rows returned
                </div>
              ) : (
                <table className="min-w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#0d1020] z-10">
                    <tr>
                      {results.cols.map((c, i) => (
                        <th key={i} className="py-2.5 px-4 border-b border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono whitespace-nowrap">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-indigo-500/5 transition-colors border-b border-white/5">
                        {row.map((cell, j) => (
                          <td key={j} className="py-2 px-4 text-[12.5px] font-mono text-zinc-300 whitespace-nowrap">
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
    </motion.div>
  );
}
