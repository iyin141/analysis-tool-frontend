import React from 'react';

export interface KpiItem {
  label: string;
  value: string;
  subtext?: string;
  badge?: {
    text: string;
    type?: 'green' | 'amber' | 'blue' | 'slate';
  };
}

export interface KpiCardProps {
  items: KpiItem[];
  className?: string;
}

export default function KpiCard({ items, className = '' }: KpiCardProps) {
  const badgeColors = {
    green: 'text-[#21B873] bg-[#21B8731A]',
    amber: 'text-amber-600 bg-amber-50',
    blue: 'text-[#00338D] bg-blue-50',
    slate: 'text-slate-500 bg-slate-100',
  };

  return (
    <div className={`w-full bg-white rounded-xl border border-slate-200 flex flex-wrap md:flex-nowrap overflow-hidden shadow-sm ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.label}
            className={`flex-1 min-w-[180px] px-6 py-5 border-b md:border-b-0 md:border-r border-slate-200 ${
              isLast ? 'md:border-r-0' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs text-slate-400 font-normal block">{item.label}</span>
              {item.badge && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${badgeColors[item.badge.type ?? 'slate']}`}>
                  {item.badge.text}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-[#0C233C] tracking-tight">{item.value}</div>
            {item.subtext && (
              <span className="text-xs text-slate-500 mt-1 block">{item.subtext}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
