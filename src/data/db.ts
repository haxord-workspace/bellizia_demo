// ============================================================
// BELLIZIA ERP — MOCK DATA STORE
// ============================================================

import type { DB } from './types';

export function createInitialDB(): DB {
  return {
    currentRole: 'admin',

    staff: [
      { id: 'STF-101', name: 'Arjun Menon', phone: '+91 98470 11223', role: 'Server', tier: 'Premium', events: 47, rating: 4.8, status: 'Active', joined: '2023-02-11', wage: 850, location: 'Kochi', avatar: 'AM' },
      { id: 'STF-102', name: 'Divya Pillai', phone: '+91 98470 22334', role: 'Housekeeping', tier: 'Normal', events: 18, rating: 4.3, status: 'Active', joined: '2024-01-05', wage: 700, location: 'Thiruvananthapuram', avatar: 'DP' },
      { id: 'STF-103', name: 'Mohammed Faisal', phone: '+91 98470 33445', role: 'Server', tier: 'Extreme Premium', events: 112, rating: 5.0, status: 'Active', joined: '2021-06-19', wage: 1100, location: 'Kochi', avatar: 'MF' },
      { id: 'STF-104', name: 'Sreelakshmi R', phone: '+91 98470 44556', role: 'Supervisor', tier: 'Premium', events: 63, rating: 4.7, status: 'Active', joined: '2022-09-02', wage: 950, location: 'Kollam', avatar: 'SR' },
      { id: 'STF-105', name: 'Vishnu Prasad', phone: '+91 98470 55667', role: 'Server', tier: 'Normal', events: 9, rating: 4.0, status: 'Deactivated', joined: '2024-05-22', wage: 700, location: 'Kochi', avatar: 'VP' },
      { id: 'STF-106', name: 'Anjali Krishnan', phone: '+91 98470 66778', role: 'Housekeeping', tier: 'Premium', events: 54, rating: 4.6, status: 'Active', joined: '2022-03-14', wage: 800, location: 'Thiruvananthapuram', avatar: 'AK' },
      { id: 'STF-107', name: 'Rahul Nair', phone: '+91 98470 77889', role: 'Driver', tier: 'Normal', events: 31, rating: 4.4, status: 'Active', joined: '2023-07-30', wage: 900, location: 'Kottayam', avatar: 'RN' },
      { id: 'STF-108', name: 'Fathima Beevi', phone: '+91 98470 88990', role: 'Server', tier: 'Normal', events: 5, rating: 3.9, status: 'Active', joined: '2025-01-10', wage: 700, location: 'Kochi', avatar: 'FB' },
    ],

    events: [
      { id: 'EVT-2041', name: 'Menon-Pillai Wedding', type: 'Wedding', tier: 'Extreme Premium', venue: 'Lulu Convention Centre, Kochi', date: '2026-07-04', guests: 850, status: 'Upcoming', vendor: 'Self', staffNeeded: { Server: 24, Housekeeping: 8, Supervisor: 3 }, staffApplied: 19, quotationId: 'QT-3301' },
      { id: 'EVT-2042', name: 'TechVista Inauguration', type: 'Inauguration', tier: 'Premium', venue: 'Hyatt Regency, Thiruvananthapuram', date: '2026-06-28', guests: 300, status: 'Upcoming', vendor: 'TechVista Pvt Ltd', staffNeeded: { Server: 10, Housekeeping: 4, Supervisor: 1 }, staffApplied: 15, quotationId: 'QT-3298' },
      { id: 'EVT-2043', name: 'High Court Bar Assoc. Annual Meet', type: 'Court Function', tier: 'Normal', venue: 'Kerala High Court Premises', date: '2026-06-25', guests: 150, status: 'Upcoming', vendor: 'Bar Association', staffNeeded: { Server: 6, Housekeeping: 2 }, staffApplied: 8, quotationId: 'QT-3295' },
      { id: 'EVT-2044', name: 'UDF Constituency Convention', type: 'Political', tier: 'Premium', venue: 'Town Hall, Kollam', date: '2026-06-30', guests: 1200, status: 'Upcoming', vendor: 'UDF Kollam Unit', staffNeeded: { Server: 30, Housekeeping: 10, Supervisor: 4 }, staffApplied: 22, quotationId: 'QT-3299' },
      { id: 'EVT-2039', name: 'Krishnan Family Wedding', type: 'Wedding', tier: 'Premium', venue: 'Taj Gateway, Kochi', date: '2026-06-12', guests: 420, status: 'Completed', vendor: 'Self', staffNeeded: { Server: 16, Housekeeping: 5, Supervisor: 2 }, staffApplied: 23, quotationId: 'QT-3280' },
      { id: 'EVT-2038', name: "St. Xavier's College Fest", type: 'College Event', tier: 'Normal', venue: "St. Xavier's College Grounds", date: '2026-06-08', guests: 600, status: 'Completed', vendor: "St. Xavier's College", staffNeeded: { Server: 14, Housekeeping: 6 }, staffApplied: 20, quotationId: 'QT-3271' },
      { id: 'EVT-2040', name: 'Nair-Warrier Engagement', type: 'Wedding', tier: 'Normal', venue: 'Community Hall, Kottayam', date: '2026-06-20', guests: 200, status: 'In Progress', vendor: 'Self', staffNeeded: { Server: 8, Housekeeping: 3 }, staffApplied: 11, quotationId: 'QT-3288' },
    ],

    godowns: [
      { id: 'GD-01', name: 'Kochi Main Godown', location: 'Kakkanad, Kochi', manager: 'Suresh Kumar', capacity: '85%', items: 142 },
      { id: 'GD-02', name: 'TVM Storage Unit', location: 'Pappanamcode, TVM', manager: 'Latha Menon', capacity: '62%', items: 96 },
    ],

    stock: [
      { id: 'STK-001', name: 'Chiavari Chairs (Gold)', category: 'Chairs', godown: 'Kochi Main Godown', total: 600, available: 410, damaged: 12, unit: 'pcs' },
      { id: 'STK-002', name: 'Round Banquet Tables (10-seater)', category: 'Furniture', godown: 'Kochi Main Godown', total: 80, available: 54, damaged: 2, unit: 'pcs' },
      { id: 'STK-003', name: 'Fresh Floral Centerpieces - Standard', category: 'Flowers', godown: 'Kochi Main Godown', total: 200, available: 140, damaged: 0, unit: 'sets' },
      { id: 'STK-004', name: 'White Dinnerware Set (Full)', category: 'Dining', godown: 'TVM Storage Unit', total: 1000, available: 760, damaged: 18, unit: 'sets' },
      { id: 'STK-005', name: 'LED Mandap Backdrop Frame', category: 'Equipment', godown: 'Kochi Main Godown', total: 14, available: 9, damaged: 1, unit: 'pcs' },
      { id: 'STK-006', name: 'Crystal Glassware Set', category: 'Dining', godown: 'TVM Storage Unit', total: 850, available: 610, damaged: 24, unit: 'sets' },
      { id: 'STK-007', name: 'Premium Drape & Canopy (White)', category: 'Equipment', godown: 'Kochi Main Godown', total: 40, available: 22, damaged: 0, unit: 'pcs' },
      { id: 'STK-008', name: 'Marigold Garlands (Fresh)', category: 'Flowers', godown: 'TVM Storage Unit', total: 500, available: 380, damaged: 0, unit: 'pcs' },
      { id: 'STK-009', name: 'Cocktail High Tables', category: 'Furniture', godown: 'TVM Storage Unit', total: 60, available: 45, damaged: 3, unit: 'pcs' },
      { id: 'STK-010', name: 'Generator Set (15 KVA)', category: 'Equipment', godown: 'Kochi Main Godown', total: 6, available: 4, damaged: 0, unit: 'units' },
    ],

    vehicles: [
      { id: 'VEH-01', name: 'Tata Ace (Own Fleet)', number: 'KL-07-AB-3344', type: 'Owned', driver: 'Rahul Nair', driverPhone: '+91 98470 77889', mileage: 11.2, capacity: '750 kg', status: 'Available' },
      { id: 'VEH-02', name: 'Eicher Pro 1110 (Own Fleet)', number: 'KL-07-AC-9981', type: 'Owned', driver: 'Biju Thomas', driverPhone: '+91 98471 10293', mileage: 7.8, capacity: '3.5 tons', status: 'On Trip' },
      { id: 'VEH-03', name: 'Mahindra Bolero Pickup (Rental)', number: 'KL-05-DF-2210', type: 'Rental', vendor: 'Speedline Logistics', driver: 'Anil Kumar', driverPhone: '+91 98472 33102', mileage: 9.5, capacity: '1.2 tons', status: 'On Trip', rentalRate: '₹2,800/day' },
      { id: 'VEH-04', name: 'Tata 407 (Own Fleet)', number: 'KL-07-AD-5567', type: 'Owned', driver: 'Joseph Mathew', driverPhone: '+91 98473 44521', mileage: 8.4, capacity: '2.5 tons', status: 'Available' },
      { id: 'VEH-05', name: 'Ashok Leyland Dost (Rental)', number: 'KL-09-GH-7723', type: 'Rental', vendor: 'City Movers', driver: 'Sanjay P', driverPhone: '+91 98474 55632', mileage: 10.1, capacity: '1.5 tons', status: 'Maintenance', rentalRate: '₹2,400/day' },
    ],

    vehicleTrips: [
      { id: 'TRP-501', vehicleId: 'VEH-02', eventId: 'EVT-2041', driver: 'Biju Thomas', km: 38, gasAllowance: 950, status: 'Out', dispatched: '2026-06-22 06:30 AM', returned: null },
      { id: 'TRP-500', vehicleId: 'VEH-03', eventId: 'EVT-2044', driver: 'Anil Kumar', km: 62, gasAllowance: 1400, status: 'Out', dispatched: '2026-06-22 05:00 AM', returned: null },
      { id: 'TRP-499', vehicleId: 'VEH-01', eventId: 'EVT-2039', driver: 'Rahul Nair', km: 21, gasAllowance: 540, status: 'Returned', dispatched: '2026-06-12 06:00 AM', returned: '2026-06-13 11:20 PM' },
      { id: 'TRP-498', vehicleId: 'VEH-04', eventId: 'EVT-2038', driver: 'Joseph Mathew', km: 15, gasAllowance: 400, status: 'Returned', dispatched: '2026-06-08 07:00 AM', returned: '2026-06-08 09:40 PM' },
    ],

    quotations: [
      { id: 'QT-3301', client: 'Menon-Pillai Family', eventName: 'Menon-Pillai Wedding', tier: 'Extreme Premium', amount: 1850000, status: 'Approved', date: '2026-06-01', validTill: '2026-06-15', items: 18 },
      { id: 'QT-3299', client: 'UDF Kollam Unit', eventName: 'UDF Constituency Convention', tier: 'Premium', amount: 620000, status: 'Approved', date: '2026-06-05', validTill: '2026-06-20', items: 12 },
      { id: 'QT-3298', client: 'TechVista Pvt Ltd', eventName: 'TechVista Inauguration', tier: 'Premium', amount: 340000, status: 'Approved', date: '2026-06-08', validTill: '2026-06-22', items: 9 },
      { id: 'QT-3295', client: 'Kerala Bar Association', eventName: 'High Court Bar Assoc. Annual Meet', tier: 'Normal', amount: 95000, status: 'Approved', date: '2026-06-10', validTill: '2026-06-24', items: 6 },
      { id: 'QT-3302', client: 'Sebastian & Mariam', eventName: 'Sebastian-Mariam Wedding', tier: 'Premium', amount: 780000, status: 'Sent', date: '2026-06-18', validTill: '2026-07-02', items: 14 },
      { id: 'QT-3303', client: 'Greenfield Public School', eventName: 'Annual Day Function', tier: 'Normal', amount: 145000, status: 'Draft', date: '2026-06-20', validTill: '2026-07-05', items: 8 },
      { id: 'QT-3280', client: 'Krishnan Family', eventName: 'Krishnan Family Wedding', tier: 'Premium', amount: 690000, status: 'Invoiced', date: '2026-05-28', validTill: '2026-06-11', items: 13 },
    ],

    invoices: [
      { id: 'INV-9041', quotationId: 'QT-3280', client: 'Krishnan Family', amount: 690000, paid: 690000, balance: 0, status: 'Paid', date: '2026-06-13' },
      { id: 'INV-9038', quotationId: 'QT-3271', client: "St. Xavier's College", amount: 210000, paid: 150000, balance: 60000, status: 'Partial', date: '2026-06-09' },
      { id: 'INV-9042', quotationId: 'QT-3301', client: 'Menon-Pillai Family', amount: 1850000, paid: 900000, balance: 950000, status: 'Partial', date: '2026-06-21' },
    ],

    checklists: [
      {
        id: 'CHK-701', quotationId: 'QT-3301', eventName: 'Menon-Pillai Wedding', tier: 'Extreme Premium', status: 'Dispatched', items: [
          { name: 'Chiavari Chairs (Gold)', qty: 600, sent: 600 },
          { name: 'Round Banquet Tables', qty: 60, sent: 60 },
          { name: 'Fresh Floral Centerpieces', qty: 60, sent: 58 },
          { name: 'White Dinnerware Set', qty: 850, sent: 850 },
          { name: 'LED Mandap Backdrop Frame', qty: 2, sent: 2 },
          { name: 'Crystal Glassware Set', qty: 850, sent: 840 },
        ]
      },
      {
        id: 'CHK-702', quotationId: 'QT-3299', eventName: 'UDF Constituency Convention', tier: 'Premium', status: 'Packing', items: [
          { name: 'Plastic Chairs', qty: 1200, sent: 0 },
          { name: 'Cocktail High Tables', qty: 20, sent: 0 },
          { name: 'Generator Set (15 KVA)', qty: 2, sent: 0 },
          { name: 'Premium Drape & Canopy', qty: 10, sent: 0 },
        ]
      },
      {
        id: 'CHK-703', quotationId: 'QT-3298', eventName: 'TechVista Inauguration', tier: 'Premium', status: 'Pending', items: [
          { name: 'Round Banquet Tables', qty: 15, sent: 0 },
          { name: 'White Dinnerware Set', qty: 300, sent: 0 },
          { name: 'Floral Centerpieces', qty: 15, sent: 0 },
        ]
      },
    ],

    earnings: [
      { staffId: 'STF-101', name: 'Arjun Menon', month: 'June 2026', eventsWorked: 6, baseWage: 5100, ta: 840, advance: 1000, netPayable: 4940 },
      { staffId: 'STF-103', name: 'Mohammed Faisal', month: 'June 2026', eventsWorked: 8, baseWage: 8800, ta: 1200, advance: 2000, netPayable: 8000 },
      { staffId: 'STF-104', name: 'Sreelakshmi R', month: 'June 2026', eventsWorked: 5, baseWage: 4750, ta: 600, advance: 0, netPayable: 5350 },
      { staffId: 'STF-106', name: 'Anjali Krishnan', month: 'June 2026', eventsWorked: 7, baseWage: 5600, ta: 950, advance: 1500, netPayable: 5050 },
      { staffId: 'STF-107', name: 'Rahul Nair', month: 'June 2026', eventsWorked: 4, baseWage: 3600, ta: 0, advance: 500, netPayable: 3100 },
    ],

    advances: [
      { id: 'ADV-201', staffId: 'STF-101', name: 'Arjun Menon', amount: 1000, date: '2026-06-10', reason: 'Personal — medical', status: 'Approved' },
      { id: 'ADV-202', staffId: 'STF-103', name: 'Mohammed Faisal', amount: 2000, date: '2026-06-14', reason: 'Family function', status: 'Approved' },
      { id: 'ADV-203', staffId: 'STF-106', name: 'Anjali Krishnan', amount: 1500, date: '2026-06-16', reason: 'Rent due', status: 'Approved' },
      { id: 'ADV-204', staffId: 'STF-108', name: 'Fathima Beevi', amount: 500, date: '2026-06-19', reason: 'Travel emergency', status: 'Pending' },
    ],

    applications: [
      { id: 'APP-901', eventId: 'EVT-2041', staffId: 'STF-101', name: 'Arjun Menon', role: 'Server', appliedOn: '2026-06-15', status: 'Approved', distance: '4.2 km', doubleWorker: false },
      { id: 'APP-902', eventId: 'EVT-2041', staffId: 'STF-103', name: 'Mohammed Faisal', role: 'Server', appliedOn: '2026-06-15', status: 'Approved', distance: '6.8 km', doubleWorker: false },
      { id: 'APP-903', eventId: 'EVT-2041', staffId: 'STF-108', name: 'Fathima Beevi', role: 'Server', appliedOn: '2026-06-17', status: 'Pending', distance: '12.1 km', doubleWorker: false },
      { id: 'APP-904', eventId: 'EVT-2044', staffId: 'STF-104', name: 'Sreelakshmi R', role: 'Supervisor', appliedOn: '2026-06-16', status: 'Approved', distance: '22.5 km', doubleWorker: true },
      { id: 'APP-905', eventId: 'EVT-2042', staffId: 'STF-106', name: 'Anjali Krishnan', role: 'Housekeeping', appliedOn: '2026-06-18', status: 'Pending', distance: '8.4 km', doubleWorker: false },
      { id: 'APP-906', eventId: 'EVT-2043', staffId: 'STF-105', name: 'Vishnu Prasad', role: 'Server', appliedOn: '2026-06-17', status: 'Rejected', distance: '3.1 km', doubleWorker: false },
    ],

    cancellations: [
      { id: 'CNL-50', staffId: 'STF-105', name: 'Vishnu Prasad', eventId: 'EVT-2038', reason: 'Family emergency', requestedOn: '2026-06-06', eventDate: '2026-06-08', withinLock: true, status: 'Rejected — within 3-day lock' },
      { id: 'CNL-51', staffId: 'STF-108', name: 'Fathima Beevi', eventId: 'EVT-2039', reason: 'Health issue', requestedOn: '2026-06-05', eventDate: '2026-06-12', withinLock: false, status: 'Approved' },
    ],

    users: [
      { id: 'USR-01', name: 'Priya Varma', role: 'Admin / Owner', email: 'priya@belliziacaters.in', phone: '+91 90000 10001', status: 'Active' },
      { id: 'USR-02', name: 'Suresh Kumar', role: 'Store Manager', email: 'suresh@belliziacaters.in', phone: '+91 90000 10002', status: 'Active', godown: 'Kochi Main Godown' },
      { id: 'USR-03', name: 'Latha Menon', role: 'Store Manager', email: 'latha@belliziacaters.in', phone: '+91 90000 10003', status: 'Active', godown: 'TVM Storage Unit' },
      { id: 'USR-04', name: 'Thomas Abraham', role: 'HR', email: 'thomas@belliziacaters.in', phone: '+91 90000 10004', status: 'Active' },
      { id: 'USR-05', name: 'Sreelakshmi R', role: 'Site Manager', email: 'sreelakshmi@belliziacaters.in', phone: '+91 98470 44556', status: 'Active' },
      { id: 'USR-06', name: 'Anand Das', role: 'Accounts', email: 'anand@belliziacaters.in', phone: '+91 90000 10006', status: 'Active' },
    ],

    promotionRules: [
      { from: 'Normal', to: 'Premium', threshold: 40, wageBoost: '+₹150/event' },
      { from: 'Premium', to: 'Extreme Premium', threshold: 100, wageBoost: '+₹250/event' },
    ],

    siteShares: [
      { id: 'SH-30', eventId: 'EVT-2041', sharedBy: 'Sreelakshmi R', sharedWith: 'Arjun Menon, Mohammed Faisal', note: 'Confirm mandap setup position before 4 PM', date: '2026-06-21' },
      { id: 'SH-31', eventId: 'EVT-2044', sharedBy: 'Suresh Kumar', sharedWith: 'Site team — Kollam', note: 'Generator backup placed near stage left', date: '2026-06-20' },
    ],
  };
}

