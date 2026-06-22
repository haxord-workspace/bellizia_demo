import { useApp } from '../context/AppContext';
import { StatusBadge, StatCard } from '../components/ui/Badge';
import { Truck, CheckCircle, MapPin } from 'lucide-react';

export function VehiclesPage() {
  const { db } = useApp();

  const totalVehicles = db.vehicles.length;
  const available = db.vehicles.filter(v => v.status === 'Available').length;
  const onTrip = db.vehicles.filter(v => v.status === 'On Trip').length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Vehicles & Fleet</h1>
          <div className="page-desc">Manage your logistics, delivery trucks, and rental vehicles.</div>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard 
          icon={<Truck size={24} />} 
          value={String(totalVehicles)} 
          label="Total Vehicles" 
        />
        <StatCard 
          icon={<CheckCircle size={24} />} 
          value={String(available)} 
          label="Available Now" 
          delta="Ready for dispatch" 
          deltaDir="up" 
        />
        <StatCard 
          icon={<MapPin size={24} />} 
          value={String(onTrip)} 
          label="On Trip" 
          delta="Currently out for events" 
          deltaDir="down" 
        />
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Fleet Directory</h3>
        </div>
        <div className="panel-body pad0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr>
                  <th>Vehicle Info</th>
                  <th>Type & Capacity</th>
                  <th>Driver Details</th>
                  <th>Mileage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {db.vehicles.map(v => (
                  <tr key={v.id}>
                    <td>
                      <div className="cell-strong">{v.name}</div>
                      <div className="cell-sub">{v.number}</div>
                    </td>
                    <td>
                      <div className="cell-strong">{v.capacity}</div>
                      <div className="cell-sub">{v.type === 'Rental' ? `Rental via ${v.vendor}` : 'Owned Fleet'}</div>
                    </td>
                    <td>
                      <div className="cell-strong">{v.driver}</div>
                      <div className="cell-sub">{v.driverPhone}</div>
                    </td>
                    <td>
                      <div className="cell-strong">{v.mileage} km/l</div>
                      {v.rentalRate && <div className="cell-sub">{v.rentalRate}</div>}
                    </td>
                    <td><StatusBadge status={v.status} /></td>
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
