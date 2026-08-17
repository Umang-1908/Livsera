import React, { useState } from 'react';
import { X, Plus, Package, DollarSign, Calendar, Layers } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const AddItemModal: React.FC = () => {
  const { isAddMedicineOpen, setIsAddMedicineOpen, addMedicine } = useERP();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Antibiotics');
  const [dosage, setDosage] = useState('');
  const [form, setForm] = useState('Tablet');
  const [currentStock, setCurrentStock] = useState(500);
  const [threshold, setThreshold] = useState(150);
  const [unitPrice, setUnitPrice] = useState(12.50);
  const [supplier, setSupplier] = useState('PharmaCorp Global');
  const [manufacturer, setManufacturer] = useState('Novartis Pharma');
  const [storageLocation, setStorageLocation] = useState('Aisle 2 - Shelf B');
  const [earliestExpiry, setEarliestExpiry] = useState('2026-12-31');

  if (!isAddMedicineOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    addMedicine({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category,
      dosage: dosage.trim() || '500mg',
      form,
      currentStock,
      threshold,
      unitPrice,
      supplier,
      manufacturer,
      storageLocation,
      earliestExpiry,
    });

    setIsAddMedicineOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121318] border border-zinc-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-white">Add Medicine Formulary SKU</h3>
              <p className="text-[11.5px] text-zinc-400">Register new item to clinical catalog</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddMedicineOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-zinc-400 mb-1">
                Medicine Commercial / Generic Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amoxicillin Trihydrate"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">SKU / Formulary Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. AMX-500-TAB"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white uppercase font-data-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Category / Drug Class</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="Antibiotics">Antibiotics</option>
                <option value="Analgesics">Analgesics</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Emergency Rx">Emergency Rx</option>
                <option value="PPE & Sterile">PPE & Sterile</option>
                <option value="Endocrinology">Endocrinology</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Dosage / Strength</label>
              <input
                type="text"
                placeholder="e.g. 500mg / 10ml"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Form</label>
              <select
                value={form}
                onChange={(e) => setForm(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Vial Injection">Vial Injection</option>
                <option value="Oral Liquid">Oral Liquid</option>
                <option value="Topical Gel">Topical Gel</option>
                <option value="Sterile Box">Sterile Box</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Initial Stock Count</label>
              <input
                type="number"
                min={0}
                value={currentStock}
                onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-data-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Minimum Alert Threshold</label>
              <input
                type="number"
                min={1}
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-data-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-data-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Storage Bay Location</label>
              <input
                type="text"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="e.g. Vault 3 - Cold 4°C"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-data-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Primary Supplier</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Earliest Lot Expiry</label>
              <input
                type="date"
                value={earliestExpiry}
                onChange={(e) => setEarliestExpiry(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-data-mono focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddMedicineOpen(false)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-sky-500/20"
            >
              Add to Formulary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
