import { useApp } from '../context/AppContext';
import { TierBadge, StockBar } from '../components/ui/Badge';

export function PerformancePage() {
  const { db } = useApp();
  const sorted = [...db.staff].sort((a, b) => b.rating - a.rating);
  return (
    <>
      <div className="page-head">
        <div><h1>Staff Performance</h1><div className="page-desc">Ratings and reliability tracked across events for fair tier promotion and assignment.</div></div>
      </div>
      <div className="panel"><div className="panel-body pad0"><div className="table-wrap"><table>
        <thead><tr><th>Rank</th><th>Staff</th><th>Tier</th><th>Events</th><th>Rating</th><th>Reliability</th></tr></thead>
        <tbody>
          {sorted.map((s, idx) => (
            <tr key={s.id}>
              <td className="cell-strong">#{idx + 1}</td>
              <td><div className="name-cell"><div className="avatar-sm">{s.avatar}</div>{s.name}</div></td>
              <td><TierBadge tier={s.tier} /></td>
              <td>{s.events}</td>
              <td className="rating-stars">★ {s.rating}</td>
              <td><StockBar available={Math.round(s.rating * 20)} total={100} /></td>
            </tr>
          ))}
        </tbody>
      </table></div></div></div>
    </>
  );
}
