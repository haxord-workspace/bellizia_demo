import React, { createContext, useContext, useReducer, useCallback, useRef, useState } from 'react';
import type { DB, AppRole, PageId } from '../data/types';
import { createInitialDB } from '../data/db';

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
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [db, setDB] = useState<DB>(createInitialDB());
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [modal, setModal] = useState<ModalState>({ open: false, content: null, wide: false });
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
    <AppContext.Provider value={{ db, setDB, currentPage, navigate, toast, toasts, modal, openModal, closeModal, confirmAction }}>
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
        <button className="modal-close" onClick={onCancel}>✕</button>
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
export const ROLES: Record<AppRole, { name: string; title: string; initials: string; icon: string; desc: string }> = {
  admin: { name: 'Priya Varma', title: 'Admin / Owner', initials: 'PV', icon: '👑', desc: 'Full system access' },
  store: { name: 'Suresh Kumar', title: 'Store Manager', initials: 'SK', icon: '📦', desc: 'Kochi Main Godown' },
  site: { name: 'Sreelakshmi R', title: 'Site Manager', initials: 'SR', icon: '📍', desc: 'On-ground event ops' },
};

export interface NavItem { id: PageId; label: string; icon: string; badge?: number; }
export interface NavGroup { group: string; items: NavItem[]; }

export const NAV: Record<AppRole, NavGroup[]> = {
  admin: [
    { group: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }] },
    { group: 'Events', items: [
      { id: 'events', label: 'Events', icon: '🎉', badge: 7 },
      { id: 'quotations', label: 'Quotations', icon: '📝', badge: 7 },
      { id: 'invoices', label: 'Invoices', icon: '🧾' },
      { id: 'checklists', label: 'Checklists', icon: '✅' },
    ]},
    { group: 'Workforce', items: [
      { id: 'staff', label: 'Staff Directory', icon: '👥', badge: 8 },
      { id: 'applications', label: 'Shift Applications', icon: '📋', badge: 2 },
      { id: 'cancellations', label: 'Cancellations', icon: '🚫' },
      { id: 'promotions', label: 'Tier & Promotions', icon: '🏅' },
      { id: 'performance', label: 'Performance', icon: '⭐' },
    ]},
    { group: 'Finance', items: [
      { id: 'payroll', label: 'Payroll & Earnings', icon: '💰' },
      { id: 'advances', label: 'Advances', icon: '💵', badge: 1 },
    ]},
    { group: 'Inventory & Logistics', items: [
      { id: 'godowns', label: 'Godowns', icon: '🏬' },
      { id: 'stock', label: 'Stock & Inventory', icon: '📦' },
      { id: 'vehicles', label: 'Vehicles', icon: '🚚' },
      { id: 'trips', label: 'Vehicle Trips', icon: '🛣️' },
    ]},
    { group: 'Admin', items: [
      { id: 'users', label: 'Team & Roles', icon: '🧑‍💼' },
      { id: 'sitesharing', label: 'Site Sharing', icon: '📍' },
      { id: 'whatsapp', label: 'WhatsApp Messaging', icon: '💬' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ]},
  ],
  store: [
    { group: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }] },
    { group: 'Inventory', items: [
      { id: 'stock', label: 'Stock & Inventory', icon: '📦' },
      { id: 'godowns', label: 'Godowns', icon: '🏬' },
    ]},
    { group: 'Dispatch', items: [
      { id: 'checklists', label: 'Checklists', icon: '✅', badge: 3 },
      { id: 'trips', label: 'Vehicle Trips', icon: '🛣️' },
      { id: 'returns', label: 'Returns & Damage', icon: '🔄' },
    ]},
    { group: 'Logistics', items: [
      { id: 'vehicles', label: 'Vehicles', icon: '🚚' },
    ]},
  ],
  site: [
    { group: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }] },
    { group: 'On Ground', items: [
      { id: 'myevents', label: 'My Events', icon: '🎉' },
      { id: 'verification', label: 'Stock Verification', icon: '✅' },
      { id: 'sitesharing', label: 'Site Sharing', icon: '📍', badge: 2 },
    ]},
    { group: 'Team', items: [
      { id: 'staff', label: 'Staff On Site', icon: '👥' },
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
