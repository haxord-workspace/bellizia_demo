import { useApp } from '../context/AppContext';
import { StatCard } from '../components/ui/Badge';
import { fmtINR } from '../data/db';
import { X, IndianRupee, Banknote, Car, Receipt, Check } from 'lucide-react';

export function PayrollPage() {
  const { db, setDB, openModal, closeModal, toast } = useApp();
  const totalPayable = db.earnings.reduce((s, e) => s + e.netPayable, 0);
  const totalAdvance = db.earnings.reduce((s, e) => s + e.advance, 0);
  const totalTA = db.earnings.reduce((s, e) => s + e.ta, 0);

  function viewPayslip(staffId: string) {
    const e = db.earnings.find(x => x.staffId === staffId)!;
    openModal(
      <div>
        <div className="modal-head"><div><h3>Payslip — {e.name}</h3><div className="modal-sub">{e.month}</div></div><button className="modal-close" onClick={closeModal}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="kv"><div className="k">Events Worked</div><div className="v">{e.eventsWorked}</div></div>
          <div className="kv"><div className="k">Base Wage</div><div className="v">{fmtINR(e.baseWage)}</div></div>
          <div className="kv"><div className="k">Travel Allowance</div><div className="v">+{fmtINR(e.ta)}</div></div>
          <div className="kv"><div className="k">Advance Deduction</div><div className="v">-{fmtINR(e.advance)}</div></div>
          <div className="divider" />
          <div className="kv">
            <div className="k" style={{ fontWeight: 700, color: 'var(--black)' }}>Net Payable</div>
            <div className="v" style={{ fontSize: 18 }}>{fmtINR(e.netPayable)}</div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Close</button>
          <button className="btn btn-gold" onClick={() => { toast('Payslip download started'); closeModal(); }}>Download PDF</button>
        </div>
      </div>
    );
  }

  function openPayrollForm() {
    let staffId = db.staff.filter(s => s.status === 'Active')[0]?.id || '';
    let base = 0; let ta = 0; let adv = 0; let events = 1;
    openModal(
      <div>
        <div className="modal-head"><div><h3>Add Earning Record</h3></div><button className="modal-close" onClick={closeModal}><X size={16} /></button></div>
        <div className="modal-body">
          <div className="field"><label>Staff</label>
            <select onChange={e => { staffId = e.target.value; }}>
              {db.staff.filter(s => s.status === 'Active').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="field-row3">
            <div className="field"><label>Events Worked</label><input type="number" defaultValue={1} onChange={e => { events = Number(e.target.value); }} /></div>
            <div className="field"><label>Base Wage (₹)</label><input type="number" placeholder="e.g. 5000" onChange={e => { base = Number(e.target.value); }} /></div>
            <div className="field"><label>Travel Allowance (₹)</label><input type="number" defaultValue={0} onChange={e => { ta = Number(e.target.value); }} /></div>
          </div>
          <div className="field"><label>Advance Deduction (₹)</label><input type="number" defaultValue={0} onChange={e => { adv = Number(e.target.value); }} /></div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button className="btn btn-gold" onClick={() => {
            const s = db.staff.find(x => x.id === staffId)!;
            setDB(prev => ({ ...prev, earnings: [{ staffId, name: s.name, month: 'June 2026', eventsWorked: events, baseWage: base, ta, advance: adv, netPayable: base + ta - adv }, ...prev.earnings] }));
            toast('Earning record added');
            closeModal();
          }}>Add Record</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Payroll &amp; Earnings</h1><div className="page-desc">Base wages, travel allowance, and advances reconciled per staff member.</div></div>
        <div className="head-actions"><button className="btn btn-gold" onClick={openPayrollForm}>+ Add Earning Record</button></div>
      </div>
      <div className="stat-grid">
        <StatCard icon={<IndianRupee size={24} />} value={fmtINR(totalPayable)} label="Net Payable — June 2026" />
        <StatCard icon={<Banknote size={24} />} value={fmtINR(totalAdvance)} label="Advances Deducted" />
        <StatCard icon={<Car size={24} />} value={fmtINR(totalTA)} label="Travel Allowance Paid" />
      </div>
      <div className="panel"><div className="panel-body pad0"><div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
        <thead><tr><th>Staff</th><th>Events Worked</th><th>Base Wage</th><th>Travel Allowance</th><th>Advance</th><th>Net Payable</th><th></th></tr></thead>
        <tbody>
          {db.earnings.map(e => (
            <tr key={e.staffId}>
              <td className="cell-strong">{e.name}</td>
              <td>{e.eventsWorked}</td>
              <td>{fmtINR(e.baseWage)}</td>
              <td>{fmtINR(e.ta)}</td>
              <td style={{ color: 'var(--danger)' }}>-{fmtINR(e.advance)}</td>
              <td className="cell-strong">{fmtINR(e.netPayable)}</td>
              <td><div className="table-actions">
                <div className="row-action" onClick={() => viewPayslip(e.staffId)}><Receipt size={16} /></div>
                <div className="row-action" onClick={() => toast('Marked as paid. Payment record archived.')}><Check size={16} /></div>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table></div></div></div>
    </>
  );
}
