import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Package,
  Layers,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { StockStatus } from '../types';

export const InventoryView: React.FC = () => {
  const {
    medicines,
    viewMedicineDetails,
    setIsAddMedicineOpen,
    quickReorderProposal,
    navigateTo,
  } = useERP();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Categories list
  const categories = ['All', 'Antibiotics', 'Analgesics', 'Cardiovascular', 'Emergency Rx', 'PPE & Sterile', 'Endocrinology'];

  // Filter & Search logic
  const filteredMedicines = medicines
    .filter((m) => {
      const matchQuery =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.sku.toLowerCase().includes(search.toLowerCase()) ||
        m.category.toLowerCase().includes(search.toLowerCase()) ||
        m.manufacturer.toLowerCase().includes(search.toLowerCase());

      const matchCategory = selectedCategory === 'All' || m.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchStatus = selectedStatus === 'All' || m.status === selectedStatus;

      return matchQuery && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortBy === 'stock') comparison = a.currentStock - b.currentStock;
      else if (sortBy === 'price') comparison = a.unitPrice - b.unitPrice;
      else if (sortBy === 'status') comparison = a.status.localeCompare(b.status);

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const totalSKUs = medicines.length;
  const inStockCount = medicines.filter((m) => m.status === 'In Stock').length;
  const lowStockCount = medicines.filter((m) => m.status === 'Low Stock' || m.status === 'Critical').length;
  const outOfStockCount = medicines.filter((m) => m.status === 'Out of Stock').length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-bold text-white tracking-tight">
            Medicine & SKU Inventory
          </h2>
          <p className="text-[13.5px] text-zinc-400 mt-0.5">
            Central formulary database, batch expiration schedules, and replenishment velocity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigateTo('alerts')}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-semibold text-[13px] transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Alerts ({lowStockCount + outOfStockCount})
          </button>
          <button
            onClick={() => setIsAddMedicineOpen(true)}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl transition-all text-[13px] font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Medicine SKU
          </button>
        </div>
      </div>

      {/* Bento Inventory Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bento-card p-4">
          <span className="text-[12px] text-zinc-400 font-medium">Total Formularies</span>
          <p className="text-[24px] font-bold text-white font-data-mono mt-1">{totalSKUs}</p>
          <span className="text-[11px] text-zinc-400 mt-1 block">Active clinical catalog</span>
        </div>
        <div className="bento-card p-4">
          <span className="text-[12px] text-zinc-400 font-medium">In Safe Supply</span>
          <p className="text-[24px] font-bold text-emerald-400 font-data-mono mt-1">{inStockCount}</p>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">Optimal buffer</span>
        </div>
        <div className="bento-card p-4">
          <span className="text-[12px] text-zinc-400 font-medium">Low Stock Warning</span>
          <p className="text-[24px] font-bold text-amber-400 font-data-mono mt-1">{lowStockCount}</p>
          <span className="text-[11px] text-amber-400/80 mt-1 block">Below par threshold</span>
        </div>
        <div className="bento-card-danger p-4">
          <span className="text-[12px] text-rose-300 font-medium">Stockout / Critical</span>
          <p className="text-[24px] font-bold text-rose-400 font-data-mono mt-1">{outOfStockCount}</p>
          <span className="text-[11px] text-rose-300/90 mt-1 block">Immediate PO reorder</span>
        </div>
      </div>

      {/* Filter and Search Bento Bar */}
      <div className="bento-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, category..."
            className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </div>

        {/* Categories Pills / Status filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-[12.5px] font-medium text-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-[12.5px] font-medium text-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Critical">Critical</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Main Inventory Bento Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4.5 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Medicine / Formulary
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 hidden md:table-cell">SKU / Code</th>
                <th className="py-3 px-4">Category</th>
                <th
                  onClick={() => handleSort('stock')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Stock Level
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors hidden sm:table-cell"
                >
                  <div className="flex items-center gap-1.5">
                    Unit Price
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-zinc-200 divide-y divide-zinc-800/60">
              {filteredMedicines.map((med) => {
                const isLow = med.status === 'Low Stock' || med.status === 'Critical' || med.status === 'Out of Stock';

                return (
                  <tr
                    key={med.id}
                    onClick={() => viewMedicineDetails(med.id)}
                    className="hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Name + Dosage */}
                    <td className="py-3.5 px-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sky-400 text-xs">
                          {med.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white group-hover:text-sky-400 transition-colors block">
                            {med.name}
                          </span>
                          <span className="text-[11.5px] text-zinc-400">
                            {med.dosage} • {med.form}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-4 font-data-mono text-[12px] text-zinc-400 hidden md:table-cell">
                      {med.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="bg-zinc-800/80 border border-zinc-700/80 px-2.5 py-1 rounded-lg text-[11.5px] font-medium text-zinc-300">
                        {med.category}
                      </span>
                    </td>

                    {/* Stock Level with mini bar */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-data-mono font-bold text-white">
                            {med.currentStock}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-data-mono">
                            / {med.threshold} min
                          </span>
                        </div>
                        <div className="w-24 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              med.status === 'In Stock'
                                ? 'bg-emerald-400'
                                : med.status === 'Low Stock'
                                ? 'bg-amber-400'
                                : 'bg-rose-500'
                            }`}
                            style={{
                              width: `${Math.min(100, Math.round((med.currentStock / (med.threshold * 2 || 1)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-data-mono text-zinc-200 hidden sm:table-cell">
                      ${med.unitPrice.toFixed(2)}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          med.status === 'In Stock'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : med.status === 'Low Stock'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {med.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {isLow && (
                          <button
                            type="button"
                            onClick={() => quickReorderProposal(med.id)}
                            className="bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="AI Quick Reorder PO"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline text-[11px]">Reorder</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => viewMedicineDetails(med.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMedicines.length === 0 && (
          <div className="p-12 text-center text-zinc-400 space-y-2">
            <Package className="w-10 h-10 mx-auto text-zinc-600" />
            <p className="font-semibold text-zinc-300">No matching medicines found.</p>
            <p className="text-xs text-zinc-500">Try adjusting your search query or filter tags.</p>
          </div>
        )}
      </div>
    </div>
  );
};
