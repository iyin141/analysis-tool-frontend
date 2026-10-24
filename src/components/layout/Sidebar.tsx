import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Wind, BarChart3, TrendingUp, BookOpen, X } from 'lucide-react';
import { colors } from '../../config/color';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'decision-view',
    label: 'Decision View',
    href: '/',
    icon: <Wind size={18} />,
  },
  {
    id: 'accuracy',
    label: 'Accuracy Dashboard',
    href: '/accuracy',
    icon: <BarChart3 size={18} />,
  },
  {
    id: 'horizon',
    label: 'Horizon Explorer',
    href: '/horizon',
    icon: <TrendingUp size={18} />,
  },
  {
    id: 'methodology',
    label: 'Methodology & Guide',
    href: '/methodology',
    icon: <BookOpen size={18} />,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when overlay sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Nav Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 sm:w-80 flex-col text-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
        }}
        aria-label="Navigation sidebar"
        aria-hidden={!isOpen}
      >
        {/* Header (Logo Removed) */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm tracking-tight leading-tight text-white">GB Wind Power</div>
            <div className="text-[11px] text-[#B2C7E0] font-normal">Day-Ahead Decision Desk</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation sidebar"
            className="p-1.5 rounded-lg text-[#B2C7E0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-[#B2C7E0]/60 uppercase">
            Market Operations
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? location.pathname === '/' || location.pathname === '/decision-view'
                : location.pathname.startsWith(item.href);

            return (
              <NavLink
                key={item.id}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 py-2.5 px-3 h-10 rounded-lg transition-all duration-150 ease-in-out text-[13px] ${
                  isActive
                    ? 'bg-white/10 opacity-100 font-semibold text-white border-l-[3px] border-emerald-400 shadow-sm'
                    : 'font-normal text-[#B2C7E0] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-[#B2C7E0]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Operational Scope Footer */}
        <div className="p-4 border-t border-white/10 bg-black/15">
          <div className="flex items-center justify-between text-[11px] text-[#B2C7E0] mb-1">
            <span>Target Delivery</span>
            <span className="font-semibold text-white">Jan 2026 (GB)</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#B2C7E0]">
            <span>Data Provider</span>
            <span className="font-semibold text-emerald-400">Elexon BMRS</span>
          </div>
        </div>
      </aside>
    </>
  );
}

