import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, CheckCircle2, Layers } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const LogStockChangeModal: React.FC = () => {
  const {
    isLogStockOpen,
    closeLogStockModal,
    activeMedicineForLog,
    medicines,
    logStockMovement,
  } = useERP();

  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [qty, setQty] = useState<number>(100);
  const [batchNumber, setBatchNumber] = useState<string>('BCH-2025-01');
  const [notes, setNotes] = useState<string>('Routine ward stock replenishment');

  if (!isLogStockOpen || !activeMedicineForLog) return null;

  const medicine = medicines.find((m) => m.id === activeMedicineForLog);
  if (!medicine) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) return;

    logStockMovement(medicine.id, type, qty, notes, batchNumber);
    closeLogStockModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121318] border border-zinc-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4.5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[16px] text-white">Log Stock Movement</h3>
            <p className="text-[11.5px] text-zinc-400 font-data-mono mt-0.5">
              {medicine.name} ({medicine.sku})
            </p>
          </div>
          <button
            onClick={closeLogStockModal}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Movement Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Movement Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('IN')}
                className={`py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                  type === 'IN'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" /> Stock Intake (+)
              </button>
              <button
                type="button"
                onClick={() => setType('OUT')}
                className={`py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                  type === 'OUT'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" /> Dispensed / Out (-)
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Quantity (Units) *
            </label>
            <input
              type="number"
              min={1}
              required
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-data-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
            <p className="text-[11px] text-zinc-500 mt-1 font-data-mono">
              Current inventory balance: {medicine.currentStock} units
            </p>
          </div>

          {/* Batch Number */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Batch / Lot Number
            </label>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="e.g. BCH-2025-081"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-data-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </div>

          {/* Reason / Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Reason / Destination Ward
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Received from PharmaCorp shipment / Transferred to ICU"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeLogStockModal}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-sky-500/20"
            >
              Confirm Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
