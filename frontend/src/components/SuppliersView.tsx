import React, { useState } from 'react';
import {
  Truck,
  Star,
  Clock,
  Search,
  Package,
  Phone,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const SuppliersView: React.FC = () => {
  const { suppliers, quickReorderProposal, medicines } = useERP();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-[24px] font-bold text-white tracking-tight">
            Contracted Pharmaceutical Suppliers
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Certified manufacturers, wholesale distributors, and API logistics suppliers.
          </p>
        </div>
      </div>

      <div className="bento-card p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppliers by drug category, company name, or lead..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((supplier) => {
          const supplierMeds = medicines.filter((m) => m.supplier === supplier.name);

          return (
            <div
              key={supplier.id}
              className="bento-card p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[15px] text-white leading-tight">
                        {supplier.name}
                      </h3>
                      <span className="text-[11px] text-purple-400 font-semibold">
                        {supplier.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-amber-400 text-xs font-bold font-data-mono">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {supplier.rating}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="font-data-mono">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{supplier.address}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-data-mono">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" /> Avg Lead Time:
                  </span>
                  <span className="font-bold text-white">{supplier.leadTimeDays} Days</span>
                </div>
                <div className="flex items-center justify-between text-xs font-data-mono">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-zinc-500" /> Catalog SKUs:
                  </span>
                  <span className="font-bold text-sky-400">{supplierMeds.length} items</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
