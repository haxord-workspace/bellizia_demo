import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, TierBadge, StatCard } from '../components/ui/Badge';
import { fmtDate } from '../data/db';
import {
  RefreshCw, AlertTriangle, CheckCircle, Package, ClipboardList,
  Search, Plus, X
} from 'lucide-react';

// ── Mock returns data (derived from dispatched checklists) ──────────────────
interface ReturnEntry {
  id: string;
  checklistId: string;
  eventName: string;
  tier: string;
  returnDate: string;
  items: ReturnItem[];
  status: 'Pending' | 'In Progress' | 'Completed';
  remarks: string;
}

interface ReturnItem {
  name: string;
  sent: number;
  returned: number;
  damaged: number;
  missing: number;
}

const INITIAL_RETURNS: ReturnEntry[] = [
  {
    id: 'RET-101',
    checklistId: 'CHK-701',
    eventName: 'Menon-Pillai Wedding',
    tier: 'Extreme Premium',
    returnDate: '2026-07-05',
    status: 'Pending',
    remarks: 'Items expected back day after event',
    items: [
      { name: 'Chiavari Chairs (Gold)', sent: 600, returned: 590, damaged: 6, missing: 4 },
      { name: 'Round Banquet Tables', sent: 60, returned: 60, damaged: 0, missing: 0 },
      { name: 'Fresh Floral Centerpieces', sent: 58, returned: 58, damaged: 58, missing: 0 },
      { name: 'White Dinnerware Set', sent: 850, returned: 842, damaged: 5, missing: 3 },
      { name: 'LED Mandap Backdrop Frame', sent: 2, returned: 2, damaged: 0, missing: 0 },
      { name: 'Crystal Glassware Set', sent: 840, returned: 818, damaged: 14, missing: 8 },
    ],
  },
  {
    id: 'RET-100',
    checklistId: 'CHK-499',
    eventName: 'Krishnan Family Wedding',
    tier: 'Premium',
    returnDate: '2026-06-13',
    status: 'Completed',
    remarks: 'All items verified and stocked back',
    items: [
      { name: 'Cocktail High Tables', sent: 20, returned: 20, damaged: 1, missing: 0 },
      { name: 'White Dinnerware Set', sent: 300, returned: 296, damaged: 3, missing: 1 },
      { name: 'Premium Drape & Canopy', sent: 8, returned: 8, damaged: 0, missing: 0 },
      { name: 'Floral Centerpieces', sent: 20, returned: 20, damaged: 20, missing: 0 },
    ],
  },
  {
    id: 'RET-099',
    checklistId: 'CHK-498',
    eventName: "St. Xavier's College Fest",
    tier: 'Normal',
    returnDate: '2026-06-09',
    status: 'Completed',
    remarks: 'Minor damage on plastic chairs noted',
    items: [
      { name: 'Plastic Chairs', sent: 600, returned: 596, damaged: 8, missing: 0 },
      { name: 'Basic Dinnerware Set', sent: 150, returned: 147, damaged: 2, missing: 1 },
    ],
  },
];

function DamageTag({ count, label }: { count: number; label: string }) {
  if (count === 0) return <span style={{ color: 'var(--ok)', fontWeight: 600 }}>—</span>;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: count > 5 ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
      color: count > 5 ? '#ef4444' : '#f59e0b',
      padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700
    }}>
      {count} {label}
    </span>
  );
}

function ReturnRow({ entry, onOpen }: { entry: ReturnEntry; onOpen: () => void }) {
  const totalDamaged = entry.items.reduce((s, i) => s + i.damaged, 0);
  const totalMissing = entry.items.reduce((s, i) => s + i.missing, 0);
  const totalSent = entry.items.reduce((s, i) => s + i.sent, 0);
  const totalReturned = entry.items.reduce((s, i) => s + i.returned, 0);

  return (
    <tr style={{ cursor: 'pointer' }} onClick={onOpen}>
      <td>
        <div className="cell-strong">{entry.id}</div>
        <div className="cell-sub">{entry.checklistId}</div>
      </td>
      <td>
        <div className="cell-strong">{entry.eventName}</div>
        <div className="cell-sub">{fmtDate(entry.returnDate)}</div>
      </td>
      <td><TierBadge tier={entry.tier as any} /></td>
      <td style={{ fontWeight: 600 }}>{totalReturned}/{totalSent}</td>
      <td><DamageTag count={totalDamaged} label="dmg" /></td>
      <td><DamageTag count={totalMissing} label="missing" /></td>
      <td><StatusBadge status={entry.status} /></td>
      <td style={{ textAlign: 'right' }}>
        <button className="btn btn-sm btn-outline" onClick={e => { e.stopPropagation(); onOpen(); }}>
          View
        </button>
      </td>
    </tr>
  );
}

