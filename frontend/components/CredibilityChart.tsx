'use client';

// ============================================================
// components/CredibilityChart.tsx — Black & Red theme
// Authentic = red-600 (theme accent), Questionable = zinc-600
// ============================================================

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface CredibilityChartProps {
  authenticPercent: number;
  confidence: number;
}

export default function CredibilityChart({ authenticPercent, confidence }: CredibilityChartProps) {
  const questionablePercent = 100 - authenticPercent;

  const data = [
    { name: 'Authentic', value: authenticPercent },
    { name: 'Questionable', value: questionablePercent },
  ];

  // Red for authentic (theme accent), dark zinc for questionable
  const COLORS = { Authentic: '#dc2626', Questionable: '#52525b' };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={44}
              outerRadius={62}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                  opacity={0.9}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value ?? 0}%`, '']}
              contentStyle={{
                background: '#09090b',
                border: '1px solid #27272a',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#e4e4e7',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Confidence % in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-none">
            {confidence}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
            conf.
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
          Authentic {authenticPercent}%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 inline-block" />
          Questionable {questionablePercent}%
        </span>
      </div>
    </div>
  );
}
