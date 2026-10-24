import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { ShieldAlert, CheckCircle2, AlertTriangle, Layers, Clock, TrendingDown, TrendingUp } from 'lucide-react';

import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/shared/Card';
import KpiCard, { KpiItem } from '../../components/shared/KpiCard';
import CutoffSelect from '../../components/shared/CutoffSelect';
import DatePicker from '../../components/shared/DatePicker';
import ChartContainer from '../../components/shared/charts/ChartContainer';
import { LoadingSpinner, ErrorState, EmptyState } from '../../components/shared/States';
import { useDeliveryDays } from '../../hooks/useDeliveryDays';
import { useDecisionView } from '../../hooks/useDecisionView';
import { formatMw, formatMwh, formatPct, formatSignedMw, formatTime } from '../../lib/format';
import { APP_CONFIG } from '../../config/constants';

export default function DecisionViewPage() {
  const [deliveryDate, setDeliveryDate] = useState<string>(APP_CONFIG.defaultDeliveryDate);
  const [cutoffTime, setCutoffTime] = useState<string>(APP_CONFIG.defaultCutoffTime);

  const { data: daysData, isLoading: daysLoading } = useDeliveryDays();
  const { data, isLoading, error, refetch } = useDecisionView({
    deliveryDate,
    cutoffTime,
  });

  const chartData = (data?.points ?? []).map((pt) => ({
    period: `SP ${pt.settlementPeriod}`,
    time: formatTime(pt.startTime),
    forecast: pt.forecastMw,
    actual: pt.actualMw,
    error: pt.errorMw,
    bandLow: pt.bandLowMw,
    bandHigh: pt.bandHighMw,
    vintage: pt.forecastPublishTime ? formatTime(pt.forecastPublishTime) : '—',
  }));

  const kpis: KpiItem[] = data?.summary
    ? [
        {
          label: 'Day Avg Wind Forecast',
          value: formatMw(data.summary.avgForecastMw),
          subtext: `Peak: ${formatMw(data.summary.peakForecastMw)}`,
        },
        {
          label: 'Total Expected Generation',
          value: formatMwh(data.summary.forecastTotalMwh),
          subtext: data.summary.actualTotalMwh
            ? `Actual: ${formatMwh(data.summary.actualTotalMwh)}`
            : 'Actuals pending settlement',
        },
        {
          label: 'Decision Cutoff (D-1)',
          value: cutoffTime,
          subtext: `Target: ${deliveryDate}`,
          badge: { text: 'GB Day-Ahead', type: 'blue' },
        },
        {
          label: 'Forecast Vintage Used',
          value: data.summary.latestPublishTimeUsed
            ? formatTime(data.summary.latestPublishTimeUsed)
            : '—',
          subtext: 'Latest vintage before cutoff',
        },
        {
          label: 'Uncertainty Interval (80%)',
          value: `P${data.band.lowerPercentile} – P${data.band.upperPercentile}`,
          subtext: data.band.bandIsInSample
            ? 'In-sample fallback'
            : `Derived from ${data.band.basedOnDays} prior delivery days`,
          badge: {
            text: data.band.bandIsInSample ? 'In-Sample' : 'Out-of-Sample',
            type: data.band.bandIsInSample ? 'amber' : 'green',
          },
        },
      ]
    : [];

  return (
    <AppLayout pageTitle="Day-Ahead Wind Forecast Decision View">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <DatePicker
            value={deliveryDate}
            onChange={setDeliveryDate}
            availableDays={daysData?.days}
          />
          <CutoffSelect value={cutoffTime} onChange={setCutoffTime} />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Clock size={14} className="text-[#00338D]" />
          <span>Cutoff applies strictly on <strong>D-1</strong> before auction closure</span>
        </div>
      </div>

      {/* Market Guidance Alert */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <ShieldAlert size={20} className="text-[#00338D] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-[#0C233C] font-semibold">GB Day-Ahead Market Rules:</strong> Decision for delivery day <strong>{deliveryDate}</strong> is taken at <strong>{cutoffTime} UK local time on D-1</strong>. The model strictly filters out all forecasts published after cutoff to guarantee zero look-ahead leakage.
        </div>
      </div>

      {isLoading && <LoadingSpinner message="Evaluating as-of-cutoff wind forecasts and error bands..." />}

      {error && (
        <ErrorState
          title="Could not load forecast decision view"
          message={error.message}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !error && data && (
        <>
          {/* KPI Stat Cards */}
          <KpiCard items={kpis} className="mb-8" />

          {/* Main Forecast Chart Container */}
          <ChartContainer
            title={`GB Wind Generation Profile – Delivery Day ${deliveryDate}`}
            subtitle={`Forecast as of D-1 ${cutoffTime} cutoff vs actual generation with 80% empirical confidence interval`}
            badge={
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                  data.band.bandIsInSample
                    ? 'text-amber-800 bg-amber-100 border border-amber-300'
                    : 'text-emerald-800 bg-emerald-100 border border-emerald-300'
                }`}
              >
                {data.band.bandIsInSample
                  ? '⚠️ In-Sample Uncertainty Band (< 3 prior days history)'
                  : `✓ Out-of-Sample Band (${data.band.basedOnDays} prior days strictly before D)`}
              </span>
            }
            className="mb-8"
          >
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="time"
                    stroke="#64748B"
                    tick={{ fontSize: 11 }}
                    interval={3}
                  />
                  <YAxis
                    stroke="#64748B"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => `${val / 1000} GW`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: string) => [formatMw(val), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                  {/* Uncertainty Band Area */}
                  <Area
                    type="monotone"
                    dataKey="bandHigh"
                    stroke="none"
                    fill="#00338D"
                    fillOpacity={0.08}
                    name="P90 Confidence Upper"
                  />
                  <Area
                    type="monotone"
                    dataKey="bandLow"
                    stroke="none"
                    fill="#FFFFFF"
                    fillOpacity={1}
                    name="P10 Confidence Lower"
                  />

                  {/* Forecast Line */}
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#00338D"
                    strokeWidth={2.5}
                    dot={{ r: 2, fill: '#00338D' }}
                    activeDot={{ r: 5 }}
                    name="As-of-Cutoff Forecast (MW)"
                  />

                  {/* Actual Generation Line */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#21B873"
                    strokeWidth={2.5}
                    dot={{ r: 2, fill: '#21B873' }}
                    activeDot={{ r: 5 }}
                    name="Settled Actual Generation (MW)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          {/* Detailed Half-Hour Settlement Table */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0C233C]">
                  Half-Hour Settlement Breakdown (48 Periods)
                </h3>
                <p className="text-xs text-slate-500">
                  Exact forecast vintage, lead-time horizon, and procurement error per settlement period
                </p>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[460px] overflow-y-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#EAF1F7] text-[#0C233C] font-bold sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 border-b border-slate-200">Period</th>
                    <th className="py-3 px-4 border-b border-slate-200">Target Time (UTC)</th>
                    <th className="py-3 px-4 border-b border-slate-200">Forecast (MW)</th>
                    <th className="py-3 px-4 border-b border-slate-200">80% Band (MW)</th>
                    <th className="py-3 px-4 border-b border-slate-200">Actual (MW)</th>
                    <th className="py-3 px-4 border-b border-slate-200">Error (MW)</th>
                    <th className="py-3 px-4 border-b border-slate-200">Publish Vintage</th>
                    <th className="py-3 px-4 border-b border-slate-200">Horizon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.points.map((pt) => {
                    const isOver = pt.errorMw !== null && pt.errorMw > 0;
                    return (
                      <tr key={pt.settlementPeriod} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-800">
                          SP {pt.settlementPeriod}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{formatTime(pt.startTime)}</td>
                        <td className="py-2.5 px-4 font-bold text-[#00338D]">
                          {formatMw(pt.forecastMw)}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                          {pt.bandLowMw !== null && pt.bandHighMw !== null
                            ? `${formatMw(pt.bandLowMw)} – ${formatMw(pt.bandHighMw)}`
                            : '—'}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-emerald-700">
                          {formatMw(pt.actualMw)}
                        </td>
                        <td
                          className={`py-2.5 px-4 font-bold ${
                            pt.errorMw === null
                              ? 'text-slate-400'
                              : isOver
                              ? 'text-amber-600'
                              : 'text-blue-600'
                          }`}
                        >
                          {formatSignedMw(pt.errorMw)}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500">{formatTime(pt.forecastPublishTime)}</td>
                        <td className="py-2.5 px-4 text-slate-500">
                          {pt.horizonHours !== null ? `${pt.horizonHours.toFixed(1)} hrs` : '—'}
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
