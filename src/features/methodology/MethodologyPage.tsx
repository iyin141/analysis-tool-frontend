import React from 'react';
import { BookOpen, ShieldCheck, HelpCircle, Layers, CheckCircle2, Clock, FileText } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/shared/Card';

export default function MethodologyPage() {
  return (
    <AppLayout pageTitle="Methodology, Assumptions & Market Rules">
      <div className="space-y-8">
        {/* Market Context & Gate Closure */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#00338D] flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0C233C]">GB Day-Ahead Market & Gate Closure</h2>
              <p className="text-xs text-slate-500">Regulatory framework and trading timeline for day D procurement</p>
            </div>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              In Great Britain's electricity market, power utilities participate in the GB Day-Ahead Auction (operated by power exchanges such as <strong>EPEX SPOT</strong> and <strong>Nord Pool</strong>) to purchase power for delivery across the 48 half-hour settlement periods of delivery day <strong>D</strong>.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-2">
              <div className="font-semibold text-[#0C233C]">GB Gate Closure Rules:</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>EPEX SPOT GB Day-Ahead Auction (DAM):</strong> Order books close at <strong>09:20 UK local time</strong> (formerly 11:00 UK / 12:00 CET for the coupled auction, with 09:20 for the local GB 30-minute auction).
                </li>
                <li>
                  <strong>Decision Cutoff Default:</strong> This application adopts <strong>09:00 UK local time on D-1</strong> as the standard trading decision cutoff. By this time, desk traders must finalize their physical generation profiles and submit commercial bids before gate closure.
                </li>
                <li>
                  <strong>Citation:</strong> EPEX SPOT GB Day-Ahead Auction Rules; Elexon Balancing and Settlement Code (BSC) Section P (Energy Contract Volumes and Metered Volumes).
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Core Logic: As-Of-Cutoff Selection */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0C233C]">As-Of-Cutoff Forecast Selection (Zero Look-Ahead Leakage)</h2>
              <p className="text-xs text-slate-500">Preventing hindsight bias in backtesting and decision support</p>
            </div>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              A critical pitfall in quantitative power trading is <em>look-ahead leakage</em>—using forecasts that were published after the decision was already executed.
            </p>
            <p>
              For each target half-hour in delivery day <strong>D</strong>:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-800">
              <li>
                We compute the exact UTC decision cutoff timestamp corresponding to <strong>09:00 UK local time on D-1</strong> (Europe/London timezone awareness).
              </li>
              <li>
                We filter Elexon <code>WINDFOR</code> forecasts strictly by <code>publishTime &lt;= decisionCutoff</code>.
              </li>
              <li>
                For each half-hour start time, we select the single latest forecast vintage published before the cutoff. All forecasts published after cutoff are eliminated from the decision view.
              </li>
              <li>
                Missing periods are explicitly preserved as <code>null</code> / <code>NaN</code> and counted in the summary metrics—never silently omitted.
              </li>
            </ol>
          </div>
        </Card>

        {/* Quantitative Metrics Definitions */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0C233C]">Mathematical Metric Formulations</h2>
              <p className="text-xs text-slate-500">Rigorous metrics used to quantitatively evaluate forecast error</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-[#0C233C] mb-1">Forecast Error (e)</div>
              <p className="text-slate-600 mb-2"><code>Error = Forecast (MW) – Actual Generation (MW)</code></p>
              <p className="text-slate-500">A positive error indicates over-forecasting (less wind was generated than expected, requiring emergency power purchase in the balancing mechanism).</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-[#0C233C] mb-1">Mean Absolute Error (MAE)</div>
              <p className="text-slate-600 mb-2"><code>MAE = (1 / n) * Σ |Forecast_i – Actual_i|</code></p>
              <p className="text-slate-500">Measures the average magnitude of procurement deviations without regard to direction.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-[#0C233C] mb-1">Root Mean Squared Error (RMSE)</div>
              <p className="text-slate-600 mb-2"><code>RMSE = sqrt((1 / n) * Σ (Forecast_i – Actual_i)²)</code></p>
              <p className="text-slate-500">Penalizes large outlier forecast errors more heavily than small errors.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-[#0C233C] mb-1">Normalized MAE (nMAE) & MAPE</div>
              <p className="text-slate-600 mb-2"><code>nMAE = MAE / mean(Actual) * 100%</code></p>
              <p className="text-slate-500">MAPE is guarded by filtering out near-zero actual generation periods (&lt; 50 MW) to prevent numerical division explosions during low-wind calms.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-[#0C233C] mb-1">Under-Procurement Risk: P(Overshoot &gt; X MW)</div>
              <p className="text-slate-600 mb-2"><code>P(Error &gt; X MW) = count(Error &gt; X) / n</code></p>
              <p className="text-slate-500">The empirical probability that wind falls short of forecast by more than X MW (default 1000 MW), exposing the utility to severe cashout penalties.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-[#0C233C] mb-1">Empirical Uncertainty Band (80% CI)</div>
              <p className="text-slate-600 mb-2"><code>Band = [Forecast – P90(Error), Forecast – P10(Error)]</code></p>
              <p className="text-slate-500">Constructed strictly from delivery days <em>prior</em> to delivery day D. When fewer than 3 historical delivery days are available, in-sample percentiles are used and labeled honestly as <code>bandIsInSample: true</code>.</p>
            </div>
          </div>
        </Card>

        {/* Elexon BMRS Source Datasets */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0C233C]">Elexon Insights API Data Sources</h2>
              <p className="text-xs text-slate-500">Official GB National Grid ESO generation settlement data</p>
            </div>
          </div>

          <div className="text-xs text-slate-700 leading-relaxed space-y-2">
            <p>
              This application interfaces directly with the Elexon Insights Solution (BMRS API v1):
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Settled Actual Generation:</strong> <code>GET /datasets/FUELHH/stream</code> filtered strictly to <code>fuelType == "WIND"</code>. Records provide final metered generation per half-hour period.
              </li>
              <li>
                <strong>National Wind Forecasts:</strong> <code>GET /datasets/WINDFOR/stream</code> providing national wind generation forecast vintages published by National Grid ESO.
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
