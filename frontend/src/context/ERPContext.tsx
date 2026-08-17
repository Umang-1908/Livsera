import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine, Customer, Supplier, Employee, Order, NavigationTab, UserProfile, StockMovement } from '../types';
import {
  initialMedicines,
  initialCustomers,
  initialSuppliers,
  initialEmployees,
  initialOrders,
  initialUserProfile
} from '../mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface ReorderTarget {
  medicineId: string;
  recommendedQty: number;
}

export interface FlatStockLog {
  id: string;
  medicineId: string;
  medicineName: string;
  type: 'IN' | 'OUT';
  qty: number;
  notes: string;
  batchNumber?: string;
  employee: string;
  timestamp: string;
}

interface ERPContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedMedicineId: string | null;
  setSelectedMedicineId: (id: string | null) => void;
  medicines: Medicine[];
  orders: Order[];
  customers: Customer[];
  suppliers: Supplier[];
  employees: Employee[];
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  login: () => void;
  logout: () => void;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Stock Logs
  stockLogs: FlatStockLog[];

  // Data actions
  addMedicine: (med: Omit<Medicine, 'id' | 'movements'>) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  logStockChange: (medicineId: string, change: { type: 'IN' | 'OUT'; qty: number; employee?: string; notes?: string; batchNumber?: string }) => void;
  logStockMovement: (medicineId: string, type: 'IN' | 'OUT', qty: number, notes: string, batchNumber?: string) => void;
  createOrder: (orderData: { customer: string; total: number; status: 'Success' | 'Pending'; items: { medicineId: string; name?: string; qty?: number; quantity?: number; unitPrice: number }[] }) => Order;
  viewMedicineDetails: (medicineId: string) => void;
  quickReorderProposal: (medicineId: string, qty?: number) => void;
  executeReorder: (medicineId: string, qty: number) => void;
  
  // Modal states & controls
  isAddMedicineOpen: boolean;
  setIsAddMedicineOpen: (open: boolean) => void;
  isLogStockOpen: boolean;
  setIsLogStockOpen: (open: boolean) => void;
  activeMedicineForLog: string | null;
  openLogStockModal: (medicineId?: string) => void;
  closeLogStockModal: () => void;
  
  isReorderOpen: boolean;
  isReorderModalOpen: boolean;
  setIsReorderModalOpen: (open: boolean) => void;
  reorderTarget: ReorderTarget | null;
  targetReorderMedId: string | null;
  setTargetReorderMedId: (id: string | null) => void;
  closeReorderModal: () => void;
  
  // Navigation helper
  navigateTo: (tab: NavigationTab, medicineId?: string) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>('med-amx-500');
  const [globalSearch, setGlobalSearch] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent storage state
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    try {
      const saved = localStorage.getItem('livsera_medicines');
      return saved ? JSON.parse(saved) : initialMedicines;
    } catch {
      return initialMedicines;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('livsera_orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('livsera_customers');
      return saved ? JSON.parse(saved) : initialCustomers;
    } catch {
      return initialCustomers;
    }
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem('livsera_suppliers');
      return saved ? JSON.parse(saved) : initialSuppliers;
    } catch {
      return initialSuppliers;
    }
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('livsera_employees');
      return saved ? JSON.parse(saved) : initialEmployees;
    } catch {
      return initialEmployees;
    }
  });

  // Modal triggers
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isLogStockOpen, setIsLogStockOpen] = useState(false);
  const [activeMedicineForLog, setActiveMedicineForLog] = useState<string | null>(null);

  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [reorderTarget, setReorderTarget] = useState<ReorderTarget | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('livsera_medicines', JSON.stringify(medicines));
    } catch (e) {
      console.error(e);
    }
  }, [medicines]);

  useEffect(() => {
    try {
      localStorage.setItem('livsera_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = () => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    addToast('success', 'Authenticated', `Welcome back, ${userProfile.name}.`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('auth');
  };

  const navigateTo = (tab: NavigationTab, medicineId?: string) => {
    if (medicineId) {
      setSelectedMedicineId(medicineId);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewMedicineDetails = (medicineId: string) => {
    setSelectedMedicineId(medicineId);
    setActiveTab('medicine-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLogStockModal = (medicineId?: string) => {
    setActiveMedicineForLog(medicineId || selectedMedicineId || medicines[0]?.id || null);
    setIsLogStockOpen(true);
  };

  const closeLogStockModal = () => {
    setIsLogStockOpen(false);
    setActiveMedicineForLog(null);
  };

  const openReorderModal = (medicineId: string, qty?: number) => {
    const med = medicines.find((m) => m.id === medicineId);
    const recQty = qty || (med ? Math.max(500, med.threshold * 2 - med.currentStock) : 500);
    setReorderTarget({ medicineId, recommendedQty: recQty });
    setIsReorderOpen(true);
  };

  const closeReorderModal = () => {
    setIsReorderOpen(false);
    setReorderTarget(null);
  };

  const quickReorderProposal = (medicineId: string, qty?: number) => {
    openReorderModal(medicineId, qty);
  };

  const executeReorder = (medicineId: string, qty: number) => {
    logStockMovement(
      medicineId,
      'IN',
      qty,
      'Automated replenishment PO fulfillment',
      'BCH-' + Math.floor(1000 + Math.random() * 9000)
    );
    addToast('success', 'Purchase Order Dispatched', `Reorder PO for ${qty} units successfully submitted.`);
  };

  const addMedicine = (medData: Omit<Medicine, 'id' | 'movements'>) => {
    const newMed: Medicine = {
      ...medData,
      id: `med-${Date.now()}`,
      minStock: medData.threshold,
      maxStock: medData.threshold * 5,
      leadTimeDays: medData.leadTimeDays || 4,
      predictedVelocity: Math.round(medData.currentStock / 15) || 20,
      predictedStockoutDays: Math.round(medData.currentStock / 25) || 14,
      riskLevel: medData.currentStock <= medData.threshold ? 'Critical' : 'Low',
      aiConfidence: 91,
      movements: [
        {
          id: `mov-${Date.now()}`,
          date: 'Just now',
          type: 'IN',
          qty: medData.currentStock,
          employee: userProfile.name,
          notes: 'Initial stock intake on registration',
          batchNumber: 'BCH-INIT-' + Math.floor(100 + Math.random() * 900),
        }
      ],
      usageTrend30Days: [10, 15, 20, 25, 30, 28, 35],
      avgDailyUsage: Math.round((medData.currentStock / 30) * 10) / 10,
    };

    setMedicines((prev) => [newMed, ...prev]);
    addToast('success', 'Medicine Added', `${newMed.name} registered into inventory successfully.`);
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...updates };
          if (updates.currentStock !== undefined || updates.threshold !== undefined) {
            const stock = updates.currentStock ?? m.currentStock;
            const thresh = updates.threshold ?? m.threshold;
            if (stock <= 0) updated.status = 'Out of Stock';
            else if (stock <= thresh * 0.25) updated.status = 'Critical';
            else if (stock <= thresh) updated.status = 'Low Stock';
            else updated.status = 'In Stock';
          }
          return updated;
        }
        return m;
      })
    );
    addToast('info', 'Record Updated', 'Medicine details have been updated.');
  };

  const deleteMedicine = (id: string) => {
    const med = medicines.find((m) => m.id === id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    addToast('warning', 'Item Removed', `${med ? med.name : 'Medicine'} deleted from catalog.`);
    if (selectedMedicineId === id) {
      setActiveTab('inventory');
    }
  };

  const logStockChange = (
    medicineId: string,
    change: { type: 'IN' | 'OUT'; qty: number; employee?: string; notes?: string; batchNumber?: string }
  ) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          const delta = change.type === 'IN' ? Math.abs(change.qty) : -Math.abs(change.qty);
          const newStock = Math.max(0, med.currentStock + delta);
          
          let newStatus = med.status;
          if (newStock <= 0) newStatus = 'Out of Stock';
          else if (newStock <= med.threshold * 0.25) newStatus = 'Critical';
          else if (newStock <= med.threshold) newStatus = 'Low Stock';
          else newStatus = 'In Stock';

          const newMovement: StockMovement = {
            id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: change.type,
            qty: delta,
            employee: change.employee || userProfile.name,
            notes: change.notes || (change.type === 'IN' ? 'Stock Receipt' : 'Dispensed for Ward'),
            batchNumber: change.batchNumber || 'BCH-2025-' + Math.floor(100 + Math.random() * 900),
          };

          return {
            ...med,
            currentStock: newStock,
            status: newStatus,
            movements: [newMovement, ...(med.movements || [])],
          };
        }
        return med;
      })
    );

    addToast(
      change.type === 'IN' ? 'success' : 'info',
      'Stock Logged',
      `${change.type === 'IN' ? '+' : '-'}${Math.abs(change.qty)} units recorded.`
    );
  };

  const logStockMovement = (
    medicineId: string,
    type: 'IN' | 'OUT',
    qty: number,
    notes: string,
    batchNumber?: string
  ) => {
    logStockChange(medicineId, {
      type,
      qty,
      employee: userProfile.name,
      notes,
      batchNumber,
    });
  };

  const createOrder = (orderData: {
    customer: string;
    total: number;
    status: 'Success' | 'Pending';
    items: { medicineId: string; name?: string; qty?: number; quantity?: number; unitPrice: number }[];
  }): Order => {
    const orderNumber = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderNumber,
      customer: orderData.customer,
      customerId: 'cust-' + Math.floor(100 + Math.random() * 900),
      subtotal: orderData.total * 0.95,
      discount: 0,
      tax: orderData.total * 0.05,
      total: orderData.total,
      status: orderData.status,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: orderData.items.map((i, idx) => ({
        id: `item-${idx}-${Date.now()}`,
        medicineId: i.medicineId,
        medicineName: i.name || 'Pharmaceutical item',
        sku: 'SKU-' + i.medicineId,
        quantity: i.qty || i.quantity || 1,
        unitPrice: i.unitPrice,
        total: (i.qty || i.quantity || 1) * i.unitPrice,
      })),
    };

    // Deduct stock for order items
    newOrder.items.forEach((item) => {
      if (item.medicineId) {
        logStockChange(item.medicineId, {
          type: 'OUT',
          qty: item.quantity,
          employee: userProfile.name,
          notes: `Order fulfillment ${orderNumber} for ${newOrder.customer}`,
        });
      }
    });

    setOrders((prev) => [newOrder, ...prev]);
    addToast('success', 'Order Created', `Order ${orderNumber} has been placed successfully.`);
    return newOrder;
  };

  // Compile flat stock logs across all medicines
  const stockLogs: FlatStockLog[] = medicines.flatMap((med) =>
    (med.movements || []).map((m) => ({
      id: m.id,
      medicineId: med.id,
      medicineName: med.name,
      type: m.type,
      qty: Math.abs(m.qty),
      notes: m.notes,
      batchNumber: m.batchNumber,
      employee: m.employee,
      timestamp: m.date.includes('T') ? m.date : new Date().toISOString(),
    }))
  );

  return (
    <ERPContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedMedicineId,
        setSelectedMedicineId,
        medicines,
        orders,
        customers,
        suppliers,
        employees,
        userProfile,
        setUserProfile,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        globalSearch,
        setGlobalSearch,
        toasts,
        addToast,
        removeToast,
        stockLogs,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        logStockChange,
        logStockMovement,
        createOrder,
        viewMedicineDetails,
        quickReorderProposal,
        executeReorder,
        isAddMedicineOpen,
        setIsAddMedicineOpen,
        isLogStockOpen,
        setIsLogStockOpen,
        activeMedicineForLog,
        openLogStockModal,
        closeLogStockModal,
        isReorderOpen,
        isReorderModalOpen: isReorderOpen,
        setIsReorderModalOpen: setIsReorderOpen,
        reorderTarget,
        targetReorderMedId: reorderTarget?.medicineId || null,
        setTargetReorderMedId: (id) => id ? openReorderModal(id) : closeReorderModal(),
        closeReorderModal,
        navigateTo,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};

