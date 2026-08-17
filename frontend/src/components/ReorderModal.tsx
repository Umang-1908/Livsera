import React, { useState } from 'react';
import { X, Sparkles, Truck, CheckCircle2, DollarSign, Calendar } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const ReorderModal: React.FC = () => {
  const { isReorderOpen, closeReorderModal, reorderTarget, medicines, executeReorder } = useERP();

  if (!isReorderOpen || !reorderTarget) return null;

  const medicine = medicines.find((m) => m.id === reorderTarget.medicineId);
  if (!medicine) return null;

  const [orderQty, setOrderQty] = useState<number>(reorderTarget.recommendedQty);
  const [submitting, setSubmitting] = useState(false);

  const estimatedCost = orderQty * medicine.unitPrice;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      executeReorder(medicine.id, orderQty);
      setSubmitting(false);
      closeReorderModal();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121318] border border-zinc-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4.5 border-b border-zinc-800 flex items-center justify-between bg-purple-500/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-white">AI Purchase Reorder PO</h3>
              <p className="text-[11px] text-purple-300 font-data-mono">
                Automated Formulary Replenishment
              </p>
            </div>
          </div>
          <button
            onClick={closeReorderModal}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirm} className="p-5 space-y-4">
          <div className="bg-zinc-900/80 rounded-xl p-3.5 border border-zinc-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Medicine Formulary:</span>
              <strong className="text-white">{medicine.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">SKU / Dosage:</span>
              <span className="font-data-mono text-zinc-300">{medicine.sku} • {medicine.dosage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Current Stock Balance:</span>
              <span className="font-data-mono font-bold text-rose-400">{medicine.currentStock} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Contracted Supplier:</span>
              <span className="text-sky-400 font-semibold">{medicine.supplier}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Purchase Quantity (Units)
            </label>
            <input
              type="number"
              min={1}
              required
              value={orderQty}
              onChange={(e) => setOrderQty(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-data-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-purple-300 font-medium block">Total Purchase Value</span>
              <span className="text-[10px] text-zinc-400 font-data-mono">${medicine.unitPrice.toFixed(2)} / unit</span>
            </div>
            <span className="text-[18px] font-bold font-data-mono text-purple-300">
              ${estimatedCost.toFixed(2)}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeReorderModal}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || orderQty <= 0}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {submitting ? 'Transmitting PO...' : 'Transmit Purchase Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
