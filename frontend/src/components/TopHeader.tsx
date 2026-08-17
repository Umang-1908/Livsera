import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, ArrowRight, AlertTriangle, ShieldCheck, User, Menu } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const TopHeader: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const {
    globalSearch,
    setGlobalSearch,
    medicines,
    orders,
    userProfile,
    viewMedicineDetails,
    navigateTo,
  } = useERP();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Filtered search results
  const trimmedSearch = globalSearch.trim().toLowerCase();
  const matchedMedicines = trimmedSearch
    ? medicines.filter(
        (m) =>
          m.name.toLowerCase().includes(trimmedSearch) ||
          m.sku.toLowerCase().includes(trimmedSearch) ||
          m.category.toLowerCase().includes(trimmedSearch)
      ).slice(0, 5)
    : [];

  const matchedOrders = trimmedSearch
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(trimmedSearch) ||
          o.customer.toLowerCase().includes(trimmedSearch)
      ).slice(0, 3)
    : [];

  // Critical alerts
  const criticalItems = medicines.filter(
    (m) => m.status === 'Critical' || m.status === 'Low Stock' || m.status === 'Out of Stock'
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-240px)] z-30 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80 flex justify-between items-center px-4 md:px-8 h-16">
      {/* Mobile Title & Menu Toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-zinc-300 hover:bg-zinc-800 border border-zinc-800"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-sky-400" />
        </button>
        <span className="text-lg font-bold text-white tracking-tight">Livsera ERP</span>
      </div>

      {/* Search Bar (Desktop) */}
      <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative">
        <div className="relative w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/90 focus-within:border-sky-500/60 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search medicines, SKUs, or orders..."
            className="w-full pl-10 pr-9 py-2 bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none text-[13px]"
          />
          {globalSearch && (
            <button
              onClick={() => {
                setGlobalSearch('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Search Popup */}
        {isSearchOpen && (matchedMedicines.length > 0 || matchedOrders.length > 0) && (
          <div className="absolute left-0 top-12 w-full bg-[#121318] border border-zinc-700/80 rounded-2xl shadow-2xl z-50 p-2.5 max-h-[380px] overflow-y-auto backdrop-blur-xl">
            {matchedMedicines.length > 0 && (
              <div>
                <p className="text-[10.5px] font-bold text-zinc-400 px-3 py-1.5 uppercase tracking-wider">
                  Medicines
                </p>
                {matchedMedicines.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      viewMedicineDetails(m.id);
                      setIsSearchOpen(false);
                      setGlobalSearch('');
                    }}
                    className="px-3 py-2.5 hover:bg-zinc-800/80 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-sky-400 group-hover:text-sky-300">{m.name}</p>
                      <p className="text-[11px] font-data-mono text-zinc-400">{m.sku} • {m.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[12px] font-data-mono font-semibold text-zinc-200">{m.currentStock} in stock</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {matchedOrders.length > 0 && (
              <div className="mt-2 pt-2 border-t border-zinc-800">
                <p className="text-[10.5px] font-bold text-zinc-400 px-3 py-1.5 uppercase tracking-wider">
                  Orders
                </p>
                {matchedOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      navigateTo('orders');
                      setIsSearchOpen(false);
                      setGlobalSearch('');
                    }}
                    className="px-3 py-2.5 hover:bg-zinc-800/80 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-zinc-200">{o.id} - {o.customer}</p>
                      <p className="text-[11px] text-zinc-400">{o.date}</p>
                    </div>
                    <span className="text-[12px] font-data-mono font-semibold text-emerald-400">${o.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="md:hidden flex-1" />

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-xl border border-zinc-800 transition-colors relative"
            title="Notifications & Stock Alerts"
          >
            <Bell className="w-4 h-4" />
            {criticalItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-[#09090b] animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#121318] border border-zinc-700/80 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <h3 className="font-semibold text-[14px] text-zinc-100">Clinical Alerts</h3>
                </div>
                <span className="text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
                  {criticalItems.length} Actions
                </span>
              </div>

              <div className="divide-y divide-zinc-800 max-h-[300px] overflow-y-auto my-2">
                {criticalItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      viewMedicineDetails(item.id);
                      setIsNotifOpen(false);
                    }}
                    className="py-2.5 px-2 hover:bg-zinc-800/60 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[13px] font-semibold text-sky-400">{item.name}</span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        item.status === 'Critical' || item.status === 'Out of Stock'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 font-data-mono">
                      Current: {item.currentStock} | Min Threshold: {item.threshold}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  navigateTo('alerts');
                  setIsNotifOpen(false);
                }}
                className="w-full mt-2 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 font-semibold text-[12px] rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                View All Alert Center <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Clinician Profile Avatar */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:ring-2 hover:ring-sky-500/40 transition-all border border-zinc-800 bg-zinc-900/60"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-700">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:block text-xs font-semibold text-zinc-200 pr-2">{userProfile.name.split(' ')[1] || userProfile.name}</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-64 bg-[#121318] border border-zinc-700/80 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                />
                <div>
                  <p className="font-semibold text-[13px] text-zinc-100 leading-tight">
                    {userProfile.name}
                  </p>
                  <p className="text-[11px] text-zinc-400">{userProfile.title}</p>
                </div>
              </div>
              <div className="py-2 space-y-1 text-[13px]">
                <button
                  onClick={() => {
                    navigateTo('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-zinc-400" /> System Profile & Role
                </button>
                <button
                  onClick={() => {
                    navigateTo('auth');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-rose-500/15 text-rose-400 transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400" /> Switch Account / Re-login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
