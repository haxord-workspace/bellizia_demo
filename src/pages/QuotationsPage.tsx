import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TierBadge, StatusBadge, StatCard } from '../components/ui/Badge';
import { fmtINR, fmtDate, uid, defaultItemsForTier } from '../data/db';
import type { Quotation, StaffTier, QuotationStatus } from '../data/types';
import { X, FileText, CheckCircle, IndianRupee, Eye, Pencil, Check, Package, Trash2, ArrowRight } from 'lucide-react';

export function QuotationsPage() {
  const { db, setDB, openModal, closeModal, toast, confirmAction } = useApp();
  const total = db.quotations.reduce((s, q) => s + q.amount, 0);

  function openQuotationForm(id?: string) {
    const q = id ? db.quotations.find(x => x.id === id) : null;
    openModal(<QuotationForm q={q || null} onClose={closeModal} onSave={(payload) => {
      if (id && q) {
        setDB(prev => ({ ...prev, quotations: prev.quotations.map(x => x.id === id ? { ...x, ...payload } : x) }));
        toast('Quotation updated');
      } else {
        setDB(prev => ({ ...prev, quotations: [{ id: uid('QT'), ...payload }, ...prev.quotations] }));
        toast('Quotation created');
      }
      closeModal();
    }} />, true);
  }

  function viewQuotation(id: string) {
    const q = db.quotations.find(x => x.id === id)!;
    openModal(
      <div>
        <div className="modal-head">
          <div><h3>{q.id}</h3><div className="modal-sub">{q.eventName}</div></div>
          <button className="modal-close" onClick={closeModal}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}><TierBadge tier={q.tier} /><StatusBadge status={q.status} /></div>
          <div className="kv"><div className="k">Client</div><div className="v">{q.client}</div></div>
          <div className="kv"><div className="k">Amount</div><div className="v">{fmtINR(q.amount)}</div></div>
          <div className="kv"><div className="k">Line Items</div><div className="v">{q.items}</div></div>
          <div className="kv"><div className="k">Date Issued</div><div className="v">{fmtDate(q.date)}</div></div>
          <div className="kv"><div className="k">Valid Till</div><div className="v">{fmtDate(q.validTill)}</div></div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Close</button>
          <button className="btn btn-gold" onClick={() => { closeModal(); openQuotationForm(q.id); }}>Edit</button>
        </div>
      </div>
    );
  }

  function approveQuotation(id: string) {
    const q = db.quotations.find(x => x.id === id)!;
    confirmAction('Approve Quotation', `Mark <strong>${q.id}</strong> as approved by client?`, () => {
      setDB(prev => ({ ...prev, quotations: prev.quotations.map(x => x.id === id ? { ...x, status: 'Approved' } : x) }));
      toast('Quotation approved');
    }, 'Approve');
  }

  function sendToStore(id: string) {
    const q = db.quotations.find(x => x.id === id)!;
    confirmAction('Send to Store Manager', `This will generate a packing checklist for <strong>${q.eventName}</strong>.`, () => {
      const newChecklist = { id: uid('CHK'), quotationId: q.id, eventName: q.eventName, tier: q.tier, status: 'Pending' as const, items: defaultItemsForTier(q.tier) };
      setDB(prev => ({ ...prev, checklists: [newChecklist, ...prev.checklists] }));
      toast('Checklist generated and sent to Store Manager');
    }, 'Send to Store');
  }

  function deleteQuotation(id: string) {
    const q = db.quotations.find(x => x.id === id)!;
    confirmAction('Delete Quotation', `Delete quotation <strong>${q.id}</strong> for ${q.client}?`, () => {
      setDB(prev => ({ ...prev, quotations: prev.quotations.filter(x => x.id !== id) }));
      toast('Quotation deleted');
    }, 'Delete', true);
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Quotations</h1><div className="page-desc">Create client quotations. Once approved, generate a store checklist and event automatically.</div></div>
        <div className="head-actions">
          <button className="btn btn-gold" onClick={() => openQuotationForm()}>+ New Quotation</button>
        </div>
      </div>
      <div className="stat-grid">
        <StatCard icon={<FileText size={24} />} value={String(db.quotations.length)} label="Total Quotations" />
        <StatCard icon={<CheckCircle size={24} />} value={String(db.quotations.filter(q => q.status === 'Approved').length)} label="Approved — Ready for Checklist" />
        <StatCard icon={<IndianRupee size={24} />} value={fmtINR(total)} label="Total Pipeline Value" />
      </div>
      <div className="panel">
        <div className="panel-body pad0">
          <div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
            <thead><tr><th>Quotation</th><th>Client</th><th>Tier</th><th>Amount</th><th>Date</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {db.quotations.map(q => (
                <tr key={q.id}>
                  <td><div className="cell-strong">{q.id}</div><div className="cell-sub">{q.eventName}</div></td>
                  <td>{q.client}</td>
                  <td><TierBadge tier={q.tier} /></td>
                  <td className="cell-strong">{fmtINR(q.amount)}</td>
                  <td>{fmtDate(q.date)}</td>
                  <td><StatusBadge status={q.status} /></td>
                  <td>
                    <div className="table-actions">
                      <div className="row-action" title="View" onClick={() => viewQuotation(q.id)}><Eye size={16} /></div>
                      <div className="row-action" title="Edit" onClick={() => openQuotationForm(q.id)}><Pencil size={16} /></div>
                      {q.status === 'Sent' && <div className="row-action" title="Approve" onClick={() => approveQuotation(q.id)}><Check size={16} /></div>}
                      {q.status === 'Approved' && <div className="row-action" title="Send to Store" onClick={() => sendToStore(q.id)}><Package size={16} /></div>}
                      <div className="row-action danger" title="Delete" onClick={() => deleteQuotation(q.id)}><Trash2 size={16} /></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>
    </>
  );
}

function QuotationForm({ q, onClose, onSave }: {
  q: Quotation | null;
  onClose: () => void;
  onSave: (payload: Omit<Quotation, 'id'>) => void;
}) {
  const [client, setClient] = useState(q?.client || '');
  const [eventName, setEventName] = useState(q?.eventName || '');
  const [tier, setTier] = useState<StaffTier>(q?.tier || 'Normal');
  const [amount, setAmount] = useState(q?.amount || 0);
  const [items, setItems] = useState(q?.items || 0);
  const [date, setDate] = useState(q?.date || '2026-06-22');
  const [validTill, setValidTill] = useState(q?.validTill || '2026-07-06');
  const [status, setStatus] = useState<QuotationStatus>(q?.status || 'Draft');
  const { toast } = useApp();

  function submit() {
    if (!client.trim()) { toast('Client name is required', 'err'); return; }
    onSave({ client, eventName, tier, amount, items, date, validTill, status });
  }

  return (
    <>
      <div className="modal-head">
        <div><h3>{q ? 'Edit Quotation' : 'New Quotation'}</h3><div className="modal-sub">{q ? q.id : 'Draft a quotation for the client'}</div></div>
        <button className="modal-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="modal-body">
        <div className="field-row">
          <div className="field"><label>Client Name</label><input value={client} onChange={e => setClient(e.target.value)} placeholder="e.g. Sebastian & Mariam" /></div>
          <div className="field"><label>Event Name</label><input value={eventName} onChange={e => setEventName(e.target.value)} placeholder="e.g. Sebastian-Mariam Wedding" /></div>
        </div>
        <div className="field-row3">
          <div className="field"><label>Tier</label>
            <select value={tier} onChange={e => setTier(e.target.value as StaffTier)}>
              {['Normal','Premium','Extreme Premium'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field"><label>Amount (₹)</label><input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} /></div>
          <div className="field"><label>Line Items</label><input type="number" value={items} onChange={e => setItems(Number(e.target.value))} /></div>
        </div>
        <div className="field-row">
          <div className="field"><label>Quotation Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
          <div className="field"><label>Valid Till</label><input type="date" value={validTill} onChange={e => setValidTill(e.target.value)} /></div>
        </div>
        <div className="field"><label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as QuotationStatus)}>
            {['Draft','Sent','Approved','Invoiced'].map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="hint">Draft <ArrowRight size={12} className="inline mx-1" /> Sent to client <ArrowRight size={12} className="inline mx-1" /> Approved <ArrowRight size={12} className="inline mx-1" /> Sent to Store <ArrowRight size={12} className="inline mx-1" /> Invoiced</div>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-gold" onClick={submit}>{q ? 'Save Changes' : 'Create Quotation'}</button>
      </div>
    </>
  );
}
