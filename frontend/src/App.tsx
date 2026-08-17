import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { MedicineDetailsView } from './components/MedicineDetailsView';
import { LowStockAlertsView } from './components/LowStockAlertsView';
import { AIInsightsView } from './components/AIInsightsView';
import { CreateOrderView } from './components/CreateOrderView';
import { OrdersView } from './components/OrdersView';
import { CustomersView } from './components/CustomersView';
import { SuppliersView } from './components/SuppliersView';
import { EmployeesView } from './components/EmployeesView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { SignInView } from './components/SignInView';
import { AddItemModal } from './components/AddItemModal';
import { LogStockChangeModal } from './components/LogStockChangeModal';
import { ReorderModal } from './components/ReorderModal';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useERP();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl backdrop-blur-lg flex items-start gap-3 transition-all animate-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-[#121814]/95 border-emerald-500/30 text-emerald-300'
              : toast.type === 'error' || toast.type === 'warning'
              ? 'bg-[#1a1214]/95 border-rose-500/30 text-rose-300'
              : 'bg-[#12141c]/95 border-sky-500/30 text-sky-300'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {(toast.type === 'error' || toast.type === 'warning') && (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-white leading-tight">{toast.title}</h4>
            <p className="text-[11px] text-zinc-300 mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useERP();

  if (!isAuthenticated || activeTab === 'auth') {
    return <SignInView />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'inventory':
      case 'medicines':
        return <InventoryView />;
      case 'medicine-detail':
        return <MedicineDetailsView />;
      case 'alerts':
        return <LowStockAlertsView />;
      case 'ai-insights':
        return <AIInsightsView />;
      case 'create-order':
        return <CreateOrderView />;
      case 'orders':
        return <OrdersView />;
      case 'customers':
        return <CustomersView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'employees':
        return <EmployeesView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-sky-500 selection:text-white">
      {/* Sidebar - Desktop navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 pb-20 md:pb-8">
        <TopHeader />
        
        <main className="flex-1 px-4 md:px-8 pt-24 max-w-7xl w-full mx-auto">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <AddItemModal />
      <LogStockChangeModal />
      <ReorderModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainContent />
    </ERPProvider>
  );
}
