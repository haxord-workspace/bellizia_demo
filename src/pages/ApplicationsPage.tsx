import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/Badge';
import { fmtDate } from '../data/db';
import { X, Check, AlertTriangle } from 'lucide-react';

export function ApplicationsPage() {
  const { db, setDB, openModal, closeModal, toast } = useApp();

  function updateApplication(id: string, status: 'Approved' | 'Rejected') {
    setDB(prev => {
      const app = prev.applications.find(a => a.id === id)!;
      return {
        ...prev,
        applications: prev.applications.map(a => a.id === id ? { ...a, status } : a),
        events: status === 'Approved'
          ? prev.events.map(e => e.id === app.eventId ? { ...e, staffApplied: e.staffApplied + 1 } : e)
          : prev.events
      };
    });
    toast(`Application ${status.toLowerCase()}`);
  }

  function viewApplication(id: string) {
    const a = db.applications.find(x => x.id === id)!;
    openModal(
      <div>
        <div className="modal-head"><div><h3>{a.name}</h3><div className="modal-sub">{a.id}</div></div><button className="modal-close" onClick={closeModal}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="kv"><div className="k">Event</div><div className="v">{a.eventId}</div></div>
          <div className="kv"><div className="k">Role</div><div className="v">{a.role}</div></div>
          <div className="kv"><div className="k">Distance from Home</div><div className="v">{a.distance}</div></div>
          <div className="kv"><div className="k">Status</div><div className="v"><StatusBadge status={a.status} /></div></div>
        </div>
        <div className="modal-foot"><button className="btn btn-outline" onClick={closeModal}>Close</button></div>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Shift Applications</h1><div className="page-desc">Review and approve staff applications for upcoming events. Double-worker conflicts are flagged.</div></div>
      </div>
      <div className="panel"><div className="panel-body pad0"><div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
        <thead><tr><th>Staff</th><th>Event</th><th>Role</th><th>Distance</th><th>Applied On</th><th>Flags</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {db.applications.map(a => {
            const ev = db.events.find(e => e.id === a.eventId);
            return (
              <tr key={a.id}>
                <td className="cell-strong">{a.name}</td>
                <td>{ev ? ev.name : a.eventId}</td>
                <td>{a.role}</td>
                <td>{a.distance}</td>
                <td>{fmtDate(a.appliedOn)}</td>
                <td>{a.doubleWorker ? <span className="badge badge-warn"><AlertTriangle size={14} className="inline mr-1" /> Double Worker</span> : '—'}</td>
                <td><StatusBadge status={a.status} /></td>
                <td>
                  <div className="table-actions">
                    {a.status === 'Pending' ? <>
                      <div className="row-action" title="Approve" onClick={() => updateApplication(a.id, 'Approved')}><Check size={16} /></div>
                      <div className="row-action danger" title="Reject" onClick={() => updateApplication(a.id, 'Rejected')}><X size={16} /></div>
                    </> : <button className="btn btn-sm btn-outline" onClick={() => viewApplication(a.id)}>View</button>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table></div></div></div>
    </>
  );
}
