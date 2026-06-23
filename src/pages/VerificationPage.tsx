import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard, TierBadge } from '../components/ui/Badge';
import { fmtDate } from '../data/db';
import {
  CheckCircle, Package, AlertTriangle, Search, Check, X,
  ClipboardList, Truck
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────────
type VerifStatus = 'Pending' | 'In Progress' | 'Verified' | 'Issues Found';

interface VerifItem {
  name: string;
  expected: number;
  counted: number;
  unit: string;
  ok: boolean;
}

interface Verification {
  id: string;
  checklistId: string;
  eventName: string;
  tier: string;
  eventDate: string;
  status: VerifStatus;
  items: VerifItem[];
  verifiedBy: string;
  notes: string;
}

// ── Mock data (cross-references checklists) ─────────────────────────────────
const INITIAL_VERIF: Verification[] = [
  {
    id: 'VRF-301',
    checklistId: 'CHK-701',
    eventName: 'Menon-Pillai Wedding',
    tier: 'Extreme Premium',
    eventDate: '2026-07-04',
    status: 'In Progress',
    verifiedBy: 'Sreelakshmi R',
    notes: 'Floral centerpieces short by 2. Flagged to store manager.',
    items: [
      { name: 'Chiavari Chairs (Gold)', expected: 600, counted: 600, unit: 'pcs', ok: true },
      { name: 'Round Banquet Tables', expected: 60, counted: 60, unit: 'pcs', ok: true },
      { name: 'Fresh Floral Centerpieces', expected: 60, counted: 58, unit: 'sets', ok: false },
      { name: 'White Dinnerware Set', expected: 850, counted: 850, unit: 'sets', ok: true },
      { name: 'LED Mandap Backdrop Frame', expected: 2, counted: 2, unit: 'pcs', ok: true },
      { name: 'Crystal Glassware Set', expected: 850, counted: 840, unit: 'sets', ok: false },
    ],
  },
  {
    id: 'VRF-300',
    checklistId: 'CHK-499',
    eventName: 'Krishnan Family Wedding',
    tier: 'Premium',
    eventDate: '2026-06-12',
    status: 'Verified',
    verifiedBy: 'Sreelakshmi R',
    notes: 'All items matched. One cocktail table had a minor wobble, noted.',
    items: [
      { name: 'Cocktail High Tables', expected: 20, counted: 20, unit: 'pcs', ok: true },
      { name: 'White Dinnerware Set', expected: 300, counted: 300, unit: 'sets', ok: true },
      { name: 'Premium Drape & Canopy', expected: 8, counted: 8, unit: 'pcs', ok: true },
      { name: 'Floral Centerpieces', expected: 20, counted: 20, unit: 'sets', ok: true },
    ],
  },
  {
    id: 'VRF-299',
    checklistId: 'CHK-498',
    eventName: "St. Xavier's College Fest",
    tier: 'Normal',
    eventDate: '2026-06-08',
    status: 'Issues Found',
    verifiedBy: 'Sreelakshmi R',
    notes: '4 plastic chairs found broken on arrival. Replacement requested.',
    items: [
      { name: 'Plastic Chairs', expected: 600, counted: 596, unit: 'pcs', ok: false },
      { name: 'Basic Dinnerware Set', expected: 150, counted: 150, unit: 'sets', ok: true },
    ],
  },
];

const STATUS_COLOR: Record<VerifStatus, string> = {
  'Pending': '#f59e0b',
  'In Progress': '#3b82f6',
  'Verified': 'var(--ok)',
  'Issues Found': '#ef4444',
};

// ── Detail modal ─────────────────────────────────────────────────────────────
function VerifDetailModal({ v, onClose, onMark }: {
  v: Verification;
  onClose: () => void;
  onMark: (id: string, status: VerifStatus) => void;
}) {
  const issues = v.items.filter(i => !i.ok);
  return (
    <>
      <div className="modal-head">
        <div>
          <h3>{v.id} — {v.eventName}</h3>
          <div style={{ fontSize: 12, color: 'var(--bronze)', marginTop: 2 }}>
            {v.checklistId} · Event date: {fmtDate(v.eventDate)}
          </div>
        </div>
        <button className="modal-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="modal-body" style={{ padding: 0 }}>
        {/* Summary banner */}
        <div style={{
          display: 'flex', gap: 16, padding: '12px 20px',
          background: issues.length > 0 ? 'rgba(239,68,68,0.07)' : 'rgba(34,197,94,0.07)',
          borderBottom: '1px solid var(--border)'
        }}>
          {issues.length === 0
            ? <><CheckCircle size={16} style={{ color: 'var(--ok)' }} /> <span style={{ color: 'var(--ok)', fontWeight: 600, fontSize: 13 }}>All items verified OK</span></>
            : <><AlertTriangle size={16} style={{ color: '#ef4444' }} /> <span style={{ color: '#ef4444', fontWeight: 600, fontSize: 13 }}>{issues.length} item{issues.length > 1 ? 's' : ''} with issues</span></>
          }
        </div>

        {/* Items */}
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Item</th>
                <th>Expected</th>
                <th>Counted</th>
                <th>Difference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {v.items.map((item, idx) => {
                const diff = item.counted - item.expected;
                return (
                  <tr key={idx} style={{ background: !item.ok ? 'rgba(239,68,68,0.04)' : undefined }}>
                    <td className="cell-strong">{item.name}</td>
                    <td>{item.expected} {item.unit}</td>
                    <td style={{ fontWeight: 700, color: !item.ok ? '#ef4444' : 'inherit' }}>
                      {item.counted} {item.unit}
                    </td>
                    <td style={{ fontWeight: 700, color: diff < 0 ? '#ef4444' : diff > 0 ? 'var(--ok)' : 'var(--bronze)' }}>
                      {diff === 0 ? '—' : (diff > 0 ? '+' : '') + diff}
                    </td>
                    <td>
                      {item.ok
                        ? <span className="badge badge-ok" style={{ fontSize: 11 }}><Check size={10} className="inline mr-1" />OK</span>
                        : <span className="badge badge-danger" style={{ fontSize: 11 }}><AlertTriangle size={10} className="inline mr-1" />Mismatch</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {v.notes && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--bronze)', marginBottom: 4 }}>
              Field Notes — {v.verifiedBy}
            </div>
            <div style={{ fontSize: 13.5 }}>{v.notes}</div>
          </div>
        )}
      </div>
      <div className="modal-foot">
        <button className="btn btn-outline" onClick={onClose}>Close</button>
        {v.status !== 'Verified' && (
          <button className="btn btn-gold" onClick={() => { onMark(v.id, issues.length > 0 ? 'Issues Found' : 'Verified'); onClose(); }}>
            <Check size={14} className="inline mr-1" /> Mark as Verified
          </button>
        )}
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function VerificationPage() {
  const { openModal, closeModal, toast } = useApp();
  const [verifs, setVerifs] = useState<Verification[]>(INITIAL_VERIF);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = verifs.filter(v => {
    const matchSearch = v.eventName.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pending = verifs.filter(v => v.status === 'Pending' || v.status === 'In Progress').length;
  const issues = verifs.filter(v => v.status === 'Issues Found').length;
  const verified = verifs.filter(v => v.status === 'Verified').length;

  const openDetail = (v: Verification) => {
    openModal(
      <VerifDetailModal
        v={v}
        onClose={closeModal}
        onMark={(id, status) => {
          setVerifs(prev => prev.map(x => x.id === id ? { ...x, status } : x));
          toast(`Verification ${id} marked as ${status}`, status === 'Issues Found' ? 'err' : 'ok');
        }}
      />,
      true
    );
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1><CheckCircle size={22} className="inline mr-2" style={{ verticalAlign: 'text-bottom' }} />Stock Verification</h1>
          <div className="page-desc">Verify dispatched stock on-site. Cross-check quantities and flag discrepancies.</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard icon={<ClipboardList size={24} />} value={String(verifs.length)} label="Total Verifications" />
        <StatCard icon={<Package size={24} />} value={String(pending)} label="Pending / In Progress"
          delta={pending > 0 ? 'Requires attention' : undefined} deltaDir="down" />
        <StatCard icon={<AlertTriangle size={24} />} value={String(issues)} label="Issues Found"
          delta={issues > 0 ? 'Discrepancies detected' : undefined} deltaDir="down" />
        <StatCard icon={<CheckCircle size={24} />} value={String(verified)} label="Verified OK" />
      </div>

      {/* Table */}
      <div className="panel">
        <div className="panel-head">
          <h3>Verification Log</h3>
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
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Verified">Verified</option>
              <option value="Issues Found">Issues Found</option>
            </select>
          </div>
        </div>
        <div className="panel-body pad0">
          {filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <div className="empty-icon"><Truck size={36} /></div>
              <div className="empty-title">No verifications found</div>
              <div className="empty-desc">Adjust your filter or check back after dispatch.</div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th>Verification ID</th>
                    <th>Event</th>
                    <th>Tier</th>
                    <th>Event Date</th>
                    <th>Items</th>
                    <th>Issues</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(v => {
                    const issueCount = v.items.filter(i => !i.ok).length;
                    return (
                      <tr key={v.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(v)}>
                        <td>
                          <div className="cell-strong">{v.id}</div>
                          <div className="cell-sub">{v.checklistId}</div>
                        </td>
                        <td>
                          <div className="cell-strong">{v.eventName}</div>
                          <div className="cell-sub">{v.verifiedBy}</div>
                        </td>
                        <td><TierBadge tier={v.tier as any} /></td>
                        <td>{fmtDate(v.eventDate)}</td>
                        <td>{v.items.length} items</td>
                        <td>
                          {issueCount === 0
                            ? <span style={{ color: 'var(--ok)', fontWeight: 600 }}>None</span>
                            : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#ef4444', fontWeight: 700, fontSize: 12 }}>
                                <AlertTriangle size={12} /> {issueCount}
                              </span>
                          }
                        </td>
                        <td>
                          <span className="badge" style={{
                            background: `${STATUS_COLOR[v.status]}20`,
                            color: STATUS_COLOR[v.status],
                            borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700
                          }}>
                            {v.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-sm btn-outline" onClick={e2 => { e2.stopPropagation(); openDetail(v); }}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
