const COLORS = ["#F1EFE8","#9FE1CB","#5DCAA5","#1D9E75","#0F6E56"];

export default function Heatmap({ data }) {
  // split 30 days into rows of 7
  const rows = [];
  for (let i = 0; i < data.length; i += 7) rows.push(data.slice(i, i + 7));

  return (
    <div className="flex flex-col gap-1">
      {rows.map((row, ri) => (
        <div key={ri} className="flex gap-1">
          {row.map((cell, ci) => (
            <div key={ci}
              title={`${cell.date}: ${cell.completed}/${cell.total} done`}
              style={{ background: COLORS[cell.level] }}
              className="w-8 h-8 rounded-md flex-1 cursor-pointer transition-transform hover:scale-110" />
          ))}
        </div>
      ))}
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
        <span>Less</span>
        {COLORS.map((c,i) => <div key={i} style={{ background: c }} className="w-4 h-4 rounded" />)}
        <span>More</span>
      </div>
    </div>
  );
}