import { useApp } from '../context/AppContext';
import { uid } from '../data/db';

export function GodownsPage() {
  const { db, setDB, openModal, closeModal, toast } = useApp();

  function openGodownForm(id?: string) {
    const g = id ? db.godowns.find(x => x.id === id) : null;
    let name = g?.name || '';
    let location = g?.location || '';
    let manager = g?.manager || db.users.filter(u => u.role === 'Store Manager')[0]?.name || '';

    openModal(
      <div>
        <div className="modal-head"><div><h3>{g ? 'Edit Godown' : 'Add Godown'}</h3></div><button className="modal-close" onClick={closeModal}>✕</button></div>
        <div className="modal-body">
          <div className="field"><label>Godown Name</label><input defaultValue={name} onChange={e => { name = e.target.value; }} placeholder="e.g. Kozhikode Storage Unit" /></div>
          <div className="field"><label>Location</label><input defaultValue={location} onChange={e => { location = e.target.value; }} placeholder="Area, City" /></div>
          <div className="field"><label>Manager</label>
            <select defaultValue={manager} onChange={e => { manager = e.target.value; }}>
              {db.users.filter(u => u.role === 'Store Manager').map(u => <option key={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button className="btn btn-gold" onClick={() => {
            if (id && g) {
              setDB(prev => ({ ...prev, godowns: prev.godowns.map(x => x.id === id ? { ...x, name, location, manager } : x) }));
              toast('Godown updated');
            } else {
              setDB(prev => ({ ...prev, godowns: [...prev.godowns, { id: uid('GD'), capacity: '0%', items: 0, name, location, manager }] }));
              toast('Godown added');
            }
            closeModal();
          }}>{g ? 'Save' : 'Add Godown'}</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Godowns</h1><div className="page-desc">Storage facilities holding catering inventory across regions.</div></div>
        <div className="head-actions"><button className="btn btn-gold" onClick={() => openGodownForm()}>+ Add Godown</button></div>
      </div>
      <div className="stat-grid">
        {db.godowns.map(g => (
          <div key={g.id} className="panel" style={{ gridColumn: 'span 1' }}>
            <div className="panel-head"><h3>{g.name}</h3><div className="row-action" onClick={() => openGodownForm(g.id)}>✎</div></div>
            <div className="panel-body">
              <div className="kv"><div className="k">Location</div><div className="v">{g.location}</div></div>
              <div className="kv"><div className="k">Manager</div><div className="v">{g.manager}</div></div>
              <div className="kv"><div className="k">Items Tracked</div><div className="v">{g.items}</div></div>
              <div className="kv"><div className="k">Capacity Used</div><div className="v">{g.capacity}</div></div>
              <div className="progress-track" style={{ marginTop: 8 }}>
                <div className="progress-fill" style={{ width: g.capacity }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
