import React, { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function ChartContainer({
  title,
  subtitle,
  badge,
  children,
  className = '',
}: ChartContainerProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#0C233C] tracking-tight">{title}</h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
