import type { StaffTier } from '../../data/types';

// ===== TierBadge =====
export function TierBadge({ tier }: { tier: StaffTier }) {
  const cls = tier === 'Extreme Premium' ? 'tier-extreme' : tier === 'Premium' ? 'tier-premium' : 'tier-normal';
  return <span className={`tier-badge ${cls}`}>{tier}</span>;
}

// ===== StatusBadge =====
const STATUS_MAP: Record<string, string> = {
  'Upcoming': 'badge-info', 'In Progress': 'badge-warn', 'Completed': 'badge-ok',
  'Approved': 'badge-ok', 'Pending': 'badge-warn', 'Rejected': 'badge-danger',
  'Active': 'badge-ok', 'Deactivated': 'badge-danger', 'Sent': 'badge-info',
  'Draft': 'badge-gold', 'Invoiced': 'badge-ok',
  'Paid': 'badge-ok', 'Partial': 'badge-warn', 'Unpaid': 'badge-danger',
  'Available': 'badge-ok', 'On Trip': 'badge-warn', 'Maintenance': 'badge-danger',
  'Out': 'badge-warn', 'Returned': 'badge-ok',
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_MAP[status] || 'badge-info';
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" />
      {status}
    </span>
  );
}

export function ChecklistStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Pending': 'badge-warn', 'Packing': 'badge-info', 'Dispatched': 'badge-ok', 'Returned': 'badge-gold'
  };
  return (
    <span className={`badge ${map[status] || 'badge-info'}`}>
      <span className="badge-dot" />
      {status}
    </span>
  );
}

// ===== StockBar =====
export function StockBar({ available, total }: { available: number; total: number }) {
  const pct = total > 0 ? Math.round((available / total) * 100) : 0;
  const color = pct < 30 ? 'var(--danger)' : pct < 60 ? 'var(--warn)' : 'var(--ok)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="progress-track" style={{ width: 70 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span style={{ fontSize: '11.5px', fontWeight: 600, color }}>{pct}%</span>
    </div>
  );
}

// ===== Avatar =====
export function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <div className="avatar-sm" style={{ width: size, height: size, fontSize: size * 0.37 }}>
      {initials}
    </div>
  );
}

// ===== StatCard =====
export function StatCard({ icon, value, label, delta, deltaDir }: {
  icon: string; value: string; label: string; delta?: string; deltaDir?: 'up' | 'down';
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-val">{value}</div>
      <div className="stat-label">{label}</div>
      {delta && <div className={`stat-delta ${deltaDir || 'up'}`}>{delta}</div>}
    </div>
  );
}
