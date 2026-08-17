import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Pill,
  Truck,
  Users,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  Settings,
  AlertTriangle,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { NavigationTab } from '../types';

export const Sidebar: React.FC = () => {
  const { activeTab, navigateTo, medicines, setIsAuthenticated } = useERP();

  const lowStockCount = medicines.filter(
    (m) => m.status === 'Low Stock' || m.status === 'Critical' || m.status === 'Out of Stock'
  ).length;

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'employees', label: 'Employees', icon: BadgeCheck },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: BrainCircuit },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-[240px] z-40 bg-[#0c0d12] border-r border-zinc-800/80 hidden md:flex flex-col py-5 select-none">
      {/* Brand Header */}
      <div 
        onClick={() => navigateTo('dashboard')}
        className="px-5 mb-6 flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
          L
        </div>
        <div>
          <h1 className="text-[18px] font-bold text-white tracking-tight leading-tight flex items-center gap-1.5">
            Livsera ERP
          </h1>
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            Clinical Health ERP
          </p>
        </div>
      </div>

      {/* Nav List */}
      <ul className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'inventory' && (activeTab === 'medicine-detail' || activeTab === 'alerts'));

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] transition-all duration-150 text-left active:scale-[0.98] ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30 shadow-xs'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-sky-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-sky-500 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Quick Status / Sign Out at Bottom */}
      <div className="px-3 pt-3 border-t border-zinc-800/80 mt-auto">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
            <span className="text-zinc-300 font-medium text-[11.5px]">System Online</span>
          </div>
          <button
            onClick={() => navigateTo('auth')}
            title="Lock / Switch User"
            className="text-zinc-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-zinc-800"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
