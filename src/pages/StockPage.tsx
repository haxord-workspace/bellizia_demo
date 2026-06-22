import { useApp } from '../context/AppContext';
import { StockBar, StatCard } from '../components/ui/Badge';
import { Package, AlertTriangle, TrendingDown } from 'lucide-react';

export function StockPage() {
  const { db } = useApp();

  const totalItems = db.stock.length;
  const lowStock = db.stock.filter(s => (s.available / s.total) < 0.4).length;
  const damagedItems = db.stock.reduce((acc, s) => acc + s.damaged, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Stock & Inventory</h1>
          <div className="page-desc">Track and manage all catering and event equipment across godowns.</div>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard 
          icon={<Package size={24} />} 
          value={String(totalItems)} 
          label="Categories Tracked" 
        />
        <StatCard 
          icon={<AlertTriangle size={24} />} 
          value={String(lowStock)} 
          label="Low Stock Alerts" 
          delta="Below 40% availability" 
          deltaDir="down" 
        />
        <StatCard 
          icon={<TrendingDown size={24} />} 
          value={String(damagedItems)} 
          label="Total Damaged Units" 
          delta="Requires repair/replacement" 
          deltaDir="down" 
        />
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>All Inventory</h3>
        </div>
        <div className="panel-body pad0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Name & Category</th>
                  <th>Location</th>
                  <th>Available</th>
                  <th>Total</th>
                  <th>Damaged</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {db.stock.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>
                      <div className="cell-strong">{s.name}</div>
                      <div className="cell-sub">{s.category}</div>
                    </td>
                    <td>{s.godown}</td>
                    <td className="cell-strong">{s.available} <span className="muted">{s.unit}</span></td>
                    <td>{s.total} <span className="muted">{s.unit}</span></td>
                    <td>{s.damaged > 0 ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{s.damaged} {s.unit}</span> : '—'}</td>
                    <td style={{ width: 160 }}><StockBar available={s.available} total={s.total} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
