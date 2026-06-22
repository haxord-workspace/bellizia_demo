import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TierBadge, StatusBadge, StatCard } from '../components/ui/Badge';
import { fmtDate, fmtINR, sumStaff, uid, defaultItemsForTier } from '../data/db';
import type { ERPEvent, EventType, StaffTier } from '../data/types';

export function EventsPage() {
  const { db, setDB, openModal, closeModal, toast, confirmAction } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? db.events : db.events.filter(e => e.status === filter);

  function openEventForm(id?: string) {
    const e = id ? db.events.find(x => x.id === id) : null;
    openModal(<EventForm event={e || null} onClose={closeModal} onSave={(payload) => {
      if (id && e) {
        setDB(prev => ({ ...prev, events: prev.events.map(x => x.id === id ? { ...x, ...payload } : x) }));
        toast('Event updated successfully');
      } else {
        const newEv: ERPEvent = { id: uid('EVT'), status: 'Upcoming', staffApplied: 0, quotationId: '—', ...payload };
        setDB(prev => ({ ...prev, events: [newEv, ...prev.events] }));
        toast('Event created successfully');
      }
      closeModal();
    }} />, true);
  }

  function viewEvent(id: string) {
    const e = db.events.find(x => x.id === id)!;
    const apps = db.applications.filter(a => a.eventId === id);
    openModal(
      <div>
        <div className="modal-head">
          <div><h3>{e.name}</h3><div className="modal-sub">{e.id} · {e.venue}</div></div>
          <button className="modal-close" onClick={closeModal}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <TierBadge tier={e.tier} /><StatusBadge status={e.status} /><span className="badge badge-info">{e.type}</span>
          </div>
          <div className="kv"><div className="k">Date</div><div className="v">{fmtDate(e.date)}</div></div>
          <div className="kv"><div className="k">Guests</div><div className="v">{e.guests}</div></div>
          <div className="kv"><div className="k">Vendor / Client</div><div className="v">{e.vendor}</div></div>
          <div className="kv"><div className="k">Linked Quotation</div><div className="v">{e.quotationId}</div></div>
          <div className="divider" />
          <div className="section-title">Staff Requirements</div>
          {Object.entries(e.staffNeeded).map(([k, v]) => (
            <div key={k} className="kv"><div className="k">{k}</div><div className="v">{v} needed</div></div>
          ))}
          <div className="divider" />
          <div className="section-title">Applications ({apps.length})</div>
          {apps.length ? apps.map(a => (
            <div key={a.id} className="kv"><div className="k">{a.name} — {a.role}</div><div className="v"><StatusBadge status={a.status} /></div></div>
          )) : <p className="muted" style={{ fontSize: '12.5px' }}>No applications yet.</p>}
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Close</button>
          <button className="btn btn-gold" onClick={() => { closeModal(); openEventForm(e.id); }}>Edit Event</button>
        </div>
      </div>
    );
  }

  function deleteEvent(id: string) {
    const e = db.events.find(x => x.id === id)!;
    confirmAction('Delete Event', `Are you sure you want to delete <strong>${e.name}</strong>? This action cannot be undone.`, () => {
      setDB(prev => ({ ...prev, events: prev.events.filter(x => x.id !== id) }));
      toast('Event deleted');
    }, 'Delete', true);
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Events</h1><div className="page-desc">Manage event details, staff requirements, and lifecycle.</div></div>
        <div className="head-actions">
          <button className="btn btn-gold" onClick={() => openEventForm()}>+ New Event</button>
        </div>
      </div>
      <div className="toolbar">
        <div className="search-box">🔍 <span>Search events…</span></div>
        {['all', 'Upcoming', 'In Progress', 'Completed'].map(f => (
          <div key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f}
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-body pad0">
          <div className="table-wrap"><table>
            <thead><tr><th>Event</th><th>Type</th><th>Tier</th><th>Date</th><th>Guests</th><th>Staff Status</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td><div className="cell-strong">{e.name}</div><div className="cell-sub">{e.venue}</div></td>
                  <td>{e.type}</td>
                  <td><TierBadge tier={e.tier} /></td>
                  <td>{fmtDate(e.date)}</td>
                  <td>{e.guests}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-track" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: `${Math.min(100, (e.staffApplied / (sumStaff(e.staffNeeded as Record<string,number>) || 1)) * 100)}%` }} />
                      </div>
                      <span style={{ fontSize: '11.5px' }}>{e.staffApplied}/{sumStaff(e.staffNeeded as Record<string,number>)}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={e.status} /></td>
                  <td>
                    <div className="table-actions">
                      <div className="row-action" title="View" onClick={() => viewEvent(e.id)}>👁</div>
                      <div className="row-action" title="Edit" onClick={() => openEventForm(e.id)}>✎</div>
                      <div className="row-action danger" title="Delete" onClick={() => deleteEvent(e.id)}>🗑</div>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">🎉</div><div className="empty-title">No events found</div><div className="empty-desc">Try a different filter or create a new event.</div></div></td></tr>
              )}
            </tbody>
          </table></div>
        </div>
      </div>
    </>
  );
}

