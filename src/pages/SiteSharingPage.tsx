import { useApp } from '../context/AppContext';
import { Share2, Users, FileText } from 'lucide-react';
import { StatCard } from '../components/ui/Badge';

export function SiteSharingPage() {
  const { db } = useApp();

  const totalShares = db.siteShares.length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Site Sharing</h1>
          <div className="page-desc">Track and review event details shared between staff and site teams.</div>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard 
          icon={<Share2 size={24} />} 
          value={String(totalShares)} 
          label="Total Active Shares" 
        />
        <StatCard 
          icon={<Users size={24} />} 
          value="2" 
          label="Teams Involved" 
        />
        <StatCard 
          icon={<FileText size={24} />} 
          value="Recent" 
          label="Notes Shared" 
        />
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Recent Shares</h3>
        </div>
        <div className="panel-body pad0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr>
                  <th>Share ID</th>
                  <th>Event ID</th>
                  <th>Shared By</th>
                  <th>Shared With</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {db.siteShares.map(s => {
                  const event = db.events.find(e => e.id === s.eventId);
                  return (
                    <tr key={s.id}>
                      <td><div className="cell-strong">{s.id}</div></td>
                      <td>
                        <div className="cell-strong">{event?.name || s.eventId}</div>
                        <div className="cell-sub">{s.eventId}</div>
                      </td>
                      <td><div className="cell-strong">{s.sharedBy}</div></td>
                      <td>{s.sharedWith}</td>
                      <td><span className="muted">{s.note}</span></td>
                      <td>{s.date}</td>
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
