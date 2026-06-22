// ============================================================
// ELEGANT ERP — TYPE DEFINITIONS
// ============================================================

export type StaffTier = 'Normal' | 'Premium' | 'Extreme Premium';
export type StaffStatus = 'Active' | 'Deactivated';
export type StaffRole = 'Server' | 'Housekeeping' | 'Supervisor' | 'Driver';

export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: StaffRole;
  tier: StaffTier;
  events: number;
  rating: number;
  status: StaffStatus;
  joined: string;
  wage: number;
  location: string;
  avatar: string;
}

export type EventStatus = 'Upcoming' | 'In Progress' | 'Completed';
export type EventType = 'Wedding' | 'Inauguration' | 'Political' | 'Court Function' | 'College Event' | 'Corporate';

export interface StaffNeeded {
  Server?: number;
  Housekeeping?: number;
  Supervisor?: number;
}

export interface ERPEvent {
  id: string;
  name: string;
  type: EventType;
  tier: StaffTier;
  venue: string;
  date: string;
  guests: number;
  status: EventStatus;
  vendor: string;
  staffNeeded: StaffNeeded;
  staffApplied: number;
  quotationId: string;
}

export interface Godown {
  id: string;
  name: string;
  location: string;
  manager: string;
  capacity: string;
  items: number;
}

export type StockCategory = 'Chairs' | 'Furniture' | 'Flowers' | 'Dining' | 'Equipment';
export type StockUnit = 'pcs' | 'sets' | 'units';

export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  godown: string;
  total: number;
  available: number;
  damaged: number;
  unit: StockUnit;
}

export type VehicleType = 'Owned' | 'Rental';
export type VehicleStatus = 'Available' | 'On Trip' | 'Maintenance';

export interface Vehicle {
  id: string;
  name: string;
  number: string;
  type: VehicleType;
  vendor?: string;
  driver: string;
  driverPhone: string;
  mileage: number;
  capacity: string;
  status: VehicleStatus;
  rentalRate?: string;
}

export type TripStatus = 'Out' | 'Returned';

export interface VehicleTrip {
  id: string;
  vehicleId: string;
  eventId: string;
  driver: string;
  km: number;
  gasAllowance: number;
  status: TripStatus;
  dispatched: string;
  returned: string | null;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Invoiced';

export interface Quotation {
  id: string;
  client: string;
  eventName: string;
  tier: StaffTier;
  amount: number;
  status: QuotationStatus;
  date: string;
  validTill: string;
  items: number;
}

export type InvoiceStatus = 'Paid' | 'Partial' | 'Unpaid';

export interface Invoice {
  id: string;
  quotationId: string;
  client: string;
  amount: number;
  paid: number;
  balance: number;
  status: InvoiceStatus;
  date: string;
}

export type ChecklistStatus = 'Pending' | 'Packing' | 'Dispatched' | 'Returned';

export interface ChecklistItem {
  name: string;
  qty: number;
  sent: number;
}

export interface Checklist {
  id: string;
  quotationId: string;
  eventName: string;
  tier: StaffTier;
  status: ChecklistStatus;
  items: ChecklistItem[];
}

export interface Earning {
  staffId: string;
  name: string;
  month: string;
  eventsWorked: number;
  baseWage: number;
  ta: number;
  advance: number;
  netPayable: number;
}

export type AdvanceStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Advance {
  id: string;
  staffId: string;
  name: string;
  amount: number;
  date: string;
  reason: string;
  status: AdvanceStatus;
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Application {
  id: string;
  eventId: string;
  staffId: string;
  name: string;
  role: StaffRole;
  appliedOn: string;
  status: ApplicationStatus;
  distance: string;
  doubleWorker: boolean;
}

export interface Cancellation {
  id: string;
  staffId: string;
  name: string;
  eventId: string;
  reason: string;
  requestedOn: string;
  eventDate: string;
  withinLock: boolean;
  status: string;
}

export type UserRole = 'Admin / Owner' | 'HR' | 'Store Manager' | 'Site Manager' | 'Accounts';

export interface ERPUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  godown?: string;
}

export interface PromotionRule {
  from: StaffTier;
  to: StaffTier;
  threshold: number;
  wageBoost: string;
}

export interface SiteShare {
  id: string;
  eventId: string;
  sharedBy: string;
  sharedWith: string;
  note: string;
  date: string;
}

export type AppRole = 'admin' | 'store' | 'site';

export type PageId =
  | 'dashboard' | 'events' | 'quotations' | 'invoices' | 'checklists'
  | 'staff' | 'applications' | 'cancellations' | 'promotions' | 'performance'
  | 'payroll' | 'advances' | 'godowns' | 'stock' | 'vehicles' | 'trips'
  | 'returns' | 'users' | 'sitesharing' | 'whatsapp' | 'settings'
  | 'myevents' | 'verification';

export interface DB {
  currentRole: AppRole;
  staff: Staff[];
  events: ERPEvent[];
  godowns: Godown[];
  stock: StockItem[];
  vehicles: Vehicle[];
  vehicleTrips: VehicleTrip[];
  quotations: Quotation[];
  invoices: Invoice[];
  checklists: Checklist[];
  earnings: Earning[];
  advances: Advance[];
  applications: Application[];
  cancellations: Cancellation[];
  users: ERPUser[];
  promotionRules: PromotionRule[];
  siteShares: SiteShare[];
}
