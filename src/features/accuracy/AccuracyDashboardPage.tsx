import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ShieldCheck, Sliders, Calendar, AlertOctagon } from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/shared/Card';
import KpiCard, { KpiItem } from '../../components/shared/KpiCard';
import CutoffSelect from '../../components/shared/CutoffSelect';
import ChartContainer from '../../components/shared/charts/ChartContainer';
import { LoadingSpinner, ErrorState } from '../../components/shared/States';
import {
  useAccuracySummary,
  useAccuracyByHour,
  useAccuracyDistribution,
  useAccuracyByWindLevel,
} from '../../hooks/useAccuracy';
import { formatMw, formatPct, formatSignedMw } from '../../lib/format';
import { APP_CONFIG } from '../../config/constants';

export default function AccuracyDashboardPage() {
  const [fromDate, setFromDate] = useState(APP_CONFIG.defaultFromDate);
  const [toDate, setToDate] = useState(APP_CONFIG.defaultToDate);
  const [cutoffTime, setCutoffTime] = useState(APP_CONFIG.defaultCutoffTime);
  const [overshootThreshold, setOvershootThreshold] = useState<number>(APP_CONFIG.overshootDefaultThresholdMw);
  const [binWidthMw, setBinWidthMw] = useState<number>(250);

  const filterParams = {
    from: fromDate,
    to: toDate,
    cutoffTime,
    overshootThresholdMw: overshootThreshold,
  };

  const { data: summary, isLoading: loadingSummary, error: summaryError, refetch } = useAccuracySummary(filterParams);
  const { data: byHour, isLoading: loadingHour } = useAccuracyByHour(filterParams);
  const { data: dist, isLoading: loadingDist } = useAccuracyDistribution({ ...filterParams, binWidthMw });
  const { data: byWind, isLoading: loadingWind } = useAccuracyByWindLevel(filterParams);

  const isLoading = loadingSummary || loadingHour || loadingDist || loadingWind;

  const kpis: KpiItem[] = summary
    ? [
        {
          label: 'Mean Absolute Error (MAE)',
          value: formatMw(summary.metrics.maeMw),
          subtext: `RMSE: ${formatMw(summary.metrics.rmseMw)}`,
        },
        {
          label: 'Forecast Bias',
          value: formatSignedMw(summary.metrics.biasMw),
          subtext: summary.metrics.biasMw > 0 ? 'Net over-forecast' : 'Net under-forecast',
          badge: {
            text: summary.metrics.biasMw >= 0 ? 'Over-Forecast' : 'Under-Forecast',
            type: summary.metrics.biasMw >= 0 ? 'amber' : 'blue',
          },
        },
        {
          label: 'Normalized MAE (nMAE)',
          value: formatPct(summary.metrics.nmaePct),
          subtext: `Guarded MAPE: ${formatPct(summary.metrics.mapePct)}`,
        },
        {
          label: `Under-Procurement Risk (> ${overshootThreshold} MW)`,
          value: formatPct(summary.metrics.overshoot.probability * 100),
          subtext: 'P(Forecast – Actual > X)',
          badge: {
            text: summary.metrics.overshoot.probability > 0.15 ? 'High Risk' : 'Normal',
            type: summary.metrics.overshoot.probability > 0.15 ? 'amber' : 'green',
          },
        },
        {
          label: 'Error Spread (P10 / P90)',
          value: `${formatSignedMw(summary.metrics.errorP10Mw)} / ${formatSignedMw(summary.metrics.errorP90Mw)}`,
          subtext: `Median P50: ${formatSignedMw(summary.metrics.errorP50Mw)}`,
        },
      ]
    : [];

  return (
    <AppLayout pageTitle="Quantitative Forecast Accuracy Evaluation">
      {/* Filters Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Calendar size={14} className="text-[#00338D]" />
              Window:
            </span>
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

          <CutoffSelect value={cutoffTime} onChange={setCutoffTime} />

          <div className="flex items-center gap-2">
            <label htmlFor="overshoot-threshold" className="text-xs font-semibold text-slate-600">
              Overshoot Threshold:
            </label>
            <input
              id="overshoot-threshold"
              type="number"
              step="100"
              value={overshootThreshold}
              onChange={(e) => setOvershootThreshold(Number(e.target.value))}
              className="w-24 text-xs font-semibold text-[#0C233C] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#00338D]"
            />
            <span className="text-xs text-slate-500">MW</span>
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner message="Calculating accuracy metrics, error distributions, and buckets..." />}

      {summaryError && (
        <ErrorState
          title="Failed to load accuracy metrics"
          message={summaryError.message}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && summary && (
        <>
          <KpiCard items={kpis} className="mb-8" />

          {/* Daily Accuracy Trend */}
          <ChartContainer
            title="Daily Forecast Error Trend (January 2026)"
            subtitle="MAE and Bias per delivery day with as-of-cutoff forecasts"
            className="mb-8"
          >
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.byDay} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickFormatter={(val) => `${val} MW`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    formatter={(val: any, name: string) => [formatMw(val), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="maeMw" stroke="#00338D" strokeWidth={2.5} name="MAE (MW)" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="biasMw" stroke="#F59E0B" strokeWidth={2} name="Bias (MW)" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          {/* Two-column Charts: Error Distribution & Error by Hour */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Error Distribution Histogram */}
            <ChartContainer
              title="Forecast Error Distribution (MW)"
              subtitle={`Histogram of forecast error (mean: ${formatSignedMw(dist?.stats.meanMw)}, std: ${formatMw(dist?.stats.stdMw)}, skew: ${dist?.stats.skew})`}
              badge={
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <label htmlFor="bin-width-select" className="text-xs text-slate-500">Bin:</label>
                  <select
                    id="bin-width-select"
                    value={binWidthMw}
                    onChange={(e) => setBinWidthMw(Number(e.target.value))}
                    className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-0.5"
                  >
                    <option value={100}>100 MW</option>
                    <option value={250}>250 MW</option>
                    <option value={500}>500 MW</option>
                  </select>
                </div>
              }
            >
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dist?.bins ?? []} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="binStartMw"
                      stroke="#64748B"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) => `${val}`}
                    />
                    <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} periods`, 'Count']}
                      labelFormatter={(lbl) => `Error Bin: ${lbl} to ${Number(lbl) + binWidthMw} MW`}
                    />
                    <Bar dataKey="count" fill="#00338D" radius={[4, 4, 0, 0]} name="Half-Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>

            {/* Error by Hour of Day */}
            <ChartContainer
              title="Accuracy by Hour of Day (00:00 – 23:00)"
              subtitle="Diurnal accuracy patterns across settlement periods"
            >
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byHour?.buckets ?? []} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="hourOfDay" stroke="#64748B" tick={{ fontSize: 10 }} tickFormatter={(h) => `${h}:00`} />
                    <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickFormatter={(val) => `${val} MW`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                      formatter={(val: any, name: string) => [formatMw(val), name]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="maeMw" fill="#00338D" name="MAE (MW)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="biasMw" fill="#21B873" name="Bias (MW)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </div>

          {/* Error by Wind Level Bucket */}
          <ChartContainer
            title="Forecast Error by Wind Generation Tier"
            subtitle="Evaluating accuracy across generation regimes (low wind vs high wind events)"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byWind?.buckets ?? []} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="label" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickFormatter={(val) => `${val} MW`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    formatter={(val: any, name: string) => [formatMw(val), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="maeMw" fill="#0C233C" name="MAE (MW)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rmseMw" fill="#00338D" name="RMSE (MW)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="biasMw" fill="#F59E0B" name="Bias (MW)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </>
      )}
    </AppLayout>
  );
}