function ReturnDetailModal({ entry, onClose, onUpdateStatus }: {
  entry: ReturnEntry;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ReturnEntry['status']) => void;
}) {
  const totalDamaged = entry.items.reduce((s, i) => s + i.damaged, 0);
  const totalMissing = entry.items.reduce((s, i) => s + i.missing, 0);

  return (
    <>
      <div className="modal-head">
        <div>
          <h3>{entry.id} — {entry.eventName}</h3>
          <div style={{ fontSize: 12, color: 'var(--bronze)', marginTop: 2 }}>
            Return date: {fmtDate(entry.returnDate)} · {entry.checklistId}
          </div>
        </div>
        <button className="modal-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="modal-body" style={{ padding: 0 }}>
        {/* Summary chips */}
        <div style={{ display: 'flex', gap: 12, padding: '14px 20px', background: 'var(--surface-raised)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Package size={14} style={{ color: 'var(--gold)' }} />
            <span style={{ color: 'var(--bronze)' }}>{entry.items.length} item types</span>
          </div>
          {totalDamaged > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>{totalDamaged} damaged</span>
            </div>
          )}
          {totalMissing > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <AlertTriangle size={14} style={{ color: '#ef4444' }} />
              <span style={{ color: '#ef4444', fontWeight: 600 }}>{totalMissing} missing</span>
            </div>
          )}
          {totalDamaged === 0 && totalMissing === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <CheckCircle size={14} style={{ color: 'var(--ok)' }} />
              <span style={{ color: 'var(--ok)', fontWeight: 600 }}>No issues</span>
            </div>
          )}
        </div>

        {/* Items table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Item</th>
                <th>Sent</th>
                <th>Returned</th>
                <th>Damaged</th>
                <th>Missing</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              {entry.items.map((item, idx) => {
                const ok = item.damaged === 0 && item.missing === 0;
                return (
                  <tr key={idx}>
                    <td className="cell-strong">{item.name}</td>
                    <td>{item.sent}</td>
                    <td style={{ fontWeight: 600, color: item.returned < item.sent ? '#f59e0b' : 'inherit' }}>
                      {item.returned}
                    </td>
                    <td>
                      {item.damaged > 0
                        ? <span style={{ color: '#f59e0b', fontWeight: 700 }}>{item.damaged}</span>
                        : <span style={{ color: 'var(--ok)' }}>—</span>}
                    </td>
                    <td>
                      {item.missing > 0
                        ? <span style={{ color: '#ef4444', fontWeight: 700 }}>{item.missing}</span>
                        : <span style={{ color: 'var(--ok)' }}>—</span>}
                    </td>
                    <td>
                      {ok
                        ? <span className="badge badge-ok" style={{ fontSize: 11 }}>OK</span>
                        : <span className="badge badge-warn" style={{ fontSize: 11 }}>Issues</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Remarks */}
        {entry.remarks && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--bronze)', marginBottom: 4 }}>Remarks</div>
            <div style={{ fontSize: 13.5, color: 'var(--fg)' }}>{entry.remarks}</div>
          </div>
        )}
      </div>
      <div className="modal-foot">
        <button className="btn btn-outline" onClick={onClose}>Close</button>
        {entry.status === 'Pending' && (
          <button className="btn btn-outline" style={{ color: '#f59e0b', borderColor: '#f59e0b' }}
            onClick={() => { onUpdateStatus(entry.id, 'In Progress'); onClose(); }}>
            Mark In Progress
          </button>
        )}
        {entry.status !== 'Completed' && (
          <button className="btn btn-gold"
            onClick={() => { onUpdateStatus(entry.id, 'Completed'); onClose(); }}>
            <CheckCircle size={14} className="inline mr-1" /> Mark Completed
          </button>
        )}
      </div>
    </>
  );
}

