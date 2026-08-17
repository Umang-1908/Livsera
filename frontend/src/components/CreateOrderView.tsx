import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Search,
  DollarSign,
  User,
  Building,
  CreditCard,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { Medicine } from '../types';

export const CreateOrderView: React.FC = () => {
  const { medicines, createOrder, navigateTo } = useERP();

  const [customer, setCustomer] = useState('');
  const [department, setDepartment] = useState('Inpatient Ward A');
  const [selectedItems, setSelectedItems] = useState<{ medicine: Medicine; qty: number }[]>([]);
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Available medicines search
  const availableMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.sku.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const addItemToOrder = (medicine: Medicine) => {
    const existing = selectedItems.find((i) => i.medicine.id === medicine.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.medicine.id === medicine.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { medicine, qty: 1 }]);
    }
  };

  const updateItemQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setSelectedItems(selectedItems.filter((i) => i.medicine.id !== id));
    } else {
      setSelectedItems(
        selectedItems.map((i) => (i.medicine.id === id ? { ...i, qty } : i))
      );
    }
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter((i) => i.medicine.id !== id));
  };

  // Pricing calculations
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.medicine.unitPrice * item.qty,
    0
  );
  const tax = subtotal * 0.05; // 5% tax
  const grandTotal = subtotal + tax;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim()) return;
    if (selectedItems.length === 0) return;

    setSubmitting(true);
    setTimeout(() => {
      createOrder({
        customer: customer.trim(),
        total: grandTotal,
        status: paymentStatus === 'Paid' ? 'Success' : 'Pending',
        items: selectedItems.map((i) => ({
          medicineId: i.medicine.id,
          name: i.medicine.name,
          qty: i.qty,
          unitPrice: i.medicine.unitPrice,
        })),
      });
      setSubmitting(false);
      navigateTo('orders');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('orders')}
            className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-colors"
            title="Back to Orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-[26px] font-bold text-white tracking-tight">
              Create Dispensing Order
            </h2>
            <p className="text-[13.5px] text-zinc-400 mt-0.5">
              Issue medication batches to wards, outpatient clinics, or hospital departments.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Item Picker & Selected Items */}
        <div className="lg:col-span-2 space-y-5">
          {/* Formulary Search & Selector Bento Card */}
          <div className="bento-card p-5 space-y-4">
            <h3 className="font-bold text-[16px] text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-sky-400" />
              Select Formulary Medicines
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medication name, dosage, or SKU..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
              {availableMedicines.slice(0, 8).map((med) => {
                const inOrder = selectedItems.find((i) => i.medicine.id === med.id);
                const isOutOfStock = med.currentStock <= 0;

                return (
                  <div
                    key={med.id}
                    onClick={() => !isOutOfStock && addItemToOrder(med)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isOutOfStock
                        ? 'opacity-40 bg-zinc-900 border-zinc-800 cursor-not-allowed'
                        : inOrder
                        ? 'bg-sky-500/10 border-sky-500/40'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-[13.5px] text-white leading-tight">
                        {med.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-data-mono mt-0.5">
                        {med.dosage} • ${med.unitPrice.toFixed(2)}
                      </p>
                      <p className="text-[10.5px] text-zinc-400 font-data-mono">
                        Available: <strong className={med.currentStock < med.threshold ? 'text-amber-400' : 'text-emerald-400'}>{med.currentStock}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isOutOfStock}
                      className={`p-1.5 rounded-lg text-xs font-semibold ${
                        inOrder
                          ? 'bg-sky-500 text-white'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Items List Bento Card */}
          <div className="bento-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="font-bold text-[16px] text-white">
                Order Items ({selectedItems.length})
              </h3>
              <span className="text-xs text-zinc-400 font-data-mono">
                Subtotal: ${subtotal.toFixed(2)}
              </span>
            </div>

            {selectedItems.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 space-y-2">
                <ShoppingCart className="w-8 h-8 mx-auto text-zinc-600" />
                <p className="text-xs">No medications added to order yet.</p>
                <p className="text-[11px] text-zinc-600">Click any medicine card above to add.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {selectedItems.map((item) => (
                  <div key={item.medicine.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[13.5px] text-white">
                        {item.medicine.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-data-mono">
                        ${item.medicine.unitPrice.toFixed(2)} each • {item.medicine.dosage}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity counter */}
                      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden text-xs">
                        <button
                          type="button"
                          onClick={() => updateItemQty(item.medicine.id, item.qty - 1)}
                          className="px-2.5 py-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold font-data-mono text-white">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItemQty(item.medicine.id, item.qty + 1)}
                          className="px-2.5 py-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-bold font-data-mono text-emerald-400 text-[13.5px] min-w-[70px] text-right">
                        ${(item.medicine.unitPrice * item.qty).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(item.medicine.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Customer Details & Order Summary */}
        <div className="space-y-5">
          {/* Recipient Details Bento Card */}
          <div className="bento-card p-5 space-y-4">
            <h3 className="font-bold text-[16px] text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
              <User className="w-4 h-4 text-sky-400" />
              Recipient / Client
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">
                  Customer / Patient / Facility *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Jude Memorial Hospital"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">
                  Department / Ward
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                >
                  <option value="Inpatient Ward A">Inpatient Ward A (General)</option>
                  <option value="ICU Critical Care">ICU Critical Care Unit</option>
                  <option value="Emergency Room">Emergency Room (Trauma)</option>
                  <option value="Outpatient Pharmacy">Outpatient Pharmacy Clinic</option>
                  <option value="Pediatrics">Pediatrics Department</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">
                  Payment / Authorization Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Paid')}
                    className={`py-2 rounded-xl font-semibold transition-colors ${
                      paymentStatus === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    Paid / Cleared
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Pending')}
                    className={`py-2 rounded-xl font-semibold transition-colors ${
                      paymentStatus === 'Pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    Pending Billing
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">
                  Dispensing Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Doctor authorization code, priority notes..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Summary Bento Card */}
          <div className="bento-card-highlight p-5 space-y-4">
            <h3 className="font-bold text-[16px] text-white pb-2 border-b border-sky-500/30">
              Financial Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>Items Subtotal</span>
                <span className="font-data-mono font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Clinical Handling & Tax (5%)</span>
                <span className="font-data-mono font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[15px] font-bold text-white">
                <span>Total Due</span>
                <span className="font-data-mono text-sky-400 text-[18px]">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || selectedItems.length === 0 || !customer.trim()}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl font-bold text-[13.5px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <span>Generating Order PO...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Complete & Dispense
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
