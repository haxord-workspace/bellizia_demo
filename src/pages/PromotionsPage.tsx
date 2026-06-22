import { useApp } from '../context/AppContext';
import { TierBadge } from '../components/ui/Badge';
import { ArrowRight, Award } from 'lucide-react';

export function PromotionsPage() {
  const { db, setDB, confirmAction, toast } = useApp();
  const eligible = db.staff.filter(s =>
    (s.tier === 'Normal' && s.events >= 40) || (s.tier === 'Premium' && s.events >= 100)
  );

  function promote(id: string) {
    const s = db.staff.find(x => x.id === id)!;
    const newTier = s.tier === 'Normal' ? 'Premium' : 'Extreme Premium';
    confirmAction('Promote Staff', `Promote <strong>${s.name}</strong> from ${s.tier} to ${newTier}?`, () => {
      setDB(prev => ({
        ...prev,
        staff: prev.staff.map(x => x.id === id ? { ...x, tier: newTier, wage: x.wage + (newTier === 'Premium' ? 150 : 250) } : x)
      }));
      toast(`${s.name} promoted to ${newTier}`);
    }, 'Promote');
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Tier &amp; Promotions</h1><div className="page-desc">Staff automatically become eligible for promotion after reaching event milestones.</div></div>
      </div>
      <div className="panel" style={{ padding: '20px 22px', marginBottom: 18 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Promotion Rules</div>
        <div className="dashboard-grid-equal">
          {db.promotionRules.map((r, i) => (
            <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <TierBadge tier={r.from} />
              <ArrowRight size={16} style={{ color: 'var(--bronze)' }} />
              <TierBadge tier={r.to} />
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div className="cell-strong">{r.threshold} events</div>
                <div className="cell-sub">{r.wageBoost}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Eligible for Promotion ({eligible.length})</h3></div>
        <div className="panel-body pad0"><div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
          <thead><tr><th>Staff</th><th>Current Tier</th><th>Events Completed</th><th>Next Tier</th><th></th></tr></thead>
          <tbody>
            {eligible.map(s => (
              <tr key={s.id}>
                <td><div className="name-cell"><div className="avatar-sm">{s.avatar}</div>{s.name}</div></td>
                <td><TierBadge tier={s.tier} /></td>
                <td>{s.events}</td>
                <td><TierBadge tier={s.tier === 'Normal' ? 'Premium' : 'Extreme Premium'} /></td>
                <td><button className="btn btn-sm btn-gold" onClick={() => promote(s.id)}>Promote</button></td>
              </tr>
            ))}
            {eligible.length === 0 && (
              <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon"><Award size={48} /></div><div className="empty-title">No one is eligible right now</div><div className="empty-desc">Staff become eligible automatically once they cross the event threshold for their current tier.</div></div></td></tr>
            )}
          </tbody>
        </table></div></div>
      </div>
    </>
  );
}
