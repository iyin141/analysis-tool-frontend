import React from 'react';
import { Calendar } from 'lucide-react';
import { DeliveryDayItem } from '../../types';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  availableDays?: DeliveryDayItem[];
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  availableDays = [],
  className = '',
}: DatePickerProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="delivery-date-select" className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 shrink-0">
        <Calendar size={14} className="text-[#00338D]" />
        Delivery Day (D):
      </label>
      <select
        id="delivery-date-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs font-semibold text-[#0C233C] bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#00338D] focus:ring-1 focus:ring-[#00338D] transition-all cursor-pointer shadow-sm"
      >
        {availableDays.length > 0 ? (
          availableDays.map((d) => (
            <option key={d.deliveryDate} value={d.deliveryDate}>
              {d.deliveryDate} {d.hasActuals ? '✓ (Settled)' : '(Pending)'}
            </option>
          ))
        ) : (
          Array.from({ length: 31 }, (_, i) => {
            const dayStr = `2026-01-${String(i + 1).padStart(2, '0')}`;
            return (
              <option key={dayStr} value={dayStr}>
                {dayStr}
              </option>
            );
          })
        )}
      </select>
    </div>
  );
}
