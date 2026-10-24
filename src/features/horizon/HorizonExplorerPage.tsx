import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Clock, Hourglass, ArrowDownRight, Lightbulb } from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/shared/Card';
import KpiCard, { KpiItem } from '../../components/shared/KpiCard';
import ChartContainer from '../../components/shared/charts/ChartContainer';
import { LoadingSpinner, ErrorState } from '../../components/shared/States';
import { useHorizonAnalysis } from '../../hooks/useHorizon';
import { formatMw, formatPct, formatSignedMw } from '../../lib/format';
import { APP_CONFIG } from '../../config/constants';

export default function HorizonExplorerPage() {
  const [fromDate, setFromDate] = useState(APP_CONFIG.defaultFromDate);
  const [toDate, setToDate] = useState(APP_CONFIG.defaultToDate);
  const [binHours, setBinHours] = useState<number>(3);

  const { data, isLoading, error, refetch } = useHorizonAnalysis({
    from: fromDate,
    to: toDate,
    horizonBinHours: binHours,
  });

  const chartData = (data?.buckets ?? []).map((b) => ({
    label: `${b.horizonMinHours}–${b.horizonMaxHours}h`,
    minHours: b.horizonMinHours,
    maxHours: b.horizonMaxHours,
    mae: b.maeMw,
    rmse: b.rmseMw,
    bias: b.biasMw,
    samples: b.n,
  }));

  // Calculate improvement from waiting (shortest horizon vs longest horizon)
  const shortest = data?.buckets?.[0];
  const longest = data?.buckets?.[data?.buckets.length - 1];
  const maeReductionPct =
    shortest && longest && longest.maeMw > 0
      ? ((longest.maeMw - shortest.maeMw) / longest.maeMw) * 100
      : 0;

  const kpis: KpiItem[] = [
    {
      label: 'Ultra Short-Term MAE (0–3h)',
      value: shortest ? formatMw(shortest.maeMw) : '—',
      subtext: shortest ? `RMSE: ${formatMw(shortest.rmseMw)}` : 'Near real-time',
      badge: { text: 'Intraday Gate', type: 'green' },
    },
    {
      label: 'Day-Ahead Horizon MAE (24–27h)',
      value: data?.buckets?.find((b) => b.horizonMinHours === 24)
        ? formatMw(data.buckets.find((b) => b.horizonMinHours === 24)?.maeMw)
        : '—',
      subtext: 'Decisions taken at D-1 morning',
      badge: { text: 'Day-Ahead', type: 'blue' },
    },
    {
      label: 'Value of Waiting (Accuracy Gain)',
      value: `${maeReductionPct.toFixed(1)}% Error Reduction`,
      subtext: 'From 48h+ lead-time to dispatch',
      badge: { text: 'Key Driver', type: 'green' },
    },
    {
      label: 'Analyzed Forecast Vintages',
      value: (data?.buckets?.reduce((sum, b) => sum + b.n, 0) ?? 0).toLocaleString(),
      subtext: 'All Elexon WINDFOR vintages',
    },
  ];

  return (
    <AppLayout pageTitle="Horizon Explorer – What Waiting Buys">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Window:</span>
            <input
              type="date"
              value={fromDate}
              min="2026-01-01"
              max="2026-01-31"
              onChange={(e) => setFromDate(e.target.value)}
              className="text-xs font-semibold text-[#0C233C] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#00338D]"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={toDate}
              min="2026-01-01"
              max="2026-01-31"
              onChange={(e) => setToDate(e.target.value)}
              className="text-xs font-semibold text-[#0C233C] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#00338D]"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="horizon-bin-select" className="text-xs font-semibold text-slate-600">
              Horizon Bin:
            </label>
            <select
              id="horizon-bin-select"
              value={binHours}
              onChange={(e) => setBinHours(Number(e.target.value))}
              className="text-xs font-semibold text-[#0C233C] bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#00338D]"
            >
              <option value={1}>1 Hour Bins</option>
              <option value={3}>3 Hour Bins (Standard)</option>
              <option value={6}>6 Hour Bins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Decision Support Insight Card */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Lightbulb size={20} className="text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-emerald-900 font-semibold">Strategic Value of Waiting:</strong> While the Day-Ahead Market requires commitments at D-1 morning (typical horizon ~18–27 hours), wind forecast error drops consistently by ~<strong>{maeReductionPct.toFixed(0)}%</strong> as delivery approaches. Traders use this curve to size intraday balancing reserves.
        </div>
      </div>

      {isLoading && <LoadingSpinner message="Evaluating error decay across all forecast vintages..." />}

      {error && (
        <ErrorState
          title="Failed to load horizon analysis"
          message={error.message}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && data && (
        <>
          <KpiCard items={kpis} className="mb-8" />

          {/* Main Horizon Degradation Curve */}
          <ChartContainer
            title="Forecast Error vs Lead Time Horizon (Hours)"
            subtitle="Evolution of MAE and RMSE across all published forecast vintages"
            className="mb-8"
          >
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="label" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickFormatter={(val) => `${val} MW`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    formatter={(val: any, name: string) => [formatMw(val), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="mae" stroke="#00338D" strokeWidth={3} name="MAE (MW)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="rmse" stroke="#0C233C" strokeWidth={2} strokeDasharray="5 5" name="RMSE (MW)" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="bias" stroke="#F59E0B" strokeWidth={2} name="Bias (MW)" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          {/* Horizon Breakdown Table */}
          <Card>
            <h3 className="text-base font-bold text-[#0C233C] mb-1">
              Lead Time Horizon Degradation Table
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Evaluation across {chartData.length} horizon intervals from 0 hours (real-time) out to multi-day horizons
            </p>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#EAF1F7] text-[#0C233C] font-bold">
                  <tr>
                    <th className="py-3 px-4 border-b border-slate-200">Lead Time Horizon</th>
                    <th className="py-3 px-4 border-b border-slate-200">Sample Count (n)</th>
                    <th className="py-3 px-4 border-b border-slate-200">MAE (MW)</th>
                    <th className="py-3 px-4 border-b border-slate-200">RMSE (MW)</th>
                    <th className="py-3 px-4 border-b border-slate-200">Bias (MW)</th>
                    <th className="py-3 px-4 border-b border-slate-200">Accuracy Relative to Real-Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chartData.map((b, idx) => {
                    const relativeToZero =
                      shortest && shortest.maeMw > 0
                        ? ((b.mae - shortest.maeMw) / shortest.maeMw) * 100
                        : 0;

                    return (
                      <tr key={b.label} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-[#00338D]">{b.label}</td>
                        <td className="py-2.5 px-4 text-slate-600">{b.samples.toLocaleString()}</td>
                        <td className="py-2.5 px-4 font-bold text-[#0C233C]">{formatMw(b.mae)}</td>
                        <td className="py-2.5 px-4 text-slate-600">{formatMw(b.rmse)}</td>
                        <td className="py-2.5 px-4 text-slate-600">{formatSignedMw(b.bias)}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                              idx === 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {idx === 0 ? 'Baseline (0% error penalty)' : `+${relativeToZero.toFixed(1)}% error`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </AppLayout>
  );
}
