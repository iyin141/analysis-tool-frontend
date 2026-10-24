import React from 'react';
import { Clock } from 'lucide-react';

interface CutoffSelectProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

const CUTOFF_OPTIONS = [
  { value: '07:00', label: '07:00 (Early Morning)' },
  { value: '08:00', label: '08:00 (Pre-Trading)' },
  { value: '09:00', label: '09:00 (Default GB Gate Cutoff)' },
  { value: '10:00', label: '10:00 (Mid Morning)' },
  { value: '11:00', label: '11:00 (Auction Gate Closure)' },
  { value: '12:00', label: '12:00 (Post Auction)' },
];

export default function CutoffSelect({ value, onChange, className = '' }: CutoffSelectProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="cutoff-select" className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 shrink-0">
        <Clock size={14} className="text-[#00338D]" />
        Decision Cutoff (D-1):
      </label>
      <select
        id="cutoff-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs font-semibold text-[#0C233C] bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#00338D] focus:ring-1 focus:ring-[#00338D] transition-all cursor-pointer shadow-sm"
      >
        {CUTOFF_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
