import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Layers,
  CheckCircle2,
  Calendar,
  Zap,
  Activity,
  Boxes
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const AIInsightsView: React.FC = () => {
  const { medicines, quickReorderProposal, viewMedicineDetails, addToast } = useERP();
  const [analyzing, setAnalyzing] = useState(false);

  const handleRefreshAI = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      addToast('success', 'Model Recalibrated', 'AI demand curves updated with latest clinical dispensing velocity.');
    }, 900);
  };

  const highRiskMedicines = medicines.filter((m) => m.riskLevel === 'High' || m.status === 'Critical');
  const moderateRiskMedicines = medicines.filter((m) => m.riskLevel === 'Medium' || m.status === 'Low Stock');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Neural Predictive Engine
            </span>
          </div>
          <h2 className="text-[28px] font-bold text-white tracking-tight">
            AI Demand & Risk Forecasting
          </h2>
          <p className="text-[13.5px] text-zinc-400 mt-0.5">
            Machine learning projections for medication depletion velocity, epidemic spikes, and stockout prevention.
          </p>
        </div>

        <button
          onClick={handleRefreshAI}
          disabled={analyzing}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-[13px] flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Recalibrating Neural Model...' : 'Recalibrate AI Predictions'}
        </button>
      </div>

      {/* Top Bento AI Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bento-card-purple p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-purple-300 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Prediction Accuracy</span>
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <BrainCircuit className="w-4 h-4 text-purple-300" />
            </div>
          </div>
          <div>
            <span className="text-[32px] font-bold text-white font-data-mono leading-none block">
              96.4%
            </span>
            <span className="text-[11.5px] text-purple-300/80 mt-2 block">
              Validated on 4,200+ historical orders
            </span>
          </div>
        </div>

        <div className="bento-card-danger p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-rose-300 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">High Risk SKUs</span>
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div>
            <span className="text-[32px] font-bold text-rose-400 font-data-mono leading-none block">
              {highRiskMedicines.length || 3}
            </span>
            <span className="text-[11.5px] text-rose-300/80 mt-2 block">
              Depletion expected &lt; 5 days
            </span>
          </div>
        </div>

        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Seasonal Demand Surge</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-[32px] font-bold text-emerald-400 font-data-mono leading-none block">
              +18.5%
            </span>
            <span className="text-[11.5px] text-zinc-400 mt-2 block">
              Respiratory & Analgesic categories
            </span>
          </div>
        </div>

        <div className="bento-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Automated PO Saved</span>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <Zap className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div>
            <span className="text-[32px] font-bold text-sky-400 font-data-mono leading-none block">
              $14,200
            </span>
            <span className="text-[11.5px] text-zinc-400 mt-2 block">
              Prevented emergency courier fees
            </span>
          </div>
        </div>
      </div>

      {/* Main Bento Predictive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4.5">
        {/* Urgent AI Reorder Proposals (2 cols) */}
        <div className="lg:col-span-2 bento-card p-5.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-[17px] font-bold text-white tracking-tight">
                  Neural Reorder Recommendations
                </h3>
              </div>
              <span className="text-xs text-zinc-400 font-medium">Real-time dynamic replenishment</span>
            </div>

            <div className="space-y-3">
              {medicines.slice(0, 4).map((med) => {
                const isUrgent = med.status === 'Critical' || med.riskLevel === 'High';
                const recommendedQty = Math.max(500, med.threshold * 2 - med.currentStock);

                return (
                  <div
                    key={med.id}
                    className={`rounded-2xl p-4 border transition-all ${
                      isUrgent
                        ? 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-zinc-900/70 border-zinc-800 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            onClick={() => viewMedicineDetails(med.id)}
                            className="font-bold text-[15px] text-white hover:text-sky-400 cursor-pointer transition-colors"
                          >
                            {med.name}
                          </h4>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isUrgent
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {isUrgent ? 'Urgent Risk' : 'Recommended'}
                          </span>
                        </div>
                        <p className="text-[12px] font-data-mono text-zinc-400 mt-1">
                          Current Stock: <strong className={isUrgent ? 'text-rose-400' : 'text-zinc-200'}>{med.currentStock}</strong> | Threshold: {med.threshold} | Velocity: ~{med.predictedVelocity}/day
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => viewMedicineDetails(med.id)}
                          className="px-3 py-2 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          Telemetry
                        </button>
                        <button
                          type="button"
                          onClick={() => quickReorderProposal(med.id)}
                          className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-purple-500/20"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Order {recommendedQty}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>Model Version: <strong>Biomed-LSTM-v4.2</strong></span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Continuously trained on hospital ward consumption
            </span>
          </div>
        </div>

        {/* AI Insights & Seasonal Trends Box (1 col) */}
        <div className="space-y-4">
          <div className="bento-card-purple p-5 space-y-4">
            <h3 className="font-bold text-[16px] text-white flex items-center gap-2 pb-2 border-b border-purple-500/30">
              <Activity className="w-4 h-4 text-purple-400" />
              Clinical Forecast Signals
            </h3>

            <div className="space-y-3 text-xs">
              <div className="bg-zinc-900/80 rounded-xl p-3 border border-purple-500/20 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-[12.5px]">Influenza / Respiratory Peak</span>
                  <span className="text-emerald-400 font-bold font-data-mono">+28%</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Projected 28% jump in demand for Antibiotics and Bronchodilators over the next 14 days based on regional CDC weather patterns.
                </p>
              </div>

              <div className="bg-zinc-900/80 rounded-xl p-3 border border-purple-500/20 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-[12.5px]">Supply Chain Lead Time Drift</span>
                  <span className="text-amber-400 font-bold font-data-mono">+1.8 days</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  PharmaCorp delivery transit time increased by 1.8 days due to port cold-chain bottlenecks. Reorder points adjusted automatically.
                </p>
              </div>

              <div className="bg-zinc-900/80 rounded-xl p-3 border border-purple-500/20 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-[12.5px]">Zero-Waste Expiry Alert</span>
                  <span className="text-sky-400 font-bold font-data-mono">99.8% safe</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  FIFO dispensing algorithms ensured that 100% of expiring lots were allocated to high-turnover ICU wards ahead of expiration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
