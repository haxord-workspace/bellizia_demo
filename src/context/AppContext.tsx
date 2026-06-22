import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import type { DB, AppRole, PageId } from '../data/types';
import { createInitialDB } from '../data/db';
import {
  Crown, Package, MapPin, BarChart, PartyPopper, FileText, Receipt, CheckCircle,
  Users, ClipboardList, Ban, Award, Star, IndianRupee, Banknote, Store, Truck, Route,
  UserCog, MessageCircle, Settings, RefreshCw, X
} from 'lucide-react';

// ============================================================
// TOAST
// ============================================================
export interface ToastItem {
  id: string;
  msg: string;
  type: 'ok' | 'err' | 'info';
}

// ============================================================
// MODAL
// ============================================================
export interface ModalState {
  open: boolean;
  content: React.ReactNode;
  wide: boolean;
}

// ============================================================
// APP CONTEXT
// ============================================================
interface AppContextValue {
  db: DB;
  setDB: React.Dispatch<React.SetStateAction<DB>>;
  currentPage: PageId;
  navigate: (page: PageId) => void;
  toast: (msg: string, type?: 'ok' | 'err' | 'info') => void;
  toasts: ToastItem[];
  modal: ModalState;
  openModal: (content: React.ReactNode, wide?: boolean) => void;
  closeModal: () => void;
  confirmAction: (
    title: string,
    desc: string,
    onConfirm: () => void,
    confirmLabel?: string,
    danger?: boolean
  ) => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [db, setDB] = useState<DB>(createInitialDB());
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [modal, setModal] = useState<ModalState>({ open: false, content: null, wide: false });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toastCounter = useRef(0);

  const navigate = useCallback((page: PageId) => {
    setCurrentPage(page);
  }, []);

