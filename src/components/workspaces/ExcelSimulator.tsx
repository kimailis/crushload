import React from 'react';
import { Database } from 'lucide-react';

export default function ExcelSimulator() {
  const rows = Array.from({length: 20});
  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div className="flex-1 w-full bg-white flex flex-col font-sans text-sm">
       <div className="h-10 bg-[#217346] flex items-center px-4 text-white font-semibold">
          <Database className="w-4 h-4 mr-2"/> Book1 - Global Macro Projections
       </div>
       <div className="h-8 bg-zinc-100 border-b border-zinc-300 flex items-center px-4 gap-4 text-xs font-mono text-zinc-600">
          <div className="w-12 border border-zinc-300 bg-white text-center">F4</div>
          <div className="flex-1 border border-zinc-300 bg-white px-2 text-zinc-800">=SUM(D4:E4)*1.02</div>
       </div>
       <div className="flex-1 overflow-auto bg-zinc-100 flex flex-col relative">
          <table className="w-full text-center border-collapse table-fixed bg-white">
             <thead>
                <tr>
                   <th className="w-10 bg-zinc-100 border border-zinc-300 font-normal text-zinc-500 hover:bg-zinc-200 cursor-pointer"></th>
                   {cols.map(c => <th key={c} className="w-24 bg-zinc-100 border border-zinc-300 font-normal text-zinc-500 hover:bg-zinc-200 cursor-pointer py-1">{c}</th>)}
                </tr>
             </thead>
             <tbody>
                {rows.map((_, i) => (
                   <tr key={i}>
                      <td className="bg-zinc-100 border border-zinc-300 text-zinc-500 text-xs py-1">{i + 1}</td>
                      {cols.map((c, j) => (
                         <td key={j} className="border border-zinc-300 text-right px-2 py-1 text-xs text-zinc-800 outline-none focus:ring-2 focus:ring-[#217346] inset-0" contentEditable suppressContentEditableWarning>
                            {i === 3 && j === 3 ? '420.50' : i === 3 && j === 4 ? '512.10' : i === 3 && j === 5 ? '951.25' : ''}
                         </td>
                      ))}
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}
