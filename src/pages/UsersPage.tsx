import { useApp } from '../context/AppContext';
import { StatusBadge, StatCard } from '../components/ui/Badge';
import { Users, Shield, MapPin } from 'lucide-react';

export function UsersPage() {
  const { db } = useApp();

  const totalUsers = db.users.length;
  const activeUsers = db.users.filter(u => u.status === 'Active').length;
  const storeManagers = db.users.filter(u => u.role === 'Store Manager').length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Team & Roles</h1>
          <div className="page-desc">Manage system access, roles, and administrative users.</div>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard 
          icon={<Users size={24} />} 
          value={String(totalUsers)} 
          label="Total Admin Users" 
        />
        <StatCard 
          icon={<Shield size={24} />} 
          value={String(activeUsers)} 
          label="Active Accounts" 
          delta="System access enabled" 
          deltaDir="up" 
        />
        <StatCard 
          icon={<MapPin size={24} />} 
          value={String(storeManagers)} 
          label="Store Managers" 
          delta="Managing godowns" 
          deltaDir="up" 
        />
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>System Users</h3>
        </div>
        <div className="panel-body pad0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name & Email</th>
                  <th>Role</th>
                  <th>Godown / Location</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {db.users.map(u => (
                  <tr key={u.id}>
                    <td><div className="cell-strong">{u.id}</div></td>
                    <td>
                      <div className="cell-strong">{u.name}</div>
                      <div className="cell-sub">{u.email}</div>
                    </td>
                    <td><div className="cell-strong">{u.role}</div></td>
                    <td>{u.godown || <span className="muted">All Access</span>}</td>
                    <td>{u.phone}</td>
                    <td><StatusBadge status={u.status} /></td>
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
