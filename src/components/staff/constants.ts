// =============================================================================
// constants.ts — Staff Module Constants, Styles, Seed Data
// =============================================================================

import type { StaffMember, ShiftApplication, StaffTier, StaffStatus, NavItem } from "./types";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Warehouse,
  Truck,
  FileText,
  Wallet,
  Trophy,
  Settings,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Events", icon: CalendarDays },
  { label: "Staff", icon: Users },
  { label: "Godown & stock", icon: Warehouse },
  { label: "Vehicles", icon: Truck },
  { label: "Quotes & invoices", icon: FileText },
  { label: "Payroll", icon: Wallet },
  { label: "Performance", icon: Trophy },
  { label: "Settings", icon: Settings },
];

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

export const tierStyles: Record<StaffTier, string> = {
  "Extreme premium": "bg-amber-100 text-amber-800 border-amber-200",
  Premium: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Normal: "bg-slate-100 text-slate-700 border-slate-200",
};

export const statusStyles: Record<StaffStatus, string> = {
  Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Deactivated: "bg-slate-100 text-slate-500 border-slate-200",
};

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

export function tierFor(events: number): StaffTier {
  if (events >= 40) return "Extreme premium";
  if (events >= 25) return "Premium";
  return "Normal";
}

/** Returns the initials (up to 2 chars) for a display name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Seed data — Staff members
// ---------------------------------------------------------------------------

export const initialStaff: StaffMember[] = [
  {
    id: "ST-014",
    name: "Arjun Kumar",
    role: "Server",
    phone: "+91 98470 11223",
    location: "Trivandrum",
    events: 47,
    rating: 4.8,
    status: "Active",
    joined: "2024-02-11",
    baseRate: 1200,
    history: [
      { event: "Menon – Nair wedding", date: "2026-06-22", rating: 5 },
      { event: "Varma family housewarming", date: "2026-06-15", rating: 5 },
      { event: "Infopark tower inauguration", date: "2026-05-30", rating: 4 },
    ],
  },
  {
    id: "ST-022",
    name: "Bibin Thomas",
    role: "Housekeeper",
    phone: "+91 94470 55621",
    location: "Trivandrum",
    events: 38,
    rating: 4.6,
    status: "Active",
    joined: "2024-04-02",
    baseRate: 950,
    history: [
      { event: "Menon – Nair wedding", date: "2026-06-22", rating: 5 },
      { event: "Infopark tower inauguration", date: "2026-05-30", rating: 4 },
    ],
  },
  {
    id: "ST-031",
    name: "Sajeev Nair",
    role: "Server",
    phone: "+91 99460 22187",
    location: "Kollam",
    events: 12,
    rating: 4.3,
    status: "Active",
    joined: "2025-08-19",
    baseRate: 1000,
    history: [
      { event: "Thomas – George wedding reception", date: "2026-06-25", rating: 4 },
    ],
  },
  {
    id: "ST-008",
    name: "Manu P S",
    role: "Driver",
    phone: "+91 97460 99021",
    location: "Trivandrum",
    events: 9,
    rating: 3.2,
    status: "Deactivated",
    joined: "2024-11-05",
    baseRate: 1100,
    deactivationReason: "Repeated late arrivals, last incident 12 June 2026.",
    history: [
      { event: "Kerala Bar Association conference", date: "2026-06-10", rating: 3 },
    ],
  },
  {
    id: "ST-019",
    name: "Devika Suresh",
    role: "Server",
    phone: "+91 98950 41167",
    location: "Trivandrum",
    events: 41,
    rating: 4.9,
    status: "Active",
    joined: "2023-12-20",
    baseRate: 1200,
    history: [
      { event: "Menon – Nair wedding", date: "2026-06-22", rating: 5 },
      { event: "Varma family housewarming", date: "2026-06-15", rating: 5 },
    ],
  },
  {
    id: "ST-027",
    name: "Anil Kumar",
    role: "Driver",
    phone: "+91 94470 55621",
    location: "Kollam",
    events: 19,
    rating: 4.4,
    status: "Active",
    joined: "2025-01-14",
    baseRate: 1100,
    history: [
      { event: "Thomas – George wedding reception", date: "2026-06-25", rating: 4 },
    ],
  },
  {
    id: "ST-033",
    name: "Priya Mohan",
    role: "Housekeeper",
    phone: "+91 96330 88452",
    location: "Trivandrum",
    events: 6,
    rating: 4.5,
    status: "Active",
    joined: "2026-03-02",
    baseRate: 950,
    history: [{ event: "Infopark tower inauguration", date: "2026-05-30", rating: 4 }],
  },
];

// ---------------------------------------------------------------------------
// Seed data — Shift applications
// ---------------------------------------------------------------------------

export const initialApplications: ShiftApplication[] = [
  {
    id: "AP-101",
    staffName: "Sajeev Nair",
    role: "Server",
    event: "Thomas – George wedding reception",
    date: "2026-06-25",
    distance: "8 km",
    status: "Pending",
  },
  {
    id: "AP-102",
    staffName: "Priya Mohan",
    role: "Housekeeper",
    event: "LDF constituency rally",
    date: "2026-06-28",
    distance: "4 km",
    status: "Pending",
  },
  {
    id: "AP-103",
    staffName: "Devika Suresh",
    role: "Server",
    event: "LDF constituency rally",
    date: "2026-06-28",
    distance: "6 km",
    status: "Pending",
  },
];
