import React, { useState } from 'react';
import {
  ArrowLeft,
  Package,
  Calendar,
  Truck,
  TrendingUp,
  BrainCircuit,
  AlertTriangle,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const MedicineDetailsView: React.FC = () => {
  const {
    selectedMedicineId,
    medicines,
    stockLogs,
    navigateTo,
    openLogStockModal,
    quickReorderProposal,
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'logs' | 'batches'>('overview');

  const medicine = medicines.find((m) => m.id === selectedMedicineId) || medicines[0];

  if (!medicine) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <p>No medicine selected.</p>
        <button
          onClick={() => navigateTo('inventory')}
          className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-semibold"
        >
          Return to Inventory
        </button>
      </div>
    );
  }

  // Filter stock logs for this medicine
  const medLogs = stockLogs.filter((l) => l.medicineId === medicine.id);

  // Mock batch records
  const batches = [
    { batchNo: 'BCH-2024-842', expiry: medicine.earliestExpiry, qty: Math.round(medicine.currentStock * 0.6), status: 'Active Quarantine Passed' },
    { batchNo: 'BCH-2024-119', expiry: '2027-04-15', qty: Math.round(medicine.currentStock * 0.4), status: 'Reserve Storage' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Back Button & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('inventory')}
            className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-colors"
            title="Back to Inventory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[24px] font-bold text-white tracking-tight">
                {medicine.name}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  medicine.status === 'In Stock'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : medicine.status === 'Low Stock'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {medicine.status}
              </span>
            </div>
            <p className="text-[12px] font-data-mono text-zinc-400">
              SKU: {medicine.sku} • Category: {medicine.category}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openLogStockModal(medicine.id)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-semibold text-[12.5px] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            Log Stock Intake / Out
          </button>
          <button
            onClick={() => quickReorderProposal(medicine.id)}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl font-semibold text-[12.5px] transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Reorder PO
          </button>
        </div>
      </div>

      {/* Bento Grid Top Section: Key Metrics + AI Predictive Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="bento-card p-4">
          <span className="text-[11.5px] text-zinc-400 font-medium">On-Hand Stock</span>
          <p className="text-[26px] font-bold text-white font-data-mono mt-1">
            {medicine.currentStock} <span className="text-xs text-zinc-400 font-sans font-normal">units</span>
          </p>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2">
            <div
              className={`h-full rounded-full ${
                medicine.status === 'In Stock' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              style={{
                width: `${Math.min(100, Math.round((medicine.currentStock / (medicine.threshold * 2 || 1)) * 100))}%`,
              }}
            />
          </div>
        </div>

        <div className="bento-card p-4">
          <span className="text-[11.5px] text-zinc-400 font-medium">Min Par Threshold</span>
          <p className="text-[26px] font-bold text-amber-400 font-data-mono mt-1">
            {medicine.threshold} <span className="text-xs text-zinc-400 font-sans font-normal">units</span>
          </p>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            Auto-trigger replenishment level
          </span>
        </div>

        <div className="bento-card p-4">
          <span className="text-[11.5px] text-zinc-400 font-medium">Unit Acquisition Price</span>
          <p className="text-[26px] font-bold text-emerald-400 font-data-mono mt-1">
            ${medicine.unitPrice.toFixed(2)}
          </p>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            Contracted wholesale cost
          </span>
        </div>

        <div className="bento-card-purple p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] text-purple-300 font-medium">AI Stockout Risk</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-[26px] font-bold text-purple-300 font-data-mono mt-1">
            {medicine.predictedStockoutDays} <span className="text-xs font-sans font-normal">days left</span>
          </p>
          <span className="text-[11px] text-purple-200/80 mt-2 block font-medium">
            Burn velocity: ~{medicine.predictedVelocity} units/day
          </span>
        </div>
      </div>

      {/* Main Bento Layout: Specification Cards & Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4.5">
        {/* Left Column: Formulation Specs */}
        <div className="space-y-4">
          <div className="bento-card p-5 space-y-4">
            <h3 className="font-bold text-[15.5px] text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
              <Package className="w-4 h-4 text-sky-400" />
              Formulary Specs
            </h3>

            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Dosage & Strength</span>
                <span className="text-white font-medium">{medicine.dosage}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Packaging Form</span>
                <span className="text-white font-medium">{medicine.form}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Primary Manufacturer</span>
                <span className="text-white font-medium">{medicine.manufacturer}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Storage Location</span>
                <span className="text-sky-400 font-medium font-data-mono">{medicine.storageLocation}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Earliest Expiry Batch</span>
                <span className="text-amber-400 font-data-mono font-medium">{medicine.earliestExpiry}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">Restock Lead Time</span>
                <span className="text-white font-medium">{medicine.leadTimeDays} business days</span>
              </div>
            </div>
          </div>

          {/* Supplier Info Bento Box */}
          <div className="bento-card p-5 space-y-3">
            <h3 className="font-bold text-[15.5px] text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
              <Truck className="w-4 h-4 text-sky-400" />
              Primary Supply Partner
            </h3>
            <p className="font-semibold text-white text-[14px]">{medicine.supplier}</p>
            <p className="text-xs text-zinc-400">
              Contract status: <strong className="text-emerald-400">Active Tier-1 Authorized</strong>
            </p>
            <button
              onClick={() => navigateTo('suppliers')}
              className="w-full mt-2 py-2 bg-zinc-900 hover:bg-zinc-800 text-sky-400 border border-zinc-800 rounded-xl text-xs font-semibold transition-colors"
            >
              View Supplier Profile
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Tabs for Logs & Batches (2 cols) */}
        <div className="lg:col-span-2 bento-card overflow-hidden flex flex-col">
          {/* Sub Tab Navigation */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold transition-colors ${
                  activeSubTab === 'overview'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Stock History Logs ({medLogs.length})
              </button>
              <button
                onClick={() => setActiveSubTab('batches')}
                className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold transition-colors ${
                  activeSubTab === 'batches'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Active Batches & Expiry
              </button>
            </div>
            <button
              onClick={() => openLogStockModal(medicine.id)}
              className="text-sky-400 hover:text-sky-300 font-semibold text-[12px] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Log Event
            </button>
          </div>

          {/* Sub Tab Content */}
          <div className="p-5 flex-1">
            {activeSubTab === 'overview' ? (
              <div className="space-y-3">
                {medLogs.length === 0 ? (
                  <p className="text-center py-8 text-zinc-500 text-xs">
                    No movements logged yet for this item.
                  </p>
                ) : (
                  medLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl ${
                            log.type === 'IN'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {log.type === 'IN' ? (
                            <ArrowDownRight className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-[13px]">
                              {log.type === 'IN' ? 'Stock Intake (+)' : 'Dispensed / Out (-)'}
                            </span>
                            <span className="text-[11px] font-data-mono text-zinc-400">
                              Lot: {log.batchNumber || 'N/A'}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-zinc-400">{log.notes} • By {log.employee}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-bold font-data-mono text-[14px] ${
                            log.type === 'IN' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {log.type === 'IN' ? `+${log.qty}` : `-${log.qty}`}
                        </span>
                        <p className="text-[10.5px] text-zinc-500 font-data-mono">{log.timestamp.split('T')[0]}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Batches List */
              <div className="space-y-3">
                {batches.map((b) => (
                  <div
                    key={b.batchNo}
                    className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-data-mono text-white text-[13px]">{b.batchNo}</span>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10.5px] px-2 py-0.5 rounded-md font-semibold">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-zinc-400 mt-0.5">
                        Expiry Date: <strong className="text-amber-400 font-data-mono">{b.expiry}</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-data-mono font-bold text-white text-[14px]">{b.qty}</span>
                      <span className="text-xs text-zinc-400 block">units in lot</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
