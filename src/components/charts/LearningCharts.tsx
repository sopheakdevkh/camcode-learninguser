import React, { useMemo, useState } from 'react';

export interface TrendPoint {
  label: string;
  value: number;
}

export const AreaTrendChart: React.FC<{
  title: string;
  subtitle?: string;
  seriesByRange: Record<'daily' | 'weekly' | 'monthly', TrendPoint[]>;
  unitSuffix?: string;
  accentColor?: string;
  rangeLabels?: Record<'daily' | 'weekly' | 'monthly', string>;
}> = ({
  title,
  subtitle,
  seriesByRange,
  unitSuffix = 'min',
  accentColor = '#1c5b48',
  rangeLabels = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' },
}) => {
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const data = seriesByRange[range];

  const { linePath, areaPath, points, maxVal } = useMemo(() => {
    const w = 640;
    const h = 190;
    const padX = 18;
    const padY = 18;
    const maxV = Math.max(10, ...data.map((d) => d.value));
    const minV = 0;

    const coords = data.map((d, i) => {
      const x = padX + (i * (w - padX * 2)) / Math.max(1, data.length - 1);
      const y = h - padY - ((d.value - minV) / (maxV - minV)) * (h - padY * 2);
      return { x, y, ...d };
    });

    if (coords.length === 0) {
      return { linePath: '', areaPath: '', points: [], maxVal: maxV };
    }

    // Smooth cubic bezier curve through points
    let dLine = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cx = (p0.x + p1.x) / 2;
      dLine += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const last = coords[coords.length - 1];
    const first = coords[0];
    const dArea = `${dLine} L ${last.x} ${h - padY} L ${first.x} ${h - padY} Z`;

    return { linePath: dLine, areaPath: dArea, points: coords, maxVal: maxV };
  }, [data]);

  const gradId = React.useId();

  return (
    <div className="card-note p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif-display text-[20px] font-medium text-[#141312] dark:text-[#f6f3ec]">
            {title}
          </h2>
          {subtitle && <p className="text-[12.5px] text-[#6e6a62] mt-0.5">{subtitle}</p>}
        </div>

        <div className="inline-flex rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#e5dfd2] dark:bg-[#181E1B] p-1">
          {(['daily', 'weekly', 'monthly'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-full text-[11.5px] font-medium capitalize transition-colors cursor-pointer ${
                range === r
                  ? 'bg-[#f6f3ec] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] shadow-xs font-semibold'
                  : 'text-[#6e6a62] hover:text-[#141312]'
              }`}
            >
              {rangeLabels[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox="0 0 640 215" className="w-full h-48 sm:h-52 overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = 172 - ratio * 154;
            return (
              <g key={ratio}>
                <line
                  x1="18"
                  y1={y}
                  x2="622"
                  y2={y}
                  stroke="currentColor"
                  className="text-[#ded8ca] dark:text-[#2A332E]"
                  strokeDasharray="3 3"
                />
                <text
                  x="0"
                  y={y + 4}
                  fontSize="10.5"
                  fill="#6e6a62"
                  className="font-mono-custom"
                >
                  {Math.round(maxVal * ratio)}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill={`url(#${gradId})`} />
          <path
            d={linePath}
            fill="none"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {points.map((pt) => (
            <g key={pt.label}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                className="fill-[#f6f3ec] dark:fill-[#151A17]"
                stroke={accentColor}
                strokeWidth="2.2"
              />
              <title>{`${pt.label}: ${pt.value} ${unitSuffix}`}</title>
              <text
                x={pt.x}
                y="204"
                textAnchor="middle"
                fontSize="11"
                fill="#6e6a62"
                className="font-mono-custom"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const CategoryDonutCard: React.FC<{
  title: string;
  items: { label: string; sublabel: string; value: number; color: string }[];
  centerValue: string;
  centerLabel: string;
}> = ({ title, items, centerValue, centerLabel }) => {
  const total = Math.max(1, items.reduce((s, i) => s + i.value, 0));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;

  return (
    <div className="card-note p-5 sm:p-6 flex flex-col justify-between gap-4">
      <h2 className="font-serif-display text-[20px] font-medium text-[#141312] dark:text-[#f6f3ec]">
        {title}
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto">
        <div className="space-y-3 w-full sm:w-auto flex-1">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#141312] dark:text-[#f6f3ec] truncate">
                  {item.label}
                </p>
                <p className="text-[11.5px] font-mono-custom text-[#6e6a62]">{item.sublabel}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative h-36 w-36 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 132 132" className="h-full w-full -rotate-90">
            <circle
              cx="66"
              cy="66"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-[#e5dfd2] dark:text-[#1E2622]"
              strokeWidth="16"
            />
            {items.map((item) => {
              const segLen = (item.value / total) * circumference;
              const offset = -cumulative;
              cumulative += segLen;
              return (
                <circle
                  key={item.label}
                  cx="66"
                  cy="66"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="16"
                  strokeDasharray={`${Math.max(0, segLen - 3)} ${circumference}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-serif-display text-[22px] font-medium text-[#141312] dark:text-[#f6f3ec] leading-none">
              {centerValue}
            </span>
            <span className="font-mono-tech text-[10px] uppercase tracking-[0.08em] text-[#6e6a62] mt-1">
              {centerLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