  const toast = useCallback((msg: string, type: 'ok' | 'err' | 'info' = 'ok') => {
    const id = String(++toastCounter.current);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  const openModal = useCallback((content: React.ReactNode, wide = false) => {
    setModal({ open: true, content, wide });
  }, []);

  const closeModal = useCallback(() => {
    setModal(prev => ({ ...prev, open: false, content: null }));
  }, []);

  const confirmAction = useCallback(
    (
      title: string,
      desc: string,
      onConfirm: () => void,
      confirmLabel = 'Confirm',
      danger = false
    ) => {
      openModal(
        <ConfirmDialogContent
          title={title}
          desc={desc}
          confirmLabel={confirmLabel}
          danger={danger}
          onConfirm={() => { onConfirm(); closeModal(); }}
          onCancel={closeModal}
        />
      );
    },
    [openModal, closeModal]
  );

  return (
    <AppContext.Provider value={{ db, setDB, currentPage, navigate, toast, toasts, modal, openModal, closeModal, confirmAction, sidebarOpen, setSidebarOpen }}>
      {children}
    </AppContext.Provider>
  );
}

function ConfirmDialogContent({
  title, desc, confirmLabel, danger, onConfirm, onCancel
}: {
  title: string;
  desc: string;
  confirmLabel: string;
  danger: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="modal-head">
        <div><h3>{title}</h3></div>
        <button className="modal-close" onClick={onCancel}><X size={16} /></button>
      </div>
      <div className="modal-body">
        <p style={{ fontSize: '13.5px', color: 'var(--bronze)', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: desc }} />
      </div>
      <div className="modal-foot">
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button
          className={`btn ${danger ? 'btn-danger-outline' : 'btn-gold'}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// Nav config
export const ROLES: Record<AppRole, { name: string; title: string; initials: string; icon: React.ReactNode; desc: string }> = {
  admin: { name: 'Priya Varma', title: 'Admin / Owner', initials: 'PV', icon: <Crown size={16} />, desc: 'Full system access' },
  store: { name: 'Suresh Kumar', title: 'Store Manager', initials: 'SK', icon: <Package size={16} />, desc: 'Kochi Main Godown' },
  site: { name: 'Sreelakshmi R', title: 'Site Manager', initials: 'SR', icon: <MapPin size={16} />, desc: 'On-ground event ops' },
};

export interface NavItem { id: PageId; label: string; icon: React.ReactNode; badge?: number; }
export interface NavGroup { group: string; items: NavItem[]; }

export const NAV: Record<AppRole, NavGroup[]> = {
  admin: [
    { group: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: <BarChart size={16} /> }] },
    { group: 'Events', items: [
      { id: 'events', label: 'Events', icon: <PartyPopper size={16} />, badge: 7 },
      { id: 'quotations', label: 'Quotations', icon: <FileText size={16} />, badge: 7 },
      { id: 'invoices', label: 'Invoices', icon: <Receipt size={16} /> },
      { id: 'checklists', label: 'Checklists', icon: <CheckCircle size={16} /> },
    ]},
    { group: 'Workforce', items: [
      { id: 'staff', label: 'Staff Directory', icon: <Users size={16} />, badge: 8 },
      { id: 'applications', label: 'Shift Applications', icon: <ClipboardList size={16} />, badge: 2 },
      { id: 'cancellations', label: 'Cancellations', icon: <Ban size={16} /> },
      { id: 'promotions', label: 'Tier & Promotions', icon: <Award size={16} /> },
      { id: 'performance', label: 'Performance', icon: <Star size={16} /> },
    ]},
    { group: 'Finance', items: [
      { id: 'payroll', label: 'Payroll & Earnings', icon: <IndianRupee size={16} /> },
      { id: 'advances', label: 'Advances', icon: <Banknote size={16} />, badge: 1 },
    ]},
    { group: 'Inventory & Logistics', items: [
      { id: 'godowns', label: 'Godowns', icon: <Store size={16} /> },
      { id: 'stock', label: 'Stock & Inventory', icon: <Package size={16} /> },
      { id: 'vehicles', label: 'Vehicles', icon: <Truck size={16} /> },
      { id: 'trips', label: 'Vehicle Trips', icon: <Route size={16} /> },
    ]},
    { group: 'Admin', items: [
      { id: 'users', label: 'Team & Roles', icon: <UserCog size={16} /> },
      { id: 'sitesharing', label: 'Site Sharing', icon: <MapPin size={16} /> },
      { id: 'whatsapp', label: 'WhatsApp Messaging', icon: <MessageCircle size={16} /> },
      { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    ]},
  ],
  store: [
    { group: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: <BarChart size={16} /> }] },
    { group: 'Inventory', items: [
      { id: 'stock', label: 'Stock & Inventory', icon: <Package size={16} /> },
      { id: 'godowns', label: 'Godowns', icon: <Store size={16} /> },
    ]},
    { group: 'Dispatch', items: [
      { id: 'checklists', label: 'Checklists', icon: <CheckCircle size={16} />, badge: 3 },
      { id: 'trips', label: 'Vehicle Trips', icon: <Route size={16} /> },
      { id: 'returns', label: 'Returns & Damage', icon: <RefreshCw size={16} /> },
    ]},
    { group: 'Logistics', items: [
      { id: 'vehicles', label: 'Vehicles', icon: <Truck size={16} /> },
    ]},
  ],
  site: [
    { group: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: <BarChart size={16} /> }] },
    { group: 'On Ground', items: [
      { id: 'myevents', label: 'My Events', icon: <PartyPopper size={16} /> },
      { id: 'verification', label: 'Stock Verification', icon: <CheckCircle size={16} /> },
      { id: 'sitesharing', label: 'Site Sharing', icon: <MapPin size={16} />, badge: 2 },
    ]},
    { group: 'Team', items: [
      { id: 'staff', label: 'Staff On Site', icon: <Users size={16} /> },
    ]},
  ],
};

export const PAGE_TITLES: Record<PageId, { t: string; b: string }> = {
  dashboard: { t: 'Dashboard', b: 'Overview' },
  events: { t: 'Events', b: 'Events / All Events' },
  quotations: { t: 'Quotations', b: 'Events / Quotations' },
  invoices: { t: 'Invoices', b: 'Events / Invoices' },
  checklists: { t: 'Checklists', b: 'Events / Checklists' },
  staff: { t: 'Staff Directory', b: 'Workforce / Staff' },
  applications: { t: 'Shift Applications', b: 'Workforce / Applications' },
  cancellations: { t: 'Cancellations', b: 'Workforce / Cancellations' },
  promotions: { t: 'Tier & Promotions', b: 'Workforce / Promotions' },
  performance: { t: 'Staff Performance', b: 'Workforce / Performance' },
  payroll: { t: 'Payroll & Earnings', b: 'Finance / Payroll' },
  advances: { t: 'Advances', b: 'Finance / Advances' },
  godowns: { t: 'Godowns', b: 'Inventory / Godowns' },
  stock: { t: 'Stock & Inventory', b: 'Inventory / Stock' },
  vehicles: { t: 'Vehicles', b: 'Logistics / Vehicles' },
  trips: { t: 'Vehicle Trips', b: 'Logistics / Trips' },
  returns: { t: 'Returns & Damage Check', b: 'Inventory / Returns' },
  users: { t: 'Team & Roles', b: 'Admin / Team' },
  sitesharing: { t: 'Site Sharing', b: 'Admin / Site Sharing' },
  whatsapp: { t: 'WhatsApp Messaging', b: 'Admin / WhatsApp' },
  settings: { t: 'Settings', b: 'Admin / Settings' },
  myevents: { t: 'My Events', b: 'On Ground / My Events' },
  verification: { t: 'Stock Verification', b: 'On Ground / Verification' },
};
