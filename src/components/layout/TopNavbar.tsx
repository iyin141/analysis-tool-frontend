import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';

interface TopNavbarProps {
  pageTitle: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function TopNavbar({ pageTitle, isSidebarOpen, onToggleSidebar }: TopNavbarProps) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-xs">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{pageTitle}</h1>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <ShieldCheck size={12} />
            GB Day-Ahead Desk
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">|</span>
          <span className="text-xs text-slate-500 hidden sm:inline">Europe/London (GMT/UTC)</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Desk operator info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              Power Procurement Desk
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500">UK Utility Trader</span>
          </div>

          {/* Avatar with Pap-matters-frontend gradient */}
          <div
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white text-xs sm:text-sm font-semibold shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(90deg, #01338C 0%, #0C233D 100%)' }}
            aria-label="User avatar"
          >
            GB
          </div>
        </div>

        <div className="h-7 sm:h-8 w-px bg-slate-200" aria-hidden="true" />

        {/* Hamburger Menu Toggle Button (replaces notification bell) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isSidebarOpen}
          className="text-[#00338D] p-2.5 rounded-full bg-[#F2F2F2] hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#00338D]/30"
          title="Navigation menu"
        >
          <Menu size={19} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}

