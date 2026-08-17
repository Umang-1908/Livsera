import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Shield,
  Clock,
  Mail,
  Phone,
  Building2,
  Sparkles
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const EmployeesView: React.FC = () => {
  const { employees } = useERP();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-bold text-white tracking-tight">
          Clinical Staff & Pharmacists
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Authorized hospital dispensary clinicians, technicians, and system administrators.
        </p>
      </div>

      <div className="bento-card p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team member by name, clinical role, or dispensary unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filtered.map((emp) => (
          <div key={emp.id} className="bento-card p-5 flex items-start gap-4">
            <img
              src={emp.avatarUrl}
              alt={emp.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border border-zinc-700/80 shadow-md shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-[16px] text-white truncate">{emp.name}</h3>
                  <span className="text-xs text-sky-400 font-medium block truncate">{emp.role}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  {emp.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{emp.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="font-data-mono text-[11.5px] truncate">{emp.shift}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
