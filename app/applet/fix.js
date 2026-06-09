const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const wrongContainer = '<div className="flex-1 relative mt-6 border border-white/10 rounded-3xl p-6 bg-[#0f172a]/80 backdrop-blur-xl shadow-inner flex flex-col justify-around min-h-[300px]">';
const correctLabel = '<div className="absolute -top-1.5 right-1 px-1 py-0.5 text-[11px] bg-white/5 backdrop-blur-2xl font-mono text-zinc-200 rounded">';

app = app.replace(
  new RegExp(wrongContainer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*INGRESS', 'g'),
  correctLabel + '\n                          INGRESS'
);

app = app.replace(
  new RegExp(wrongContainer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*GATEWAY', 'g'),
  correctLabel + '\n                          GATEWAY'
);

fs.writeFileSync('src/App.tsx', app);
