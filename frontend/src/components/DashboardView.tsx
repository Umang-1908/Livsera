import React, { useState } from 'react';
import {
  ShoppingCart,
  DollarSign,
  Pill,
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  Plus,
  BrainCircuit,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Layers,
  Activity,
  Boxes
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const DashboardView: React.FC = () => {
  const { medicines, orders, navigateTo, viewMedicineDetails, quickReorderProposal } = useERP();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [hoveredPoint, setHoveredPoint] = useState<{ day: string; value: number; sales: number } | null>(null);

  // Live calculations from state
  const totalStockItems = medicines.reduce((acc, m) => acc + m.currentStock, 0);
  const lowStockMedicines = medicines.filter(
    (m) => m.status === 'Low Stock' || m.status === 'Critical' || m.status === 'Out of Stock'
  );
  const pendingOrders = orders.filter((o) => o.status === 'Pending');

  // Chart data for weekly trends
  const chartData = [
    { day: 'Mon', value: 320, sales: 3450 },
    { day: 'Tue', value: 410, sales: 4250 },
    { day: 'Wed', value: 380, sales: 3900 },
    { day: 'Thu', value: 520, sales: 5100 },
    { day: 'Fri', value: 680, sales: 6890 },
    { day: 'Sat', value: 490, sales: 4800 },
    { day: 'Sun', value: 580, sales: 5600 },
  ];

  const inStockPct = Math.round(
    (medicines.filter((m) => m.status === 'In Stock').length / (medicines.length || 1)) * 100
  );
  const lowStockPct = Math.round(
    (medicines.filter((m) => m.status === 'Low Stock').length / (medicines.length || 1)) * 100
  );
  const outOfStockPct = Math.max(0, 100 - inStockPct - lowStockPct);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
              Live Operations
            </span>
          </div>
          <h2 className="text-[28px] font-bold text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-[13.5px] text-zinc-400 mt-0.5">
            Real-time dispensing velocity, pharmaceutical inventory telemetry, and AI forecasting.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigateTo('reports')}
            className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-[13px] font-medium flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            Export Audit
          </button>
          <button
            onClick={() => navigateTo('create-order')}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-4.5 py-2.5 rounded-xl transition-all text-[13px] font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Create Order
          </button>
        </div>
      </div>

      {/* Bento Metric Cards (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Orders */}
        <div 
          onClick={() => navigateTo('orders')}
          className="bento-card p-4.5 flex flex-col justify-between hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-[12.5px] font-semibold">Total Orders</span>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-[28px] font-bold text-white tracking-tight leading-none block font-data-mono">
              1,240
            </span>
            <span className="text-[11.5px] text-emerald-400 font-medium flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +5.2% this week
            </span>
          </div>
        </div>

        {/* Today's Sales */}
        <div 
          onClick={() => navigateTo('orders')}
          className="bento-card p-4.5 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-[12.5px] font-semibold">Today's Sales</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-[28px] font-bold text-white tracking-tight leading-none block font-data-mono">
              $4,250
            </span>
            <span className="text-[11.5px] text-emerald-400 font-medium flex items-center gap-1 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +12% vs yesterday
            </span>
          </div>
        </div>

        {/* Total SKU Medicines */}
        <div 
          onClick={() => navigateTo('inventory')}
          className="bento-card p-4.5 flex flex-col justify-between hover:border-zinc-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-[12.5px] font-semibold">Active Catalog</span>
            <div className="p-2 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-300 group-hover:scale-110 transition-transform">
              <Pill className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div>
            <span className="text-[28px] font-bold text-white tracking-tight leading-none block font-data-mono">
              {medicines.length || 850}
            </span>
            <span className="text-[11.5px] text-zinc-400 mt-2 block">
              Registered Formularies
            </span>
          </div>
        </div>

        {/* Low Stock Items (Highlighted Danger Bento) */}
        <div 
          onClick={() => navigateTo('alerts')}
          className="bento-card-danger p-4.5 flex flex-col justify-between hover:border-rose-500/60 hover:shadow-lg hover:shadow-rose-500/10 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-300 mb-3">
            <span className="text-[12.5px] font-semibold">Low Stock Alerts</span>
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-[28px] font-bold text-rose-400 tracking-tight leading-none block font-data-mono">
              {lowStockMedicines.length || 12}
            </span>
            <span className="text-[11.5px] text-rose-300/90 font-medium mt-2 flex items-center gap-1">
              Action required • Review
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div 
          onClick={() => navigateTo('orders')}
          className="bento-card p-4.5 flex flex-col justify-between hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-[12.5px] font-semibold">Pending Orders</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-[28px] font-bold text-white tracking-tight leading-none block font-data-mono">
              {pendingOrders.length || 8}
            </span>
            <span className="text-[11.5px] text-zinc-400 mt-2 block">
              In Clinician Review
            </span>
          </div>
        </div>
      </div>

      {/* Main Bento Grid Row: Analytics Chart + AI Predictive Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4.5">
        {/* Sales Overview Chart (2 cols) */}
        <div className="lg:col-span-2 bento-card p-5.5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <h3 className="text-[17px] font-bold text-white tracking-tight">Prescription & Dispensing Velocity</h3>
              </div>
              <p className="text-[12px] text-zinc-400 mt-0.5">Automated dispensing volumes and pharmacy revenue stream</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-zinc-900 p-1 rounded-xl flex items-center border border-zinc-800 text-xs">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all ${
                    timeRange === 'week' ? 'bg-sky-500 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all ${
                    timeRange === 'month' ? 'bg-sky-500 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas with Glowing Wave */}
          <div className="flex-1 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 p-4 relative overflow-hidden flex flex-col justify-between min-h-[290px]">
            {/* SVG Trend Wave with Hover Interaction */}
            <div className="relative w-full h-52 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartBentoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                    <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,170 C80,150 140,110 210,130 C280,150 350,90 420,60 C490,30 560,95 630,40 L700,20 L700,200 L0,200 Z"
                  fill="url(#chartBentoGrad)"
                />
                <path
                  d="M0,170 C80,150 140,110 210,130 C280,150 350,90 420,60 C490,30 560,95 630,40 L700,20"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Data overlay points */}
              <div className="absolute inset-0 flex justify-between items-end px-4 pb-2">
                {chartData.map((pt) => (
                  <div
                    key={pt.day}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="flex flex-col items-center group cursor-pointer h-full justify-end"
                  >
                    {hoveredPoint?.day === pt.day && (
                      <div className="bg-zinc-900 border border-zinc-700 text-white text-[11px] px-3 py-1.5 rounded-xl shadow-xl font-data-mono mb-2 whitespace-nowrap z-20 animate-in fade-in">
                        <span className="text-sky-400 font-bold">{pt.day}:</span> ${pt.sales.toLocaleString()} ({pt.value} units)
                      </div>
                    )}
                    <div className="w-3.5 h-3.5 rounded-full bg-sky-400 ring-4 ring-sky-500/20 group-hover:scale-125 transition-transform" />
                    <span className="text-[11.5px] font-semibold text-zinc-400 mt-2 group-hover:text-sky-300">
                      {pt.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-zinc-800 text-xs">
              <span className="text-zinc-400 font-medium">Avg Daily Revenue: <strong className="text-white font-data-mono font-bold">$4,860</strong></span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last cycle
              </span>
            </div>
          </div>
        </div>

        {/* AI Insights & Inventory Status (Right Bento Column) */}
        <div className="flex flex-col gap-4.5">
          {/* AI Demand Insights Bento Box */}
          <div className="bento-card-purple p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-white">AI Demand Insights</h3>
                  <p className="text-[11px] text-purple-300/80">Neural Model Active</p>
                </div>
              </div>
              <span className="text-[10.5px] font-bold bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 94% Conf.
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Insight 1 */}
              <div 
                onClick={() => viewMedicineDetails('med-para-500')}
                className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <div>
                    <p className="text-[12.5px] text-zinc-100 leading-snug">
                      <strong className="text-white">Paracetamol</strong> demand surging <span className="text-emerald-400 font-bold">(+15%)</span>.
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Predicted seasonal respiratory spike.
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight 2 */}
              <div 
                onClick={() => viewMedicineDetails('med-ato-020')}
                className="bg-zinc-900/80 rounded-xl p-3 border border-rose-500/30 hover:border-rose-500 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0 animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                  <div>
                    <p className="text-[12.5px] text-zinc-100 leading-snug">
                      <strong className="text-white">Atorvastatin</strong> risk: Runout in 4 days.
                    </p>
                    <p className="text-[11px] text-rose-400 font-medium mt-0.5">
                      Action required: Review Reorder PO.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('ai-insights')}
              className="w-full mt-3.5 py-2.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 font-semibold text-[12.5px] rounded-xl border border-purple-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              Open AI Predictive Center <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Inventory Status Gauges Bento Box */}
          <div className="bento-card p-5 flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-[15px] text-white">Inventory Telemetry</h3>
              </div>
              <span className="text-[11.5px] font-data-mono text-zinc-400">{medicines.length} SKUs</span>
            </div>

            <div className="space-y-3.5 py-2">
              {/* In Stock */}
              <div>
                <div className="flex justify-between text-[12px] font-semibold mb-1">
                  <span className="text-zinc-300">In Stock</span>
                  <span className="text-emerald-400 font-data-mono">{inStockPct}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${inStockPct}%` }} />
                </div>
              </div>

              {/* Low Stock */}
              <div>
                <div className="flex justify-between text-[12px] font-semibold mb-1">
                  <span className="text-zinc-300">Low Stock</span>
                  <span className="text-amber-400 font-data-mono">{lowStockPct}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${lowStockPct}%` }} />
                </div>
              </div>

              {/* Out of Stock */}
              <div>
                <div className="flex justify-between text-[12px] font-semibold mb-1">
                  <span className="text-zinc-300">Out of Stock</span>
                  <span className="text-rose-400 font-data-mono">{outOfStockPct}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${outOfStockPct}%` }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('inventory')}
              className="mt-3 pt-3 border-t border-zinc-800/80 text-center text-sky-400 hover:text-sky-300 text-[12.5px] font-semibold flex items-center justify-center gap-1"
            >
              Full Inventory Table <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bento Tables: Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4.5">
        {/* Recent Orders Bento Box (2 cols) */}
        <div className="lg:col-span-2 bento-card overflow-hidden flex flex-col">
          <div className="p-4.5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/40">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-[15.5px] text-white">Recent Orders</h3>
            </div>
            <button
              onClick={() => navigateTo('orders')}
              className="text-sky-400 hover:text-sky-300 font-semibold text-[12.5px] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4.5">Order ID</th>
                  <th className="py-3 px-4.5">Customer</th>
                  <th className="py-3 px-4.5">Total</th>
                  <th className="py-3 px-4.5">Status</th>
                  <th className="py-3 px-4.5 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-zinc-200 divide-y divide-zinc-800/60">
                {orders.slice(0, 4).map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigateTo('orders')}
                    className="hover:bg-zinc-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4.5 font-data-mono text-sky-400 font-semibold">
                      {order.id}
                    </td>
                    <td className="py-3 px-4.5 font-medium text-white">{order.customer}</td>
                    <td className="py-3 px-4.5 font-data-mono font-semibold text-emerald-400">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          order.status === 'Success'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4.5 text-zinc-400 text-[12px] hidden sm:table-cell">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Mini Bento Box */}
        <div className="bento-card overflow-hidden flex flex-col">
          <div className="p-4.5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/40">
            <h3 className="font-bold text-[15.5px] text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Low Stock Alerts
            </h3>
            <button
              onClick={() => navigateTo('alerts')}
              className="text-sky-400 font-semibold text-[12px] hover:underline"
            >
              Alerts ({lowStockMedicines.length})
            </button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 max-h-[260px]">
            {lowStockMedicines.slice(0, 4).map((med) => (
              <div
                key={med.id}
                onClick={() => viewMedicineDetails(med.id)}
                className="p-3.5 hover:bg-zinc-800/40 transition-colors flex justify-between items-center cursor-pointer group"
              >
                <div>
                  <p className="font-semibold text-[13px] text-white group-hover:text-sky-400 transition-colors">
                    {med.name}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-data-mono mt-0.5">
                    Current: <strong className={med.status === 'Critical' ? 'text-rose-400' : 'text-amber-400'}>{med.currentStock}</strong> | Min: {med.threshold}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10.5px] font-bold uppercase tracking-wider ${
                      med.status === 'Critical' || med.status === 'Out of Stock'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {med.status === 'Out of Stock' ? 'Zero Stock' : med.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
