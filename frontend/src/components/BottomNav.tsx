import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  AlertTriangle,
  BrainCircuit,
  BarChart3
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { NavigationTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, navigateTo, medicines } = useERP();

  const lowStockCount = medicines.filter(
    (m) => m.status === 'Low Stock' || m.status === 'Critical' || m.status === 'Out of Stock'
  ).length;

  const items: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'ai-insights', label: 'AI', icon: BrainCircuit },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d12]/95 backdrop-blur-lg border-t border-zinc-800 md:hidden pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'inventory' && activeTab === 'medicine-detail');

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-sky-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9.5px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center border-2 border-[#0c0d12]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10.5px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
