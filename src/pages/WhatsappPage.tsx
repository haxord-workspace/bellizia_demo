import { useApp } from '../context/AppContext';
import { MessageSquare, Users, Send, CheckCircle2 } from 'lucide-react';
import { StatCard } from '../components/ui/Badge';

export function WhatsappPage() {
  const { db, toast } = useApp();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    toast('WhatsApp Broadcast Sent Successfully!', 'ok');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>WhatsApp Messaging</h1>
          <div className="page-desc">Send automated broadcast messages and shift alerts to your staff.</div>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard 
          icon={<MessageSquare size={24} />} 
          value="1,248" 
          label="Messages Sent This Month" 
        />
        <StatCard 
          icon={<CheckCircle2 size={24} />} 
          value="98.5%" 
          label="Delivery Rate" 
          delta="Reliable connection" 
          deltaDir="up" 
        />
        <StatCard 
          icon={<Users size={24} />} 
          value={String(db.staff.length)} 
          label="Total Contacts Synced" 
        />
      </div>

      <div className="dashboard-grid-main">
        <div className="panel">
          <div className="panel-head">
            <h3>New Broadcast Message</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSend}>
              <div className="field">
                <label>Select Target Audience</label>
                <select required defaultValue="">
                  <option value="" disabled>Choose an audience...</option>
                  <option value="all">All Active Staff ({db.staff.length})</option>
                  <option value="servers">Servers Only</option>
                  <option value="housekeeping">Housekeeping Staff Only</option>
                  <option value="event-2041">Team assigned to Menon-Pillai Wedding</option>
                  <option value="event-2044">Team assigned to UDF Convention</option>
                </select>
                <div className="hint">The message will be sent to the registered phone numbers of the selected group.</div>
              </div>

              <div className="field" style={{ marginTop: 24 }}>
                <label>Message Content</label>
                <textarea 
                  required 
                  placeholder="Type your broadcast message here..." 
                  style={{ minHeight: 120 }}
                />
              </div>

              <div className="field" style={{ marginTop: 24 }}>
                <button type="submit" className="btn btn-gold">
                  <Send size={16} /> Send Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Recent Broadcasts</h3>
          </div>
          <div className="panel-body pad0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr>
                    <th>Audience</th>
                    <th>Date / Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="cell-strong">All Active Staff</div>
                      <div className="cell-sub">Shift availability reminder</div>
                    </td>
                    <td>Today, 09:00 AM</td>
                    <td><span className="badge badge-ok"><span className="badge-dot" />Delivered</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="cell-strong">UDF Convention Team</div>
                      <div className="cell-sub">Uniform details update</div>
                    </td>
                    <td>Yesterday, 18:30 PM</td>
                    <td><span className="badge badge-ok"><span className="badge-dot" />Delivered</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="cell-strong">Servers Only</div>
                      <div className="cell-sub">Urgent requirement for weekend</div>
                    </td>
                    <td>Jun 18, 11:15 AM</td>
                    <td><span className="badge badge-ok"><span className="badge-dot" />Delivered</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
