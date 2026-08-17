import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Receipt,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { Order } from '../types';

export const OrdersView: React.FC = () => {
  const { orders, navigateTo, viewMedicineDetails } = useERP();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((i) => i.medicineName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalValue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const completedCount = orders.filter((o) => o.status === 'Success').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bento-card p-4.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Total Purchase Volume</span>
            <div className="text-[24px] font-bold text-white font-data-mono mt-1">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-zinc-500 font-data-mono">{orders.length} total clinical requisitions</span>
          </div>
          <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20 text-sky-400">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        <div className="bento-card p-4.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Fulfilled Orders</span>
            <div className="text-[24px] font-bold text-emerald-400 font-data-mono mt-1">
              {completedCount}
            </div>
            <span className="text-[11px] text-emerald-400/80 font-data-mono">100% verified dispense</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bento-card p-4.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Pending Orders</span>
            <div className="text-[24px] font-bold text-amber-400 font-data-mono mt-1">
              {pendingCount}
            </div>
            <span className="text-[11px] text-amber-400/80 font-data-mono">In processing pipeline</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bento-card p-4.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Quick Action</span>
            <Receipt className="w-4 h-4 text-purple-400" />
          </div>
          <button
            onClick={() => navigateTo('create-order')}
            className="w-full mt-2 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Issue New Order
          </button>
        </div>
      </div>

      {/* Orders Grid & Detail Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bento-card p-4.5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by Order ID, Hospital, or Formulary SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterStatus === 'all' ? 'bg-sky-500 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  onClick={() => setFilterStatus('success')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Fulfilled
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterStatus === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="pb-3 pl-2">Order Ref</th>
                    <th className="pb-3">Customer / Facility</th>
                    <th className="pb-3">Items Count</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">
                        No requisitions matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isSelected = selectedOrder?.id === order.id;
                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={`cursor-pointer transition-colors group ${
                            isSelected ? 'bg-sky-500/10' : 'hover:bg-zinc-800/40'
                          }`}
                        >
                          <td className="py-3.5 pl-2 font-data-mono font-bold text-white">
                            {order.id}
                          </td>
                          <td className="py-3.5">
                            <div className="font-semibold text-zinc-200">{order.customer}</div>
                            <div className="text-[11px] text-zinc-500">{order.date}</div>
                          </td>
                          <td className="py-3.5 text-zinc-400 font-data-mono">
                            {order.items.length} line {order.items.length === 1 ? 'item' : 'items'}
                          </td>
                          <td className="py-3.5 font-data-mono font-bold text-sky-400">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                                order.status === 'Success'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}
                            >
                              {order.status === 'Success' ? 'Fulfilled' : 'Processing'}
                            </span>
                          </td>
                          <td className="py-3.5 text-right pr-2">
                            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-sky-400 transition-colors inline-block" />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Details Panel */}
        <div className="space-y-4">
          {selectedOrder ? (
            <div className="bento-card p-5 space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-[11px] font-semibold text-sky-400 font-data-mono uppercase tracking-wider">
                    Requisition Slip
                  </span>
                  <h3 className="text-[20px] font-bold text-white font-data-mono mt-0.5">
                    {selectedOrder.id}
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedOrder.status === 'Success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {selectedOrder.status === 'Success' ? 'Fulfilled' : 'Pending Authorization'}
                </span>
              </div>

              {/* Facility details */}
              <div className="bg-zinc-900/80 rounded-xl p-3.5 border border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Receiving Facility:</span>
                  <span className="font-semibold text-white">{selectedOrder.customer}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Dispatched Date:</span>
                  <span className="font-data-mono text-zinc-300">{selectedOrder.date}</span>
                </div>
                {selectedOrder.paymentTerms && (
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Payment Terms:</span>
                    <span className="font-data-mono text-sky-400">{selectedOrder.paymentTerms}</span>
                  </div>
                )}
                {selectedOrder.notes && (
                  <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                    <span className="font-semibold text-zinc-300 block mb-0.5">Dispensary Notes:</span>
                    {selectedOrder.notes}
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
                  Dispensed Line Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div
                          onClick={() => item.medicineId && viewMedicineDetails(item.medicineId)}
                          className="font-semibold text-white hover:text-sky-400 cursor-pointer flex items-center gap-1"
                        >
                          {item.medicineName}
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </div>
                        <span className="text-[11px] text-zinc-500 font-data-mono">
                          {item.quantity} units @ ${item.unitPrice.toFixed(2)}
                        </span>
                      </div>
                      <span className="font-bold text-sky-400 font-data-mono text-xs">
                        ${item.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown */}
              <div className="border-t border-zinc-800 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-data-mono text-zinc-200">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discount ? (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-data-mono">-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-zinc-400">
                  <span>Standard Clinical Tax</span>
                  <span className="font-data-mono text-zinc-200">${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total Billed</span>
                  <span className="font-data-mono text-sky-400">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bento-card p-8 text-center text-zinc-500 text-xs">
              Select an order on the left to view detailed receipt.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
