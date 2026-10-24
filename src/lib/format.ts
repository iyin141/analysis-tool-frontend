export function formatMw(mw: number | null | undefined): string {
  if (mw === null || mw === undefined || isNaN(mw)) return '—';
  return `${mw.toLocaleString('en-GB', { maximumFractionDigits: 1 })} MW`;
}

export function formatMwh(mwh: number | null | undefined): string {
  if (mwh === null || mwh === undefined || isNaN(mwh)) return '—';
  return `${mwh.toLocaleString('en-GB', { maximumFractionDigits: 1 })} MWh`;
}

export function formatPct(pct: number | null | undefined): string {
  if (pct === null || pct === undefined || isNaN(pct)) return '—';
  return `${pct.toFixed(1)}%`;
}

export function formatSignedMw(mw: number | null | undefined): string {
  if (mw === null || mw === undefined || isNaN(mw)) return '—';
  const sign = mw > 0 ? '+' : '';
  return `${sign}${mw.toLocaleString('en-GB', { maximumFractionDigits: 1 })} MW`;
}

export function formatTime(isoStr: string | null | undefined): string {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
  } catch {
    return isoStr;
  }
}

export function formatDate(isoDateStr: string | null | undefined): string {
  if (!isoDateStr) return '—';
  try {
    const d = new Date(isoDateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return isoDateStr;
  }
}
