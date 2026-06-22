import { useApp } from '../context/AppContext';
import { TierBadge, StatusBadge, StockBar, StatCard } from '../components/ui/Badge';
import { fmtINR, fmtDate, todayStr, sumStaff } from '../data/db';
import { Hand, FileText, PartyPopper, Users, ClipboardList, ArrowRight, Banknote, CheckCircle, MessageCircle, Star, Package, AlertTriangle, Truck, MapPin, Check } from 'lucide-react';

export function DashboardPage() {
  const { db } = useApp();
  if (db.currentRole === 'admin') return <AdminDashboard />;
  if (db.currentRole === 'store') return <StoreDashboard />;
  return <SiteDashboard />;
}

function AdminDashboard() {
  const { db, navigate } = useApp();
  const upcoming = db.events.filter(e => e.status === 'Upcoming').length;
  const totalQuoteVal = db.quotations.filter(q => q.status !== 'Draft').reduce((s, q) => s + q.amount, 0);
  const pendingApps = db.applications.filter(a => a.status === 'Pending').length;
  const activeStaff = db.staff.filter(s => s.status === 'Active').length;
  const chartData = [{ l: 'Wk 1', v: 62 }, { l: 'Wk 2', v: 78 }, { l: 'Wk 3', v: 54 }, { l: 'Wk 4', v: 91 }];
  const max = Math.max(...chartData.map(d => d.v));

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Welcome back, Priya <Hand size={24} className="inline ml-2 text-amber-500" /></h1>
          <div className="page-desc">Here's what's happening across all events today, {todayStr()}.</div>
        </div>
        <div className="head-actions">
          <button className="btn btn-outline" onClick={() => navigate('quotations')}><FileText size={16} className="inline mr-2" /> New Quotation</button>
          <button className="btn btn-gold" onClick={() => navigate('events')}>+ New Event</button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon={<PartyPopper size={24} />} value={String(upcoming)} label="Upcoming Events" delta="↑ 2 vs last week" deltaDir="up" />
        <StatCard icon={<FileText size={24} />} value={fmtINR(totalQuoteVal)} label="Active Quotation Value" delta="↑ 12.4%" deltaDir="up" />
        <StatCard icon={<Users size={24} />} value={String(activeStaff)} label="Active Staff" delta="↑ 3 this month" deltaDir="up" />
        <StatCard icon={<ClipboardList size={24} />} value={String(pendingApps)} label="Pending Applications" delta="Needs review" deltaDir="down" />
      </div>

      <div className="dashboard-grid-main">
        <div className="panel">
          <div className="panel-head">
            <h3>Upcoming Events</h3>
            <a onClick={() => navigate('events')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)', cursor: 'pointer' }}>View all <ArrowRight size={14} className="inline" /></a>
          </div>
          <div className="panel-body pad0">
            <div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
                <thead><tr><th>Event</th><th>Tier</th><th>Date</th><th>Staff</th><th>Status</th></tr></thead>
                <tbody>
                  {db.events.filter(e => e.status !== 'Completed').slice(0, 5).map(e => (
                    <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => navigate('events')}>
                      <td><div className="cell-strong">{e.name}</div><div className="cell-sub">{e.venue}</div></td>
                      <td><TierBadge tier={e.tier} /></td>
                      <td>{fmtDate(e.date)}</td>
                      <td>{e.staffApplied}/{sumStaff(e.staffNeeded as Record<string,number>)} applied</td>
                      <td><StatusBadge status={e.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Quick Actions</h3></div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('applications')}><ClipboardList size={16} className="inline mr-2" /> Review {pendingApps} pending applications</button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('advances')}><Banknote size={16} className="inline mr-2" /> Approve staff advances</button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('checklists')}><CheckCircle size={16} className="inline mr-2" /> Track dispatch checklists</button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('whatsapp')}><MessageCircle size={16} className="inline mr-2" /> Send WhatsApp updates</button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-equal">
        <div className="panel">
          <div className="panel-head"><h3>Revenue This Month</h3></div>
          <div className="panel-body">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 140, paddingTop: 10 }}>
              {chartData.map(d => (
                <div key={d.l} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--bronze)' }}>₹{d.v}L</div>
                  <div style={{ width: '100%', background: 'linear-gradient(180deg,var(--gold-bright),var(--gold))', borderRadius: '6px 6px 0 0', height: (d.v / max) * 90 }} />
                  <div style={{ fontSize: 11, color: 'var(--bronze)' }}>{d.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <h3>Top Performing Staff</h3>
            <a onClick={() => navigate('performance')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)', cursor: 'pointer' }}>View all <ArrowRight size={14} className="inline" /></a>
          </div>
          <div className="panel-body" style={{ paddingTop: 6 }}>
            {[...db.staff].sort((a, b) => b.rating - a.rating).slice(0, 4).map(s => (
              <div key={s.id} className="kv">
                <div className="k" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="avatar-sm" style={{ width: 26, height: 26, fontSize: 10 }}>{s.avatar}</div>
                  {s.name}
                </div>
                <div className="v rating-stars"><Star size={14} className="inline" style={{ verticalAlign: 'text-bottom' }} /> {s.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function StoreDashboard() {
  const { db, navigate } = useApp();
  const lowStock = db.stock.filter(s => (s.available / s.total) < 0.4).length;
  const pendingChecklists = db.checklists.filter(c => c.status !== 'Dispatched').length;
  const outTrips = db.vehicleTrips.filter(t => t.status === 'Out').length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Good morning, Suresh <Package size={24} className="inline ml-2" /></h1>
          <div className="page-desc">Kochi Main Godown — {todayStr()}</div>
        </div>
        <div className="head-actions">
          <button className="btn btn-gold" onClick={() => navigate('checklists')}><CheckCircle size={16} className="inline mr-2" /> View Checklists</button>
        </div>
      </div>
      <div className="stat-grid">
        <StatCard icon={<Package size={24} />} value={String(db.stock.length)} label="Stock Categories Tracked" />
        <StatCard icon={<AlertTriangle size={24} />} value={String(lowStock)} label="Low Stock Alerts" delta="Below 40% availability" deltaDir="down" />
        <StatCard icon={<CheckCircle size={24} />} value={String(pendingChecklists)} label="Checklists Pending Dispatch" />
        <StatCard icon={<Truck size={24} />} value={String(outTrips)} label="Vehicles Currently Out" />
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Today's Dispatch Queue</h3><a onClick={() => navigate('checklists')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)', cursor: 'pointer' }}>View all <ArrowRight size={14} className="inline" /></a></div>
        <div className="panel-body pad0">
          <div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
            <thead><tr><th>Checklist</th><th>Event</th><th>Tier</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {db.checklists.map(c => (
                <tr key={c.id}>
                  <td className="cell-strong">{c.id}</td>
                  <td>{c.eventName}</td>
                  <td><TierBadge tier={c.tier} /></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td style={{ textAlign: 'right' }}><button className="btn btn-sm btn-outline" onClick={() => navigate('checklists')}>Open</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Low Stock Alerts</h3></div>
        <div className="panel-body pad0">
          <div className="w-full overflow-x-auto"><table className="w-full text-left whitespace-nowrap">
            <thead><tr><th>Item</th><th>Available</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {db.stock.filter(s => (s.available / s.total) < 0.5).map(s => (
                <tr key={s.id}>
                  <td className="cell-strong">{s.name}</td>
                  <td>{s.available} {s.unit}</td>
                  <td>{s.total} {s.unit}</td>
                  <td><StockBar available={s.available} total={s.total} /></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>
    </>
  );
}

function SiteDashboard() {
  const { db } = useApp();
  const myEvents = db.events.filter(e => e.status === 'Upcoming' || e.status === 'In Progress');
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Hi Sreelakshmi <MapPin size={24} className="inline ml-2" /></h1>
          <div className="page-desc">Your on-ground event operations — {todayStr()}</div>
        </div>
      </div>
      <div className="stat-grid">
        <StatCard icon={<PartyPopper size={24} />} value={String(myEvents.length)} label="Active Site Assignments" />
        <StatCard icon={<CheckCircle size={24} />} value="2" label="Pending Stock Verifications" />
        <StatCard icon={<MapPin size={24} />} value={String(db.siteShares.length)} label="Site Updates Shared" />
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Current Site: Menon-Pillai Wedding</h3><span className="badge badge-warn">In Progress</span></div>
        <div className="panel-body">
          <div className="checklist-item"><div className="check-circle checked"><Check size={14} /></div> Mandap setup verified — 24 Chiavari chair sets placed</div>
          <div className="checklist-item"><div className="check-circle checked"><Check size={14} /></div> Dinnerware count confirmed against checklist CHK-701</div>
          <div className="checklist-item"><div className="check-circle"></div> Floral centerpieces — 2 short, flagged to store manager</div>
          <div className="checklist-item"><div className="check-circle"></div> Final headcount confirmation with serving staff</div>
        </div>
      </div>
    </>
  );
}
