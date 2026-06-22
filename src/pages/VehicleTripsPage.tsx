import { useApp } from '../context/AppContext';
import { StatusBadge, StatCard } from '../components/ui/Badge';
import { Route, Map, Fuel } from 'lucide-react';
import { fmtINR } from '../data/db';

export function VehicleTripsPage() {
  const { db } = useApp();

  const totalTrips = db.vehicleTrips.length;
  const activeTrips = db.vehicleTrips.filter(t => t.status === 'Out').length;
  const totalGas = db.vehicleTrips.reduce((acc, t) => acc + t.gasAllowance, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Vehicle Trips</h1>
          <div className="page-desc">Track active dispatch routes and fuel allowances.</div>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard 
          icon={<Route size={24} />} 
          value={String(totalTrips)} 
          label="Total Logged Trips" 
        />
        <StatCard 
          icon={<Map size={24} />} 
          value={String(activeTrips)} 
          label="Active Trips (Out)" 
          delta="Currently on the road" 
          deltaDir="up" 
        />
        <StatCard 
          icon={<Fuel size={24} />} 
          value={fmtINR(totalGas)} 
          label="Total Fuel Allowance" 
          delta="Gas expenses logged" 
          deltaDir="up" 
        />
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Trip Logs</h3>
        </div>
        <div className="panel-body pad0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Vehicle & Driver</th>
                  <th>Event ID</th>
                  <th>Distance / Gas</th>
                  <th>Dispatch Time</th>
                  <th>Return Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {db.vehicleTrips.map(t => {
                  const vehicle = db.vehicles.find(v => v.id === t.vehicleId);
                  return (
                    <tr key={t.id}>
                      <td><div className="cell-strong">{t.id}</div></td>
                      <td>
                        <div className="cell-strong">{vehicle?.name || t.vehicleId}</div>
                        <div className="cell-sub">{t.driver}</div>
                      </td>
                      <td><div className="cell-strong">{t.eventId}</div></td>
                      <td>
                        <div className="cell-strong">{t.km} km</div>
                        <div className="cell-sub">{fmtINR(t.gasAllowance)}</div>
                      </td>
                      <td>{t.dispatched}</td>
                      <td>{t.returned || <span className="muted">—</span>}</td>
                      <td><StatusBadge status={t.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
