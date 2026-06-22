import { useApp } from '../context/AppContext';
import { fmtDate } from '../data/db';

export function CancellationsPage() {
  const { db } = useApp();
  return (
    <>
      <div className="page-head">
        <div><h1>Cancellations</h1><div className="page-desc">Staff cancellation requests. A mandatory reason and a 3-day lock-out before the event are enforced.</div></div>
      </div>
      <div className="panel"><div className="panel-body pad0"><div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
        <thead><tr><th>Staff</th><th>Event</th><th>Reason</th><th>Requested</th><th>Event Date</th><th>3-Day Lock</th><th>Status</th></tr></thead>
        <tbody>
          {db.cancellations.map(c => (
            <tr key={c.id}>
              <td className="cell-strong">{c.name}</td>
              <td>{c.eventId}</td>
              <td>{c.reason}</td>
              <td>{fmtDate(c.requestedOn)}</td>
              <td>{fmtDate(c.eventDate)}</td>
              <td>{c.withinLock ? <span className="badge badge-danger">Within Lock</span> : <span className="badge badge-ok">Clear</span>}</td>
              <td><span className={`badge ${c.status.includes('Approved') ? 'badge-ok' : 'badge-danger'}`}>{c.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table></div></div></div>
      <div className="panel" style={{ padding: '18px 22px' }}>
        <div className="section-title">Policy Reference</div>
        <p style={{ fontSize: 13, color: 'var(--bronze)', lineHeight: 1.7 }}>Staff cannot cancel a confirmed shift within 3 days of the event date. Cancellation requests must include a reason and are reviewed by the admin team. Repeated late cancellations affect tier eligibility.</p>
      </div>
    </>
  );
}