function EventForm({ event: e, onClose, onSave }: {
  event: ERPEvent | null;
  onClose: () => void;
  onSave: (payload: Omit<ERPEvent, 'id' | 'status' | 'staffApplied' | 'quotationId'>) => void;
}) {
  const [name, setName] = useState(e?.name || '');
  const [type, setType] = useState<EventType>(e?.type || 'Wedding');
  const [tier, setTier] = useState<StaffTier>(e?.tier || 'Normal');
  const [venue, setVenue] = useState(e?.venue || '');
  const [date, setDate] = useState(e?.date || '2026-07-01');
  const [guests, setGuests] = useState(e?.guests || 0);
  const [vendor, setVendor] = useState(e?.vendor || '');
  const [server, setServer] = useState(e?.staffNeeded.Server || 0);
  const [house, setHouse] = useState(e?.staffNeeded.Housekeeping || 0);
  const [supervisor, setSupervisor] = useState(e?.staffNeeded.Supervisor || 0);
  const { toast } = useApp();

  function submit() {
    if (!name.trim()) { toast('Event name is required', 'err'); return; }
    onSave({ name, type, tier, venue, date, guests, vendor, staffNeeded: { Server: server, Housekeeping: house, Supervisor: supervisor } });
  }

  return (
    <>
      <div className="modal-head">
        <div><h3>{e ? 'Edit Event' : 'New Event'}</h3><div className="modal-sub">{e ? e.id : 'Define event details and staff requirements'}</div></div>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">
        <div className="field"><label>Event Name</label><input value={name} onChange={ev => setName(ev.target.value)} placeholder="e.g. Nair Family Wedding" /></div>
        <div className="field-row">
          <div className="field"><label>Event Type</label>
            <select value={type} onChange={ev => setType(ev.target.value as EventType)}>
              {['Wedding','Inauguration','Political','Court Function','College Event','Corporate'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field"><label>Tier</label>
            <select value={tier} onChange={ev => setTier(ev.target.value as StaffTier)}>
              {['Normal','Premium','Extreme Premium'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="field"><label>Venue</label><input value={venue} onChange={ev => setVenue(ev.target.value)} placeholder="Venue address" /></div>
        <div className="field-row">
          <div className="field"><label>Event Date</label><input type="date" value={date} onChange={ev => setDate(ev.target.value)} /></div>
          <div className="field"><label>Guest Count</label><input type="number" value={guests} onChange={ev => setGuests(Number(ev.target.value))} /></div>
        </div>
        <div className="field"><label>Vendor / Client</label><input value={vendor} onChange={ev => setVendor(ev.target.value)} placeholder="Client or vendor name" /></div>
        <div className="divider" />
        <div className="section-title">Staff Requirements</div>
        <div className="field-row3">
          <div className="field"><label>Servers</label><input type="number" value={server} onChange={ev => setServer(Number(ev.target.value))} /></div>
          <div className="field"><label>Housekeeping</label><input type="number" value={house} onChange={ev => setHouse(Number(ev.target.value))} /></div>
          <div className="field"><label>Supervisors</label><input type="number" value={supervisor} onChange={ev => setSupervisor(Number(ev.target.value))} /></div>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-gold" onClick={submit}>{e ? 'Save Changes' : 'Create Event'}</button>
      </div>
    </>
  );
}
