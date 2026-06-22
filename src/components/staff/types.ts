// =============================================================================
// types.ts — Staff Module Type Definitions
// =============================================================================

export type StaffRole = "Server" | "Housekeeper" | "Driver";
export type FilterRole = StaffRole | "All";

export type StaffStatus = "Active" | "Deactivated";
export type FilterStatus = StaffStatus | "All";

export type StaffTier = "Extreme premium" | "Premium" | "Normal";

// ---------------------------------------------------------------------------
// Sub-entities
// ---------------------------------------------------------------------------

export interface EventHistory {
  event: string;
  date: string;
  rating: number;
}

// ---------------------------------------------------------------------------
// Core domain models
// ---------------------------------------------------------------------------

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  location: string;
  events: number;
  rating: number;
  status: StaffStatus;
  joined: string;
  baseRate: number;
  history: EventHistory[];
  deactivationReason?: string;
}

export interface ShiftApplication {
  id: string;
  staffName: string;
  role: StaffRole;
  event: string;
  date: string;
  distance: string;
  status: "Pending" | "Approved" | "Rejected";
}

// ---------------------------------------------------------------------------
// UI / Navigation
// ---------------------------------------------------------------------------

export interface NavItem {
  label: string;
  /** Lucide-react icon component */
  icon: React.ComponentType<{ className?: string }>;
}

export type ViewState =
  | { screen: "list" }
  | { screen: "detail"; id: string };
