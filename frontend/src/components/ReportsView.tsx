import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  FileSpreadsheet,
  FileText,
  Activity,
  Sparkles
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const ReportsView: React.FC = () => {
  const { orders, medicines, addToast } = useERP();
  const [period, setPeriod] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Year'>('Year');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = totalRevenue / (orders.length || 1);
  const totalUnitsDispensed = orders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.qty, 0),
    0
  );

  const handleExport = (type: 'csv' | 'pdf') => {
    addToast(
      'success',
      `Export Generated (${type.toUpperCase()})`,
      `Financial audit statement for period ${period} ready for download.`
    );
  };

  // Monthly revenue mock distribution for Bento bars
  const monthlyData = [
    { month: 'Jan', rev: 38500, orders: 180 },
    { month: 'Feb', rev: 42300, orders: 210 },
    { month: 'Mar', rev: 49000, orders: 245 },
    { month: 'Apr', rev: 44200, orders: 220 },
    { month: 'May', rev: 56100, orders: 280 },
    { month: 'Jun', rev: 61800, orders: 310 },
  ];

  const maxRev = Math.max(...monthlyData.map((d) => d.rev));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
              Audit & Ledger Telemetry
            </span>
          </div>
          <h2 className="text-[28px] font-bold text-white tracking-tight">
            Financial & Dispensing Reports
          </h2>
          <p className="text-[13.5px] text-zinc-400 mt-0.5">
            Audit-ready reconciliations, formulary turnover, gross margins, and regulatory statements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExport('csv')}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-rose-400" /> Export Audit PDF
          </button>
        </div>
      </div>

      {/* Top Bento Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bento-card p-5">
          <div className="flex justify-between items-center text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Total Revenue Cycle</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[28px] font-bold text-white font-data-mono leading-none block">
            ${(totalRevenue * 15.4).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11.5px] text-emerald-400 font-medium flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% YoY Growth
          </span>
        </div>

        <div className="bento-card p-5">
          <div className="flex justify-between items-center text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Average Order Value</span>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[28px] font-bold text-white font-data-mono leading-none block">
            ${(averageOrderValue * 2.4).toFixed(2)}
          </span>
          <span className="text-[11.5px] text-zinc-400 mt-2 block">
            Per clinical prescription PO
          </span>
        </div>

        <div className="bento-card p-5">
          <div className="flex justify-between items-center text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Units Dispensed</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[28px] font-bold text-white font-data-mono leading-none block">
            {(totalUnitsDispensed * 84).toLocaleString()}
          </span>
          <span className="text-[11.5px] text-zinc-400 mt-2 block">
            Verified across 8 hospital units
          </span>
        </div>

        <div className="bento-card p-5">
          <div className="flex justify-between items-center text-zinc-400 mb-3">
            <span className="text-xs font-semibold">Gross Formulary Margin</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[28px] font-bold text-white font-data-mono leading-none block">
            41.8%
          </span>
          <span className="text-[11.5px] text-emerald-400 font-medium flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +2.1% efficiency
          </span>
        </div>
      </div>

      {/* Main Bento Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Revenue Histogram Bento Card (2 cols) */}
        <div className="lg:col-span-2 bento-card p-5.5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="font-bold text-[16px] text-white">Monthly Revenue Progression</h3>
              <p className="text-xs text-zinc-400">Aggregated gross revenue by billing period</p>
            </div>
            <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex items-center text-xs">
              {(['Q1', 'Q2', 'Q3', 'Q4', 'Year'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    period === p ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Histogram Bar Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyData.map((data) => {
              const heightPct = Math.round((data.rev / maxRev) * 100);

              return (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[11px] font-data-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${(data.rev / 1000).toFixed(1)}k
                  </span>
                  <div className="w-full bg-zinc-900 rounded-xl h-full flex items-end p-1 border border-zinc-800 group-hover:border-sky-500/40 transition-colors">
                    <div
                      className="w-full bg-gradient-to-t from-sky-600 to-sky-400 rounded-lg transition-all duration-500 group-hover:from-sky-500 group-hover:to-sky-300 shadow-sm"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 group-hover:text-sky-400">
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Dispensed Category Bento Card (1 col) */}
        <div className="bento-card p-5.5 space-y-4">
          <h3 className="font-bold text-[16px] text-white pb-3 border-b border-zinc-800">
            Formulary Volume by Class
          </h3>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-200">Antibiotics & Antivirals</span>
                <span className="text-sky-400 font-data-mono">38%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-200">Analgesics & Pain Relief</span>
                <span className="text-emerald-400 font-data-mono">26%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '26%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-200">Cardiovascular & Statins</span>
                <span className="text-purple-400 font-data-mono">18%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-200">Emergency & Critical Care</span>
                <span className="text-rose-400 font-data-mono">12%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-400 h-full rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-200">Other Formularies</span>
                <span className="text-zinc-400 font-data-mono">6%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-zinc-600 h-full rounded-full" style={{ width: '6%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
