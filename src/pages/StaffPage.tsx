import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TierBadge, StatusBadge, Avatar } from '../components/ui/Badge';
import { fmtDate, fmtINR, uid } from '../data/db';
import type { Staff, StaffRole, StaffTier } from '../data/types';
import { Eye, Pencil, Ban, Check, Search, X, Star } from 'lucide-react';

export function StaffPage() {
  const { db, setDB, openModal, closeModal, toast, confirmAction } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? db.staff : db.staff.filter(s => s.status === filter);

  function openStaffForm(id?: string) {
    const s = id ? db.staff.find(x => x.id === id) : null;
    openModal(<StaffForm s={s || null} onClose={closeModal} onSave={(payload) => {
      if (id && s) {
        setDB(prev => ({ ...prev, staff: prev.staff.map(x => x.id === id ? { ...x, ...payload } : x) }));
        toast('Staff updated');
      } else {
        const initials = payload.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
        const newStaff: Staff = { id: uid('STF'), events: 0, rating: 4.0, status: 'Active', joined: '2026-06-22', avatar: initials, ...payload };
        setDB(prev => ({ ...prev, staff: [newStaff, ...prev.staff] }));
        toast('Staff added');
      }
      closeModal();
    }} />, true);
  }

  function viewStaff(id: string) {
    const s = db.staff.find(x => x.id === id)!;
    const earning = db.earnings.find(e => e.staffId === id);
    openModal(
      <div>
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar initials={s.avatar} size={42} />
            <div><h3>{s.name}</h3><div className="modal-sub">{s.id} · {s.role}</div></div>
          </div>
          <button className="modal-close" onClick={closeModal}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}><TierBadge tier={s.tier} /><StatusBadge status={s.status} /></div>
          <div className="kv"><div className="k">Phone</div><div className="v">{s.phone}</div></div>
          <div className="kv"><div className="k">Location</div><div className="v">{s.location}</div></div>
          <div className="kv"><div className="k">Joined</div><div className="v">{fmtDate(s.joined)}</div></div>
          <div className="kv"><div className="k">Events Completed</div><div className="v">{s.events}</div></div>
          <div className="kv"><div className="k">Average Rating</div><div className="v rating-stars"><Star size={14} className="inline" style={{ verticalAlign: 'text-bottom' }} /> {s.rating}</div></div>
          <div className="kv"><div className="k">Per-Event Wage</div><div className="v">{fmtINR(s.wage)}</div></div>
          {earning && <>
            <div className="divider" />
            <div className="section-title">This Month ({earning.month})</div>
            <div className="kv"><div className="k">Events Worked</div><div className="v">{earning.eventsWorked}</div></div>
            <div className="kv"><div className="k">Net Payable</div><div className="v">{fmtINR(earning.netPayable)}</div></div>
          </>}
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Close</button>
          <button className="btn btn-gold" onClick={() => { closeModal(); openStaffForm(s.id); }}>Edit</button>
        </div>
      </div>
    );
  }

  function deactivate(id: string) {
    const s = db.staff.find(x => x.id === id)!;
    confirmAction('Deactivate Staff Account', `Deactivate <strong>${s.name}</strong>'s account?`, () => {
      setDB(prev => ({ ...prev, staff: prev.staff.map(x => x.id === id ? { ...x, status: 'Deactivated' } : x) }));
      toast('Staff account deactivated');
    }, 'Deactivate', true);
  }

  function reactivate(id: string) {
    setDB(prev => ({ ...prev, staff: prev.staff.map(x => x.id === id ? { ...x, status: 'Active' } : x) }));
    toast('Staff account reactivated');
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Staff Directory</h1><div className="page-desc">All registered catering and event staff across tiers and locations.</div></div>
        <div className="head-actions"><button className="btn btn-gold" onClick={() => openStaffForm()}>+ Add Staff</button></div>
      </div>
      <div className="toolbar">
        <div className="search-box"><Search size={16} /> <span>Search staff…</span></div>
        {['all', 'Active', 'Deactivated'].map(f => (
          <div key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f}
          </div>
        ))}
      </div>
      <div className="panel"><div className="panel-body pad0"><div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
        <thead><tr><th>Staff</th><th>Role</th><th>Tier</th><th>Events</th><th>Rating</th><th>Location</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td><div className="name-cell"><Avatar initials={s.avatar} /><div><div className="cell-strong">{s.name}</div><div className="cell-sub">{s.phone}</div></div></div></td>
              <td>{s.role}</td>
              <td><TierBadge tier={s.tier} /></td>
              <td>{s.events}</td>
              <td className="rating-stars"><Star size={14} className="inline" style={{ verticalAlign: 'text-bottom' }} /> {s.rating}</td>
              <td>{s.location}</td>
              <td><StatusBadge status={s.status} /></td>
              <td><div className="table-actions">
                <div className="row-action" onClick={() => viewStaff(s.id)}><Eye size={16} /></div>
                <div className="row-action" onClick={() => openStaffForm(s.id)}><Pencil size={16} /></div>
                {s.status === 'Active'
                  ? <div className="row-action danger" onClick={() => deactivate(s.id)}><Ban size={16} /></div>
                  : <div className="row-action" onClick={() => reactivate(s.id)}><Check size={16} /></div>}
              </div></td>
            </tr>
          ))}
        </tbody>
      </table></div></div></div>
    </>
  );
}

function StaffForm({ s, onClose, onSave }: {
  s: Staff | null; onClose: () => void;
  onSave: (p: Pick<Staff, 'name'|'phone'|'role'|'tier'|'location'|'wage'>) => void;
}) {
  const [name, setName] = useState(s?.name || '');
  const [phone, setPhone] = useState(s?.phone || '');
  const [role, setRole] = useState<StaffRole>(s?.role || 'Server');
  const [tier, setTier] = useState<StaffTier>(s?.tier || 'Normal');
  const [location, setLocation] = useState(s?.location || '');
  const [wage, setWage] = useState(s?.wage || 0);
  const { toast } = useApp();

  function submit() {
    if (!name.trim()) { toast('Name is required', 'err'); return; }
    onSave({ name, phone, role, tier, location, wage });
  }
  return (
    <>
      <div className="modal-head"><div><h3>{s ? 'Edit Staff' : 'Add Staff'}</h3></div><button className="modal-close" onClick={onClose}><X size={16} /></button></div>
      <div className="modal-body">
        <div className="field-row">
          <div className="field"><label>Full Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Karthik S" /></div>
          <div className="field"><label>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 90000 00000" /></div>
        </div>
        <div className="field-row">
          <div className="field"><label>Role</label>
            <select value={role} onChange={e => setRole(e.target.value as StaffRole)}>
              {['Server','Housekeeping','Supervisor','Driver'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="field"><label>Tier</label>
            <select value={tier} onChange={e => setTier(e.target.value as StaffTier)}>
              {['Normal','Premium','Extreme Premium'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="field-row">
          <div className="field"><label>Base Location</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="City" /></div>
          <div className="field"><label>Per-Event Wage (₹)</label><input type="number" value={wage} onChange={e => setWage(Number(e.target.value))} /></div>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-gold" onClick={submit}>{s ? 'Save' : 'Add Staff'}</button>
      </div>
    </>
  );
}
