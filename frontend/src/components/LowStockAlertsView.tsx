import React, { useState } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Package,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const LowStockAlertsView: React.FC = () => {
  const { medicines, quickReorderProposal, viewMedicineDetails, navigateTo } = useERP();
  const [filter, setFilter] = useState<'all' | 'critical' | 'low'>('all');

  const alertItems = medicines.filter((m) => {
    if (filter === 'critical') return m.status === 'Critical' || m.status === 'Out of Stock';
    if (filter === 'low') return m.status === 'Low Stock';
    return m.status === 'Low Stock' || m.status === 'Critical' || m.status === 'Out of Stock';
  });

  const criticalCount = medicines.filter((m) => m.status === 'Critical' || m.status === 'Out of Stock').length;
  const lowCount = medicines.filter((m) => m.status === 'Low Stock').length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
              Supply Protection Active
            </span>
          </div>
          <h2 className="text-[26px] font-bold text-white tracking-tight">
            Low Stock & Critical Alert Center
          </h2>
          <p className="text-[13.5px] text-zinc-400 mt-0.5">
            Automated threshold surveillance to prevent ward stockouts and treatment delays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex items-center shadow-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                filter === 'all' ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({criticalCount + lowCount})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                filter === 'critical' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                filter === 'low' ? 'bg-amber-500 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Low Stock ({lowCount})
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
        {alertItems.map((med) => {
          const isCritical = med.status === 'Critical' || med.status === 'Out of Stock';
          const recommendedOrder = Math.max(500, med.threshold * 3 - med.currentStock);

          return (
            <div
              key={med.id}
              className={`p-5 flex flex-col justify-between hover:shadow-xl transition-all ${
                isCritical ? 'bento-card-danger' : 'bento-card'
              }`}
            >
              <div>
                {/* Status bar */}
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {med.status === 'Out of Stock' ? 'STOCKOUT' : med.status}
                  </span>
                  <span className="text-[11px] font-data-mono text-zinc-400">
                    Lead time: {med.leadTimeDays}d
                  </span>
                </div>

                <h3
                  onClick={() => viewMedicineDetails(med.id)}
                  className="font-bold text-[16px] text-white hover:text-sky-400 cursor-pointer transition-colors"
                >
                  {med.name}
                </h3>
                <p className="text-[12px] text-zinc-400 mt-0.5 font-data-mono">
                  {med.sku} • {med.dosage}
                </p>

                {/* Stock Level Bar */}
                <div className="my-4 bg-zinc-900/80 rounded-xl p-3 border border-zinc-800/80 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">Current Balance</span>
                    <span className={`font-data-mono ${isCritical ? 'text-rose-400 font-bold' : 'text-amber-400'}`}>
                      {med.currentStock} / {med.threshold} min
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-400'}`}
                      style={{
                        width: `${Math.min(100, Math.round((med.currentStock / (med.threshold * 2 || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 pt-1">
                    <span>Burn Velocity: ~{med.predictedVelocity}/day</span>
                    <span className="text-purple-400 font-medium">Est. {med.predictedStockoutDays}d left</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => viewMedicineDetails(med.id)}
                  className="text-[12.5px] text-zinc-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
                >
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => quickReorderProposal(med.id)}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-3.5 py-1.5 rounded-xl font-semibold text-[12px] flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Order {recommendedOrder} Units
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {alertItems.length === 0 && (
        <div className="bento-card p-12 text-center text-zinc-400 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">All Stock Levels Secure</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            No medicine stock levels are currently below safety thresholds. The clinical inventory is fully backed up.
          </p>
        </div>
      )}
    </div>
  );
};
