export type NavigationTab = 
  | 'dashboard'
  | 'orders'
  | 'inventory'
  | 'medicines'
  | 'suppliers'
  | 'customers'
  | 'employees'
  | 'reports'
  | 'ai-insights'
  | 'alerts'
  | 'settings'
  | 'create-order'
  | 'medicine-detail'
  | 'auth';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Critical' | 'Out of Stock';

export type OrderStatus = 'Success' | 'Pending' | 'Processing' | 'Cancelled' | 'Delivered';

export interface StockMovement {
  id: string;
  date: string;
  type: 'IN' | 'OUT';
  qty: number;
  employee: string;
  notes: string;
  batchNumber?: string;
}

export interface Medicine {
  id: string;
  sku: string;
  name: string;
  category: string;
  dosage: string;
  form: string;
  manufacturer: string;
  supplier: string;
  unitPrice: number;
  currentStock: number;
  threshold: number;
  minStock: number;
  maxStock: number;
  storageLocation: string;
  earliestExpiry: string;
  status: StockStatus;
  leadTimeDays: number;
  predictedVelocity?: number; // units/day
  predictedStockoutDays?: number;
  riskLevel?: 'Critical' | 'High' | 'Medium' | 'Low';
  aiConfidence?: number;
  usageTrend30Days?: number[];
  avgDailyUsage?: number;
  description?: string;
  activeIngredient?: string;
  movements: StockMovement[];
}

export interface OrderItem {
  id: string;
  medicineId: string;
  medicineName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string; // e.g. "Net 30 Terms"
  totalOrders: number;
  totalSpend: number;
  status: 'Active' | 'Inactive';
}

export interface Order {
  id: string; // e.g. "#ORD-0921"
  customer: string;
  customerId: string;
  customerContact?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  date: string;
  notes?: string;
  paymentTerms?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  leadTimeDays: number;
  rating: number;
  activeOrdersCount: number;
  address: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  shift: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatarUrl?: string;
}

export interface AIPredictiveAlert {
  id: string;
  medicineId: string;
  medicineName: string;
  sku: string;
  riskLevelText: string;
  riskSeverity: 'critical' | 'high' | 'medium';
  currentStock: number;
  predictedVelocity: number;
  leadTimeDays: number;
  predictedDays: number;
  confidence: number;
  insightDescription: string;
  recommendedAction: string;
}

export interface UserProfile {
  name: string;
  role: string;
  title: string;
  department: string;
  email: string;
  avatarUrl: string;
}
