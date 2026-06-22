import { useApp } from '../context/AppContext';
import { TierBadge, ChecklistStatusBadge } from '../components/ui/Badge';
import { uid, defaultItemsForTier } from '../data/db';

export function ChecklistsPage() {
  const { db, setDB, openModal, closeModal, toast } = useApp();

  function markItemPacked(checklistId: string, idx: number) {
    setDB(prev => ({
      ...prev,
      checklists: prev.checklists.map(c => c.id === checklistId
        ? { ...c, items: c.items.map((it, i) => i === idx ? { ...it, sent: it.qty } : it) }
        : c)
    }));
    toast('Item marked as packed');
  }

  function updateStatus(id: string, status: string) {
    setDB(prev => ({
      ...prev,
      checklists: prev.checklists.map(c => c.id === id ? { ...c, status: status as any } : c)
    }));
    toast(`Checklist moved to "${status}"`);
  }

  function dispatchChecklist(id: string) {
    const c = db.checklists.find(x => x.id === id)!;
    const availableVehicles = db.vehicles.filter(v => v.status === 'Available');
    let selectedVid = availableVehicles[0]?.id || '';
    let km = 0;
    let driver = '';

    openModal(
      <div>
        <div className="modal-head"><div><h3>Assign Truck</h3><div className="modal-sub">{c.eventName}</div></div><button className="modal-close" onClick={closeModal}>✕</button></div>
        <div className="modal-body">
          <div className="field"><label>Select Vehicle</label>
            <select onChange={e => { selectedVid = e.target.value; }}>
              {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.name} — {v.number} ({v.type})</option>)}
            </select>
            <div className="hint">Rental vehicle details and gas allowance will be auto-logged.</div>
          </div>
          <div className="field-row">
            <div className="field"><label>Estimated Distance (km)</label><input type="number" placeholder="e.g. 35" onChange={e => { km = Number(e.target.value); }} /></div>
            <div className="field"><label>Driver</label><input placeholder="Driver name" onChange={e => { driver = e.target.value; }} /></div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button className="btn btn-gold" onClick={() => {
            const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            setDB(prev => ({
              ...prev,
              vehicles: prev.vehicles.map(v => v.id === selectedVid ? { ...v, status: 'On Trip' } : v),
              vehicleTrips: [{ id: uid('TRP'), vehicleId: selectedVid, eventId: c.quotationId, driver: driver || 'Unassigned', km, gasAllowance: Math.round(km * 25), status: 'Out', dispatched: `2026-06-22 ${time}`, returned: null }, ...prev.vehicleTrips],
              checklists: prev.checklists.map(ch => ch.id === id ? { ...ch, status: 'Dispatched', items: ch.items.map(it => ({ ...it, sent: it.qty })) } : ch)
            }));
            toast('Truck dispatched. Trip logged under Vehicle Trips.');
            closeModal();
          }}>Dispatch Truck</button>
        </div>
      </div>
    );
  }

  function openChecklistForm() {
    const approvedQuotes = db.quotations.filter(q => q.status === 'Approved');
    if (approvedQuotes.length === 0) { toast('No approved quotations available', 'err'); return; }
    let selectedQid = approvedQuotes[0].id;
    openModal(
      <div>
        <div className="modal-head"><div><h3>New Checklist</h3></div><button className="modal-close" onClick={closeModal}>✕</button></div>
        <div className="modal-body">
          <div className="field"><label>Quotation</label>
            <select onChange={e => { selectedQid = e.target.value; }}>
              {approvedQuotes.map(q => <option key={q.id} value={q.id}>{q.id} — {q.eventName}</option>)}
            </select>
          </div>
          <div className="hint" style={{ marginTop: -6, marginBottom: 14 }}>Item list will be auto-generated from the quotation's tier package.</div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button className="btn btn-gold" onClick={() => {
            const q = db.quotations.find(x => x.id === selectedQid)!;
            setDB(prev => ({ ...prev, checklists: [{ id: uid('CHK'), quotationId: q.id, eventName: q.eventName, tier: q.tier, status: 'Pending', items: defaultItemsForTier(q.tier) }, ...prev.checklists] }));
            toast('Checklist generated');
            closeModal();
          }}>Generate Checklist</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Dispatch Checklists</h1><div className="page-desc">Generated when a quotation is approved and sent to store. Tracks packing through dispatch.</div></div>
        <div className="head-actions"><button className="btn btn-gold" onClick={openChecklistForm}>+ New Checklist</button></div>
      </div>

      <div className="panel" style={{ padding: '22px 26px' }}>
        <div className="section-title" style={{ marginBottom: 18 }}>Standard Flow</div>
        <div className="stepper">
          {[
            { label: 'Quotation Approved', sub: 'Client confirms', done: true },
            { label: 'Checklist Generated', sub: 'Sent to Store Manager', done: true },
            { label: 'Packing & Dispatch', sub: 'Truck assigned', current: true },
            { label: 'Site Verification', sub: 'Site Manager confirms' },
            { label: 'Return & Damage Check', sub: 'Store reconciles' },
          ].map((s, i) => (
            <div key={i} className={`step ${s.done ? 'done' : s.current ? 'current' : ''}`}>
              <div className="step-circle">{i + 1}</div>
              <div className="step-label">{s.label}</div>
              <div className="step-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {db.checklists.map(c => {
          const totalSent = c.items.reduce((s, i) => s + i.sent, 0);
          const totalQty = c.items.reduce((s, i) => s + i.qty, 0);
          const pct = totalQty ? Math.round((totalSent / totalQty) * 100) : 0;
          return (
            <div key={c.id} className="panel">
              <div className="panel-head">
                <div>
                  <h3>{c.id} <span style={{ fontWeight: 400, color: 'var(--bronze)', fontSize: 13 }}>— {c.eventName}</span></h3>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}><TierBadge tier={c.tier} /><ChecklistStatusBadge status={c.status} /><span className="badge badge-info">{c.quotationId}</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--bronze)', marginBottom: 5 }}>{totalSent}/{totalQty} items packed</div>
                  <div className="progress-track" style={{ width: 140 }}><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                </div>
              </div>
              <div className="panel-body">
                {c.items.map((it, idx) => (
                  <div key={idx} className="checklist-item">
                    <div className={`check-circle ${it.sent >= it.qty ? 'checked' : ''}`}>{it.sent >= it.qty ? '✓' : ''}</div>
                    <div style={{ flex: 1 }}>{it.name}</div>
                    <span className="qty-pill">{it.sent} / {it.qty}</span>
                    {c.status !== 'Dispatched' && <button className="btn btn-sm btn-outline" onClick={() => markItemPacked(c.id, idx)}>Mark Packed</button>}
                  </div>
                ))}
                <div className="divider" />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
                  {c.status === 'Pending' && <button className="btn btn-sm btn-outline" onClick={() => updateStatus(c.id, 'Packing')}>Start Packing</button>}
                  {c.status === 'Packing' && <button className="btn btn-sm btn-gold" onClick={() => dispatchChecklist(c.id)}>🚚 Assign Truck & Dispatch</button>}
                  {c.status === 'Dispatched' && <span className="badge badge-ok">Dispatched — awaiting return</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
