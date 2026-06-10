import React, { useState, useMemo } from 'react';
import { Database, Filter, ArrowUpDown, Plus, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

interface Row { id: string; revenue: number; costs: number; }

const INITIAL_ROWS: Row[] = [
  { id: 'Q1-FY24', revenue: 450000, costs: 210000 },
  { id: 'Q2-FY24', revenue: 520000, costs: 230000 },
  { id: 'Q3-FY24', revenue: 480000, costs: 250000 },
  { id: 'Q4-FY24', revenue: 610000, costs: 310000 },
  { id: 'Q1-FY25', revenue: 650000, costs: 320000 },
];

const RIBBON_TABS = ['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'];

export default function ExcelWorkspace({ config }: { config: CareerConfig }) {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [activeRibbon, setActiveRibbon] = useState('Home');
  const [sortDesc, setSortDesc] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<{ row: number; col: 'revenue' | 'costs' } | null>(null);
  const [selected, setSelected] = useState<{ row: number; col: 'revenue' | 'costs' } | null>(null);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('Ready');

  const derived = useMemo(() => rows.map(r => ({
    ...r,
    profit: r.revenue - r.costs,
    margin: r.revenue > 0 ? Math.round(((r.revenue - r.costs) / r.revenue) * 100) : 0,
  })), [rows]);

  const totals = useMemo(() => ({
    revenue: derived.reduce((a, r) => a + r.revenue, 0),
    costs: derived.reduce((a, r) => a + r.costs, 0),
    profit: derived.reduce((a, r) => a + r.profit, 0),
  }), [derived]);

  const commitEdit = () => {
    if (!editing) return;
    const n = Math.max(0, Math.round(Number(draft.replace(/[^0-9.]/g, '')) || 0));
    setRows(prev => prev.map((r, i) => i === editing.row ? { ...r, [editing.col]: n } : r));
    setStatus(`Updated ${columnLetter(editing.col)}${editing.row + 2}`);
    setEditing(null);
  };

  const columnLetter = (col: 'revenue' | 'costs') => (col === 'revenue' ? 'B' : 'C');

  const handleSort = () => {
    const desc = sortDesc !== true;
    setSortDesc(desc);
    setRows(prev => [...prev].sort((a, b) => desc ? (b.revenue - b.costs) - (a.revenue - a.costs) : (a.revenue - a.costs) - (b.revenue - b.costs)));
    setStatus(`Sorted by Net Profit (${desc ? 'desc' : 'asc'})`);
  };

  const handleRefresh = () => {
    // Pull a fresh quarter of "live" data
    setRows(prev => {
      const last = prev[prev.length - 1];
      const drift = () => 0.9 + Math.random() * 0.3;
      return prev.map(r => ({ ...r, revenue: Math.round(r.revenue * drift()), costs: Math.round(r.costs * drift()) }));
    });
    setSortDesc(null);
    setStatus('Data refreshed from source');
  };

  const addRow = () => {
    const next = rows.length + 1;
    setRows(prev => [...prev, { id: `Q${((next - 1) % 4) + 1}-FY${25 + Math.floor((next - 1) / 4)}`, revenue: 500000, costs: 250000 }]);
    setStatus('Row inserted');
  };

  const formulaValue = selected
    ? `${selected.col === 'revenue' ? rows[selected.row]?.revenue : rows[selected.row]?.costs ?? ''}`
    : '=SUM(B2:B6)';

  const cellClass = (row: number, col: 'revenue' | 'costs') =>
    `border border-zinc-300 px-4 py-1.5 text-right font-mono cursor-cell ${
      selected?.row === row && selected?.col === col ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-50' : ''
    }`;

  const editableCell = (row: number, col: 'revenue' | 'costs', value: number, extra: string) => {
    const isEditing = editing?.row === row && editing?.col === col;
    return (
      <td
        className={`${cellClass(row, col)} ${extra}`}
        onClick={() => setSelected({ row, col })}
        onDoubleClick={() => { setEditing({ row, col }); setDraft(String(value)); }}
      >
        {isEditing ? (
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(null); }}
            className="w-full text-right font-mono bg-white outline-none ring-1 ring-emerald-500 rounded px-1"
            aria-label={`Edit ${columnLetter(col)}${row + 2}`}
          />
        ) : (
          `${col === 'costs' ? '-' : ''}$${value.toLocaleString()}`
        )}
      </td>
    );
  };

  return (
    <motion.div key="excel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-white text-zinc-800 font-sans border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative selection:bg-emerald-200">
      <div className="h-14 bg-emerald-700 flex items-center px-4 justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center text-white">
            <span className="font-bold text-lg font-serif">X</span>
          </div>
          <span className="text-white font-medium text-sm">Financial_Projections_v4_FINAL.xlsx</span>
        </div>
        <div className="flex items-center gap-4">
          <Search className="w-4 h-4 text-emerald-200 cursor-pointer hover:text-white transition" />
          <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center text-white font-bold text-xs">
            {config.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Ribbon tabs */}
      <div className="h-10 border-b border-zinc-200 bg-zinc-50 flex items-center px-2 shrink-0 gap-1 overflow-x-auto [scrollbar-width:none]">
        {RIBBON_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveRibbon(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${activeRibbon === tab ? 'bg-white border border-zinc-200 shadow-sm text-emerald-700' : 'text-zinc-600 hover:bg-zinc-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="h-14 border-b border-zinc-200 bg-white flex items-center px-4 gap-3 shrink-0 text-zinc-600 overflow-x-auto [scrollbar-width:none]">
        <button onClick={handleSort} className="flex items-center gap-2 pr-3 border-r border-zinc-200 hover:text-emerald-700 transition">
          <ArrowUpDown className="w-4 h-4" /> <span className="text-xs font-medium">Sort by Profit</span>
        </button>
        <button onClick={handleRefresh} className="flex items-center gap-2 pr-3 border-r border-zinc-200 hover:text-emerald-700 transition">
          <Database className="w-4 h-4" /> <span className="text-xs font-medium">Refresh Data</span>
        </button>
        <button onClick={addRow} className="flex items-center gap-2 pr-3 border-r border-zinc-200 hover:text-emerald-700 transition">
          <Plus className="w-4 h-4" /> <span className="text-xs font-medium">Add Row</span>
        </button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg font-serif italic pr-2 font-bold text-zinc-400">fx</span>
          <input type="text" value={formulaValue} readOnly aria-label="Formula bar" className="w-64 h-8 px-2 text-sm border border-zinc-300 rounded focus:border-emerald-500 focus:outline-none bg-zinc-50" />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-zinc-100 p-2">
        <div className="bg-white border border-zinc-300 shadow-sm inline-block min-w-full">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                <th className="border border-zinc-300 bg-zinc-100 w-10"></th>
                {['A', 'B', 'C', 'D', 'E'].map(l => (
                  <th key={l} className="border border-zinc-300 bg-zinc-100 px-4 py-1.5 font-medium text-center text-zinc-600 select-none min-w-[120px]">{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-zinc-300 bg-zinc-100 text-center text-zinc-500 font-medium select-none">1</td>
                <td className="border border-zinc-300 px-4 py-1.5 font-bold bg-zinc-50 text-zinc-800">Period</td>
                <td className="border border-zinc-300 px-4 py-1.5 font-bold bg-zinc-50 text-zinc-800">Gross Revenue</td>
                <td className="border border-zinc-300 px-4 py-1.5 font-bold bg-zinc-50 text-zinc-800">Operating Costs</td>
                <td className="border border-zinc-300 px-4 py-1.5 font-bold bg-zinc-50 text-zinc-800">Net Profit</td>
                <td className="border border-zinc-300 px-4 py-1.5 font-bold bg-zinc-50 text-zinc-800">Margin</td>
              </tr>
              {derived.map((row, i) => (
                <tr key={row.id} className="hover:bg-blue-50/50">
                  <td className="border border-zinc-300 bg-zinc-100 text-center text-zinc-500 font-medium select-none">{i + 2}</td>
                  <td className="border border-zinc-300 px-4 py-1.5 text-zinc-800 font-medium cursor-cell">{row.id}</td>
                  {editableCell(i, 'revenue', row.revenue, 'text-zinc-700')}
                  {editableCell(i, 'costs', row.costs, 'text-rose-600')}
                  <td className="border border-zinc-300 px-4 py-1.5 text-right font-mono font-bold text-emerald-700">${row.profit.toLocaleString()}</td>
                  <td className={`border border-zinc-300 px-4 py-1.5 text-right font-mono bg-zinc-50 ${row.margin < 50 ? 'text-rose-600' : 'text-zinc-600'}`}>{row.margin}%</td>
                </tr>
              ))}
              <tr>
                <td className="border border-zinc-300 bg-zinc-100 text-center text-zinc-500 font-medium select-none text-xs">{derived.length + 2}</td>
                <td className="border border-zinc-300 px-4 py-1.5 font-bold text-zinc-800 text-right">TOTAL:</td>
                <td className="border border-zinc-300 px-4 py-1.5 font-bold text-right font-mono text-zinc-800">${totals.revenue.toLocaleString()}</td>
                <td className="border border-zinc-300 px-4 py-1.5 font-bold text-right font-mono text-rose-600">-${totals.costs.toLocaleString()}</td>
                <td className="border border-zinc-300 px-4 py-1.5 font-bold text-right font-mono text-emerald-700 bg-emerald-50/50">${totals.profit.toLocaleString()}</td>
                <td className="border border-zinc-300 px-4 py-1.5 bg-zinc-100"></td>
              </tr>
              {[...Array(12)].map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="border border-zinc-300 bg-zinc-100 text-center text-zinc-500 font-medium select-none text-xs">{derived.length + 3 + i}</td>
                  {['A', 'B', 'C', 'D', 'E'].map(c => (
                    <td key={c} className="border border-zinc-300 px-4 py-1.5 cursor-cell"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="h-8 border-t border-zinc-200 bg-zinc-100 flex items-center px-4 shrink-0 text-xs text-zinc-500 justify-between">
        <div className="flex gap-4 items-center">
          <button onClick={addRow} className="flex items-center gap-1 hover:text-emerald-700 font-medium underline underline-offset-4 decoration-emerald-500">+ Sheet</button>
          <span className="text-zinc-400">{status}</span>
        </div>
        <div className="flex gap-4 items-center">
          <span>Avg Profit: ${Math.round(totals.profit / Math.max(1, derived.length)).toLocaleString()}</span>
          <span className="w-px h-3 bg-zinc-300"></span>
          <span>Count: {derived.length}</span>
        </div>
      </div>
    </motion.div>
  );
}
