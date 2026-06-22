import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/Badge';
import { fmtDate, fmtINR, uid } from '../data/db';
import { X, Check } from 'lucide-react';

export function AdvancesPage() {
  const { db, setDB, openModal, closeModal, toast } = useApp();

  function approve(id: string) {
    setDB(prev => ({ ...prev, advances: prev.advances.map(a => a.id === id ? { ...a, status: 'Approved' } : a) }));
    toast('Advance approved');
  }

  function reject(id: string) {
    setDB(prev => ({ ...prev, advances: prev.advances.map(a => a.id === id ? { ...a, status: 'Rejected' } : a) }));
    toast('Advance rejected');
  }

  function openAdvanceForm() {
    let staffId = db.staff.filter(s => s.status === 'Active')[0]?.id || '';
    let amount = 0;
    let reason = '';
    openModal(
      <div>
        <div className="modal-head"><div><h3>Log Advance Payment</h3></div><button className="modal-close" onClick={closeModal}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="field"><label>Staff</label>
            <select onChange={e => { staffId = e.target.value; }}>
              {db.staff.filter(s => s.status === 'Active').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Amount (₹)</label><input type="number" placeholder="e.g. 1000" onChange={e => { amount = Number(e.target.value); }} /></div>
          <div className="field"><label>Reason</label><textarea placeholder="Reason for advance request" onChange={e => { reason = e.target.value; }} /></div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button className="btn btn-gold" onClick={() => {
            const s = db.staff.find(x => x.id === staffId)!;
            setDB(prev => ({ ...prev, advances: [{ id: uid('ADV'), staffId, name: s.name, amount, date: '2026-06-22', reason: reason || 'Not specified', status: 'Pending' }, ...prev.advances] }));
            toast('Advance logged, pending approval');
            closeModal();
          }}>Log Advance</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Staff Advances</h1><div className="page-desc">Advance payment requests against future earnings.</div></div>
        <div className="head-actions"><button className="btn btn-gold" onClick={openAdvanceForm}>+ Log Advance</button></div>
      </div>
      <div className="panel"><div className="panel-body pad0"><div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
        <thead><tr><th>Staff</th><th>Amount</th><th>Reason</th><th>Date</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {db.advances.map(a => (
            <tr key={a.id}>
              <td className="cell-strong">{a.name}</td>
              <td>{fmtINR(a.amount)}</td>
              <td>{a.reason}</td>
              <td>{fmtDate(a.date)}</td>
              <td><StatusBadge status={a.status} /></td>
              <td>{a.status === 'Pending'
                ? <div className="table-actions">
                    <div className="row-action" onClick={() => approve(a.id)}><Check size={16} /></div>
                    <div className="row-action danger" onClick={() => reject(a.id)}><X size={16} /></div>
                  </div>
                : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table></div></div></div>
    </>
  );
}
