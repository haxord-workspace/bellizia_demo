import { useApp } from '../context/AppContext';
import { Save } from 'lucide-react';

export function SettingsPage() {
  const { toast } = useApp();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Settings saved successfully', 'ok');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <div className="page-desc">Manage your application preferences, notifications, and company profile.</div>
        </div>
      </div>

      <div className="dashboard-grid-main">
        <div className="panel">
          <div className="panel-head">
            <h3>General Configuration</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSave}>
              <div className="field-row">
                <div className="field">
                  <label>Company Name</label>
                  <input type="text" defaultValue="Bellizia Caters & Events" required />
                </div>
                <div className="field">
                  <label>Contact Email</label>
                  <input type="email" defaultValue="admin@belliziacaters.in" required />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Currency Symbol</label>
                  <select defaultValue="INR">
                    <option value="INR">₹ (INR)</option>
                    <option value="USD">$ (USD)</option>
                    <option value="EUR">€ (EUR)</option>
                    <option value="GBP">£ (GBP)</option>
                  </select>
                </div>
                <div className="field">
                  <label>Timezone</label>
                  <select defaultValue="IST">
                    <option value="IST">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>

              <div className="divider"></div>

              <div className="field">
                <label>Default Quotation Validity (Days)</label>
                <input type="number" defaultValue={14} style={{ width: 120 }} />
                <div className="hint">Quotations will automatically expire after this many days.</div>
              </div>

              <div className="field" style={{ marginTop: 24 }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Notification Preferences</h3>
          </div>
          <div className="panel-body">
            <div className="checklist-item">
              <div className="check-circle checked">✓</div>
              <div>
                <div className="cell-strong">New Shift Applications</div>
                <div className="cell-sub">Alert when staff apply for an event shift</div>
              </div>
            </div>
            <div className="checklist-item">
              <div className="check-circle checked">✓</div>
              <div>
                <div className="cell-strong">Low Stock Alerts</div>
                <div className="cell-sub">Alert when inventory drops below 40%</div>
              </div>
            </div>
            <div className="checklist-item">
              <div className="check-circle checked">✓</div>
              <div>
                <div className="cell-strong">Vehicle Return Delays</div>
                <div className="cell-sub">Alert when a trip exceeds estimated duration</div>
              </div>
            </div>
            <div className="checklist-item">
              <div className="check-circle"></div>
              <div>
                <div className="cell-strong">Daily Digest</div>
                <div className="cell-sub">Receive a morning summary email</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