// Utility functions
export function fmtINR(n: number): string {
  return '₹' + Number(n).toLocaleString('en-IN');
}

export function uid(prefix: string): string {
  return prefix + '-' + Math.floor(1000 + Math.random() * 9000);
}

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function todayStr(): string {
  return new Date('2026-06-22').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function sumStaff(obj: Record<string, number>): number {
  return Object.values(obj).reduce((a, b) => a + b, 0);
}

export function defaultItemsForTier(tier: string) {
  if (tier === 'Extreme Premium') return [
    { name: 'Chiavari Chairs (Gold)', qty: 500, sent: 0 },
    { name: 'Round Banquet Tables', qty: 50, sent: 0 },
    { name: 'Fresh Floral Centerpieces', qty: 50, sent: 0 },
    { name: 'Crystal Glassware Set', qty: 700, sent: 0 },
    { name: 'LED Mandap Backdrop Frame', qty: 2, sent: 0 },
  ];
  if (tier === 'Premium') return [
    { name: 'Cocktail High Tables', qty: 20, sent: 0 },
    { name: 'White Dinnerware Set', qty: 300, sent: 0 },
    { name: 'Premium Drape & Canopy', qty: 8, sent: 0 },
    { name: 'Floral Centerpieces', qty: 20, sent: 0 },
  ];
  return [
    { name: 'Plastic Chairs', qty: 150, sent: 0 },
    { name: 'Basic Dinnerware Set', qty: 150, sent: 0 },
  ];
}
