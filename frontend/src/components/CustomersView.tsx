import React, { useState } from 'react';
import {
  Users,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  TrendingUp,
  Plus,
  ChevronRight
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const CustomersView: React.FC = () => {
  const { customers, navigateTo } = useERP();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-[24px] font-bold text-white tracking-tight">
            Hospital & Clinic Partners
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Registered medical centers, outpatient clinics, and hospital pharmacies.
          </p>
        </div>
        <button
          onClick={() => navigateTo('create-order')}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
        >
          <Plus className="w-3.5 h-3.5" /> New Requisition
        </button>
      </div>

      {/* Search Bar */}
      <div className="bento-card p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partner hospitals, contact leads, or billing emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </div>
      </div>

      {/* Bento Grid of Partners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            className="bento-card-interactive p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] text-white leading-tight">
                      {customer.name}
                    </h3>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {customer.contactPerson}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {customer.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="font-data-mono">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{customer.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-medium block">Total Orders</span>
                <span className="font-data-mono font-bold text-white text-sm">{customer.totalOrders}</span>
              </div>
              <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-medium block">Total Spend</span>
                <span className="font-data-mono font-bold text-sky-400 text-sm">
                  ${customer.totalSpend.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