// ── Add Return Modal ───────────────────────────────────────────────────────
function AddReturnModal({ onClose, onAdd }: { onClose: () => void; onAdd: (e: ReturnEntry) => void }) {
  const { db } = useApp();
  const dispatched = db.checklists.filter(c => c.status === 'Dispatched');
  const [selected, setSelected] = useState(dispatched[0]?.id || '');
  const [returnDate, setReturnDate] = useState('2026-07-05');
  const [remarks, setRemarks] = useState('');

  const checklist = dispatched.find(c => c.id === selected);

  const handleAdd = () => {
    if (!checklist) return;
    const newEntry: ReturnEntry = {
      id: 'RET-' + Math.floor(100 + Math.random() * 900),
      checklistId: checklist.id,
      eventName: checklist.eventName,
      tier: checklist.tier,
      returnDate,
      status: 'Pending',
      remarks,
      items: checklist.items.map(i => ({
        name: i.name,
        sent: i.sent,
        returned: i.sent,
        damaged: 0,
        missing: 0,
      })),
    };
    onAdd(newEntry);
    onClose();
  };

  return (
    <>
      <div className="modal-head">
        <div><h3>Log Return</h3></div>
        <button className="modal-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="modal-body">
        <div className="field-row">
          <label className="field-label">Dispatched Checklist</label>
          <select className="input" value={selected} onChange={e => setSelected(e.target.value)}>
            {dispatched.map(c => <option key={c.id} value={c.id}>{c.id} — {c.eventName}</option>)}
            {dispatched.length === 0 && <option>No dispatched checklists</option>}
          </select>
        </div>
        <div className="field-row">
          <label className="field-label">Expected Return Date</label>
          <input type="date" className="input" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
        </div>
        <div className="field-row">
          <label className="field-label">Remarks</label>
          <textarea className="input" rows={3} value={remarks} onChange={e => setRemarks(e.target.value)}
            placeholder="Any notes about the return condition..." />
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-gold" onClick={handleAdd} disabled={!checklist}>
          <Plus size={14} className="inline mr-1" /> Log Return
        </button>
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export function ReturnsPage() {
  const { openModal, closeModal, toast } = useApp();
  const [returns, setReturns] = useState<ReturnEntry[]>(INITIAL_RETURNS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filtered = returns.filter(r => {
    const matchSearch = r.eventName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalDamaged = returns.reduce((s, r) => s + r.items.reduce((a, i) => a + i.damaged, 0), 0);
  const totalMissing = returns.reduce((s, r) => s + r.items.reduce((a, i) => a + i.missing, 0), 0);
  const pending = returns.filter(r => r.status === 'Pending').length;
  const inProgress = returns.filter(r => r.status === 'In Progress').length;

  const openDetail = (entry: ReturnEntry) => {
    openModal(
      <ReturnDetailModal
        entry={entry}
        onClose={closeModal}
        onUpdateStatus={(id, status) => {
          setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r));
          toast(`Return ${id} marked as ${status}`, 'ok');
        }}
      />,
      true
    );
  };

  const openAddReturn = () => {
    openModal(
      <AddReturnModal
        onClose={closeModal}
        onAdd={entry => {
          setReturns(prev => [entry, ...prev]);
          toast(`Return ${entry.id} logged`, 'ok');
        }}
      />,
      false
    );
  };

  return (
    <>
      {/* Page header */}
      <div className="page-head">
        <div>
          <h1><RefreshCw size={22} className="inline mr-2" style={{ verticalAlign: 'text-bottom' }} />Returns & Damage Check</h1>
          <div className="page-desc">Log and verify returned event items. Flag damage and missing pieces.</div>
        </div>
        <div className="head-actions">
          <button className="btn btn-gold" onClick={openAddReturn}>
            <Plus size={16} className="inline mr-1" /> Log Return
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <StatCard icon={<ClipboardList size={24} />} value={String(returns.length)} label="Total Returns" />
        <StatCard icon={<AlertTriangle size={24} />} value={String(pending + inProgress)} label="Pending / In Progress"
          delta={pending + inProgress > 0 ? 'Needs attention' : undefined} deltaDir="down" />
        <StatCard icon={<AlertTriangle size={24} />} value={String(totalDamaged)} label="Damaged Items"
          delta={totalDamaged > 0 ? 'Requires write-off' : undefined} deltaDir="down" />
        <StatCard icon={<Package size={24} />} value={String(totalMissing)} label="Missing Items"
          delta={totalMissing > 0 ? 'Investigate urgently' : undefined} deltaDir="down" />
      </div>

      {/* Filters */}
      <div className="panel">
        <div className="panel-head">
          <h3>Returns Log</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--bronze)' }} />
              <input
                className="input"
                style={{ paddingLeft: 30, height: 34, fontSize: 13 }}
                placeholder="Search event or ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="input" style={{ height: 34, fontSize: 13 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="panel-body pad0">
          {filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <div className="empty-icon"><RefreshCw size={36} /></div>
              <div className="empty-title">No returns found</div>
              <div className="empty-desc">Adjust filters or log a new return above.</div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th>Return ID</th>
                    <th>Event</th>
                    <th>Tier</th>
                    <th>Returned / Sent</th>
                    <th>Damaged</th>
                    <th>Missing</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(entry => (
                    <ReturnRow key={entry.id} entry={entry} onOpen={() => openDetail(entry)} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
