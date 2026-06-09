import React, { useState } from 'react';
import { Database, Filter, Download, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function ExcelWorkspace({ config }: { config: CareerConfig }) {
  const [data, setData] = useState([
    { id: 'Q1-FY24', revenue: 450000, costs: 210000, profit: 240000, margin: '53%' },
    { id: 'Q2-FY24', revenue: 520000, costs: 230000, profit: 290000, margin: '55%' },
    { id: 'Q3-FY24', revenue: 480000, costs: 250000, profit: 230000, margin: '47%' },
    { id: 'Q4-FY24', revenue: 610000, costs: 310000, profit: 300000, margin: '49%' },
    { id: 'Q1-FY25', revenue: 650000, costs: 320000, profit: 330000, margin: '50%' },
  ]);

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
           <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center text-white font-bold text-xs cursor-pointer">
              {config.name.charAt(0)}
           </div>
        </div>
      </div>

      <div className="h-10 border-b border-zinc-200 bg-zinc-50 flex items-center px-2 shrink-0 gap-1 overflow-x-auto [scrollbar-width:none]">
         {['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'].map(tab => (
           <button key={tab} className={`px-3 py-1.5 text-xs font-medium rounded-md ${tab === 'Home' ? 'bg-white border border-zinc-200 shadow-sm text-emerald-700' : 'text-zinc-600 hover:bg-zinc-200'}`}>
             {tab}
           </button>
         ))}
      </div>
      
      <div className="h-14 border-b border-zinc-200 bg-white flex items-center px-4 gap-6 shrink-0 text-zinc-500 overflow-x-auto [scrollbar-width:none]">
         <div className="flex items-center gap-2 pr-6 border-r border-zinc-200">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-medium">Filter</span>
         </div>
         <div className="flex items-center gap-2 pr-6 border-r border-zinc-200">
            <Database className="w-4 h-4" />
            <span className="text-xs font-medium">Refresh Data</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-lg font-serif italic pr-2 font-bold text-zinc-400">fx</span>
            <input type="text" value="=SUM(C2:C6)" readOnly className="w-64 h-8 px-2 text-sm border border-zinc-300 rounded focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
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
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50/50 outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-inset">
                       <td className="border border-zinc-300 bg-zinc-100 text-center text-zinc-500 font-medium select-none">{i + 2}</td>
                       <td className="border border-zinc-300 px-4 py-1.5 text-zinc-800 font-medium cursor-cell">{row.id}</td>
                       <td className="border border-zinc-300 px-4 py-1.5 text-right font-mono text-zinc-700 cursor-cell">${row.revenue.toLocaleString()}</td>
                       <td className="border border-zinc-300 px-4 py-1.5 text-right font-mono text-rose-600 cursor-cell">-${row.costs.toLocaleString()}</td>
                       <td className="border border-zinc-300 px-4 py-1.5 text-right font-mono font-bold text-emerald-700 cursor-cell">${row.profit.toLocaleString()}</td>
                       <td className="border border-zinc-300 px-4 py-1.5 text-right font-mono text-zinc-600 bg-zinc-50 cursor-cell">{row.margin}</td>
                    </tr>
                  ))}
                  <tr>
                     <td className="border border-zinc-300 bg-zinc-100 text-center text-zinc-500 font-medium select-none text-xs">{data.length + 2}</td>
                     <td className="border border-zinc-300 px-4 py-1.5 font-bold text-zinc-800 text-right cursor-cell">TOTAL:</td>
                     <td className="border border-zinc-300 px-4 py-1.5 font-bold text-right font-mono text-zinc-800 cursor-cell">${data.reduce((acc, r) => acc + r.revenue, 0).toLocaleString()}</td>
                     <td className="border border-zinc-300 px-4 py-1.5 font-bold text-right font-mono text-rose-600 cursor-cell">-${data.reduce((acc, r) => acc + r.costs, 0).toLocaleString()}</td>
                     <td className="border border-zinc-300 px-4 py-1.5 font-bold text-right font-mono text-emerald-700 cursor-cell bg-emerald-50/50">${data.reduce((acc, r) => acc + r.profit, 0).toLocaleString()}</td>
                     <td className="border border-zinc-300 px-4 py-1.5 bg-zinc-100 cursor-cell"></td>
                  </tr>
                  {[...Array(15)].map((_, i) => (
                    <tr key={`empty-${i}`}>
                        <td className="border border-zinc-300 bg-zinc-100 text-center text-zinc-500 font-medium select-none text-xs">{data.length + 3 + i}</td>
                        <td className="border border-zinc-300 px-4 py-1.5 cursor-cell empty-cell"></td>
                        <td className="border border-zinc-300 px-4 py-1.5 cursor-cell empty-cell"></td>
                        <td className="border border-zinc-300 px-4 py-1.5 cursor-cell empty-cell"></td>
                        <td className="border border-zinc-300 px-4 py-1.5 cursor-cell empty-cell"></td>
                        <td className="border border-zinc-300 px-4 py-1.5 cursor-cell empty-cell"></td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
      
      <div className="h-8 border-t border-zinc-200 bg-zinc-100 flex items-center px-4 shrink-0 text-xs text-zinc-500 justify-between">
         <div className="flex gap-4">
            <button className="flex items-center gap-1 hover:text-emerald-700 font-medium underline underline-offset-4 decoration-emerald-500">
               + Sheet 1
            </button>
         </div>
         <div className="flex gap-4 items-center">
            <span>Ready</span>
            <span className="w-px h-3 bg-zinc-300"></span>
            <span>Average: $502,000</span>
            <span className="w-px h-3 bg-zinc-300"></span>
            <span>Count: 5</span>
         </div>
      </div>
    </motion.div>
  );
}
