import { useApp } from '../context/AppContext';
import { StatusBadge, TierBadge, StatCard } from '../components/ui/Badge';
import { fmtDate } from '../data/db';
import {
  PartyPopper, MapPin, Users, Calendar, Check, Clock,
  ArrowRight, X, AlertTriangle, CheckCircle
} from 'lucide-react';

// Site Manager is Sreelakshmi R — show events she's assigned to
const SITE_MANAGER_STAFF_ID = 'STF-104';

export function MyEventsPage() {
  const { db, navigate, openModal, closeModal } = useApp();

  // Events where this site manager has an approved application
  const myApprovedEventIds = new Set(
    db.applications
      .filter(a => a.staffId === SITE_MANAGER_STAFF_ID && a.status === 'Approved')
      .map(a => a.eventId)
  );

  // Also include upcoming/in-progress events by default (site manager sees all active ones)
  const myEvents = db.events.filter(
    e => myApprovedEventIds.has(e.id) || e.status === 'Upcoming' || e.status === 'In Progress'
  );

  const upcoming = myEvents.filter(e => e.status === 'Upcoming');
  const inProgress = myEvents.filter(e => e.status === 'In Progress');
  const completed = myEvents.filter(e => e.status === 'Completed');

  function openEventDetail(eventId: string) {
    const event = db.events.find(e => e.id === eventId)!;
    const staffOnEvent = db.applications.filter(
      a => a.eventId === eventId && a.status === 'Approved'
    );
    openModal(
      <div>
        <div className="modal-head">
          <div>
            <h3>{event.name}</h3>
            <div className="modal-sub">{event.id} · {event.type}</div>
          </div>
          <button className="modal-close" onClick={closeModal}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <TierBadge tier={event.tier} />
            <StatusBadge status={event.status} />
          </div>
          <div className="kv"><div className="k">Venue</div><div className="v">{event.venue}</div></div>
          <div className="kv"><div className="k">Date</div><div className="v">{fmtDate(event.date)}</div></div>
          <div className="kv"><div className="k">Guests</div><div className="v">{event.guests}</div></div>
          <div className="kv"><div className="k">Vendor</div><div className="v">{event.vendor}</div></div>
          <div className="kv"><div className="k">Staff Applied / Needed</div>
            <div className="v">{event.staffApplied} / {Object.values(event.staffNeeded as Record<string,number>).reduce((a,b)=>a+b,0)}</div>
          </div>
          {staffOnEvent.length > 0 && <>
            <div className="divider" />
            <div className="section-title">Approved Staff</div>
            {staffOnEvent.map(a => (
              <div key={a.id} className="kv">
                <div className="k">{a.name}</div>
                <div className="v">{a.role} · {a.distance}</div>
              </div>
            ))}
          </>}
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Close</button>
          <button className="btn btn-gold" onClick={() => { closeModal(); navigate('verification'); }}>
            <CheckCircle size={14} className="inline mr-1" /> Go to Verification
          </button>
        </div>
      </div>,
      true
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1><PartyPopper size={22} className="inline mr-2" style={{ verticalAlign: 'text-bottom' }} />My Events</h1>
          <div className="page-desc">Your assigned site events — on-ground operations, stock, and staff coordination.</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard icon={<PartyPopper size={24} />} value={String(upcoming.length)} label="Upcoming Assignments" />
        <StatCard icon={<Clock size={24} />} value={String(inProgress.length)} label="Currently In Progress"
          delta={inProgress.length > 0 ? 'Active now' : undefined} deltaDir="up" />
        <StatCard icon={<Users size={24} />} value={String(myEvents.reduce((s,e)=>s+e.staffApplied,0))} label="Total Staff Across Events" />
        <StatCard icon={<CheckCircle size={24} />} value={String(completed.length)} label="Completed This Season" />
      </div>

      {/* In Progress — highlighted */}
      {inProgress.length > 0 && (
        <div className="panel" style={{ borderLeft: '3px solid var(--warn)' }}>
          <div className="panel-head">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--warn)' }}>●</span> Currently In Progress
            </h3>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {inProgress.map(e => (
              <div key={e.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', background: 'var(--surface-raised)', borderRadius: 10,
                cursor: 'pointer'
              }} onClick={() => openEventDetail(e.id)}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--bronze)', marginTop: 2 }}>
                    <MapPin size={12} className="inline mr-1" />{e.venue}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <TierBadge tier={e.tier} />
                  <StatusBadge status={e.status} />
                  <button className="btn btn-sm btn-gold">
                    View <ArrowRight size={12} className="inline ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming events table */}
      <div className="panel">
        <div className="panel-head">
          <h3><Calendar size={16} className="inline mr-2" style={{ verticalAlign: 'text-bottom' }} />Upcoming Events</h3>
        </div>
        <div className="panel-body pad0">
          {upcoming.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <div className="empty-icon"><PartyPopper size={36} /></div>
              <div className="empty-title">No upcoming events</div>
              <div className="empty-desc">Check back later for new assignments.</div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Type</th>
                    <th>Tier</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Guests</th>
                    <th>Staff</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map(e => (
                    <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => openEventDetail(e.id)}>
                      <td>
                        <div className="cell-strong">{e.name}</div>
                        <div className="cell-sub">{e.id}</div>
                      </td>
                      <td>{e.type}</td>
                      <td><TierBadge tier={e.tier} /></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(e.date)}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.venue}</td>
                      <td>{e.guests}</td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{e.staffApplied}</span>
                        <span style={{ color: 'var(--bronze)' }}>/{Object.values(e.staffNeeded as Record<string,number>).reduce((a,b)=>a+b,0)}</span>
                        {e.staffApplied < Object.values(e.staffNeeded as Record<string,number>).reduce((a,b)=>a+b,0) && (
                          <AlertTriangle size={12} className="inline ml-1" style={{ color: '#f59e0b' }} />
                        )}
                      </td>
                      <td><button className="btn btn-sm btn-outline" onClick={e2 => { e2.stopPropagation(); openEventDetail(e.id); }}>View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Checklist quick-status */}
      <div className="panel">
        <div className="panel-head">
          <h3>My Pre-Event Checklist</h3>
          <span className="badge badge-warn">Menon-Pillai Wedding</span>
        </div>
        <div className="panel-body">
          <div className="checklist-item"><div className="check-circle checked"><Check size={14} /></div> Mandap setup position confirmed with godown team</div>
          <div className="checklist-item"><div className="check-circle checked"><Check size={14} /></div> Staff headcount verified — 19 of 35 confirmed</div>
          <div className="checklist-item"><div className="check-circle checked"><Check size={14} /></div> Dinnerware receipt acknowledged (CHK-701)</div>
          <div className="checklist-item"><div className="check-circle"></div> Floral shortfall (2 pieces) — pending store dispatch</div>
          <div className="checklist-item"><div className="check-circle"></div> Final walkthrough with client by 5:00 PM</div>
        </div>
      </div>
    </>
  );
}
