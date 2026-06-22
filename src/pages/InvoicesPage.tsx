// removed useState
import { useApp } from '../context/AppContext';
import { StatusBadge, StatCard } from '../components/ui/Badge';
import { fmtINR, uid } from '../data/db';
import { X, Receipt, CheckCircle, Hourglass, Eye, Banknote } from 'lucide-react';

export function InvoicesPage() {
  const { db, setDB, openModal, closeModal, toast } = useApp();
  const totalCollected = db.invoices.reduce((s, i) => s + i.paid, 0);
  const totalBalance = db.invoices.reduce((s, i) => s + i.balance, 0);

  function viewInvoice(id: string) {
    const inv = db.invoices.find(x => x.id === id)!;
    openModal(
      <div>
        <div className="modal-head"><div><h3>{inv.id}</h3><div className="modal-sub">{inv.client}</div></div><button className="modal-close" onClick={closeModal}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="kv"><div className="k">Linked Quotation</div><div className="v">{inv.quotationId}</div></div>
          <div className="kv"><div className="k">Total Amount</div><div className="v">{fmtINR(inv.amount)}</div></div>
          <div className="kv"><div className="k">Paid</div><div className="v">{fmtINR(inv.paid)}</div></div>
          <div className="kv"><div className="k">Balance</div><div className="v">{fmtINR(inv.balance)}</div></div>
          <div className="kv"><div className="k">Status</div><div className="v"><StatusBadge status={inv.status} /></div></div>
        </div>
        <div className="modal-foot"><button className="btn btn-outline" onClick={closeModal}>Close</button></div>
      </div>
    );
  }

  function recordPayment(id: string) {
    const inv = db.invoices.find(x => x.id === id)!;
    let amt = 0;
    openModal(
      <div>
        <div className="modal-head"><div><h3>Record Payment</h3><div className="modal-sub">{inv.id} — Balance: {fmtINR(inv.balance)}</div></div><button className="modal-close" onClick={closeModal}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="field"><label>Payment Amount (₹)</label><input type="number" placeholder="Amount received" onChange={e => { amt = Number(e.target.value); }} /></div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button className="btn btn-gold" onClick={() => {
            setDB(prev => ({
              ...prev,
              invoices: prev.invoices.map(x => x.id === id ? {
                ...x, paid: x.paid + amt, balance: Math.max(0, x.balance - amt),
                status: x.balance - amt <= 0 ? 'Paid' : 'Partial'
              } : x)
            }));
            toast('Payment recorded');
            closeModal();
          }}>Record Payment</button>
        </div>
      </div>
    );
  }

  function openInvoiceForm() {
    const approvedQuotes = db.quotations.filter(q => q.status === 'Approved' || q.status === 'Invoiced');
    let selectedQid = approvedQuotes[0]?.id || '';
    let paid = 0;
    openModal(
      <div>
        <div className="modal-head"><div><h3>New Invoice</h3></div><button className="modal-close" onClick={closeModal}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="field"><label>Quotation</label>
            <select onChange={e => { selectedQid = e.target.value; }}>
              {approvedQuotes.map(q => <option key={q.id} value={q.id}>{q.id} — {q.client} ({fmtINR(q.amount)})</option>)}
            </select>
          </div>
          <div className="field"><label>Amount Paid Now (₹)</label><input type="number" placeholder="e.g. 200000" onChange={e => { paid = Number(e.target.value); }} /></div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button className="btn btn-gold" onClick={() => {
            const q = db.quotations.find(x => x.id === selectedQid);
            if (!q) return;
            const newInv = { id: uid('INV'), quotationId: selectedQid, client: q.client, amount: q.amount, paid, balance: q.amount - paid, status: paid >= q.amount ? 'Paid' as const : paid > 0 ? 'Partial' as const : 'Unpaid' as const, date: '2026-06-22' };
            setDB(prev => ({
              ...prev,
              invoices: [newInv, ...prev.invoices],
              quotations: prev.quotations.map(x => x.id === selectedQid ? { ...x, status: 'Invoiced' } : x)
            }));
            toast('Invoice created');
            closeModal();
          }}>Create Invoice</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Invoices</h1><div className="page-desc">Track payments collected against approved quotations.</div></div>
        <div className="head-actions"><button className="btn btn-gold" onClick={openInvoiceForm}>+ New Invoice</button></div>
      </div>
      <div className="stat-grid">
        <StatCard icon={<Receipt size={24} />} value={String(db.invoices.length)} label="Total Invoices" />
        <StatCard icon={<CheckCircle size={24} />} value={fmtINR(totalCollected)} label="Total Collected" />
        <StatCard icon={<Hourglass size={24} />} value={fmtINR(totalBalance)} label="Outstanding Balance" />
      </div>
      <div className="panel"><div className="panel-body pad0"><div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
        <thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {db.invoices.map(i => (
            <tr key={i.id}>
              <td><div className="cell-strong">{i.id}</div><div className="cell-sub">{i.quotationId}</div></td>
              <td>{i.client}</td>
              <td>{fmtINR(i.amount)}</td>
              <td>{fmtINR(i.paid)}</td>
              <td className="cell-strong" style={{ color: i.balance > 0 ? 'var(--danger)' : 'var(--ok)' }}>{fmtINR(i.balance)}</td>
              <td><StatusBadge status={i.status} /></td>
              <td><div className="table-actions">
                <div className="row-action" title="View" onClick={() => viewInvoice(i.id)}><Eye size={16} /></div>
                <div className="row-action" title="Record Payment" onClick={() => recordPayment(i.id)}><Banknote size={16} /></div>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table></div></div></div>
    </>
  );
}
